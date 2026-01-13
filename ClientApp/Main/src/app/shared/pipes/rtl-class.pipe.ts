import { Pipe, PipeTransform, inject } from '@angular/core';
import { RtlService } from '../../core/services/rtl.service';

/**
 * RTL Class Pipe
 * 
 * Transforms CSS classes to be RTL-aware
 * 
 * Usage:
 * <div [class]="'text-left ml-4' | rtlClass">Content</div>
 * <div [ngClass]="'float-left border-r' | rtlClass">Content</div>
 */
@Pipe({
  name: 'rtlClass',
  standalone: true,
  pure: false // Make it impure to react to RTL changes
})
export class RtlClassPipe implements PipeTransform {
  private rtlService = inject(RtlService);

  transform(classes: string | string[] | Record<string, boolean>): string | Record<string, boolean> {
    if (!classes) return '';

    if (typeof classes === 'string') {
      return this.transformStringClasses(classes);
    }

    if (Array.isArray(classes)) {
      return this.transformArrayClasses(classes);
    }

    if (typeof classes === 'object') {
      return this.transformObjectClasses(classes);
    }

    return classes;
  }

  private transformStringClasses(classes: string): string {
    return classes
      .split(' ')
      .map(cls => this.rtlService.getPositionClass(cls.trim()))
      .filter(cls => cls.length > 0)
      .join(' ');
  }

  private transformArrayClasses(classes: string[]): string {
    return classes
      .map(cls => this.rtlService.getPositionClass(cls.trim()))
      .filter(cls => cls.length > 0)
      .join(' ');
  }

  private transformObjectClasses(classes: Record<string, boolean>): Record<string, boolean> {
    const transformed: Record<string, boolean> = {};
    
    Object.entries(classes).forEach(([className, enabled]) => {
      const rtlClassName = this.rtlService.getPositionClass(className);
      transformed[rtlClassName] = enabled;
    });

    return transformed;
  }
}