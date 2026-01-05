// Theme Context Types

import type { ThemeConfig } from '../../pages/themes';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface LayoutConfig {
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

export interface ThemeContextType {
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

export interface ThemeProviderProps {
  children: React.ReactNode;
}

export type { ThemeConfig };

