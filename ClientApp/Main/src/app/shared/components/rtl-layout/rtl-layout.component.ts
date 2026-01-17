import { Component, Input, OnInit, OnDestroy, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { RtlService, LayoutDirection } from '../../../core/services/rtl.service';

/**
 * RTL Layout Wrapper Component
 * 
 * Provides automatic RTL layout support for child components
 * 
 * Usage:
 * <app-rtl-layout>
 *   <div>Content that will be RTL-aware</div>
 * </app-rtl-layout>
 * 
 * <app-rtl-layout [forceDirection]="'ltr'">
 *   <div>Always LTR content</div>
 * </app-rtl-layout>
 */
@Component({
  selector: 'app-rtl-layout',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rtl-layout.component.html',
  styles: [`
    .rtl-layout-wrapper {
      width: 100%;
      height: 100%;
    }

    .rtl-layout {
      direction: rtl;
    }

    .ltr-layout {
      direction: ltr;
    }

    /* RTL-specific adjustments */
    .rtl-layout .flex {
      flex-direction: row-reverse;
    }

    .rtl-layout .space-x-2 > * + * {
      margin-left: 0;
      margin-right: 0.5rem;
    }

    .rtl-layout .space-x-3 > * + * {
      margin-left: 0;
      margin-right: 0.75rem;
    }

    .rtl-layout .space-x-4 > * + * {
      margin-left: 0;
      margin-right: 1rem;
    }

    /* Text alignment */
    .rtl-layout .text-left {
      text-align: right;
    }

    .rtl-layout .text-right {
      text-align: left;
    }

    /* Float adjustments */
    .rtl-layout .float-left {
      float: right;
    }

    .rtl-layout .float-right {
      float: left;
    }

    /* Margin adjustments */
    .rtl-layout .ml-auto {
      margin-left: 0;
      margin-right: auto;
    }

    .rtl-layout .mr-auto {
      margin-right: 0;
      margin-left: auto;
    }

    /* Border radius adjustments */
    .rtl-layout .rounded-l {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
      border-top-right-radius: 0.375rem;
      border-bottom-right-radius: 0.375rem;
    }

    .rtl-layout .rounded-r {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
      border-top-left-radius: 0.375rem;
      border-bottom-left-radius: 0.375rem;
    }

    /* Icon mirroring */
    .rtl-layout .rtl-mirror {
      transform: scaleX(-1);
    }

    /* Forced direction indicators */
    .rtl-forced {
      border-left: 2px solid transparent;
    }

    .ltr-forced {
      border-right: 2px solid transparent;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RtlLayoutComponent implements OnInit, OnDestroy {
  private rtlService = inject(RtlService);
  private destroy$ = new Subject<void>();

  @Input() forceDirection: 'ltr' | 'rtl' | null = null;
  @Input() wrapperClass: string = '';
  @Input() enableMirroring: boolean = true;

  currentDirection: 'ltr' | 'rtl' = 'ltr';
  isRTL: boolean = false;
  layoutDirection: LayoutDirection | null = null;

  ngOnInit(): void {
    this.rtlService.layoutDirection$
      .pipe(takeUntil(this.destroy$))
      .subscribe(layout => {
        this.layoutDirection = layout;
        this.updateDirection(layout);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private updateDirection(layout: LayoutDirection): void {
    if (this.forceDirection) {
      this.currentDirection = this.forceDirection;
      this.isRTL = this.forceDirection === 'rtl';
    } else {
      this.currentDirection = layout.direction;
      this.isRTL = layout.isRTL;
    }
  }

  /**
   * Get CSS class for RTL-aware positioning
   */
  getRtlClass(baseClass: string): string {
    return this.rtlService.getPositionClass(baseClass);
  }

  /**
   * Get inline styles for RTL-aware positioning
   */
  getRtlStyles(styles: Record<string, string>): Record<string, string> {
    return this.rtlService.getPositionStyles(styles);
  }
}