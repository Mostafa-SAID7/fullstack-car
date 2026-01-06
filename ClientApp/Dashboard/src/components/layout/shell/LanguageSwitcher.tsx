import React, { useState, useEffect, useRef } from 'react';
import { cn } from '../../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Languages } from 'lucide-react';

export const LanguageSwitcher: React.FC = () => {
    const { i18n } = useTranslation();
    const [showLangMenu, setShowLangMenu] = useState(false);
    const langRef = useRef<HTMLDivElement>(null);

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

    const toggleLanguage = (lang: string) => {
        i18n.changeLanguage(lang);
        setShowLangMenu(false);
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    };

    const languages = [
        { id: 'en-US', label: 'English', flag: '🇺🇸' },
        { id: 'ar-SA', label: 'العربية', flag: '🇸🇦' }
    ];

    return (
        <div className="relative" ref={langRef}>
            <button
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="p-2 rounded-lg hover:bg-gray-100  transition-colors text-gray-500 "
                title="Switch language"
            >
                <Languages className="w-5 h-5" />
            </button>
            <AnimatePresence>
                {showLangMenu && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-36 glassmorphism rounded-xl shadow-lg p-2 z-50"
                    >
                        {languages.map((lang) => (
                            <button
                                key={lang.id}
                                onClick={() => toggleLanguage(lang.id)}
                                className={cn(
                                    "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-muted",
                                    i18n.language === lang.id && "bg-pink-50 text-pink-600"
                                )}
                            >
                                <span className="text-base">{lang.flag}</span>
                                {lang.label}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
