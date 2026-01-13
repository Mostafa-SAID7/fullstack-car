import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Globe, ChevronDown, Check, AlertCircle, Loader2 } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import type { SupportedCulture } from '../services/translationService';

interface LanguageSwitcherProps {
  className?: string;
  variant?: 'dropdown' | 'inline';
  showFlags?: boolean;
  showNativeNames?: boolean;
  size?: 'sm' | 'md' | 'lg';
  position?: 'left' | 'right' | 'center';
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  className = '',
  variant = 'dropdown',
  showFlags = true,
  showNativeNames = true,
  size = 'md',
  position = 'left'
}) => {
  const { 
    changeLanguage, 
    currentLanguage, 
    supportedLanguages, 
    loadingLanguages, 
    error,
    isRTL 
  } = useTranslation();
  
  const [isOpen, setIsOpen] = useState(false);
  const [isChanging, setIsChanging] = useState(false);
  const [lastChanged, setLastChanged] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Enhanced language configuration with all 4 supported languages as per requirements
  const languageConfig: Record<string, { flag: string; name: string; nativeName: string; isRTL: boolean }> = {
    'en-US': { 
      flag: '🇺🇸', 
      name: 'EN', 
      nativeName: 'EN', 
      isRTL: false 
    },
    'ar-EG': { 
      flag: '🇪🇬', 
      name: 'Arabic (Egypt)', 
      nativeName: 'EG', 
      isRTL: true 
    },
    'ar-AE': { 
      flag: '🇦🇪', 
      name: 'Arabic (UAE)', 
      nativeName: 'AE', 
      isRTL: true 
    },
    'ar-SA': { 
      flag: '🇸🇦', 
      name: 'Arabic (Saudi Arabia)', 
      nativeName: 'SA', 
      isRTL: true 
    }
  };

  // Size configurations
  const sizeConfig = {
    sm: {
      button: 'px-2 py-1 text-xs',
      icon: 'w-3 h-3',
      flag: 'text-sm',
      dropdown: 'text-xs'
    },
    md: {
      button: 'px-3 py-2 text-sm',
      icon: 'w-4 h-4',
      flag: 'text-base',
      dropdown: 'text-sm'
    },
    lg: {
      button: 'px-4 py-3 text-base',
      icon: 'w-5 h-5',
      flag: 'text-lg',
      dropdown: 'text-base'
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      switch (event.key) {
        case 'Escape':
          setIsOpen(false);
          break;
        case 'ArrowDown':
        case 'ArrowUp':
          event.preventDefault();
          // Could implement keyboard navigation between options
          break;
        case 'Enter':
          event.preventDefault();
          // Could implement selection with Enter key
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Enhanced language change with comprehensive error handling and user preference persistence
  const handleLanguageChange = useCallback(async (languageCode: string) => {
    if (languageCode === currentLanguage || isChanging) return;

    try {
      setIsChanging(true);
      setLastChanged(languageCode);
      
      // Change language with immediate UI update (no reload required)
      await changeLanguage(languageCode);
      
      // Persist user preference to localStorage immediately
      localStorage.setItem('preferred-language', languageCode);
      
      // Update user preference in backend if authenticated (non-blocking)
      try {
        const token = localStorage.getItem('authToken') || localStorage.getItem('access_token');
        if (token) {
          // Non-blocking backend update for user preference persistence
          fetch('/api/v1/users/profile', {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ preferredLanguage: languageCode })
          }).catch(error => {
            console.warn('Failed to update user language preference in backend:', error);
          });
        }
      } catch (error) {
        console.warn('Failed to update user language preference:', error);
      }
      
      // Update document direction and language for RTL support
      const isRightToLeft = languageCode.startsWith('ar-');
      document.documentElement.dir = isRightToLeft ? 'rtl' : 'ltr';
      document.documentElement.lang = languageCode;
      
      // Add/remove RTL classes for CSS styling
      if (isRightToLeft) {
        document.body.classList.add('rtl');
        document.body.classList.remove('ltr');
      } else {
        document.body.classList.add('ltr');
        document.body.classList.remove('rtl');
      }
      
      // Dispatch custom event for other components to listen
      window.dispatchEvent(new CustomEvent('languageChanged', { 
        detail: { 
          language: languageCode, 
          isRTL: isRightToLeft,
          previousLanguage: currentLanguage 
        } 
      }));
      
      setIsOpen(false);
      
      // Show success feedback briefly
      setTimeout(() => setLastChanged(null), 2000);
      
      console.info(`Language changed to: ${languageCode} (RTL: ${isRightToLeft})`);
      
    } catch (err) {
      console.error('Failed to change language:', err);
      // Could show error toast here
    } finally {
      setIsChanging(false);
    }
  }, [currentLanguage, isChanging, changeLanguage]);

  // Get current language configuration
  const getCurrentLanguage = useCallback((): SupportedCulture | undefined => {
    return supportedLanguages.find(lang => lang.code === currentLanguage);
  }, [supportedLanguages, currentLanguage]);

  // Enhanced language display with fallback to config
  const getLanguageDisplay = useCallback((language: SupportedCulture): string => {
    const parts: string[] = [];
    const config = languageConfig[language.code];
    
    if (showFlags && config?.flag) {
      parts.push(config.flag);
    }
    
    if (showNativeNames) {
      parts.push(config?.nativeName || language.nativeName || language.name);
    } else {
      parts.push(config?.name || language.name);
    }
    
    return parts.join(' ');
  }, [showFlags, showNativeNames, languageConfig]);

  // Get all supported languages with enhanced configuration
  const getEnhancedLanguages = useCallback((): (SupportedCulture & { config: typeof languageConfig[string] })[] => {
    return supportedLanguages.map(lang => ({
      ...lang,
      config: languageConfig[lang.code] || {
        flag: '🌐',
        name: lang.name,
        nativeName: lang.nativeName || lang.name,
        isRTL: lang.code.startsWith('ar-')
      }
    }));
  }, [supportedLanguages, languageConfig]);

  // Loading state
  if (loadingLanguages) {
    return (
      <div className={`flex items-center space-x-2 ${className} ${isRTL ? 'space-x-reverse' : ''}`}>
        <Loader2 className={`${sizeConfig[size].icon} animate-spin`} />
        <span className={`${sizeConfig[size].dropdown} text-gray-500`}>Loading languages...</span>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={`flex items-center space-x-2 text-red-500 ${className} ${isRTL ? 'space-x-reverse' : ''}`}>
        <AlertCircle className={sizeConfig[size].icon} />
        <span className={sizeConfig[size].dropdown}>Language error</span>
      </div>
    );
  }

  const enhancedLanguages = getEnhancedLanguages();
  const currentLang = getCurrentLanguage();

  // Inline variant - horizontal language buttons
  if (variant === 'inline') {
    return (
      <div className={`flex items-center gap-2 ${className} ${isRTL ? 'flex-row-reverse' : ''}`}>
        {enhancedLanguages.map((language) => (
          <button
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            disabled={isChanging}
            className={`
              ${sizeConfig[size].button} rounded-md font-medium transition-all duration-200
              flex items-center gap-2
              ${currentLanguage === language.code
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 ring-2 ring-blue-500/20'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-800'
              }
              ${isChanging ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-105'}
              ${lastChanged === language.code ? 'ring-2 ring-green-500/50' : ''}
            `}
            title={`Switch to ${language.config.name}`}
          >
            {showFlags && (
              <span className={sizeConfig[size].flag}>{language.config.flag}</span>
            )}
            <span>
              {showNativeNames ? language.config.nativeName : language.config.name}
            </span>
            {isChanging && currentLanguage === language.code && (
              <Loader2 className={`${sizeConfig[size].icon} animate-spin`} />
            )}
          </button>
        ))}
      </div>
    );
  }

  // Dropdown variant - main implementation
  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isChanging}
        className={`
          flex items-center gap-2 ${sizeConfig[size].button} rounded-md font-medium
          bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600
          hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-blue-500/50
          ${isChanging ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:shadow-md'}
          ${isRTL ? 'flex-row-reverse' : ''}
          ${lastChanged ? 'ring-2 ring-green-500/50' : ''}
        `}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={`Current language: ${currentLang ? getLanguageDisplay(currentLang) : 'Unknown'}. Click to change language.`}
        title="Change language"
      >
        <Globe className={sizeConfig[size].icon} />
        {currentLang && (
          <span className="flex items-center gap-2">
            {showFlags && languageConfig[currentLang.code]?.flag && (
              <span className={sizeConfig[size].flag}>{languageConfig[currentLang.code].flag}</span>
            )}
            <span>{getLanguageDisplay(currentLang)}</span>
          </span>
        )}
        {isChanging ? (
          <Loader2 className={`${sizeConfig[size].icon} animate-spin`} />
        ) : (
          <ChevronDown 
            className={`${sizeConfig[size].icon} transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
          />
        )}
      </button>

      {/* Enhanced dropdown menu */}
      {isOpen && (
        <div 
          className={`
            absolute top-full mt-2 bg-white dark:bg-gray-800 
            border border-gray-300 dark:border-gray-600 rounded-lg shadow-xl z-50
            min-w-full w-max max-w-xs
            ${position === 'right' || isRTL ? 'right-0' : position === 'center' ? 'left-1/2 -translate-x-1/2' : 'left-0'}
            animate-in fade-in-0 zoom-in-95 duration-200
          `}
          role="listbox"
          aria-label="Select language"
        >
          <div className="py-2">
            {enhancedLanguages.map((language, index) => (
              <button
                key={language.code}
                onClick={() => handleLanguageChange(language.code)}
                disabled={isChanging}
                className={`
                  w-full text-left px-4 py-3 ${sizeConfig[size].dropdown}
                  hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150
                  flex items-center justify-between gap-3
                  ${currentLanguage === language.code 
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-300' 
                    : 'text-gray-700 dark:text-gray-300'
                  }
                  ${isChanging ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                  ${index === 0 ? 'rounded-t-lg' : ''}
                  ${index === enhancedLanguages.length - 1 ? 'rounded-b-lg' : ''}
                  focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-700
                `}
                role="option"
                aria-selected={currentLanguage === language.code}
                title={`Switch to ${language.config.name}`}
              >
                <span className="flex items-center gap-3">
                  {showFlags && (
                    <span className={`${sizeConfig[size].flag} flex-shrink-0`}>
                      {language.config.flag}
                    </span>
                  )}
                  <div className="flex flex-col min-w-0">
                    <span className="font-medium truncate">
                      {showNativeNames ? language.config.nativeName : language.config.name}
                    </span>
                    {showNativeNames && language.config.name !== language.config.nativeName && (
                      <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {language.config.name}
                      </span>
                    )}
                  </div>
                </span>
                
                <div className="flex items-center gap-2 flex-shrink-0">
                  {language.config.isRTL && (
                    <span className="text-xs bg-gray-200 dark:bg-gray-600 px-1.5 py-0.5 rounded text-gray-600 dark:text-gray-300">
                      RTL
                    </span>
                  )}
                  {currentLanguage === language.code && (
                    <Check className={`${sizeConfig[size].icon} text-blue-600 dark:text-blue-400`} />
                  )}
                  {isChanging && currentLanguage === language.code && (
                    <Loader2 className={`${sizeConfig[size].icon} animate-spin`} />
                  )}
                </div>
              </button>
            ))}
          </div>
          
          {/* Footer with language count */}
          <div className="border-t border-gray-200 dark:border-gray-600 px-4 py-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {enhancedLanguages.length} languages available
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;