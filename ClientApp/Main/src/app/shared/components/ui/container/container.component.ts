import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ContainerSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';

/**
 * Responsive Container Component
 * 
 * Provides consistent max-width containers with responsive breakpoints
 */
@Component({
  selector: 'app-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="containerClasses()">
      <ng-content></ng-content>
    </div>
  `
})
export class ContainerComponent {
  // Input signals
  size = input<ContainerSize>('xl');
  centered = input<boolean>(true);
  padding = input<boolean>(true);
  className = input<string>('');

  // Computed container classes
  containerClasses = computed(() => {
    const classes = [];
    
    // Base container class
    if (this.size() === 'full') {
      classes.push('w-full');
    } else {
      classes.push('container');
      classes.push(`max-w-${this.size()}`);
    }
    
    // Centering
    if (this.centered()) {
      classes.push('mx-auto');
    }
    
    // Padding
    if (this.padding()) {
      classes.push('px-4 sm:px-6 lg:px-8');
    }
    
    // Additional classes
    if (this.className()) {
      classes.push(this.className());
    }
    
    return classes.join(' ');
  });
}