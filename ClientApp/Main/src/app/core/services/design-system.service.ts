import { Injectable, signal, computed } from '@angular/core';

/**
 * Design System Configuration
 */
export interface DesignTokens {
  colors: ColorTokens;
  spacing: SpacingTokens;
  typography: TypographyTokens;
  shadows: ShadowTokens;
  borderRadius: BorderRadiusTokens;
  breakpoints: BreakpointTokens;
}

export interface ColorTokens {
  primary: string;
  secondary: string;
  accent: string;
  success: string;
  warning: string;
  error: string;
  info: string;
  background: string;
  foreground: string;
  muted: string;
  border: string;
}

export interface SpacingTokens {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
}

export interface TypographyTokens {
  fontFamily: {
    sans: string;
    serif: string;
    mono: string;
  };
  fontSize: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
  };
  fontWeight: {
    normal: number;
    medium: number;
    semibold: number;
    bold: number;
  };
}

export interface ShadowTokens {
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
}

export interface BorderRadiusTokens {
  sm: string;
  md: string;
  lg: string;
  xl: string;
  full: string;
}

export interface BreakpointTokens {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  '2xl': number;
}

/**
 * Design System Service
 * 
 * Provides centralized access to design tokens and utilities
 * Uses Angular Signals for reactive design system updates
 */
@Injectable({
  providedIn: 'root'
})
export class DesignSystemService {
  // Design tokens signal
  private _tokens = signal<DesignTokens>({
    colors: {
      primary: '#fb2c36',
      secondary: '#3b82f6',
      accent: '#8b5cf6',
      success: '#22c55e',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6',
      background: '#ffffff',
      foreground: '#1f2937',
      muted: '#6b7280',
      border: '#e5e7eb'
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
      '2xl': '3rem',
      '3xl': '4rem'
    },
    typography: {
      fontFamily: {
        sans: 'Inter, system-ui, sans-serif',
        serif: 'Georgia, serif',
        mono: 'JetBrains Mono, Fira Code, monospace'
      },
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem'
      },
      fontWeight: {
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700
      }
    },
    shadows: {
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
      xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
      '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)'
    },
    borderRadius: {
      sm: '0.25rem',
      md: '0.375rem',
      lg: '0.5rem',
      xl: '0.75rem',
      full: '9999px'
    },
    breakpoints: {
      xs: 475,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      '2xl': 1536
    }
  });

  // Public readonly tokens
  readonly tokens = this._tokens.asReadonly();

  // Computed values
  readonly primaryColor = computed(() => this._tokens().colors.primary);
  readonly secondaryColor = computed(() => this._tokens().colors.secondary);
  readonly backgroundColor = computed(() => this._tokens().colors.background);
  readonly foregroundColor = computed(() => this._tokens().colors.foreground);

  // Current viewport size signal
  private _viewportWidth = signal(typeof window !== 'undefined' ? window.innerWidth : 1024);
  readonly viewportWidth = this._viewportWidth.asReadonly();

  // Current breakpoint computed signal
  readonly currentBreakpoint = computed(() => {
    const width = this._viewportWidth();
    const breakpoints = this._tokens().breakpoints;

    if (width < breakpoints.sm) return 'xs';
    if (width < breakpoints.md) return 'sm';
    if (width < breakpoints.lg) return 'md';
    if (width < breakpoints.xl) return 'lg';
    if (width < breakpoints['2xl']) return 'xl';
    return '2xl';
  });

  // Responsive helpers
  readonly isMobile = computed(() => {
    const bp = this.currentBreakpoint();
    return bp === 'xs' || bp === 'sm';
  });

  readonly isTablet = computed(() => this.currentBreakpoint() === 'md');
  readonly isDesktop = computed(() => {
    const bp = this.currentBreakpoint();
    return bp === 'lg' || bp === 'xl' || bp === '2xl';
  });

  constructor() {
    if (typeof window !== 'undefined') {
      // Listen for viewport changes
      window.addEventListener('resize', () => {
        this._viewportWidth.set(window.innerWidth);
      });
    }
  }

  /**
   * Get color by name
   */
  getColor(name: keyof ColorTokens): string {
    return this._tokens().colors[name];
  }

  /**
   * Get spacing by size
   */
  getSpacing(size: keyof SpacingTokens): string {
    return this._tokens().spacing[size];
  }

  /**
   * Get shadow by size
   */
  getShadow(size: keyof ShadowTokens): string {
    return this._tokens().shadows[size];
  }

  /**
   * Get border radius by size
   */
  getBorderRadius(size: keyof BorderRadiusTokens): string {
    return this._tokens().borderRadius[size];
  }

  /**
   * Check if viewport matches breakpoint
   */
  matchesBreakpoint(breakpoint: keyof BreakpointTokens): boolean {
    return this._viewportWidth() >= this._tokens().breakpoints[breakpoint];
  }

  /**
   * Update design tokens (for theming)
   */
  updateTokens(updates: Partial<DesignTokens>): void {
    this._tokens.update(current => ({
      ...current,
      ...updates,
      colors: { ...current.colors, ...(updates.colors || {}) },
      spacing: { ...current.spacing, ...(updates.spacing || {}) },
      typography: { ...current.typography, ...(updates.typography || {}) },
      shadows: { ...current.shadows, ...(updates.shadows || {}) },
      borderRadius: { ...current.borderRadius, ...(updates.borderRadius || {}) },
      breakpoints: { ...current.breakpoints, ...(updates.breakpoints || {}) }
    }));
  }

  /**
   * Apply CSS custom properties to document
   */
  applyCSSVariables(): void {
    if (typeof document === 'undefined') return;

    const tokens = this._tokens();
    const root = document.documentElement;

    // Apply color variables
    Object.entries(tokens.colors).forEach(([key, value]) => {
      root.style.setProperty(`--ds-color-${key}`, value);
    });

    // Apply spacing variables
    Object.entries(tokens.spacing).forEach(([key, value]) => {
      root.style.setProperty(`--ds-spacing-${key}`, value);
    });

    // Apply typography variables
    root.style.setProperty('--ds-font-sans', tokens.typography.fontFamily.sans);
    root.style.setProperty('--ds-font-serif', tokens.typography.fontFamily.serif);
    root.style.setProperty('--ds-font-mono', tokens.typography.fontFamily.mono);

    Object.entries(tokens.typography.fontSize).forEach(([key, value]) => {
      root.style.setProperty(`--ds-text-${key}`, value);
    });

    // Apply shadow variables
    Object.entries(tokens.shadows).forEach(([key, value]) => {
      root.style.setProperty(`--ds-shadow-${key}`, value);
    });

    // Apply border radius variables
    Object.entries(tokens.borderRadius).forEach(([key, value]) => {
      root.style.setProperty(`--ds-radius-${key}`, value);
    });
  }
}
