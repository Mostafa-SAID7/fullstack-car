import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable, forkJoin, of, fromEvent, Subject, timer, interval } from 'rxjs';
import { map, catchError, tap, filter, debounceTime, switchMap, retry, shareReplay, takeUntil } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { CustomTranslationLoader } from './translation-loader.service';

export interface BatchTranslationRequest {
  culture: string;
  features: string[];
}

export interface SupportedLanguage {
  code: string;
  name: string;
  flag: string;
  isRTL: boolean;
}

export interface LanguageDetectionResult {
  detectedLanguage: string;
  confidence: number;
  source: 'browser' | 'stored' | 'default';
}

export interface TranslationUpdate {
  culture: string;
  feature: string;
  key: string;
  value: string;
  timestamp: Date;
}

export interface FeatureTranslationStatus {
  feature: string;
  culture: string;
  loaded: boolean;
  loading: boolean;
  error?: string;
  lastUpdated?: Date;
}

export interface RealTimeTranslationConfig {
  enabled: boolean;
  pollInterval: number; // in milliseconds
  features: string[];
}

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private http = inject(HttpClient);
  private translateService = inject(TranslateService);
  private translationLoader = inject(CustomTranslationLoader);
  
  private currentLanguageSubject = new BehaviorSubject<string>('en-US');
  public currentLanguage$ = this.currentLanguageSubject.asObservable();
  
  private isRTLSubject = new BehaviorSubject<boolean>(false);
  public isRTL$ = this.isRTLSubject.asObservable();

  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  public isLoading$ = this.isLoadingSubject.asObservable();

  // Real-time translation updates
  private translationUpdatesSubject = new Subject<TranslationUpdate>();
  public translationUpdates$ = this.translationUpdatesSubject.asObservable();

  // Feature translation status tracking
  private featureStatusSubject = new BehaviorSubject<FeatureTranslationStatus[]>([]);
  public featureStatus$ = this.featureStatusSubject.asObservable();

  // Real-time configuration
  private realTimeConfig: RealTimeTranslationConfig = {
    enabled: false,
    pollInterval: 30000, // 30 seconds
    features: []
  };

  private destroy$ = new Subject<void>();
  private realTimeSubscription?: any;

  public readonly supportedLanguages: SupportedLanguage[] = [
    { code: 'en-US', name: 'English', flag: '🇺🇸', isRTL: false },
    { code: 'ar-EG', name: 'العربية (مصر)', flag: '🇪🇬', isRTL: true },
    { code: 'ar-AE', name: 'العربية (الإمارات)', flag: '🇦🇪', isRTL: true },
    { code: 'ar-SA', name: 'العربية (السعودية)', flag: '🇸🇦', isRTL: true }
  ];

  private readonly communityFeatures = [
    'posts', 'groups', 'qa', 'reviews', 'social', 
    'maps', 'news', 'guides', 'common'
  ];

  constructor() {
    this.initializeLanguageDetection();
    this.setupLanguageChangeListener();
    this.initializeFeatureStatus();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.stopRealTimeUpdates();
  }

  /**
   * Initialize feature status tracking
   */
  private initializeFeatureStatus(): void {
    const initialStatus: FeatureTranslationStatus[] = this.communityFeatures.map(feature => ({
      feature,
      culture: this.currentLanguageSubject.value,
      loaded: false,
      loading: false
    }));
    this.featureStatusSubject.next(initialStatus);
  }

  /**
   * Update feature status
   */
  private updateFeatureStatus(feature: string, culture: string, updates: Partial<FeatureTranslationStatus>): void {
    const currentStatus = this.featureStatusSubject.value;
    const updatedStatus = currentStatus.map(status => {
      if (status.feature === feature && status.culture === culture) {
        return { ...status, ...updates };
      }
      return status;
    });
    this.featureStatusSubject.next(updatedStatus);
  }

  /**
   * Load translations for multiple features with enhanced error handling and status tracking
   */
  async loadFeatureTranslations(culture: string, features: string[]): Promise<Record<string, any>> {
    console.log(`Loading translations for features: ${features.join(', ')} in culture: ${culture}`);
    
    // Update status to loading
    features.forEach(feature => {
      this.updateFeatureStatus(feature, culture, { loading: true, error: undefined });
    });

    try {
      const translations = await this.loadBatchTranslations(culture, features).toPromise();
      
      // Update status to loaded
      features.forEach(feature => {
        this.updateFeatureStatus(feature, culture, { 
          loading: false, 
          loaded: true, 
          lastUpdated: new Date() 
        });
      });

      console.log(`Successfully loaded ${Object.keys(translations || {}).length} translations for ${culture}`);
      return translations || {};
    } catch (error) {
      console.error(`Failed to load feature translations for ${culture}:`, error);
      
      // Update status with error
      features.forEach(feature => {
        this.updateFeatureStatus(feature, culture, { 
          loading: false, 
          loaded: false, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        });
      });

      // Fallback to English if not already English
      if (culture !== 'en-US') {
        console.log(`Attempting fallback to en-US for features: ${features.join(', ')}`);
        return this.loadFeatureTranslations('en-US', features);
      }

      return {};
    }
  }

  /**
   * Load translations for a single feature
   */
  async loadSingleFeatureTranslations(culture: string, feature: string): Promise<Record<string, any>> {
    return this.loadFeatureTranslations(culture, [feature]);
  }

  /**
   * Reload translations for specific features
   */
  async reloadFeatureTranslations(features: string[], culture?: string): Promise<void> {
    const targetCulture = culture || this.currentLanguageSubject.value;
    
    console.log(`Reloading translations for features: ${features.join(', ')} in culture: ${targetCulture}`);
    
    // Clear cache for these features
    this.translationLoader.clearCache(targetCulture);
    
    // Load fresh translations
    const translations = await this.loadFeatureTranslations(targetCulture, features);
    
    // Update ngx-translate with new translations
    this.translateService.setTranslation(targetCulture, translations, true);
    
    // Emit translation updates
    features.forEach(feature => {
      this.translationUpdatesSubject.next({
        culture: targetCulture,
        feature,
        key: '*', // Indicates full feature reload
        value: '',
        timestamp: new Date()
      });
    });
  }

  /**
   * Initialize language detection with enhanced browser detection
   */
  private initializeLanguageDetection(): void {
    const detectionResult = this.detectOptimalLanguage();
    console.log('Language detection result:', detectionResult);
    this.setLanguage(detectionResult.detectedLanguage);
  }

  /**
   * Enhanced browser language detection with confidence scoring
   */
  private detectOptimalLanguage(): LanguageDetectionResult {
    // 1. Check stored preference (highest priority)
    const storedLanguage = localStorage.getItem('preferred-language');
    if (storedLanguage && this.isSupportedLanguage(storedLanguage)) {
      return {
        detectedLanguage: storedLanguage,
        confidence: 1.0,
        source: 'stored'
      };
    }

    // 2. Enhanced browser language detection
    const browserResult = this.detectBrowserLanguageWithConfidence();
    if (browserResult.confidence > 0.5) {
      return browserResult;
    }

    // 3. Default fallback
    return {
      detectedLanguage: 'en-US',
      confidence: 0.0,
      source: 'default'
    };
  }

  /**
   * Detect browser language with confidence scoring
   */
  private detectBrowserLanguageWithConfidence(): LanguageDetectionResult {
    const browserLanguages = this.getBrowserLanguages();
    
    for (const browserLang of browserLanguages) {
      // Try exact match first (highest confidence)
      const exactMatch = this.supportedLanguages.find(lang => 
        lang.code.toLowerCase() === browserLang.toLowerCase()
      );
      if (exactMatch) {
        return {
          detectedLanguage: exactMatch.code,
          confidence: 0.9,
          source: 'browser'
        };
      }

      // Try language without region (medium confidence)
      const langOnly = browserLang.split('-')[0].toLowerCase();
      const langMatch = this.supportedLanguages.find(lang => 
        lang.code.toLowerCase().startsWith(langOnly)
      );
      if (langMatch) {
        return {
          detectedLanguage: langMatch.code,
          confidence: 0.7,
          source: 'browser'
        };
      }
    }

    return {
      detectedLanguage: 'en-US',
      confidence: 0.0,
      source: 'browser'
    };
  }

  /**
   * Get browser languages in order of preference
   */
  private getBrowserLanguages(): string[] {
    const languages: string[] = [];
    
    // Primary language
    if (navigator.language) {
      languages.push(navigator.language);
    }

    // Additional languages
    if (navigator.languages) {
      navigator.languages.forEach(lang => {
        if (!languages.includes(lang)) {
          languages.push(lang);
        }
      });
    }

    // Legacy support
    const userLanguage = (navigator as any).userLanguage;
    if (userLanguage && !languages.includes(userLanguage)) {
      languages.push(userLanguage);
    }

    return languages;
  }

  /**
   * Setup listener for language changes in other tabs/windows
   */
  private setupLanguageChangeListener(): void {
    fromEvent(window, 'storage').pipe(
      filter((event: any) => event.key === 'preferred-language'),
      debounceTime(100)
    ).subscribe((event: any) => {
      const newLanguage = event.newValue;
      if (newLanguage && this.isSupportedLanguage(newLanguage) && 
          newLanguage !== this.currentLanguageSubject.value) {
        console.log('Language changed in another tab, syncing:', newLanguage);
        this.changeLanguage(newLanguage);
      }
    });
  }

  /**
   * Load translations for a specific culture and feature
   */
  loadTranslations(culture: string, feature: string): Observable<any> {
    const url = `${environment.apiUrl}/v7/localization/translations/${culture}/${feature}`;
    return this.http.get(url).pipe(
      catchError(error => {
        console.error(`Failed to load translations for ${culture}:${feature}`, error);
        // Fallback to English if the requested culture fails
        if (culture !== 'en-US') {
          return this.loadTranslations('en-US', feature);
        }
        return of({});
      })
    );
  }

  /**
   * Load translations for multiple features using batch API
   */
  loadBatchTranslations(culture: string, features: string[]): Observable<Record<string, any>> {
    const request: BatchTranslationRequest = { culture, features };
    const url = `${environment.apiUrl}/v7/localization/translations/batch`;
    
    return this.http.post<Record<string, Record<string, string>>>(url, request).pipe(
      map(response => {
        // Flatten the nested structure for ngx-translate
        const flattened: Record<string, any> = {};
        if (response && typeof response === 'object') {
          Object.entries(response).forEach(([feature, translations]) => {
            if (translations && typeof translations === 'object') {
              Object.entries(translations).forEach(([key, value]) => {
                flattened[key] = value;
              });
            }
          });
        }
        return flattened;
      }),
      catchError(error => {
        console.error(`Failed to load batch translations for ${culture}`, error);
        // Fallback to English if the requested culture fails
        if (culture !== 'en-US') {
          return this.loadBatchTranslations('en-US', features);
        }
        return of({});
      })
    );
  }

  /**
   * Get supported cultures from the API
   */
  getSupportedCultures(): Observable<string[]> {
    const url = `${environment.apiUrl}/v7/localization/cultures/supported`;
    return this.http.get<string[]>(url).pipe(
      catchError(error => {
        console.error('Failed to load supported cultures', error);
        return of(['en-US', 'ar-EG', 'ar-AE', 'ar-SA']);
      })
    );
  }

  /**
   * Change the application language with enhanced error handling and feature management
   */
  async changeLanguage(languageCode: string): Promise<void> {
    if (!this.isSupportedLanguage(languageCode)) {
      console.warn(`Unsupported language: ${languageCode}, falling back to en-US`);
      languageCode = 'en-US';
    }

    if (languageCode === this.currentLanguageSubject.value) {
      console.log(`Language ${languageCode} is already active`);
      return;
    }

    this.isLoadingSubject.next(true);

    try {
      console.log(`Changing language to ${languageCode}`);
      
      // Initialize feature status for new language
      const newFeatureStatus: FeatureTranslationStatus[] = this.communityFeatures.map(feature => ({
        feature,
        culture: languageCode,
        loaded: false,
        loading: false
      }));
      this.featureStatusSubject.next(newFeatureStatus);
      
      // Load translations using enhanced feature loading
      const translations = await this.loadFeatureTranslations(languageCode, this.communityFeatures);
      
      // Set translations in ngx-translate
      this.translateService.setTranslation(languageCode, translations, true);
      
      // Use the language
      await this.translateService.use(languageCode).toPromise();
      
      // Update internal state
      this.setLanguage(languageCode);
      
      // Save preference
      localStorage.setItem('preferred-language', languageCode);
      
      // Restart real-time updates for new language if enabled
      if (this.realTimeConfig.enabled) {
        this.startRealTimeUpdates();
      }
      
      console.log(`Successfully changed language to ${languageCode}`);
    } catch (error) {
      console.error(`Failed to change language to ${languageCode}`, error);
      
      // Fallback to English on error
      if (languageCode !== 'en-US') {
        console.log('Attempting fallback to en-US');
        await this.changeLanguage('en-US');
      } else {
        // If even English fails, at least update the UI state
        this.setLanguage('en-US');
      }
    } finally {
      this.isLoadingSubject.next(false);
    }
  }

  /**
   * Set the current language and update RTL state
   */
  private setLanguage(languageCode: string): void {
    const language = this.supportedLanguages.find(lang => lang.code === languageCode);
    const isRTL = language?.isRTL || false;
    
    this.currentLanguageSubject.next(languageCode);
    this.isRTLSubject.next(isRTL);
    
    // Update document direction and language
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = languageCode;
    
    // Add/remove RTL class for styling
    if (isRTL) {
      document.documentElement.classList.add('rtl');
    } else {
      document.documentElement.classList.remove('rtl');
    }

    // Update meta tag for better SEO
    this.updateLanguageMetaTags(languageCode);
  }

  /**
   * Update language-related meta tags
   */
  private updateLanguageMetaTags(languageCode: string): void {
    // Update or create language meta tag
    let langMeta = document.querySelector('meta[name="language"]') as HTMLMetaElement;
    if (!langMeta) {
      langMeta = document.createElement('meta');
      langMeta.name = 'language';
      document.head.appendChild(langMeta);
    }
    langMeta.content = languageCode;

    // Update or create locale meta tag
    let localeMeta = document.querySelector('meta[property="og:locale"]') as HTMLMetaElement;
    if (!localeMeta) {
      localeMeta = document.createElement('meta');
      localeMeta.setAttribute('property', 'og:locale');
      document.head.appendChild(localeMeta);
    }
    localeMeta.content = languageCode.replace('-', '_');
  }

  /**
   * Check if a language is supported
   */
  private isSupportedLanguage(languageCode: string): boolean {
    return this.supportedLanguages.some(lang => lang.code === languageCode);
  }

  /**
   * Get the current language info
   */
  getCurrentLanguage(): SupportedLanguage {
    const currentCode = this.currentLanguageSubject.value;
    return this.supportedLanguages.find(lang => lang.code === currentCode) || this.supportedLanguages[0];
  }

  /**
   * Check if current language is RTL
   */
  isCurrentLanguageRTL(): boolean {
    return this.isRTLSubject.value;
  }

  /**
   * Initialize translations on app startup
   */
  async initializeTranslations(): Promise<void> {
    const currentLang = this.currentLanguageSubject.value;
    await this.changeLanguage(currentLang);
  }

  /**
   * Preload translations for better performance
   */
  async preloadTranslations(languages?: string[]): Promise<void> {
    const languagesToPreload = languages || this.supportedLanguages.map(lang => lang.code);
    
    try {
      await this.translationLoader.preloadTranslations(languagesToPreload).toPromise();
      console.log('Translation preloading completed');
    } catch (error) {
      console.warn('Translation preloading failed:', error);
    }
  }

  /**
   * Clear translation cache
   */
  clearCache(language?: string): void {
    this.translationLoader.clearCache(language);
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { size: number; languages: string[] } {
    return this.translationLoader.getCacheStats();
  }

  /**
   * Get language detection result for debugging
   */
  getLanguageDetectionInfo(): LanguageDetectionResult {
    return this.detectOptimalLanguage();
  }

  // ===== ENHANCED COMPREHENSIVE TRANSLATION MANAGEMENT =====

  /**
   * Enable real-time translation updates
   */
  enableRealTimeUpdates(config?: Partial<RealTimeTranslationConfig>): void {
    this.realTimeConfig = {
      ...this.realTimeConfig,
      ...config,
      enabled: true
    };

    if (this.realTimeConfig.features.length === 0) {
      this.realTimeConfig.features = [...this.communityFeatures];
    }

    this.startRealTimeUpdates();
    console.log('Real-time translation updates enabled', this.realTimeConfig);
  }

  /**
   * Disable real-time translation updates
   */
  disableRealTimeUpdates(): void {
    this.realTimeConfig.enabled = false;
    this.stopRealTimeUpdates();
    console.log('Real-time translation updates disabled');
  }

  /**
   * Start real-time translation polling
   */
  private startRealTimeUpdates(): void {
    if (!this.realTimeConfig.enabled) return;

    this.stopRealTimeUpdates(); // Stop any existing subscription

    this.realTimeSubscription = interval(this.realTimeConfig.pollInterval).pipe(
      takeUntil(this.destroy$),
      switchMap(() => this.checkForTranslationUpdates()),
      catchError(error => {
        console.warn('Real-time translation update check failed:', error);
        return of(null);
      })
    ).subscribe(updates => {
      if (updates && updates.length > 0) {
        this.processTranslationUpdates(updates);
      }
    });
  }

  /**
   * Stop real-time translation polling
   */
  private stopRealTimeUpdates(): void {
    if (this.realTimeSubscription) {
      this.realTimeSubscription.unsubscribe();
      this.realTimeSubscription = null;
    }
  }

  /**
   * Check for translation updates from the server
   */
  private checkForTranslationUpdates(): Observable<TranslationUpdate[] | null> {
    const culture = this.currentLanguageSubject.value;
    const url = `${environment.apiUrl}/v7/localization/updates/${culture}`;
    
    // Get last update timestamp for each feature
    const featureStatus = this.featureStatusSubject.value;
    const lastUpdateTimes = featureStatus.reduce((acc, status) => {
      if (status.lastUpdated) {
        acc[status.feature] = status.lastUpdated.toISOString();
      }
      return acc;
    }, {} as Record<string, string>);

    return this.http.post<TranslationUpdate[]>(url, {
      features: this.realTimeConfig.features,
      lastUpdateTimes
    }).pipe(
      retry(2),
      catchError(error => {
        console.warn('Failed to check for translation updates:', error);
        return of(null);
      })
    );
  }

  /**
   * Process incoming translation updates
   */
  private processTranslationUpdates(updates: TranslationUpdate[]): void {
    const culture = this.currentLanguageSubject.value;
    const translationsToUpdate: Record<string, string> = {};

    updates.forEach(update => {
      if (update.culture === culture) {
        translationsToUpdate[update.key] = update.value;
        
        // Update feature status
        this.updateFeatureStatus(update.feature, culture, {
          lastUpdated: update.timestamp
        });

        // Emit update event
        this.translationUpdatesSubject.next(update);
      }
    });

    if (Object.keys(translationsToUpdate).length > 0) {
      // Update ngx-translate with new translations
      this.translateService.setTranslation(culture, translationsToUpdate, true);
      console.log(`Applied ${Object.keys(translationsToUpdate).length} real-time translation updates`);
    }
  }

  /**
   * Get feature translation status
   */
  getFeatureStatus(feature?: string): FeatureTranslationStatus[] {
    const allStatus = this.featureStatusSubject.value;
    return feature ? allStatus.filter(s => s.feature === feature) : allStatus;
  }

  /**
   * Check if a feature is loaded for the current language
   */
  isFeatureLoaded(feature: string, culture?: string): boolean {
    const targetCulture = culture || this.currentLanguageSubject.value;
    const status = this.featureStatusSubject.value.find(s => 
      s.feature === feature && s.culture === targetCulture
    );
    return status?.loaded || false;
  }

  /**
   * Get real-time configuration
   */
  getRealTimeConfig(): RealTimeTranslationConfig {
    return { ...this.realTimeConfig };
  }

  /**
   * Update real-time configuration
   */
  updateRealTimeConfig(config: Partial<RealTimeTranslationConfig>): void {
    const wasEnabled = this.realTimeConfig.enabled;
    this.realTimeConfig = { ...this.realTimeConfig, ...config };
    
    if (this.realTimeConfig.enabled && !wasEnabled) {
      this.startRealTimeUpdates();
    } else if (!this.realTimeConfig.enabled && wasEnabled) {
      this.stopRealTimeUpdates();
    } else if (this.realTimeConfig.enabled) {
      // Restart with new configuration
      this.startRealTimeUpdates();
    }
  }

  /**
   * Force refresh all translations for current language
   */
  async refreshAllTranslations(): Promise<void> {
    const culture = this.currentLanguageSubject.value;
    console.log(`Force refreshing all translations for ${culture}`);
    
    // Clear all caches
    this.translationLoader.clearCache();
    
    // Reload all features
    await this.reloadFeatureTranslations(this.communityFeatures, culture);
  }

  /**
   * Get translation statistics
   */
  getTranslationStats(): {
    currentLanguage: string;
    isRTL: boolean;
    featuresLoaded: number;
    featuresLoading: number;
    featuresWithErrors: number;
    realTimeEnabled: boolean;
    cacheStats: { size: number; languages: string[] };
  } {
    const featureStatus = this.featureStatusSubject.value;
    const currentCulture = this.currentLanguageSubject.value;
    const currentFeatures = featureStatus.filter(s => s.culture === currentCulture);
    
    return {
      currentLanguage: currentCulture,
      isRTL: this.isRTLSubject.value,
      featuresLoaded: currentFeatures.filter(s => s.loaded).length,
      featuresLoading: currentFeatures.filter(s => s.loading).length,
      featuresWithErrors: currentFeatures.filter(s => s.error).length,
      realTimeEnabled: this.realTimeConfig.enabled,
      cacheStats: this.translationLoader.getCacheStats()
    };
  }
}