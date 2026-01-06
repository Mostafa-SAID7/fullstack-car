import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ThemeConfig } from '../../pages/content/themes';
import { defaultTheme, availableThemes, getThemeById } from '../../pages/content/themes';
import type { ThemeContextType, ThemeProviderProps, ThemeMode, LayoutConfig } from './types';
import { DEFAULT_LAYOUT, THEME_STORAGE_KEYS, THEME_UPDATE_DEBOUNCE } from './constants';
import {
  getSystemTheme,
  applyThemeToCSS,
  applyDarkModeClass,
  saveThemeToStorage,
  loadThemeFromStorage,
  setupSystemThemeListener
} from './utils';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<ThemeConfig>(defaultTheme);
  const [layout, setLayout] = useState<LayoutConfig>(DEFAULT_LAYOUT);
  const [previewTheme, setPreviewTheme] = useState<ThemeConfig | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [themeMode, setThemeModeState] = useState<ThemeMode>(() => {
    // Load from localStorage or default to 'dark'
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(THEME_STORAGE_KEYS.THEME_MODE);
      return (saved as ThemeMode) || 'dark';
    }
    return 'dark';
  });

  // Get resolved theme (actual theme to apply)
  const resolvedTheme: 'light' | 'dark' = themeMode === 'system' ? getSystemTheme() : themeMode;

  // Apply dark mode class to document (runs on mount and when resolvedTheme changes)
  useEffect(() => {
    applyDarkModeClass(resolvedTheme);
  }, [resolvedTheme]);

  // Listen to system theme changes when in system mode
  useEffect(() => {
    return setupSystemThemeListener(themeMode, (newTheme) => {
      applyDarkModeClass(newTheme);
    });
  }, [themeMode]);

  const loadSavedTheme = () => {
    const savedTheme = loadThemeFromStorage();
    if (savedTheme) {
      const theme = getThemeById(savedTheme.themeId!);
      if (theme) {
        setCurrentTheme(theme);
      }
      if (savedTheme.layout) {
        setLayout({ ...DEFAULT_LAYOUT, ...savedTheme.layout });
      }
    }
  };

  // Load saved theme on mount
  useEffect(() => {
    loadSavedTheme();
  }, [loadSavedTheme]);

  // Apply theme to CSS variables
  useEffect(() => {
    const themeToApply = previewTheme || currentTheme;
    applyThemeToCSS(themeToApply);
  }, [currentTheme, previewTheme]);


  const setTheme = (themeId: string) => {
    const theme = getThemeById(themeId);
    if (theme) {
      setCurrentTheme(theme);
      setIsPreviewMode(false);
      setPreviewTheme(null);
    }
  };

  const updateLayout = (newLayout: Partial<LayoutConfig>) => {
    setLayout(prev => ({ ...prev, ...newLayout }));
  };

  const resetToDefault = () => {
    setCurrentTheme(defaultTheme);
    setLayout(DEFAULT_LAYOUT);
    setIsPreviewMode(false);
    setPreviewTheme(null);
    localStorage.removeItem(THEME_STORAGE_KEYS.DASHBOARD_THEME);
    localStorage.removeItem(THEME_STORAGE_KEYS.DASHBOARD_LAYOUT);
  };

  const previewThemeById = (themeId: string) => {
    const theme = getThemeById(themeId);
    if (theme) {
      setPreviewTheme(theme);
      setIsPreviewMode(true);
    }
  };

  const confirmPreview = () => {
    if (previewTheme) {
      setCurrentTheme(previewTheme);
    }
    setIsPreviewMode(false);
    setPreviewTheme(null);
  };

  const cancelPreview = () => {
    setPreviewTheme(null);
    setIsPreviewMode(false);
  };

  const saveTheme = () => {
    saveThemeToStorage(currentTheme.id, layout);
  };

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
    localStorage.setItem(THEME_STORAGE_KEYS.THEME_MODE, mode);

    // Apply immediately
    const newResolvedTheme = mode === 'system' ? getSystemTheme() : mode;
    applyDarkModeClass(newResolvedTheme);
  };

  // Auto-save theme changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      saveTheme();
    }, THEME_UPDATE_DEBOUNCE);

    return () => clearTimeout(timeoutId);
  }, [currentTheme, layout]);

  const value: ThemeContextType = {
    currentTheme: previewTheme || currentTheme,
    layout,
    availableThemes,
    setTheme,
    updateLayout,
    resetToDefault,
    previewTheme: previewThemeById,
    isPreviewMode,
    confirmPreview,
    cancelPreview,
    saveTheme,
    loadSavedTheme,
    themeMode,
    setThemeMode,
    resolvedTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
