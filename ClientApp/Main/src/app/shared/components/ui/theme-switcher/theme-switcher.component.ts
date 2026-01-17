import { Component, inject, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeSystemService, ThemeMode } from '../../../../core/services/theme-system.service';

/**
 * Theme Switcher Component
 * 
 * Provides UI for switching between light, dark, and system themes
 */
@Component({
  selector: 'app-theme-switcher',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './theme-switcher.component.html',
  styleUrls: ['./theme-switcher.component.scss']
})
export class ThemeSwitcherComponent {
  themeService = inject(ThemeSystemService);
  
  // Input signals
  variant = input<'button' | 'dropdown' | 'radio' | 'default'>('button');
  
  // Local state
  isDropdownOpen = signal(false);
  
  // Theme modes
  themeModes: ThemeMode[] = ['light', 'dark', 'system'];

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  selectTheme(mode: ThemeMode): void {
    this.themeService.setThemeMode(mode);
    this.isDropdownOpen.set(false);
  }

  toggleDropdown(): void {
    this.isDropdownOpen.update(open => !open);
  }

  getTooltipText(): string {
    return `Current theme: ${this.themeService.getCurrentThemeDisplayName()}`;
  }
}