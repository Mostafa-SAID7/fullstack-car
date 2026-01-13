import { useTranslation as useI18nextTranslation } from 'react-i18next';
import { useCallback, useEffect, useState } from 'react';
import { translationService, type SupportedCulture } from '../services/translationService';

export interface UseTranslationReturn {
  t: (key: string, options?: any) => string;
  i18n: any;
  ready: boolean;
  changeLanguage: (language: string) => Promise<void>;
  currentLanguage: string;
  isRTL: boolean;
  supportedLanguages: SupportedCulture[];
  loadingLanguages: boolean;
  error: string | null;
}

export const useTranslation = (namespace?: string): UseTranslationReturn => {
  const { t, i18n, ready } = useI18nextTranslation(namespace);
  const [supportedLanguages, setSupportedLanguages] = useState<SupportedCulture[]>([]);
  const [loadingLanguages, setLoadingLanguages] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const currentLanguage = i18n.language || 'en-US';
  const isRTL = currentLanguage.startsWith('ar-');

  // Load supported languages on mount
  useEffect(() => {
    const loadSupportedLanguages = async () => {
      try {
        setLoadingLanguages(true);
        setError(null);
        const languages = await translationService.getSupportedCultures();
        setSupportedLanguages(languages);
      } catch (err) {
        console.error('Failed to load supported languages:', err);
        setError('Failed to load supported languages');
        
        // Set default languages as fallback
        setSupportedLanguages([
          { code: 'en-US', name: 'English (United States)', nativeName: 'English', isRTL: false },
          { code: 'ar-EG', name: 'Arabic (Egypt)', nativeName: 'العربية (مصر)', isRTL: true },
          { code: 'ar-AE', name: 'Arabic (UAE)', nativeName: 'العربية (الإمارات)', isRTL: true },
          { code: 'ar-SA', name: 'Arabic (Saudi Arabia)', nativeName: 'العربية (السعودية)', isRTL: true }
        ]);
      } finally {
        setLoadingLanguages(false);
      }
    };

    loadSupportedLanguages();
  }, []);

  // Enhanced language change function
  const changeLanguage = useCallback(async (language: string) => {
    try {
      setError(null);
      
      // Validate language is supported
      const isSupported = supportedLanguages.some(lang => lang.code === language);
      if (!isSupported && supportedLanguages.length > 0) {
        throw new Error(`Language ${language} is not supported`);
      }

      // Change language in i18next
      await i18n.changeLanguage(language);
      
      // Update document direction for RTL languages
      const isRightToLeft = language.startsWith('ar-');
      document.documentElement.dir = isRightToLeft ? 'rtl' : 'ltr';
      document.documentElement.lang = language;
      
      // Save preference
      localStorage.setItem('preferred-language', language);
      
      // Dispatch custom event for other components
      window.dispatchEvent(new CustomEvent('languageChanged', { 
        detail: { language, isRTL: isRightToLeft } 
      }));
      
      // Preload critical translations for the new language
      await translationService.preloadTranslations([language], ['common', 'dashboard']);
      
    } catch (err) {
      console.error('Failed to change language:', err);
      setError(`Failed to change language: ${err}`);
      throw err;
    }
  }, [i18n, supportedLanguages]);

  return {
    t,
    i18n,
    ready,
    changeLanguage,
    currentLanguage,
    isRTL,
    supportedLanguages,
    loadingLanguages,
    error
  };
};

// Hook for managing translation cache
export const useTranslationCache = () => {
  const [cacheInfo, setCacheInfo] = useState(translationService.getCacheInfo());

  const refreshCacheInfo = useCallback(() => {
    setCacheInfo(translationService.getCacheInfo());
  }, []);

  const clearCache = useCallback(async (culture?: string, feature?: string) => {
    await translationService.invalidateCache(culture, feature);
    refreshCacheInfo();
  }, [refreshCacheInfo]);

  const preloadTranslations = useCallback(async (cultures: string[], features: string[]) => {
    await translationService.preloadTranslations(cultures, features);
    refreshCacheInfo();
  }, [refreshCacheInfo]);

  useEffect(() => {
    // Refresh cache info periodically
    const interval = setInterval(refreshCacheInfo, 60000); // Every minute
    return () => clearInterval(interval);
  }, [refreshCacheInfo]);

  return {
    cacheInfo,
    refreshCacheInfo,
    clearCache,
    preloadTranslations
  };
};

// Hook for RTL-aware styling
export const useRTL = () => {
  const { isRTL, currentLanguage } = useTranslation();
  
  const getRTLClass = useCallback((ltrClass: string, rtlClass: string) => {
    return isRTL ? rtlClass : ltrClass;
  }, [isRTL]);
  
  const getRTLStyle = useCallback((ltrStyle: React.CSSProperties, rtlStyle: React.CSSProperties) => {
    return isRTL ? { ...ltrStyle, ...rtlStyle } : ltrStyle;
  }, [isRTL]);

  return {
    isRTL,
    currentLanguage,
    getRTLClass,
    getRTLStyle,
    direction: isRTL ? 'rtl' : 'ltr'
  };
};