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
        // Default to light if nothing stored, or check system preference? 
        // For now, default to false (light).
        return stored === 'dark';
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
