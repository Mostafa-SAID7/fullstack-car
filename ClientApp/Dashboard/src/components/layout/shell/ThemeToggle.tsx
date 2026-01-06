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
                        className="absolute right-0 mt-2 w-36 glassmorphism rounded-xl shadow-lg p-2 z-50"
                    >
                        {themeOptions.map((item) => {
                            // Define static styles for Light/Dark to match body bg
                            // Values taken from index.css logic
                            const isLightBtn = item.id === 'light';
                            const isDarkBtn = item.id === 'dark';

                            // Light mode bg: hsl(220 15% 92%)
                            // Dark mode bg: hsl(222.2 84% 4.9%)

                            let specificClass = "";
                            if (isLightBtn) {
                                specificClass = "bg-[hsl(220,15%,92%)] text-[hsl(220,13%,9%)] hover:bg-[hsl(220,15%,88%)] border border-gray-200";
                            } else if (isDarkBtn) {
                                specificClass = "bg-[hsl(222.2,84%,4.9%)] text-[hsl(210,40%,98%)] hover:bg-[hsl(222.2,84%,10%)] border border-gray-800";
                            }

                            return (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        setThemeMode(item.id as ThemeMode);
                                        setShowThemeMenu(false);
                                    }}
                                    className={cn(
                                        "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all mb-1 last:mb-0",
                                        // If specific class exists (Light/Dark), use it. 
                                        // Otherwise (System), fallback to default hover logic.
                                        specificClass || "hover:bg-muted text-foreground",
                                        // Active state styling: strong ring/border
                                        themeMode === item.id && "ring-2 ring-primary ring-offset-1 ring-offset-card"
                                    )}
                                >
                                    <item.icon className="w-4 h-4" />
                                    {item.label}
                                </button>
                            );
                        })}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
