import { Injectable, signal, effect, computed } from '@angular/core';
import { ThemeMode } from '../types/theme.types';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    private readonly THEME_KEY = 'app-theme-mode';
    private systemThemeSignal = signal<'light' | 'dark'>(this.getSystemTheme());

    // Signal to hold the current mode
    themeMode = signal<ThemeMode>(this.getStoredTheme());

    // Computed signal for the resolved theme (actual theme to apply)
    resolvedTheme = computed<'light' | 'dark'>(() => {
        const mode = this.themeMode();
        if (mode === 'system') {
            return this.systemThemeSignal();
        }
        return mode;
    });

    constructor() {
        // Initialize system theme listener
        this.initSystemThemeListener();

        // Apply theme when resolved theme changes
        effect(() => {
            const theme = this.resolvedTheme();
            this.applyTheme(theme === 'dark');
            localStorage.setItem(this.THEME_KEY, this.themeMode());
        });
    }

    private initSystemThemeListener() {
        if (typeof window !== 'undefined' && window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            
            // Update system theme signal when system preference changes
            const handleChange = (e: MediaQueryListEvent) => {
                this.systemThemeSignal.set(e.matches ? 'dark' : 'light');
            };

            // Listen for changes
            if (mediaQuery.addEventListener) {
                mediaQuery.addEventListener('change', handleChange);
            } else {
                // Fallback for older browsers (using deprecated addListener)
                (mediaQuery as any).addListener((e: MediaQueryList) => {
                    this.systemThemeSignal.set(e.matches ? 'dark' : 'light');
                });
            }
        }
    }

    setThemeMode(mode: ThemeMode) {
        this.themeMode.set(mode);
    }

    isDark(): boolean {
        return this.resolvedTheme() === 'dark';
    }

    getThemeMode(): ThemeMode {
        return this.themeMode();
    }

    private getStoredTheme(): ThemeMode {
        if (typeof window === 'undefined') return 'system';
        
        const stored = localStorage.getItem(this.THEME_KEY);
        if (stored === 'light' || stored === 'dark' || stored === 'system') {
            return stored;
        }

        // Default to system preference
        return 'system';
    }

    private getSystemTheme(): 'light' | 'dark' {
        if (typeof window !== 'undefined' && window.matchMedia) {
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        return 'dark'; // Default to dark if system preference cannot be determined
    }

    private applyTheme(isDark: boolean) {
        const html = document.documentElement;
        if (isDark) {
            html.classList.add('dark');
        } else {
            html.classList.remove('dark');
        }
    }
}
