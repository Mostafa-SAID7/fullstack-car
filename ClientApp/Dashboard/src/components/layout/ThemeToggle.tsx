import React, { useState, useEffect, useRef } from 'react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Laptop } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export const ThemeToggle: React.FC = () => {
    const { currentTheme, setTheme } = useTheme();
    const theme = currentTheme.id;
    const [showThemeMenu, setShowThemeMenu] = useState(false);
    const themeRef = useRef<HTMLDivElement>(null);

    // Handle clicks outside dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (themeRef.current && !themeRef.current.contains(event.target as Node)) {
                setShowThemeMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const themeOptions = [
        { id: 'light', icon: Sun, label: 'Light' },
        { id: 'dark', icon: Moon, label: 'Dark' },
        { id: 'system', icon: Laptop, label: 'System' }
    ];

    return (
        <div className="relative" ref={themeRef}>
            <button
                onClick={() => setShowThemeMenu(!showThemeMenu)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-500 dark:text-gray-400"
                title="Toggle theme"
            >
                <Sun className="w-5 h-5" />
            </button>
            <AnimatePresence>
                {showThemeMenu && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-36 bg-card border border-border rounded-xl shadow-lg p-2 z-50"
                    >
                        {themeOptions.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => { 
                                    setTheme(item.id as any); 
                                    setShowThemeMenu(false); 
                                }}
                                className={cn(
                                    "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-muted",
                                    theme === item.id && "bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400"
                                )}
                            >
                                <item.icon className="w-4 h-4" />
                                {item.label}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};