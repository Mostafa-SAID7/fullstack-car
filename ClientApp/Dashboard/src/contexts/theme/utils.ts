// Theme Context Utilities

import type { ThemeConfig } from '../../pages/themes';
import type { ThemeMode } from './types';

export const getSystemTheme = (): 'light' | 'dark' => {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'dark'; // Default to dark if system preference cannot be determined
};

export const applyThemeToCSS = (theme: ThemeConfig): void => {
  const root = document.documentElement;

  // Apply color variables
  Object.entries(theme.colors).forEach(([key, value]) => {
    root.style.setProperty(`--${key}`, value);
  });

  // Apply layout styles
  Object.entries(theme.layout).forEach(([section, styles]) => {
    Object.entries(styles).forEach(([property, value]) => {
      root.style.setProperty(`--layout-${section}-${property}`, value);
    });
  });

  // Apply typography
  Object.entries(theme.typography).forEach(([category, styles]) => {
    if (typeof styles === 'object') {
      Object.entries(styles).forEach(([property, value]) => {
        if (typeof value === 'object') {
          Object.entries(value).forEach(([subProperty, subValue]) => {
            root.style.setProperty(`--${category}-${property}-${subProperty}`, subValue as string);
          });
        } else {
          root.style.setProperty(`--${category}-${property}`, value);
        }
      });
    } else {
      root.style.setProperty(`--${category}`, styles);
    }
  });

  // Apply effects
  Object.entries(theme.effects).forEach(([category, styles]) => {
    Object.entries(styles).forEach(([property, value]) => {
      root.style.setProperty(`--${category}-${property}`, value);
    });
  });
};

export const applyDarkModeClass = (resolvedTheme: 'light' | 'dark'): void => {
  const root = document.documentElement;
  if (resolvedTheme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
};

export const saveThemeToStorage = (themeId: string, layout: any): void => {
  try {
    const themeData = {
      themeId,
      layout,
      timestamp: Date.now()
    };
    localStorage.setItem('dashboard-theme', JSON.stringify(themeData));
  } catch (error) {
    console.error('Failed to save theme:', error);
  }
};

export const loadThemeFromStorage = (): { themeId?: string; layout?: any } | null => {
  try {
    const saved = localStorage.getItem('dashboard-theme');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('Failed to load saved theme:', error);
  }
  return null;
};

export const setupSystemThemeListener = (
  themeMode: ThemeMode,
  onThemeChange: (theme: 'light' | 'dark') => void
): (() => void) => {
  if (themeMode !== 'system') return () => {};

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const handleChange = () => {
    const newTheme = mediaQuery.matches ? 'dark' : 'light';
    applyDarkModeClass(newTheme);
    onThemeChange(newTheme);
  };

  // Apply initial system theme
  handleChange();

  mediaQuery.addEventListener('change', handleChange);
  return () => mediaQuery.removeEventListener('change', handleChange);
};

export const validateThemeConfig = (theme: ThemeConfig): boolean => {
  // Basic validation for required theme properties
  return !!(
    theme &&
    theme.colors &&
    theme.layout &&
    theme.typography &&
    theme.effects &&
    typeof theme.id === 'string' &&
    typeof theme.name === 'string'
  );
};

export const createThemePreview = (originalTheme: ThemeConfig, modifications: Partial<ThemeConfig>): ThemeConfig => {
  return {
    ...originalTheme,
    ...modifications,
    colors: { ...originalTheme.colors, ...modifications.colors },
    layout: { ...originalTheme.layout, ...modifications.layout },
    typography: { ...originalTheme.typography, ...modifications.typography },
    effects: { ...originalTheme.effects, ...modifications.effects }
  };
};

