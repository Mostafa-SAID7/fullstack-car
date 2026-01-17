import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

export type SectionSpacing = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

/**
 * Section Component
 * 
 * Provides consistent section spacing and layout
 */
@Component({
  selector: 'app-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section [class]="sectionClasses()">
      <ng-content></ng-content>
    </section>
  `
})
export class SectionComponent {
  // Input signals
  spacing = input<SectionSpacing>('lg');
  background = input<'default' | 'muted' | 'accent'>('default');
  className = input<string>('');

  // Computed section classes
  sectionClasses = computed(() => {
    const classes = [];
    
    // Spacing
    switch (this.spacing()) {
      case 'none':
        break;
      case 'sm':
        classes.push('py-8');
        break;
      case 'md':
        classes.push('py-12');
        break;
      case 'lg':
        classes.push('py-16');
        break;
      case 'xl':
        classes.push('py-20');
        break;
      case '2xl':
        classes.push('py-24');
        break;
    }
    
    // Background
    switch (this.background()) {
      case 'default':
        classes.push('bg-white dark:bg-gray-900');
        break;
      case 'muted':
        classes.push('bg-gray-50 dark:bg-gray-800');
        break;
      case 'accent':
        classes.push('bg-primary/5 dark:bg-primary/10');
        break;
    }
    
    // Additional classes
    if (this.className()) {
      classes.push(this.className());
    }
    
    return classes.join(' ');
  });
}