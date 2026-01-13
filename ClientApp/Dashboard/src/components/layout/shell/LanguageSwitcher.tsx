import React, { useState, useEffect, useRef } from 'react';
import { cn } from '../../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Languages, Check, Loader2 } from 'lucide-react';

export const LanguageSwitcher: React.FC = () => {
    const { i18n } = useTranslation();
    const [showLangMenu, setShowLangMenu] = useState(false);
    const [isChanging, setIsChanging] = useState(false);
    const langRef = useRef<HTMLDivElement>(null);

    // Enhanced language configuration with all 4 supported languages
    const languages = [
        { 
            id: 'en-US', 
            label: 'English', 
            nativeLabel: 'English',
            flag: '🇺🇸',
            isRTL: false
        },
        { 
            id: 'ar-EG', 
            label: 'Arabic (Egypt)', 
            nativeLabel: 'العربية (مصر)',
            flag: '🇪🇬',
            isRTL: true
        },
        { 
            id: 'ar-AE', 
            label: 'Arabic (UAE)', 
            nativeLabel: 'العربية (الإمارات)',
            flag: '🇦🇪',
            isRTL: true
        },
        { 
            id: 'ar-SA', 
            label: 'Arabic (Saudi Arabia)', 
            nativeLabel: 'العربية (السعودية)',
            flag: '🇸🇦',
            isRTL: true
        }
    ];

    // Handle clicks outside dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (langRef.current && !langRef.current.contains(event.target as Node)) {
                setShowLangMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Enhanced language switching with immediate UI update and user preference persistence
    const toggleLanguage = async (langCode: string) => {
        if (langCode === i18n.language || isChanging) return;

        try {
            setIsChanging(true);
            
            // Change language immediately
            await i18n.changeLanguage(langCode);
            
            // Update document direction for RTL support
            const selectedLang = languages.find(lang => lang.id === langCode);
            const isRTL = selectedLang?.isRTL || false;
            document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
            document.documentElement.lang = langCode;
            
            // Add RTL class to body for CSS styling
            if (isRTL) {
                document.body.classList.add('rtl');
                document.body.classList.remove('ltr');
            } else {
                document.body.classList.add('ltr');
                document.body.classList.remove('rtl');
            }
            
            // Persist user preference to localStorage
            localStorage.setItem('preferred-language', langCode);
            
            // Update user preference in backend if authenticated (non-blocking)
            try {
                const token = localStorage.getItem('authToken') || localStorage.getItem('access_token');
                if (token) {
                    fetch('/api/v1/users/profile', {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({ preferredLanguage: langCode })
                    }).catch(error => {
                        console.warn('Failed to update user language preference in backend:', error);
                    });
                }
            } catch (error) {
                console.warn('Failed to update user language preference:', error);
            }
            
            // Dispatch custom event for other components
            window.dispatchEvent(new CustomEvent('languageChanged', { 
                detail: { 
                    language: langCode, 
                    isRTL,
                    previousLanguage: i18n.language 
                } 
            }));
            
            setShowLangMenu(false);
            
        } catch (error) {
            console.error('Failed to change language:', error);
        } finally {
            setIsChanging(false);
        }
    };

    // Get current language configuration
    const getCurrentLanguage = () => {
        return languages.find(lang => lang.id === i18n.language) || languages[0];
    };

    const currentLang = getCurrentLanguage();

    return (
        <div className="relative" ref={langRef}>
            <button
                onClick={() => setShowLangMenu(!showLangMenu)}
                disabled={isChanging}
                className={cn(
                    "p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50",
                    isChanging && "opacity-50 cursor-not-allowed"
                )}
                title={`Current language: ${currentLang.nativeLabel}. Click to change language.`}
                aria-expanded={showLangMenu}
                aria-haspopup="listbox"
                aria-label="Change language"
            >
                {isChanging ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                    <Languages className="w-5 h-5" />
                )}
            </button>
            
            <AnimatePresence>
                {showLangMenu && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-48 glassmorphism rounded-xl shadow-lg p-2 z-50 border border-gray-200/20"
                        role="listbox"
                        aria-label="Select language"
                    >
                        {languages.map((lang) => (
                            <button
                                key={lang.id}
                                onClick={() => toggleLanguage(lang.id)}
                                disabled={isChanging}
                                className={cn(
                                    "w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
                                    "hover:bg-muted focus:outline-none focus:bg-muted",
                                    i18n.language === lang.id && "bg-pink-50 text-pink-600 dark:bg-pink-900/20 dark:text-pink-400",
                                    isChanging && "opacity-50 cursor-not-allowed"
                                )}
                                role="option"
                                aria-selected={i18n.language === lang.id}
                                title={`Switch to ${lang.label}`}
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-lg flex-shrink-0">{lang.flag}</span>
                                    <div className="flex flex-col items-start min-w-0">
                                        <span className="font-medium truncate">{lang.nativeLabel}</span>
                                        {lang.label !== lang.nativeLabel && (
                                            <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                                {lang.label}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    {lang.isRTL && (
                                        <span className="text-xs bg-gray-200 dark:bg-gray-600 px-1.5 py-0.5 rounded text-gray-600 dark:text-gray-300">
                                            RTL
                                        </span>
                                    )}
                                    {i18n.language === lang.id && (
                                        <Check className="w-4 h-4 text-pink-600 dark:text-pink-400" />
                                    )}
                                    {isChanging && i18n.language === lang.id && (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    )}
                                </div>
                            </button>
                        ))}
                        
                        {/* Footer */}
                        <div className="border-t border-gray-200/20 mt-2 pt-2">
                            <span className="text-xs text-gray-500 dark:text-gray-400 px-3">
                                {languages.length} languages available
                            </span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};