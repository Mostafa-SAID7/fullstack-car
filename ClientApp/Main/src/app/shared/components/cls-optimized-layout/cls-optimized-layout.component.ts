import {
  Component,
  Input,
  Output,
  EventEmitter,
  signal,
  computed,
  effect,
  OnInit,
  OnDestroy,
  ElementRef,
  ViewChild,
  inject,
  ChangeDetectionStrategy
} from '@angular/core';
import { CommonModule } from '@angular/common';

export interface CLSOptimizedConfig {
  enableSkeletonLoading: boolean;
  enableImageSizing: boolean;
  enableFontOptimization: boolean;
  skeletonDuration: number;
  reserveSpace: boolean;
  minHeight?: string;
  aspectRatio?: string;
}

export interface LayoutShiftMetrics {
  clsScore: number;
  shiftCount: number;
  largestShift: number;
  timestamp: number;
}

/**
 * CLS Optimized Layout Component
 * 
 * Provides comprehensive Cumulative Layout Shift (CLS) optimization with:
 * - Proper content sizing and space reservation
 * - Skeleton loading states to prevent layout shifts
 * - Font loading optimization
 * - Layout shift monitoring and metrics
 * - Responsive design with fixed dimensions
 */
@Component({
  selector: 'app-cls-optimized-layout',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cls-optimized-layout.component.html',
  styleUrls: ['./cls-optimized-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CLSOptimizedLayoutComponent implements OnInit, OnDestroy {
  @ViewChild('containerElement') containerElement!: ElementRef<HTMLDivElement>;

  // Input properties
  @Input() config: CLSOptimizedConfig = {
    enableSkeletonLoading: true,
    enableImageSizing: true,
    enableFontOptimization: true,
    skeletonDuration: 1500,
    reserveSpace: true
  };

  @Input() skeletonType: 'default' | 'card' | 'list' | 'grid' = 'default';
  @Input() showMetrics: boolean = false;
  @Input() isLoading = signal<boolean>(true);

  // Output events
  @Output() layoutShift = new EventEmitter<LayoutShiftMetrics>();
  @Output() loadingComplete = new EventEmitter<void>();

  private elementRef = inject(ElementRef);
  private layoutShiftObserver?: PerformanceObserver;
  private resizeObserver?: ResizeObserver;

  // Signals for reactive state
  private _clsMetrics = signal<LayoutShiftMetrics | null>(null);
  private _wasLoading = signal<boolean>(false);

  // Computed values
  readonly clsMetrics = this._clsMetrics.asReadonly();
  readonly wasLoading = this._wasLoading.asReadonly();

  readonly containerClasses = computed(() => {
    const classes = ['cls-optimized-container'];

    if (this.config.reserveSpace) {
      classes.push('reserve-space');
    }

    if (this.config.enableFontOptimization) {
      classes.push('font-optimized');
    }

    return classes.join(' ');
  });

  readonly skeletonClasses = computed(() => {
    const classes = ['skeleton-container', `skeleton-${this.skeletonType}`];
    return classes.join(' ');
  });

  readonly skeletonTemplate = computed(() => {
    // This would be expanded to return different skeleton templates
    // based on the skeletonType
    return null; // Placeholder for now
  });

  constructor() {
    // Effect to track loading state changes
    effect(() => {
      const loading = this.isLoading();
      if (!loading && this._wasLoading()) {
        this.loadingComplete.emit();
      }
      if (loading) {
        this._wasLoading.set(true);
      }
    });
  }

  ngOnInit(): void {
    this.setupLayoutShiftObserver();
    this.setupResizeObserver();

    if (this.config.enableFontOptimization) {
      this.optimizeFontLoading();
    }
  }

  ngOnDestroy(): void {
    if (this.layoutShiftObserver) {
      this.layoutShiftObserver.disconnect();
    }

    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  /**
   * Setup Layout Shift Observer to monitor CLS
   */
  private setupLayoutShiftObserver(): void {
    if (!('PerformanceObserver' in window)) {
      return;
    }

    try {
      this.layoutShiftObserver = new PerformanceObserver((list) => {
        let clsScore = 0;
        let shiftCount = 0;
        let largestShift = 0;

        for (const entry of list.getEntries()) {
          if (entry.entryType === 'layout-shift' && !(entry as any).hadRecentInput) {
            const shiftValue = (entry as any).value;
            clsScore += shiftValue;
            shiftCount++;
            largestShift = Math.max(largestShift, shiftValue);
          }
        }

        if (shiftCount > 0) {
          const metrics: LayoutShiftMetrics = {
            clsScore,
            shiftCount,
            largestShift,
            timestamp: performance.now()
          };

          this._clsMetrics.set(metrics);
          this.layoutShift.emit(metrics);

          // Log warning if CLS score is high
          if (clsScore > 0.1) {
            console.warn(`🚨 High CLS detected: ${clsScore.toFixed(4)} (${shiftCount} shifts)`);
          }
        }
      });

      this.layoutShiftObserver.observe({ entryTypes: ['layout-shift'] });
    } catch (error) {
      console.warn('Layout Shift Observer not supported:', error);
    }
  }

  /**
   * Setup Resize Observer to monitor element size changes
   */
  private setupResizeObserver(): void {
    if (!('ResizeObserver' in window)) {
      return;
    }

    this.resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        // Monitor for unexpected size changes that could cause layout shifts
        const { width, height } = entry.contentRect;

        if (this.showMetrics) {
          console.log(`📐 Element resized: ${width}x${height}`);
        }
      }
    });

    // Observe the container element once it's available
    setTimeout(() => {
      if (this.containerElement) {
        this.resizeObserver?.observe(this.containerElement.nativeElement);
      }
    });
  }

  /**
   * Optimize font loading to prevent layout shifts
   */
  private optimizeFontLoading(): void {
    // Check if fonts are already loaded
    if ('fonts' in document) {
      document.fonts.ready.then(() => {
        console.log('🔤 Fonts loaded, layout stable');
      });

      // Monitor font loading
      document.fonts.addEventListener('loadingdone', (event) => {
        console.log(`🔤 Font loaded: ${(event as any).fontface?.family}`);
      });

      document.fonts.addEventListener('loadingerror', (event) => {
        console.warn(`🚨 Font loading error: ${(event as any).fontface?.family}`);
      });
    }

    // Add font-display: swap to existing fonts if not already set
    this.addFontDisplaySwap();
  }

  /**
   * Add font-display: swap to prevent invisible text during font load
   */
  private addFontDisplaySwap(): void {
    const fontLinks = document.querySelectorAll('link[href*="fonts.googleapis.com"]');

    fontLinks.forEach((link) => {
      const href = link.getAttribute('href');
      if (href && !href.includes('display=swap')) {
        const separator = href.includes('?') ? '&' : '?';
        link.setAttribute('href', `${href}${separator}display=swap`);
      }
    });
  }

  /**
   * Manually trigger loading completion
   */
  completeLoading(): void {
    this.isLoading.set(false);
  }

  /**
   * Reset the component to loading state
   */
  resetToLoading(): void {
    this.isLoading.set(true);
    this._wasLoading.set(false);
    this._clsMetrics.set(null);
  }

  /**
   * Get current CLS metrics
   */
  getCurrentCLSMetrics(): LayoutShiftMetrics | null {
    return this._clsMetrics();
  }
}