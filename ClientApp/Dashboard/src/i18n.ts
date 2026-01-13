import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { API_BASE_URL } from './config';
import { translationService } from './services/translationService';

// Enhanced i18next configuration with v7 backend API integration
i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next);

// Initialize with configuration
const initConfig = {
  fallbackLng: 'en-US',
  debug: import.meta.env.DEV,
  
  // Supported languages - all 4 cultures as per requirements
  supportedLngs: ['en-US', 'ar-EG', 'ar-AE', 'ar-SA'],
  
  // Backend configuration for v7 API endpoints
  backend: {
    // Use local files for development, v7 API for production
    loadPath: import.meta.env.DEV 
      ? '/locales/{{lng}}/{{ns}}.json'
      : `${API_BASE_URL}/v7/localization/translations/{{lng}}/{{ns}}`,
    
    // Request options with caching and performance optimization
    requestOptions: {
      cache: 'default' as RequestCache,
      credentials: 'include' as RequestCredentials,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    },
    
    // Custom request function with enhanced error handling and fallback
    request: async (options: any, url: string, _payload: any, callback: any) => {
      try {
        const response = await fetch(url, {
          ...options.requestOptions,
          method: 'GET'
        });

        if (!response.ok) {
          // Handle different error scenarios
          if (response.status === 404) {
            // Translation resource not found - try fallback to English
            const urlParts = url.split('/');
            const namespace = urlParts[urlParts.length - 1];
            const culture = urlParts[urlParts.length - 2];
            
            if (culture !== 'en-US') {
              const fallbackUrl = url.replace(`/${culture}/`, '/en-US/');
              const fallbackResponse = await fetch(fallbackUrl, options.requestOptions);
              
              if (fallbackResponse.ok) {
                const fallbackData = await fallbackResponse.json();
                console.warn(`Using fallback translations for ${culture}:${namespace}`);
                callback(null, { status: fallbackResponse.status, data: fallbackData });
                return;
              }
            }
          }
          
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        callback(null, { status: response.status, data });
      } catch (error) {
        console.warn('Translation loading failed:', error);
        
        // Fallback to local translations for critical features
        const fallbackTranslations = getFallbackTranslations(url);
        if (fallbackTranslations) {
          callback(null, { status: 200, data: fallbackTranslations });
        } else {
          callback(error, null);
        }
      }
    },
    
    // Parse response data
    parse: (data: any) => {
      return typeof data === 'object' ? data : {};
    },
    
    // Allow cross-origin requests
    crossDomain: true,
    
    // Request timeout
    requestTimeout: 10000,
    
    // Retry configuration
    maxRetries: 3,
    retryDelay: 1000
  },

  // Enhanced language detection configuration
  detection: {
    order: ['localStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],
    caches: ['localStorage'],
    lookupLocalStorage: 'preferred-language',
    lookupFromPathIndex: 0,
    lookupFromSubdomainIndex: 0,
    checkWhitelist: true,
    
    // Convert browser language codes to supported cultures
    convertDetectedLanguage: (lng: string) => {
      // Map browser language codes to our supported cultures
      const languageMap: Record<string, string> = {
        'en': 'en-US',
        'en-US': 'en-US',
        'ar': 'ar-EG', // Default Arabic to Egyptian
        'ar-EG': 'ar-EG',
        'ar-AE': 'ar-AE',
        'ar-SA': 'ar-SA'
      };
      
      return languageMap[lng] || 'en-US';
    }
  },

  interpolation: {
    escapeValue: false, // React already safe from XSS
    formatSeparator: ',',
    format: (value: any, format: string | undefined, lng: string | undefined) => {
      // Enhanced culture-aware formatting
      if (!format) return value;
      
      const language = lng || 'en-US';
      
      if (format === 'uppercase') return value.toUpperCase();
      if (format === 'lowercase') return value.toLowerCase();
      
      // Culture-aware date formatting
      if (format === 'date' && value instanceof Date) {
        return new Intl.DateTimeFormat(language, {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }).format(value);
      }
      
      if (format === 'shortDate' && value instanceof Date) {
        return new Intl.DateTimeFormat(language, {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }).format(value);
      }
      
      // Culture-aware number formatting
      if (format === 'number' && typeof value === 'number') {
        return new Intl.NumberFormat(language).format(value);
      }
      
      if (format === 'currency' && typeof value === 'number') {
        // Default to USD, but could be enhanced with culture-specific currencies
        return new Intl.NumberFormat(language, {
          style: 'currency',
          currency: 'USD'
        }).format(value);
      }
      
      return value;
    }
  },

  // React-specific options
  react: {
    useSuspense: false, // Disable suspense to prevent loading issues
    bindI18n: 'languageChanged loaded',
    bindI18nStore: 'added removed',
    transEmptyNodeValue: '',
    transSupportBasicHtmlNodes: true,
    transKeepBasicHtmlNodesFor: ['br', 'strong', 'i', 'em', 'span']
  },

  // Namespace configuration for feature-based loading
  ns: ['common', 'dashboard', 'community', 'management', 'analytics', 'moderation', 'posts', 'groups', 'qa', 'reviews', 'social', 'maps', 'news', 'guides'],
  defaultNS: 'common',
  
  // Preload critical languages for better performance
  preload: ['en-US'],
  
  // Enhanced caching configuration
  cache: {
    enabled: true,
    prefix: 'i18next_res_',
    expirationTime: 7 * 24 * 60 * 60 * 1000, // 7 days
    versions: {}
  },

  // Enhanced error handling
  missingKeyHandler: (lngs: readonly string[], ns: string, key: string, _fallbackValue: string, _updateMissing: boolean, _options: any) => {
    console.warn(`Missing translation key: ${key} for language: ${lngs[0]} in namespace: ${ns}`);
    
    // Report missing keys to analytics in production
    if (import.meta.env.PROD) {
      // Could send to analytics service
      console.info('Missing translation reported:', { lng: lngs[0], ns, key });
    }
  },

  // Save missing translations in development
  saveMissing: import.meta.env.DEV,
  saveMissingTo: 'current' as const,
  
  // Performance optimizations
  load: 'languageOnly' as const, // Load only language without region for fallback
  cleanCode: true,
  
  // Partition keys for better performance
  partialBundledLanguages: true,
  
  // Non-explicit support for plurals
  compatibilityJSON: 'v4' as const
};

// Initialize i18n
i18n.init(initConfig);

// Fallback translations for critical UI elements when API fails
function getFallbackTranslations(url: string): Record<string, string> | null {
  const urlParts = url.split('/');
  const namespace = urlParts[urlParts.length - 1];
  
  const fallbackTranslations: Record<string, Record<string, string>> = {
    common: {
      // Navigation
      dashboard: 'Dashboard',
      analytics: 'Analytics',
      users: 'Users',
      content: 'Content',
      ai_agent: 'AI Agent',
      system: 'System',
      settings: 'Settings',
      
      // Common actions
      welcome: 'Welcome',
      login: 'Login',
      logout: 'Logout',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      create: 'Create',
      update: 'Update',
      
      // Auth
      email: 'Email',
      password: 'Password',
      remember_me: 'Remember me',
      forgot_password: 'Forgot password?',
      sign_in: 'Sign In',
      sign_up: 'Sign Up',
      
      // Errors
      error_occurred: 'An error occurred',
      try_again: 'Try again',
      page_not_found: 'Page not found',
      loading: 'Loading...',
      no_data: 'No data available',
      
      // Status messages
      success: 'Success',
      error: 'Error',
      warning: 'Warning',
      info: 'Information'
    },
    dashboard: {
      overview: 'Overview',
      statistics: 'Statistics',
      recent_activity: 'Recent Activity',
      total_users: 'Total Users',
      active_sessions: 'Active Sessions',
      revenue: 'Revenue',
      growth: 'Growth'
    },
    community: {
      posts: 'Posts',
      groups: 'Groups',
      members: 'Members',
      activity: 'Activity',
      discussions: 'Discussions'
    }
  };
  
  return fallbackTranslations[namespace] || null;
}

// Enhanced language change function with comprehensive error handling and RTL support
export const changeLanguage = async (languageCode: string): Promise<void> => {
  try {
    // Validate language code
    const supportedLanguages = ['en-US', 'ar-EG', 'ar-AE', 'ar-SA'];
    if (!supportedLanguages.includes(languageCode)) {
      throw new Error(`Unsupported language: ${languageCode}`);
    }

    // Change language in i18next
    await i18n.changeLanguage(languageCode);
    
    // Update document direction and language for RTL languages
    const isRTL = languageCode.startsWith('ar-');
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = languageCode;
    
    // Add RTL class to body for CSS styling
    if (isRTL) {
      document.body.classList.add('rtl');
      document.body.classList.remove('ltr');
    } else {
      document.body.classList.add('ltr');
      document.body.classList.remove('rtl');
    }
    
    // Save preference to localStorage
    localStorage.setItem('preferred-language', languageCode);
    
    // Update user preference in backend if authenticated
    try {
      const token = localStorage.getItem('authToken');
      if (token) {
        await fetch(`${API_BASE_URL}/v1/users/profile`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ preferredLanguage: languageCode })
        });
      }
    } catch (error) {
      console.warn('Failed to update user language preference:', error);
    }
    
    // Dispatch custom event for other components to listen
    window.dispatchEvent(new CustomEvent('languageChanged', { 
      detail: { 
        language: languageCode, 
        isRTL,
        previousLanguage: i18n.language 
      } 
    }));
    
    console.info(`Language changed to: ${languageCode} (RTL: ${isRTL})`);
    
  } catch (error) {
    console.error('Failed to change language:', error);
    throw new Error(`Language change failed: ${error}`);
  }
};

// Preload critical translations for better performance
export const preloadTranslations = async (languages: string[] = ['en-US'], namespaces: string[] = ['common', 'dashboard']): Promise<void> => {
  try {
    const preloadPromises: Promise<void>[] = [];
    
    for (const lang of languages) {
      for (const ns of namespaces) {
        preloadPromises.push(
          i18n.loadNamespaces(ns).then(() => {
            console.debug(`Preloaded ${lang}:${ns}`);
          }).catch(error => {
            console.warn(`Failed to preload ${lang}:${ns}:`, error);
          })
        );
      }
    }
    
    await Promise.allSettled(preloadPromises);
    console.info('Translation preloading completed');
  } catch (error) {
    console.warn('Failed to preload some translations:', error);
  }
};

// Enhanced cache management utilities
export const clearTranslationCache = (): void => {
  try {
    // Clear i18next cache
    i18n.services.backendConnector?.backend?.clearCache?.();
    
    // Clear localStorage cache
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('i18next_res_')) {
        localStorage.removeItem(key);
      }
    });
    
    // Clear translation service cache
    translationService.invalidateCache();
    
    console.info('Translation cache cleared');
  } catch (error) {
    console.error('Failed to clear translation cache:', error);
  }
};

export const getTranslationCacheInfo = (): { size: number; keys: string[]; i18nextCache: any; serviceCache: any } => {
  const cacheKeys = Object.keys(localStorage).filter(key => 
    key.startsWith('i18next_res_')
  );
  
  const totalSize = cacheKeys.reduce((size, key) => {
    return size + (localStorage.getItem(key)?.length || 0);
  }, 0);
  
  return {
    size: totalSize,
    keys: cacheKeys,
    i18nextCache: i18n.services.backendConnector?.backend?.cache || {},
    serviceCache: translationService.getCacheInfo()
  };
};

// Batch translation loading for performance optimization
export const loadTranslationBatch = async (culture: string, features: string[]): Promise<void> => {
  try {
    const batchData = await translationService.getBatchTranslations({
      culture,
      features
    });
    
    // Add translations to i18next store
    Object.entries(batchData).forEach(([feature, translations]) => {
      i18n.addResourceBundle(culture, feature, translations, true, true);
    });
    
    console.info(`Loaded batch translations for ${culture}:`, features);
  } catch (error) {
    console.error('Failed to load translation batch:', error);
    throw error;
  }
};

// RTL-aware text direction utility
export const getTextDirection = (language?: string): 'ltr' | 'rtl' => {
  const lang = language || i18n.language;
  return lang.startsWith('ar-') ? 'rtl' : 'ltr';
};

// Culture-aware formatting utilities
export const formatDate = (date: Date, format: 'short' | 'long' | 'full' = 'short', language?: string): string => {
  const lang = language || i18n.language;
  
  const formatOptions: Record<string, Intl.DateTimeFormatOptions> = {
    short: { year: 'numeric', month: 'short', day: 'numeric' },
    long: { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' },
    full: { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric', 
      weekday: 'long',
      hour: '2-digit',
      minute: '2-digit'
    }
  };
  
  return new Intl.DateTimeFormat(lang, formatOptions[format]).format(date);
};

export const formatNumber = (number: number, options?: Intl.NumberFormatOptions, language?: string): string => {
  const lang = language || i18n.language;
  return new Intl.NumberFormat(lang, options).format(number);
};

export const formatCurrency = (amount: number, currency: string = 'USD', language?: string): string => {
  const lang = language || i18n.language;
  return new Intl.NumberFormat(lang, {
    style: 'currency',
    currency
  }).format(amount);
};

// Initialize RTL support on page load
const initializeRTLSupport = () => {
  const currentLanguage = i18n.language || localStorage.getItem('preferred-language') || 'en-US';
  const isRTL = currentLanguage.startsWith('ar-');
  
  document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
  document.documentElement.lang = currentLanguage;
  
  if (isRTL) {
    document.body.classList.add('rtl');
  } else {
    document.body.classList.add('ltr');
  }
};

// Initialize on module load
if (typeof window !== 'undefined') {
  // Initialize RTL support
  initializeRTLSupport();
  
  // Listen for i18next initialization
  i18n.on('initialized', () => {
    initializeRTLSupport();
  });
  
  // Listen for language changes
  i18n.on('languageChanged', (lng: string) => {
    const isRTL = lng.startsWith('ar-');
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = lng;
    
    if (isRTL) {
      document.body.classList.add('rtl');
      document.body.classList.remove('ltr');
    } else {
      document.body.classList.add('ltr');
      document.body.classList.remove('rtl');
    }
  });
}

export default i18n;
