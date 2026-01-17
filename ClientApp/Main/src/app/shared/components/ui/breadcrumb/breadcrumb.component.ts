import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  active?: boolean;
}

/**
 * Breadcrumb Component
 * 
 * Navigation breadcrumb component using Angular 19 features
 */
@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="flex" aria-label="Breadcrumb">
      <ol class="inline-flex items-center space-x-1 md:space-x-3">
        @for (item of items(); track $index; let isLast = $last) {
          <li class="inline-flex items-center">
            @if (!isLast && item.href) {
              <a
                [routerLink]="item.href"
                class="inline-flex items-center text-sm font-medium text-gray-700 hover:text-primary dark:text-gray-400 dark:hover:text-white transition-colors">
                {{ item.label }}
              </a>
            } @else {
              <span class="ml-1 text-sm font-medium text-gray-500 dark:text-gray-400" [attr.aria-current]="isLast ? 'page' : null">
                {{ item.label }}
              </span>
            }
            
            @if (!isLast) {
              <i class="fa-solid fa-chevron-right w-4 h-4 text-gray-400 mx-2"></i>
            }
          </li>
        }
      </ol>
    </nav>
  `
})
export class BreadcrumbComponent {
  items = input<BreadcrumbItem[]>([]);
}