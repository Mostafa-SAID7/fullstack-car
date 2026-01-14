import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  direction: 'ltr' | 'rtl';
  dateFormat: string;
  timeFormat: string;
}

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private readonly STORAGE_KEY = 'ai_agent_language';
  private readonly DEFAULT_LANGUAGE = 'en-US';

  private currentLanguage$ = new BehaviorSubject<string>(this.DEFAULT_LANGUAGE);
  private translations$ = new BehaviorSubject<any>({});

  // Supported languages
  readonly languages: Language[] = [
    {
      code: 'en-US',
      name: 'English',
      nativeName: 'English',
      direction: 'ltr',
      dateFormat: 'MM/DD/YYYY',
      timeFormat: 'hh:mm A'
    },
    {
      code: 'ar-EG',
      name: 'Arabic (Egypt)',
      nativeName: 'العربية (مصر)',
      direction: 'rtl',
      dateFormat: 'DD/MM/YYYY',
      timeFormat: 'HH:mm'
    },
    {
      code: 'ar-AE',
      name: 'Arabic (UAE)',
      nativeName: 'العربية (الإمارات)',
      direction: 'rtl',
      dateFormat: 'DD/MM/YYYY',
      timeFormat: 'HH:mm'
    },
    {
      code: 'ar-SA',
      name: 'Arabic (Saudi Arabia)',
      nativeName: 'العربية (السعودية)',
      direction: 'rtl',
      dateFormat: 'DD/MM/YYYY',
      timeFormat: 'HH:mm'
    }
  ];

  constructor() {
    this.loadLanguage();
  }

  /**
   * Get current language code
   */
  getCurrentLanguage(): string {
    return this.currentLanguage$.value;
  }

  /**
   * Get current language observable
   */
  getCurrentLanguage$(): Observable<string> {
    return this.currentLanguage$.asObservable();
  }

  /**
   * Get current language details
   */
  getCurrentLanguageDetails(): Language {
    return this.getLanguageDetails(this.currentLanguage$.value);
  }

  /**
   * Get language details by code
   */
  getLanguageDetails(code: string): Language {
    return this.languages.find(lang => lang.code === code) || this.languages[0];
  }

  /**
   * Check if current language is RTL
   */
  isRTL(): boolean {
    return this.getCurrentLanguageDetails().direction === 'rtl';
  }

  /**
   * Set language
   */
  async setLanguage(languageCode: string): Promise<void> {
    const language = this.getLanguageDetails(languageCode);
    if (!language) {
      console.error(`Language ${languageCode} not supported`);
      return;
    }

    try {
      // Load translations
      const translations = await this.loadTranslations(languageCode);
      this.translations$.next(translations);

      // Update current language
      this.currentLanguage$.next(languageCode);

      // Save to localStorage
      this.saveLanguage(languageCode);

      // Update document direction
      this.updateDocumentDirection(language.direction);

      // Update document language attribute
      document.documentElement.lang = languageCode;

      console.log(`Language changed to: ${languageCode}`);
    } catch (error) {
      console.error(`Failed to load language ${languageCode}:`, error);
    }
  }

  /**
   * Get translation for a key
   */
  translate(key: string, params?: Record<string, any>): string {
    const translations = this.translations$.value;
    const keys = key.split('.');
    let value: any = translations;

    // Navigate through nested keys
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key; // Return key if translation not found
      }
    }

    // Replace parameters
    if (params && typeof value === 'string') {
      Object.keys(params).forEach(param => {
        value = value.replace(`{{${param}}}`, params[param]);
      });
    }

    return value || key;
  }

  /**
   * Get translations observable
   */
  getTranslations$(): Observable<any> {
    return this.translations$.asObservable();
  }

  /**
   * Format date according to current locale
   */
  formatDate(date: Date): string {
    const language = this.getCurrentLanguageDetails();
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    };

    return new Intl.DateTimeFormat(language.code, options).format(date);
  }

  /**
   * Format time according to current locale
   */
  formatTime(date: Date): string {
    const language = this.getCurrentLanguageDetails();
    const options: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit'
    };

    return new Intl.DateTimeFormat(language.code, options).format(date);
  }

  /**
   * Format date and time according to current locale
   */
  formatDateTime(date: Date): string {
    return `${this.formatDate(date)} ${this.formatTime(date)}`;
  }

  /**
   * Format relative time (e.g., "2 minutes ago")
   */
  formatRelativeTime(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) {
      return this.translate('messages.justNow');
    } else if (diffMins < 60) {
      return this.translate('messages.minutesAgo', { count: diffMins });
    } else if (diffHours < 24) {
      return this.translate('messages.hoursAgo', { count: diffHours });
    } else if (diffDays < 7) {
      return this.translate('messages.daysAgo', { count: diffDays });
    } else {
      return this.formatDate(date);
    }
  }

  /**
   * Load translations from JSON file
   */
  private async loadTranslations(languageCode: string): Promise<any> {
    try {
      const response = await fetch(`/assets/i18n/ai-agent/${languageCode}.json`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Failed to load translations for ${languageCode}:`, error);
      // Fallback to English
      if (languageCode !== this.DEFAULT_LANGUAGE) {
        return this.loadTranslations(this.DEFAULT_LANGUAGE);
      }
      return {};
    }
  }

  /**
   * Load language from localStorage
   */
  private loadLanguage(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      const languageCode = stored || this.detectBrowserLanguage();
      this.setLanguage(languageCode);
    } catch (error) {
      console.error('Failed to load language from storage:', error);
      this.setLanguage(this.DEFAULT_LANGUAGE);
    }
  }

  /**
   * Save language to localStorage
   */
  private saveLanguage(languageCode: string): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, languageCode);
    } catch (error) {
      console.error('Failed to save language to storage:', error);
    }
  }

  /**
   * Detect browser language
   */
  private detectBrowserLanguage(): string {
    const browserLang = navigator.language || (navigator as any).userLanguage;
    
    // Check if we support the exact language
    if (this.languages.some(lang => lang.code === browserLang)) {
      return browserLang;
    }

    // Check if we support the language family (e.g., 'ar' for 'ar-EG')
    const langFamily = browserLang.split('-')[0];
    const matchingLang = this.languages.find(lang => lang.code.startsWith(langFamily));
    
    return matchingLang?.code || this.DEFAULT_LANGUAGE;
  }

  /**
   * Update document direction (LTR/RTL)
   */
  private updateDocumentDirection(direction: 'ltr' | 'rtl'): void {
    document.documentElement.dir = direction;
    document.body.dir = direction;

    // Add/remove RTL class for styling
    if (direction === 'rtl') {
      document.body.classList.add('rtl');
      document.body.classList.remove('ltr');
    } else {
      document.body.classList.add('ltr');
      document.body.classList.remove('rtl');
    }
  }

  /**
   * Get all supported languages
   */
  getSupportedLanguages(): Language[] {
    return this.languages;
  }
}
