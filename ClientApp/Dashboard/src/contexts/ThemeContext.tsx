import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { ThemeConfig } from '../themes';
import { defaultTheme, availableThemes, getThemeById } from '../themes';

type ThemeMode = 'light' | 'dark' | 'system';

interface LayoutConfig {
  header: {
    showLogo: boolean;
    showSearch: boolean;
    showNotifications: boolean;
    showUserMenu: boolean;
    height: string;
    background: string;
    position: 'fixed' | 'static';
  };
  footer: {
    showCopyright: boolean;
    showSocialLinks: boolean;
    showLinks: boolean;
    height: string;
    background: string;
    position: 'fixed' | 'static';
  };
  sidebar: {
    showHeader: boolean;
    showFooter: boolean;
    collapsible: boolean;
    width: string;
    position: 'left' | 'right';
  };
  main: {
    maxWidth: string;
    padding: string;
    centered: boolean;
  };
}

interface ThemeContextType {
  // Current theme
  currentTheme: ThemeConfig;
  layout: LayoutConfig;

  // Available themes
  availableThemes: ThemeConfig[];

  // Actions
  setTheme: (themeId: string) => void;
  updateLayout: (layout: Partial<LayoutConfig>) => void;
  resetToDefault: () => void;

  // Preview
  previewTheme: (themeId: string) => void;
  isPreviewMode: boolean;
  confirmPreview: () => void;
  cancelPreview: () => void;

  // Persistence
  saveTheme: () => void;
  loadSavedTheme: () => void;

  // Dark mode
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  resolvedTheme: 'light' | 'dark';
}

const defaultLayout: LayoutConfig = {
  header: {
    showLogo: true,
    showSearch: true,
    showNotifications: true,
    showUserMenu: true,
    height: '4rem',
    background: 'rgba(255, 255, 255, 0.8)',
    position: 'fixed'
  },
  footer: {
    showCopyright: true,
    showSocialLinks: false,
    showLinks: true,
    height: '3rem',
    background: 'rgba(255, 255, 255, 0.9)',
    position: 'static'
  },
  sidebar: {
    showHeader: true,
    showFooter: false,
    collapsible: true,
    width: '16rem',
    position: 'left'
  },
  main: {
    maxWidth: '1200px',
    padding: '2rem',
    centered: false
  }
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<ThemeConfig>(defaultTheme);
  const [layout, setLayout] = useState<LayoutConfig>(defaultLayout);
  const [previewTheme, setPreviewTheme] = useState<ThemeConfig | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [themeMode, setThemeModeState] = useState<ThemeMode>(() => {
    // Load from localStorage or default to 'dark'
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme-mode');
      return (saved as ThemeMode) || 'dark';
    }
    return 'dark';
  });

  // Get system preference
  const getSystemTheme = (): 'light' | 'dark' => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'dark'; // Default to dark if system preference cannot be determined
  };

  // Get resolved theme (actual theme to apply)
  const resolvedTheme: 'light' | 'dark' = themeMode === 'system' ? getSystemTheme() : themeMode;

  // Apply dark mode class to document (runs on mount and when resolvedTheme changes)
  useEffect(() => {
    const root = document.documentElement;
    if (resolvedTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [resolvedTheme]);

  // Listen to system theme changes when in system mode
  useEffect(() => {
    if (themeMode !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      const root = document.documentElement;
      if (mediaQuery.matches) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    // Apply initial system theme
    handleChange();

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [themeMode]);

  // Load saved theme on mount
  useEffect(() => {
    loadSavedTheme();
  }, []);

  // Apply theme to CSS variables
  useEffect(() => {
    const themeToApply = previewTheme || currentTheme;
    applyThemeToCSS(themeToApply);
  }, [currentTheme, previewTheme]);

  const applyThemeToCSS = (theme: ThemeConfig) => {
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
    setLayout(defaultLayout);
    setIsPreviewMode(false);
    setPreviewTheme(null);
    localStorage.removeItem('dashboard-theme');
    localStorage.removeItem('dashboard-layout');
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
    try {
      const themeData = {
        themeId: currentTheme.id,
        layout,
        timestamp: Date.now()
      };
      localStorage.setItem('dashboard-theme', JSON.stringify(themeData));
    } catch (error) {
      console.error('Failed to save theme:', error);
    }
  };

  const loadSavedTheme = () => {
    try {
      const saved = localStorage.getItem('dashboard-theme');
      if (saved) {
        const themeData = JSON.parse(saved);
        const theme = getThemeById(themeData.themeId);
        if (theme) {
          setCurrentTheme(theme);
        }
        if (themeData.layout) {
          setLayout({ ...defaultLayout, ...themeData.layout });
        }
      }
    } catch (error) {
      console.error('Failed to load saved theme:', error);
    }
  };

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
    localStorage.setItem('theme-mode', mode);
    
    // Apply immediately
    const root = document.documentElement;
    const newResolvedTheme = mode === 'system' ? getSystemTheme() : mode;
    if (newResolvedTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  };

  // Auto-save theme changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      saveTheme();
    }, 1000); // Debounce saves

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

// Hook to get current resolved theme (handles system preference)
export const useResolvedTheme = () => {
  const { currentTheme } = useTheme();

  // For now, just return the current theme
  // In the future, this could handle system dark/light mode preferences
  return currentTheme;
};