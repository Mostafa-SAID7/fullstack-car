import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Card Component - Shadcn/UI style card
 */
@Component({
  selector: 'ui-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="cardClasses()">
      <ng-content></ng-content>
    </div>
  `
})
export class CardComponent {
  variant = input<'default' | 'outline'>('default');
  
  cardClasses = computed(() => {
    const baseClasses = 'rounded-lg border bg-card text-card-foreground shadow-sm';
    
    const variantClasses = {
      default: '',
      outline: 'border-2'
    };
    
    return `${baseClasses} ${variantClasses[this.variant()]}`;
  });
}

/**
 * Card Header Component
 */
@Component({
  selector: 'ui-card-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col space-y-1.5 p-6">
      <ng-content></ng-content>
    </div>
  `
})
export class CardHeaderComponent {}

/**
 * Card Title Component
 */
@Component({
  selector: 'ui-card-title',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h3 class="text-2xl font-semibold leading-none tracking-tight">
      <ng-content></ng-content>
    </h3>
  `
})
export class CardTitleComponent {}

/**
 * Card Description Component
 */
@Component({
  selector: 'ui-card-description',
  standalone: true,
  imports: [CommonModule],
  template: `
    <p class="text-sm text-muted-foreground">
      <ng-content></ng-content>
    </p>
  `
})
export class CardDescriptionComponent {}

/**
 * Card Content Component
 */
@Component({
  selector: 'ui-card-content',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6 pt-0">
      <ng-content></ng-content>
    </div>
  `
})
export class CardContentComponent {}

/**
 * Card Footer Component
 */
@Component({
  selector: 'ui-card-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex items-center p-6 pt-0">
      <ng-content></ng-content>
    </div>
  `
})
export class CardFooterComponent {}