import { Injectable, signal, effect } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    private readonly THEME_KEY = 'app-theme-mode';

    // Signal to hold the current mode (true = dark, false = light)
    isDark = signal<boolean>(this.getStoredTheme());

    constructor() {
        effect(() => {
            const dark = this.isDark();
            this.applyTheme(dark);
            localStorage.setItem(this.THEME_KEY, dark ? 'dark' : 'light');
        });
    }

    toggleTheme() {
        this.isDark.update(d => !d);
    }

    private getStoredTheme(): boolean {
        const stored = localStorage.getItem(this.THEME_KEY);
        if (stored) return stored === 'dark';

        // Default to system preference if no stored theme
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
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
