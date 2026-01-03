import React, { useState, useEffect, useRef } from 'react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Laptop } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export const ThemeToggle: React.FC = () => {
    const { theme, setTheme, resolvedTheme } = useTheme();
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
                className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground"
                title="Toggle theme"
            >
                {resolvedTheme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
            <AnimatePresence>
                {showThemeMenu && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-36 bg-card border border-border rounded-2xl shadow-2xl p-2 z-50"
                    >
                        {themeOptions.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => { 
                                    setTheme(item.id as any); 
                                    setShowThemeMenu(false); 
                                }}
                                className={cn(
                                    "w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-colors hover:bg-muted",
                                    theme === item.id && "bg-primary/10 text-primary"
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