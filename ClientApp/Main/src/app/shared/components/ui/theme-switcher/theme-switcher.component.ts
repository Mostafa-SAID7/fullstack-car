import { Component, inject, input } from '@angular/core';
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
  template: `
    @switch (variant()) {
      @case ('button') {
        <button
          (click)="toggleTheme()"
          class="inline-flex items-center justify-center w-10 h-10 rounded-full text-gray-600 dark:text-gray-400 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 cursor-pointer active:scale-90 group"
          [title]="getTooltipText()">
          <i [class]="'fa-solid text-xl transition-all duration-500 group-hover:rotate-12 ' + themeService.getThemeIcon()"
             class="text-primary"></i>
        </button>
      }
      
      @case ('dropdown') {
        <div class="relative">
          <button
            (click)="toggleDropdown()"
            class="inline-flex items-center justify-center w-10 h-10 rounded-full text-gray-600 dark:text-gray-400 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 cursor-pointer active:scale-90 group"
            [title]="getTooltipText()">
            <i [class]="'fa-solid text-xl transition-all duration-500 group-hover:rotate-12 ' + themeService.getThemeIcon()"
               class="text-primary"></i>
          </button>
          
          @if (isDropdownOpen()) {
            <div class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
              <div class="py-1">
                @for (mode of themeModes; track mode) {
                  <button
                    (click)="selectTheme(mode)"
                    class="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    [class.bg-primary]="themeService.themeMode() === mode"
                    [class.text-white]="themeService.themeMode() === mode">
                    <i [class]="'fa-solid ' + themeService.getThemeModeIcon(mode) + ' w-4 h-4 mr-3'"></i>
                    {{ themeService.getThemeModeDisplayName(mode) }}
                    @if (themeService.themeMode() === mode) {
                      <i class="fa-solid fa-check ml-auto"></i>
                    }
                  </button>
                }
              </div>
            </div>
          }
        </div>
      }
      
      @case ('radio') {
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Theme</label>
          <div class="space-y-2">
            @for (mode of themeModes; track mode) {
              <label class="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  [value]="mode"
                  [checked]="themeService.themeMode() === mode"
                  (change)="selectTheme(mode)"
                  class="w-4 h-4 text-primary border-gray-300 focus:ring-primary dark:border-gray-600 dark:bg-gray-700" />
                <div class="flex items-center space-x-2">
                  <i [class]="'fa-solid ' + themeService.getThemeModeIcon(mode) + ' w-4 h-4'"></i>
                  <span class="text-sm text-gray-700 dark:text-gray-300">
                    {{ themeService.getThemeModeDisplayName(mode) }}
                  </span>
                </div>
              </label>
            }
          </div>
        </div>
      }
      
      @default {
        <button
          (click)="toggleTheme()"
          class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 transition-colors">
          <i [class]="'fa-solid ' + themeService.getThemeIcon() + ' w-4 h-4 mr-2'"></i>
          {{ themeService.getCurrentThemeDisplayName() }}
        </button>
      }
    }
  `
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