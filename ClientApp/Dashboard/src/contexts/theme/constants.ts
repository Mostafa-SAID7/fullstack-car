// Theme Context Constants

import type { LayoutConfig } from './types';

export const DEFAULT_LAYOUT: LayoutConfig = {
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

export const THEME_STORAGE_KEYS = {
  THEME_MODE: 'theme-mode',
  DASHBOARD_THEME: 'dashboard-theme',
  DASHBOARD_LAYOUT: 'dashboard-layout'
} as const;

export const THEME_UPDATE_DEBOUNCE = 1000; // 1 second

export const THEME_TRANSITIONS = {
  MODE_CHANGE: 300, // ms
  THEME_SWITCH: 200, // ms
  LAYOUT_CHANGE: 150 // ms
} as const;

