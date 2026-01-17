import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccessibilityService, AccessibilitySettings } from '../../../../core/services/accessibility.service';

/**
 * Accessibility Panel Component
 * 
 * Provides UI for managing accessibility settings
 */
@Component({
  selector: 'app-accessibility-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './accessibility-panel.component.html',
  styleUrls: ['./accessibility-panel.component.scss']
})
export class AccessibilityPanelComponent {
  accessibilityService = inject(AccessibilityService);

  fontSizes = [
    { value: 'small' as const, label: 'Small' },
    { value: 'medium' as const, label: 'Medium' },
    { value: 'large' as const, label: 'Large' },
    { value: 'extra-large' as const, label: 'Extra Large' }
  ];

  onCheckboxChange(key: keyof AccessibilitySettings, event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target) {
      this.updateSetting(key, target.checked);
    }
  }

  updateSetting<K extends keyof AccessibilitySettings>(key: K, value: AccessibilitySettings[K]): void {
    this.accessibilityService.updateSetting(key, value);

    // Announce change to screen readers
    const settingName = (key as string).replace(/([A-Z])/g, ' $1').toLowerCase();
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