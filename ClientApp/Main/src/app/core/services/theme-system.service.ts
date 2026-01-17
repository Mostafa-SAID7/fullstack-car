import { Injectable, signal, computed, effect } from '@angular/core';

export type ThemeMode = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

/**
 * Comprehensive Theme System Service
 * 
 * Modern Angular 19 theme service using:
 * - Angular Signals for reactive state
 * - Effects for DOM manipulation
 * - System preference detection
 * - Smooth theme transitions
 */
@Injectable({
  providedIn: 'root'
})
export class ThemeSystemService {
  // Private signals
  private _themeMode = signal<ThemeMode>('system');
  private _systemPreference = signal<ResolvedTheme>('light');
  
  // Public readonly signals
  readonly themeMode = this._themeMode.asReadonly();
  readonly systemPreference = this._systemPreference.asReadonly();
  
  // Computed signals
  readonly resolvedTheme = computed<ResolvedTheme>(() => {
    const mode = this._themeMode();
    if (mode === 'system') {
      return this._systemPreference();
    }
    return mode as ResolvedTheme;
  });
  
  readonly isDark = computed(() => this.resolvedTheme() === 'dark');
  readonly isLight = computed(() => this.resolvedTheme() === 'light');

  constructor() {
    this.initializeTheme();
    this.setupSystemPreferenceListener();
    this.setupThemeEffects();
  }

  /**
   * Initialize theme from localStorage or system preference
   */
  private initializeTheme(): void {
    const savedTheme = localStorage.getItem('theme-mode') as ThemeMode;
    if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
      this._themeMode.set(savedTheme);
    }
    
    this.updateSystemPreference();
  }

  /**
   * Set up system preference listener
   */
  private setupSystemPreferenceListener(): void {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Initial value
    this.updateSystemPreference();
    
    // Listen for changes
    mediaQuery.addEventListener('change', () => {
      this.updateSystemPreference();
    });
  }

  /**
   * Update system preference signal
   */
  private updateSystemPreference(): void {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    this._systemPreference.set(prefersDark ? 'dark' : 'light');
  }

  /**
   * Set up theme effects for DOM manipulation
   */
  private setupThemeEffects(): void {
    // Effect to update DOM classes
    effect(() => {
      const theme = this.resolvedTheme();
      const html = document.documentElement;
      
      // Add transition class for smooth theme switching
      html.classList.add('theme-transition');
      
      if (theme === 'dark') {
        html.classList.add('dark');
        html.classList.remove('light');
      } else {
        html.classList.add('light');
        html.classList.remove('dark');
      }
      
      // Remove transition class after animation
      setTimeout(() => {
        html.classList.remove('theme-transition');
      }, 300);
    });

    // Effect to persist theme mode
    effect(() => {
      const mode = this._themeMode();
      localStorage.setItem('theme-mode', mode);
    });

    // Effect to update meta theme-color
    effect(() => {
      const theme = this.resolvedTheme();
      const metaThemeColor = document.querySelector('meta[name="theme-color"]');
      
      if (metaThemeColor) {
        const color = theme === 'dark' ? '#1f2937' : '#ffffff';
        metaThemeColor.setAttribute('content', color);
      }
    });
  }

  /**
   * Set theme mode
   */
  setThemeMode(mode: ThemeMode): void {
    this._themeMode.set(mode);
  }

  /**
   * Toggle between light and dark themes
   */
  toggleTheme(): void {
    const current = this.resolvedTheme();
    this.setThemeMode(current === 'light' ? 'dark' : 'light');
  }

  /**
   * Get theme mode display name
   */
  getThemeModeDisplayName(mode: ThemeMode): string {
    switch (mode) {
      case 'light':
        return 'Light';
      case 'dark':
        return 'Dark';
      case 'system':
        return 'System';
      default:
        return 'Unknown';
    }
  }

  /**
   * Get current theme display name
   */
  getCurrentThemeDisplayName(): string {
    const mode = this._themeMode();
    if (mode === 'system') {
      return `System (${this.resolvedTheme()})`;
    }
    return this.getThemeModeDisplayName(mode);
  }

  /**
   * Get theme icon
   */
  getThemeIcon(theme?: ResolvedTheme): string {
    const targetTheme = theme || this.resolvedTheme();
    return targetTheme === 'dark' ? 'fa-moon' : 'fa-sun';
  }

  /**
   * Get theme mode icon
   */
  getThemeModeIcon(mode: ThemeMode): string {
    switch (mode) {
      case 'light':
        return 'fa-sun';
      case 'dark':
        return 'fa-moon';
      case 'system':
        return 'fa-desktop';
      default:
        return 'fa-palette';
    }
  }
}