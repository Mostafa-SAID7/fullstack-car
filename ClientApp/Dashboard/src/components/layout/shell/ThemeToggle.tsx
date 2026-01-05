import React, { useState, useEffect, useRef } from 'react';
import { cn } from '../../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Laptop } from 'lucide-react';
import { useTheme } from '../../../contexts';

type ThemeMode = 'light' | 'dark' | 'system';

export const ThemeToggle: React.FC = () => {
    const { themeMode, setThemeMode, resolvedTheme } = useTheme();
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

    // Get icon based on resolved theme
    const getIcon = () => {
        if (resolvedTheme === 'dark') {
            return Moon;
        }
        return Sun;
    };

    const Icon = getIcon();

    return (
        <div className="relative" ref={themeRef}>
            <button
                onClick={() => setShowThemeMenu(!showThemeMenu)}
                className="p-2 rounded-lg hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground"
                title="Toggle theme"
            >
                <Icon className="w-5 h-5" />
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
                                    setThemeMode(item.id as ThemeMode);
                                    setShowThemeMenu(false);
                                }}
                                className={cn(
                                    "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-muted",
                                    themeMode === item.id && "bg-primary/10 text-primary"
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
