import { Component, signal, computed, input, output, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

export interface MobileNavItem {
  id: string;
  label: string;
  href: string;
  icon: string;
  badge?: string | number;
  active?: boolean;
}

/**
 * Mobile-First Navigation Component
 * 
 * Touch-optimized navigation with gestures and mobile-specific features
 */
@Component({
  selector: 'app-mobile-navigation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- Mobile Bottom Navigation -->
    <nav class="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 z-50 md:hidden">
      <div class="grid grid-cols-5 h-16">
        @for (item of items(); track item.id; let index = $index) {
          <a
            [routerLink]="item.href"
            routerLinkActive="text-primary bg-primary/10"
            (click)="onItemClick(item, index)"
            class="flex flex-col items-center justify-center space-y-1 text-gray-600 dark:text-gray-400 hover:text-primary transition-colors touch-manipulation"
            [class.text-primary]="item.active"
            [attr.aria-label]="item.label">
            
            <div class="relative">
              <i [class]="item.icon + ' text-xl'"></i>
              @if (item.badge) {
                <span class="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full min-w-5 h-5 flex items-center justify-center px-1">
                  {{ item.badge }}
                </span>
              }
            </div>
            
            <span class="text-xs font-medium truncate max-w-full">
              {{ item.label }}
            </span>
          </a>
        }
      </div>
    </nav>

    <!-- Mobile Slide-out Menu -->
    @if (isMenuOpen()) {
      <div class="fixed inset-0 z-50 md:hidden">
        <!-- Backdrop -->
        <div 
          class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          (click)="closeMenu()"
          (touchstart)="onBackdropTouchStart($event)"
          (touchend)="onBackdropTouchEnd($event)">
        </div>
        
        <!-- Menu Panel -->
        <div 
          class="fixed inset-y-0 left-0 w-80 max-w-sm bg-white dark:bg-gray-900 shadow-xl transform transition-transform"
          [class.translate-x-0]="isMenuOpen()"
          [class.-translate-x-full]="!isMenuOpen()"
          (touchstart)="onMenuTouchStart($event)"
          (touchmove)="onMenuTouchMove($event)"
          (touchend)="onMenuTouchEnd($event)">
          
          <!-- Menu Header -->
          <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Menu</h2>
            <button
              (click)="closeMenu()"
              class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Close menu">
              <i class="fa-solid fa-times text-xl"></i>
            </button>
          </div>
          
          <!-- Menu Content -->
          <div class="flex-1 overflow-y-auto">
            <ng-content select="[slot=menu-content]"></ng-content>
          </div>
        </div>
      </div>
    }

    <!-- Desktop Navigation -->
    <nav class="hidden md:block bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center space-x-8">
            <ng-content select="[slot=logo]"></ng-content>
            
            <div class="flex space-x-8">
              @for (item of items(); track item.id) {
                <a
                  [routerLink]="item.href"
                  routerLinkActive="text-primary border-primary"
                  class="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 transition-colors">
                  <i [class]="item.icon + ' mr-2'"></i>
                  {{ item.label }}
                  @if (item.badge) {
                    <span class="ml-2 bg-red-500 text-white text-xs rounded-full min-w-5 h-5 flex items-center justify-center px-1">
                      {{ item.badge }}
                    </span>
                  }
                </a>
              }
            </div>
          </div>
          
          <div class="flex items-center space-x-4">
            <ng-content select="[slot=actions]"></ng-content>
          </div>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    :host {
      display: block;
    }
    
    /* Touch optimization */
    .touch-manipulation {
      touch-action: manipulation;
      -webkit-tap-highlight-color: transparent;
    }
    
    /* Smooth transitions */
    .transition-transform {
      transition: transform 0.3s ease-in-out;
    }
    
    /* Haptic feedback simulation */
    .touch-manipulation:active {
      transform: scale(0.95);
      transition: transform 0.1s ease-in-out;
    }
  `]
})
export class MobileNavigationComponent {
  // Input signals
  items = input<MobileNavItem[]>([]);
  
  // Local state
  isMenuOpen = signal(false);
  
  // Touch gesture state
  private touchStartX = 0;
  private touchStartY = 0;
  private isDragging = false;
  
  // Output signals
  itemClick = output<{ item: MobileNavItem; index: number }>();
  menuToggle = output<boolean>();

  constructor() {
    // Effect to handle body scroll lock when menu is open
    effect(() => {
      const isOpen = this.isMenuOpen();
      if (isOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });
  }

  openMenu(): void {
    this.isMenuOpen.set(true);
    this.menuToggle.emit(true);
  }

  closeMenu(): void {
    this.isMenuOpen.set(false);
    this.menuToggle.emit(false);
  }

  toggleMenu(): void {
    if (this.isMenuOpen()) {
      this.closeMenu();
    } else {
      this.openMenu();
    }
  }

  onItemClick(item: MobileNavItem, index: number): void {
    this.itemClick.emit({ item, index });
    
    // Haptic feedback for mobile devices
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  }

  // Touch gesture handlers for swipe-to-close
  onBackdropTouchStart(event: TouchEvent): void {
    this.touchStartX = event.touches[0].clientX;
    this.touchStartY = event.touches[0].clientY;
    this.isDragging = false;
  }

  onBackdropTouchEnd(event: TouchEvent): void {
    if (!this.isDragging) {
      this.closeMenu();
    }
  }

  onMenuTouchStart(event: TouchEvent): void {
    this.touchStartX = event.touches[0].clientX;
    this.touchStartY = event.touches[0].clientY;
    this.isDragging = false;
  }

  onMenuTouchMove(event: TouchEvent): void {
    const currentX = event.touches[0].clientX;
    const currentY = event.touches[0].clientY;
    
    const deltaX = currentX - this.touchStartX;
    const deltaY = Math.abs(currentY - this.touchStartY);
    
    // Only consider horizontal swipes
    if (Math.abs(deltaX) > 10 && deltaY < 50) {
      this.isDragging = true;
      
      // Swipe left to close (only if starting from left edge)
      if (deltaX < -50 && this.touchStartX < 50) {
        this.closeMenu();
      }
    }
  }

  onMenuTouchEnd(event: TouchEvent): void {
    this.isDragging = false;
  }
}