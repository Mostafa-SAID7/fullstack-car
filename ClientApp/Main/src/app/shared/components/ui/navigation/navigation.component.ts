import { Component, signal, computed, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon?: string;
  badge?: string | number;
  children?: NavigationItem[];
  active?: boolean;
}

/**
 * Responsive Navigation Component
 * 
 * Modern Angular 19 navigation component with:
 * - Responsive design with mobile menu
 * - Angular Signals for state management
 * - New control flow syntax
 * - Tailwind CSS styling
 */
@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent {
  // Input signals
  items = input<NavigationItem[]>([]);

  // Local state
  isMobileMenuOpen = signal(false);

  // Events
  menuToggle = output<boolean>();

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update(open => !open);
    this.menuToggle.emit(this.isMobileMenuOpen());
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
    this.menuToggle.emit(false);
  }
}