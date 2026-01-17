import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icon/icon.component';
import { IconService } from '@core/services/icon.service';

/**
 * Icon Demo Component
 * Showcases the icon system with all registered icons
 */
@Component({
  selector: 'app-icon-demo',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div class="p-6 max-w-7xl mx-auto">
      <h1 class="text-3xl font-bold mb-6">HugeIcons Integration Demo</h1>
      
      <!-- Variant Selector -->
      <div class="mb-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <h2 class="text-xl font-semibold mb-4">Icon Variants</h2>
        <div class="flex gap-4">
          <button 
            (click)="selectedVariant.set('outline')"
            [class.bg-primary]="selectedVariant() === 'outline'"
            [class.text-white]="selectedVariant() === 'outline'"
            class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700">
            Outline
          </button>
          <button 
            (click)="selectedVariant.set('filled')"
            [class.bg-primary]="selectedVariant() === 'filled'"
            [class.text-white]="selectedVariant() === 'filled'"
            class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700">
            Filled
          </button>
          <button 
            (click)="selectedVariant.set('duotone')"
            [class.bg-primary]="selectedVariant() === 'duotone'"
            [class.text-white]="selectedVariant() === 'duotone'"
            class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700">
            Duotone
          </button>
        </div>
      </div>

      <!-- Size Examples -->
      <div class="mb-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <h2 class="text-xl font-semibold mb-4">Icon Sizes</h2>
        <div class="flex items-center gap-6">
          <div class="flex flex-col items-center gap-2">
            <app-icon name="home" [size]="16" [variant]="selectedVariant()" />
            <span class="text-xs">16px</span>
          </div>
          <div class="flex flex-col items-center gap-2">
            <app-icon name="home" [size]="24" [variant]="selectedVariant()" />
            <span class="text-xs">24px</span>
          </div>
          <div class="flex flex-col items-center gap-2">
            <app-icon name="home" [size]="32" [variant]="selectedVariant()" />
            <span class="text-xs">32px</span>
          </div>
          <div class="flex flex-col items-center gap-2">
            <app-icon name="home" [size]="48" [variant]="selectedVariant()" />
            <span class="text-xs">48px</span>
          </div>
          <div class="flex flex-col items-center gap-2">
            <app-icon name="home" [size]="64" [variant]="selectedVariant()" />
            <span class="text-xs">64px</span>
          </div>
        </div>
      </div>

      <!-- All Registered Icons -->
      <div class="mb-8">
        <h2 class="text-xl font-semibold mb-4">All Registered Icons ({{ registeredIcons().length }})</h2>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          @for (iconName of registeredIcons(); track iconName) {
            <div class="p-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex flex-col items-center gap-2">
              <app-icon 
                [name]="iconName" 
                [size]="32" 
                [variant]="selectedVariant()"
                customClass="text-gray-700 dark:text-gray-300" />
              <span class="text-xs text-center text-gray-600 dark:text-gray-400 break-all">{{ iconName }}</span>
            </div>
          }
        </div>
      </div>

      <!-- Usage Examples -->
      <div class="mb-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <h2 class="text-xl font-semibold mb-4">Usage Examples</h2>
        <div class="space-y-4">
          <!-- Buttons with icons -->
          <div>
            <h3 class="text-sm font-medium mb-2">Buttons with Icons</h3>
            <div class="flex gap-2">
              <button class="px-4 py-2 bg-primary text-white rounded-lg flex items-center gap-2 hover:bg-primary/90">
                <app-icon name="add" [size]="20" customClass="text-white" />
                <span>Add Item</span>
              </button>
              <button class="px-4 py-2 bg-green-500 text-white rounded-lg flex items-center gap-2 hover:bg-green-600">
                <app-icon name="save" [size]="20" customClass="text-white" />
                <span>Save</span>
              </button>
              <button class="px-4 py-2 bg-red-500 text-white rounded-lg flex items-center gap-2 hover:bg-red-600">
                <app-icon name="delete" [size]="20" customClass="text-white" />
                <span>Delete</span>
              </button>
            </div>
          </div>

          <!-- Icon-only buttons -->
          <div>
            <h3 class="text-sm font-medium mb-2">Icon-Only Buttons</h3>
            <div class="flex gap-2">
              <button class="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-600">
                <app-icon name="like" [size]="20" />
              </button>
              <button class="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-600">
                <app-icon name="share" [size]="20" />
              </button>
              <button class="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-600">
                <app-icon name="bookmark" [size]="20" />
              </button>
            </div>
          </div>

          <!-- Status indicators -->
          <div>
            <h3 class="text-sm font-medium mb-2">Status Indicators</h3>
            <div class="flex gap-4">
              <div class="flex items-center gap-2">
                <app-icon name="success" [size]="20" customClass="text-green-500" />
                <span>Success</span>
              </div>
              <div class="flex items-center gap-2">
                <app-icon name="error" [size]="20" customClass="text-red-500" />
                <span>Error</span>
              </div>
              <div class="flex items-center gap-2">
                <app-icon name="warning" [size]="20" customClass="text-yellow-500" />
                <span>Warning</span>
              </div>
              <div class="flex items-center gap-2">
                <app-icon name="info" [size]="20" customClass="text-blue-500" />
                <span>Info</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class IconDemoComponent {
  private iconService = inject(IconService);
  
  selectedVariant = signal<'outline' | 'filled' | 'duotone'>('outline');
  registeredIcons = this.iconService.getRegisteredIconsSignal();
}
