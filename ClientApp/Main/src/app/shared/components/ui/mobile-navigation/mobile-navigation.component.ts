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
  templateUrl: './mobile-navigation.component.html',
  styleUrls: ['./mobile-navigation.component.scss']
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