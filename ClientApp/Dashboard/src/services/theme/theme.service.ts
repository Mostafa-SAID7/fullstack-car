// Theme Service
import { THEME_STORAGE_KEYS } from '../../contexts/theme/constants';

export interface ThemePreference {
    mode: 'light' | 'dark' | 'system';
    primaryColor: string;
    borderRadius: string;
}

export interface ThemeStats {
    activeTheme: string;
    lastChanged: string;
    themesCount: number;
}

export const themeService = {
    getThemePreference: (): ThemePreference => {
        const saved = localStorage.getItem(THEME_STORAGE_KEYS.THEME_MODE);
        return {
            mode: (saved as any) || 'system',
            primaryColor: '#3b82f6',
            borderRadius: '0.75rem'
        };
    },
    setThemePreference: (pref: ThemePreference) => {
        localStorage.setItem(THEME_STORAGE_KEYS.THEME_MODE, pref.mode);
        // Apply theme logic would go here
    },
    getThemeStats: (): ThemeStats => {
        return {
            activeTheme: localStorage.getItem(THEME_STORAGE_KEYS.DASHBOARD_THEME) || 'modern',
            lastChanged: new Date().toISOString(),
            themesCount: 6
        };
    }
};
