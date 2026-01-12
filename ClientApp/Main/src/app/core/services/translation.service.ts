import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable, forkJoin, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

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

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private http = inject(HttpClient);
  private translateService = inject(TranslateService);
  
  private currentLanguageSubject = new BehaviorSubject<string>('en-US');
  public currentLanguage$ = this.currentLanguageSubject.asObservable();
  
  private isRTLSubject = new BehaviorSubject<boolean>(false);
  public isRTL$ = this.isRTLSubject.asObservable();

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
    // Initialize with stored language or browser language
    const storedLanguage = localStorage.getItem('preferred-language') || 
                          this.detectBrowserLanguage() || 
                          'en-US';
    this.setLanguage(storedLanguage);
  }

  /**
   * Load translations for a specific culture and feature
   */
  loadTranslations(culture: string, feature: string): Observable<any> {
    const url = `${environment.apiUrl}/api/v7/localization/translations/${culture}/${feature}`;
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
    const url = `${environment.apiUrl}/api/v7/localization/translations/batch`;
    
    return this.http.post<Record<string, Record<string, string>>>(url, request).pipe(
      map(response => {
        // Flatten the nested structure for ngx-translate
        const flattened: Record<string, any> = {};
        Object.entries(response).forEach(([feature, translations]) => {
          Object.entries(translations).forEach(([key, value]) => {
            flattened[key] = value;
          });
        });
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
    const url = `${environment.apiUrl}/api/v7/localization/cultures/supported`;
    return this.http.get<string[]>(url).pipe(
      catchError(error => {
        console.error('Failed to load supported cultures', error);
        return of(['en-US', 'ar-EG', 'ar-AE', 'ar-SA']);
      })
    );
  }

  /**
   * Change the application language
   */
  async changeLanguage(languageCode: string): Promise<void> {
    try {
      // Load translations for all community features
      const translations = await this.loadBatchTranslations(languageCode, this.communityFeatures).toPromise();
      
      // Set translations in ngx-translate
      this.translateService.setTranslation(languageCode, translations || {}, true);
      
      // Use the language
      await this.translateService.use(languageCode).toPromise();
      
      // Update internal state
      this.setLanguage(languageCode);
      
      // Save preference
      localStorage.setItem('preferred-language', languageCode);
      
      console.log(`Language changed to ${languageCode}`);
    } catch (error) {
      console.error(`Failed to change language to ${languageCode}`, error);
      // Fallback to English on error
      if (languageCode !== 'en-US') {
        await this.changeLanguage('en-US');
      }
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
  }

  /**
   * Detect browser language and find the best match
   */
  private detectBrowserLanguage(): string | null {
    const browserLang = navigator.language || (navigator as any).userLanguage;
    
    // Try exact match first
    const exactMatch = this.supportedLanguages.find(lang => lang.code === browserLang);
    if (exactMatch) {
      return exactMatch.code;
    }
    
    // Try language without region (e.g., 'ar' for 'ar-EG')
    const langOnly = browserLang.split('-')[0];
    const langMatch = this.supportedLanguages.find(lang => lang.code.startsWith(langOnly));
    if (langMatch) {
      return langMatch.code;
    }
    
    return null;
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
}