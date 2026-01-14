import { Pipe, PipeTransform, inject } from '@angular/core';
import { RtlService } from '../../core/services/rtl.service';

/**
 * RTL Style Pipe
 * 
 * Transforms inline styles to be RTL-aware
 * 
 * Usage:
 * <div [ngStyle]="{ 'text-align': 'left', 'margin-left': '10px' } | rtlStyle">Content</div>
 * <div [style]="'text-align: left; float: right;' | rtlStyle">Content</div>
 */
@Pipe({
  name: 'rtlStyle',
  standalone: true,
  pure: false // Make it impure to react to RTL changes
})
export class RtlStylePipe implements PipeTransform {
  private rtlService = inject(RtlService);

  transform(styles: null | undefined): {};
  transform(styles: string): string;
  transform(styles: Record<string, string | number>): Record<string, string | number>;
  transform(styles: string | Record<string, string | number> | null | undefined): string | Record<string, string | number> {
    if (!styles) return {};

    if (typeof styles === 'string') {
      return this.transformStringStyles(styles);
    }

    if (typeof styles === 'object') {
      return this.transformObjectStyles(styles);
    }

    return styles;
  }

  private transformStringStyles(styles: string): string {
    // Parse CSS string into object
    const styleObject: Record<string, string> = {};

    styles.split(';').forEach(declaration => {
      const [property, value] = declaration.split(':').map(s => s.trim());
      if (property && value) {
        styleObject[this.camelCase(property)] = value;
      }
    });

    // Transform the object
    const transformedObject = this.rtlService.getPositionStyles(styleObject);

    // Convert back to CSS string
    return Object.entries(transformedObject)
      .map(([property, value]) => `${this.kebabCase(property)}: ${value}`)
      .join('; ');
  }

  private transformObjectStyles(styles: Record<string, string | number>): Record<string, string | number> {
    const stringStyles: Record<string, string> = {};

    // Convert all values to strings for processing
    Object.entries(styles).forEach(([key, value]) => {
      stringStyles[key] = String(value);
    });

    const transformed = this.rtlService.getPositionStyles(stringStyles);

    // Convert back to original types
    const result: Record<string, string | number> = {};
    Object.entries(transformed).forEach(([key, value]) => {
      // Try to convert back to number if it was originally a number
      const originalValue = styles[key];
      if (typeof originalValue === 'number' && !isNaN(Number(value))) {
        result[key] = Number(value);
      } else {
        result[key] = value;
      }
    });

    return result;
  }

  private camelCase(str: string): string {
    return str.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());
  }

  private kebabCase(str: string): string {
    return str.replace(/([A-Z])/g, '-$1').toLowerCase();
  }
}