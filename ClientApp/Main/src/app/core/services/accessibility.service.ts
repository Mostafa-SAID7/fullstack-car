import { Injectable, signal, computed } from '@angular/core';

export interface AccessibilitySettings {
  reducedMotion: boolean;
  highContrast: boolean;
  fontSize: 'small' | 'medium' | 'large' | 'extra-large';
  focusVisible: boolean;
  screenReaderOptimized: boolean;
}

/**
 * Accessibility Service
 * 
 * Manages accessibility features and WCAG 2.1 AA compliance
 */
@Injectable({
  providedIn: 'root'
})
export class AccessibilityService {
  // Private signals
  private _settings = signal<AccessibilitySettings>({
    reducedMotion: false,
    highContrast: false,
    fontSize: 'medium',
    focusVisible: true,
    screenReaderOptimized: false
  });

  // Public readonly signals
  readonly settings = this._settings.asReadonly();
  
  // Computed signals
  readonly reducedMotion = computed(() => this._settings().reducedMotion);
  readonly highContrast = computed(() => this._settings().highContrast);
  readonly fontSize = computed(() => this._settings().fontSize);
  readonly focusVisible = computed(() => this._settings().focusVisible);
  readonly screenReaderOptimized = computed(() => this._settings().screenReaderOptimized);

  constructor() {
    this.initializeAccessibility();
    this.setupMediaQueryListeners();
  }

  /**
   * Initialize accessibility settings
   */
  private initializeAccessibility(): void {
    // Load saved settings
    const saved = localStorage.getItem('accessibility-settings');
    if (saved) {
      try {
        const settings = JSON.parse(saved);
        this._settings.set({ ...this._settings(), ...settings });
      } catch (error) {
        console.warn('Failed to parse accessibility settings:', error);
      }
    }

    // Detect system preferences
    this.detectSystemPreferences();
    this.applyAccessibilitySettings();
  }

  /**
   * Detect system accessibility preferences
   */
  private detectSystemPreferences(): void {
    // Detect reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Detect high contrast preference
    const prefersHighContrast = window.matchMedia('(prefers-contrast: high)').matches;

    this._settings.update(current => ({
      ...current,
      reducedMotion: prefersReducedMotion,
      highContrast: prefersHighContrast
    }));
  }

  /**
   * Set up media query listeners for system preferences
   */
  private setupMediaQueryListeners(): void {
    // Listen for reduced motion changes
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    reducedMotionQuery.addEventListener('change', (e) => {
      this.updateSetting('reducedMotion', e.matches);
    });

    // Listen for high contrast changes
    const highContrastQuery = window.matchMedia('(prefers-contrast: high)');
    highContrastQuery.addEventListener('change', (e) => {
      this.updateSetting('highContrast', e.matches);
    });
  }

  /**
   * Apply accessibility settings to DOM
   */
  private applyAccessibilitySettings(): void {
    const settings = this._settings();
    const html = document.documentElement;

    // Apply reduced motion
    if (settings.reducedMotion) {
      html.classList.add('reduce-motion');
    } else {
      html.classList.remove('reduce-motion');
    }

    // Apply high contrast
    if (settings.highContrast) {
      html.classList.add('high-contrast');
    } else {
      html.classList.remove('high-contrast');
    }

    // Apply font size
    html.classList.remove('font-small', 'font-medium', 'font-large', 'font-extra-large');
    html.classList.add(`font-${settings.fontSize}`);

    // Apply focus visible
    if (settings.focusVisible) {
      html.classList.add('focus-visible');
    } else {
      html.classList.remove('focus-visible');
    }

    // Apply screen reader optimization
    if (settings.screenReaderOptimized) {
      html.classList.add('screen-reader-optimized');
    } else {
      html.classList.remove('screen-reader-optimized');
    }
  }

  /**
   * Update a specific accessibility setting
   */
  updateSetting<K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ): void {
    this._settings.update(current => ({
      ...current,
      [key]: value
    }));

    this.applyAccessibilitySettings();
    this.saveSettings();
  }

  /**
   * Update multiple settings at once
   */
  updateSettings(updates: Partial<AccessibilitySettings>): void {
    this._settings.update(current => ({
      ...current,
      ...updates
    }));

    this.applyAccessibilitySettings();
    this.saveSettings();
  }

  /**
   * Reset to default settings
   */
  resetSettings(): void {
    this._settings.set({
      reducedMotion: false,
      highContrast: false,
      fontSize: 'medium',
      focusVisible: true,
      screenReaderOptimized: false
    });

    this.detectSystemPreferences();
    this.applyAccessibilitySettings();
    this.saveSettings();
  }

  /**
   * Save settings to localStorage
   */
  private saveSettings(): void {
    localStorage.setItem('accessibility-settings', JSON.stringify(this._settings()));
  }

  /**
   * Announce message to screen readers
   */
  announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;

    document.body.appendChild(announcement);

    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }

  /**
   * Set focus to element with optional announcement
   */
  setFocus(element: HTMLElement, announce?: string): void {
    element.focus();
    
    if (announce) {
      this.announceToScreenReader(announce);
    }
  }

  /**
   * Get ARIA label for current settings
   */
  getSettingsAriaLabel(): string {
    const settings = this._settings();
    const labels = [];

    if (settings.reducedMotion) labels.push('Reduced motion enabled');
    if (settings.highContrast) labels.push('High contrast enabled');
    labels.push(`Font size: ${settings.fontSize}`);
    if (settings.screenReaderOptimized) labels.push('Screen reader optimized');

    return labels.join(', ');
  }
}