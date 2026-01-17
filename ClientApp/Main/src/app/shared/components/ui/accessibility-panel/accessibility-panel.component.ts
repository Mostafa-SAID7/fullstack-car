import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccessibilityService } from '../../../../core/services/accessibility.service';

/**
 * Accessibility Panel Component
 * 
 * Provides UI for managing accessibility settings
 */
@Component({
  selector: 'app-accessibility-panel',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
          Accessibility Settings
        </h2>
        <button
          (click)="resetSettings()"
          class="text-sm text-primary hover:text-primary-dark transition-colors"
          aria-label="Reset accessibility settings to default">
          Reset
        </button>
      </div>

      <div class="space-y-6">
        <!-- Reduced Motion -->
        <div class="flex items-center justify-between">
          <div>
            <label for="reduced-motion" class="text-sm font-medium text-gray-700 dark:text-gray-300">
              Reduced Motion
            </label>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Minimize animations and transitions
            </p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input
              id="reduced-motion"
              type="checkbox"
              [checked]="accessibilityService.reducedMotion()"
              (change)="updateSetting('reducedMotion', ($event.target as HTMLInputElement).checked)"
              class="sr-only peer"
              aria-describedby="reduced-motion-description">
            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 dark:peer-focus:ring-primary/50 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
          </label>
        </div>

        <!-- High Contrast -->
        <div class="flex items-center justify-between">
          <div>
            <label for="high-contrast" class="text-sm font-medium text-gray-700 dark:text-gray-300">
              High Contrast
            </label>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Increase color contrast for better visibility
            </p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input
              id="high-contrast"
              type="checkbox"
              [checked]="accessibilityService.highContrast()"
              (change)="updateSetting('highContrast', ($event.target as HTMLInputElement).checked)"
              class="sr-only peer">
            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 dark:peer-focus:ring-primary/50 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
          </label>
        </div>

        <!-- Font Size -->
        <div>
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-3">
            Font Size
          </label>
          <div class="space-y-2">
            @for (size of fontSizes; track size.value) {
              <label class="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  [value]="size.value"
                  [checked]="accessibilityService.fontSize() === size.value"
                  (change)="updateSetting('fontSize', size.value)"
                  class="w-4 h-4 text-primary border-gray-300 focus:ring-primary dark:border-gray-600 dark:bg-gray-700"
                  [attr.aria-describedby]="'font-size-' + size.value + '-description'">
                <span class="text-sm text-gray-700 dark:text-gray-300">
                  {{ size.label }}
                </span>
              </label>
            }
          </div>
        </div>

        <!-- Focus Visible -->
        <div class="flex items-center justify-between">
          <div>
            <label for="focus-visible" class="text-sm font-medium text-gray-700 dark:text-gray-300">
              Enhanced Focus Indicators
            </label>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Show clear focus outlines for keyboard navigation
            </p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input
              id="focus-visible"
              type="checkbox"
              [checked]="accessibilityService.focusVisible()"
              (change)="updateSetting('focusVisible', ($event.target as HTMLInputElement).checked)"
              class="sr-only peer">
            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 dark:peer-focus:ring-primary/50 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
          </label>
        </div>

        <!-- Screen Reader Optimized -->
        <div class="flex items-center justify-between">
          <div>
            <label for="screen-reader" class="text-sm font-medium text-gray-700 dark:text-gray-300">
              Screen Reader Optimization
            </label>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Optimize layout and spacing for screen readers
            </p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input
              id="screen-reader"
              type="checkbox"
              [checked]="accessibilityService.screenReaderOptimized()"
              (change)="updateSetting('screenReaderOptimized', ($event.target as HTMLInputElement).checked)"
              class="sr-only peer">
            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 dark:peer-focus:ring-primary/50 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
          </label>
        </div>
      </div>

      <!-- Current Settings Summary -->
      <div class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Current Settings
        </h3>
        <p class="text-xs text-gray-500 dark:text-gray-400" [attr.aria-label]="accessibilityService.getSettingsAriaLabel()">
          {{ getSettingsSummary() }}
        </p>
      </div>
    </div>
  `
})
export class AccessibilityPanelComponent {
  accessibilityService = inject(AccessibilityService);

  fontSizes = [
    { value: 'small' as const, label: 'Small' },
    { value: 'medium' as const, label: 'Medium' },
    { value: 'large' as const, label: 'Large' },
    { value: 'extra-large' as const, label: 'Extra Large' }
  ];

  updateSetting(key: keyof any, value: any): void {
    this.accessibilityService.updateSetting(key, value);
    
    // Announce change to screen readers
    const settingName = key.replace(/([A-Z])/g, ' $1').toLowerCase();
    const announcement = `${settingName} ${value ? 'enabled' : 'disabled'}`;
    this.accessibilityService.announceToScreenReader(announcement);
  }

  resetSettings(): void {
    this.accessibilityService.resetSettings();
    this.accessibilityService.announceToScreenReader('Accessibility settings reset to default');
  }

  getSettingsSummary(): string {
    const settings = this.accessibilityService.settings();
    const active = [];

    if (settings.reducedMotion) active.push('Reduced Motion');
    if (settings.highContrast) active.push('High Contrast');
    active.push(`Font Size: ${settings.fontSize}`);
    if (settings.focusVisible) active.push('Enhanced Focus');
    if (settings.screenReaderOptimized) active.push('Screen Reader Optimized');

    return active.length > 0 ? active.join(', ') : 'Default settings';
  }
}