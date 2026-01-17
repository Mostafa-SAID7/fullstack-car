import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

export type TypographyVariant = 
  | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  | 'body1' | 'body2' | 'caption' | 'overline'
  | 'display1' | 'display2' | 'display3';

export type TypographyWeight = 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold';
export type TypographyAlign = 'left' | 'center' | 'right' | 'justify';

/**
 * Typography Component
 * 
 * Provides consistent typography with fluid scaling and responsive design
 */
@Component({
  selector: 'app-typography',
  standalone: true,
  imports: [CommonModule],
  template: `
    <ng-container [ngSwitch]="element()">
      <h1 *ngSwitchCase="'h1'" [class]="typographyClasses()">
        <ng-content></ng-content>
      </h1>
      <h2 *ngSwitchCase="'h2'" [class]="typographyClasses()">
        <ng-content></ng-content>
      </h2>
      <h3 *ngSwitchCase="'h3'" [class]="typographyClasses()">
        <ng-content></ng-content>
      </h3>
      <h4 *ngSwitchCase="'h4'" [class]="typographyClasses()">
        <ng-content></ng-content>
      </h4>
      <h5 *ngSwitchCase="'h5'" [class]="typographyClasses()">
        <ng-content></ng-content>
      </h5>
      <h6 *ngSwitchCase="'h6'" [class]="typographyClasses()">
        <ng-content></ng-content>
      </h6>
      <p *ngSwitchDefault [class]="typographyClasses()">
        <ng-content></ng-content>
      </p>
    </ng-container>
  `
})
export class TypographyComponent {
  // Input signals
  variant = input<TypographyVariant>('body1');
  weight = input<TypographyWeight>('normal');
  align = input<TypographyAlign>('left');
  color = input<'default' | 'muted' | 'primary' | 'secondary' | 'success' | 'warning' | 'error'>('default');
  fluid = input<boolean>(true);
  className = input<string>('');

  // Computed element type
  element = computed(() => {
    const variant = this.variant();
    if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(variant)) {
      return variant;
    }
    return 'p';
  });

  // Computed typography classes
  typographyClasses = computed(() => {
    const classes = [];
    const variant = this.variant();
    const isFluid = this.fluid();

    // Base typography styles
    switch (variant) {
      case 'display1':
        classes.push(isFluid ? 'text-6xl md:text-7xl lg:text-8xl' : 'text-8xl');
        classes.push('font-bold leading-none tracking-tight');
        break;
      case 'display2':
        classes.push(isFluid ? 'text-5xl md:text-6xl lg:text-7xl' : 'text-7xl');
        classes.push('font-bold leading-none tracking-tight');
        break;
      case 'display3':
        classes.push(isFluid ? 'text-4xl md:text-5xl lg:text-6xl' : 'text-6xl');
        classes.push('font-bold leading-tight tracking-tight');
        break;
      case 'h1':
        classes.push(isFluid ? 'text-3xl md:text-4xl lg:text-5xl' : 'text-5xl');
        classes.push('font-bold leading-tight tracking-tight');
        break;
      case 'h2':
        classes.push(isFluid ? 'text-2xl md:text-3xl lg:text-4xl' : 'text-4xl');
        classes.push('font-semibold leading-tight tracking-tight');
        break;
      case 'h3':
        classes.push(isFluid ? 'text-xl md:text-2xl lg:text-3xl' : 'text-3xl');
        classes.push('font-semibold leading-snug');
        break;
      case 'h4':
        classes.push(isFluid ? 'text-lg md:text-xl lg:text-2xl' : 'text-2xl');
        classes.push('font-semibold leading-snug');
        break;
      case 'h5':
        classes.push(isFluid ? 'text-base md:text-lg lg:text-xl' : 'text-xl');
        classes.push('font-medium leading-snug');
        break;
      case 'h6':
        classes.push(isFluid ? 'text-sm md:text-base lg:text-lg' : 'text-lg');
        classes.push('font-medium leading-normal');
        break;
      case 'body1':
        classes.push(isFluid ? 'text-sm md:text-base' : 'text-base');
        classes.push('leading-relaxed');
        break;
      case 'body2':
        classes.push(isFluid ? 'text-xs md:text-sm' : 'text-sm');
        classes.push('leading-relaxed');
        break;
      case 'caption':
        classes.push('text-xs leading-normal');
        break;
      case 'overline':
        classes.push('text-xs uppercase tracking-wider leading-normal');
        break;
    }

    // Weight
    switch (this.weight()) {
      case 'light':
        classes.push('font-light');
        break;
      case 'normal':
        classes.push('font-normal');
        break;
      case 'medium':
        classes.push('font-medium');
        break;
      case 'semibold':
        classes.push('font-semibold');
        break;
      case 'bold':
        classes.push('font-bold');
        break;
      case 'extrabold':
        classes.push('font-extrabold');
        break;
    }

    // Alignment
    switch (this.align()) {
      case 'left':
        classes.push('text-left');
        break;
      case 'center':
        classes.push('text-center');
        break;
      case 'right':
        classes.push('text-right');
        break;
      case 'justify':
        classes.push('text-justify');
        break;
    }

    // Color
    switch (this.color()) {
      case 'default':
        classes.push('text-gray-900 dark:text-white');
        break;
      case 'muted':
        classes.push('text-gray-600 dark:text-gray-400');
        break;
      case 'primary':
        classes.push('text-primary');
        break;
      case 'secondary':
        classes.push('text-gray-700 dark:text-gray-300');
        break;
      case 'success':
        classes.push('text-green-600 dark:text-green-400');
        break;
      case 'warning':
        classes.push('text-yellow-600 dark:text-yellow-400');
        break;
      case 'error':
        classes.push('text-red-600 dark:text-red-400');
        break;
    }

    // Additional classes
    if (this.className()) {
      classes.push(this.className());
    }

    return classes.join(' ');
  });
}