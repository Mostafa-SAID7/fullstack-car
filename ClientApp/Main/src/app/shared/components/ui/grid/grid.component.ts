import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

export type GridCols = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
export type GridGap = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16 | 20 | 24;

/**
 * Responsive Grid Component
 * 
 * Flexible grid system using Tailwind CSS with Angular 19 features
 */
@Component({
  selector: 'app-grid',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent {
  // Input signals for responsive breakpoints
  cols = input<GridCols>(1);
  smCols = input<GridCols | undefined>(undefined);
  mdCols = input<GridCols | undefined>(undefined);
  lgCols = input<GridCols | undefined>(undefined);
  xlCols = input<GridCols | undefined>(undefined);

  // Gap settings
  gap = input<GridGap>(4);
  gapX = input<GridGap | undefined>(undefined);
  gapY = input<GridGap | undefined>(undefined);

  // Additional classes
  className = input<string>('');

  // Computed grid classes
  gridClasses = computed(() => {
    const classes = ['grid'];

    // Base columns
    classes.push(`grid-cols-${this.cols()}`);

    // Responsive columns
    if (this.smCols()) classes.push(`sm:grid-cols-${this.smCols()}`);
    if (this.mdCols()) classes.push(`md:grid-cols-${this.mdCols()}`);
    if (this.lgCols()) classes.push(`lg:grid-cols-${this.lgCols()}`);
    if (this.xlCols()) classes.push(`xl:grid-cols-${this.xlCols()}`);

    // Gap settings
    if (this.gapX() !== undefined && this.gapY() !== undefined) {
      classes.push(`gap-x-${this.gapX()}`);
      classes.push(`gap-y-${this.gapY()}`);
    } else {
      classes.push(`gap-${this.gap()}`);
    }

    // Additional classes
    if (this.className()) {
      classes.push(this.className());
    }

    return classes.join(' ');
  });
}