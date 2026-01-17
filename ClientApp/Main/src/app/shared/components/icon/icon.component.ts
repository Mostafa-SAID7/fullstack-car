import { Component, input, computed, inject } from '@angular/core';
import { IconService } from '@core/services/icon.service';

/**
 * Icon Component
 * 
 * Centralized icon component using HugeIcons with:
 * - Icon registry for aliases
 * - Multiple variants (outline, filled, duotone)
 * - Customizable size and color
 * - Accessibility support
 */
@Component({
  selector: 'app-icon',
  standalone: true,
  template: `
    <i 
      [class]="iconClasses()"
      [attr.aria-label]="ariaLabel() || name()"
      [attr.role]="role()"
      [style.font-size.px]="size()">
    </i>
  `,
  styles: [`
    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    
    i {
      display: inline-block;
      line-height: 1;
    }
  `]
})
export class IconComponent {
  private iconService = inject(IconService);

  // Inputs
  name = input.required<string>();
  size = input<number>(24);
  variant = input<'outline' | 'filled' | 'duotone'>('outline');
  ariaLabel = input<string>('');
  role = input<string>('img');
  customClass = input<string>('');

  // Computed icon classes
  iconClasses = computed(() => {
    const iconName = this.iconService.getIcon(this.name());
    const variantSuffix = this.variant() === 'outline' ? '' : `-${this.variant()}`;
    const baseClass = `hugeicons-${iconName}${variantSuffix}`;
    const custom = this.customClass();
    
    return custom ? `${baseClass} ${custom}` : baseClass;
  });
}
