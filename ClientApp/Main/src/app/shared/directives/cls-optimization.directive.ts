import {
  Directive,
  ElementRef,
  Input,
  OnInit,
  OnDestroy,
  Renderer2,
  inject,
  signal,
  effect
} from '@angular/core';
import { CLSMonitoringService } from '../../core/services/cls-monitoring.service';
import { FontOptimizationService } from '../../core/services/font-optimization.service';

export interface CLSOptimizationConfig {
  reserveSpace: boolean;
  minHeight?: string;
  aspectRatio?: string;
  enableSkeleton: boolean;
  skeletonDuration: number;
  monitorShifts: boolean;
  preventFontShifts: boolean;
  enableImageSizing: boolean;
}

/**
 * CLS Optimization Directive
 * 
 * Applies comprehensive CLS optimization to any element:
 * - Reserves space to prevent layout shifts
 * - Monitors layout shifts in real-time
 * - Applies skeleton loading states
 * - Optimizes font loading
 * - Provides image sizing constraints
 * 
 * Usage:
 * <div clsOptimization [clsConfig]="{ reserveSpace: true, minHeight: '200px' }">
 *   Content that might cause layout shifts
 * </div>
 */
@Directive({
  selector: '[clsOptimization]',
  standalone: true
})
export class CLSOptimizationDirective implements OnInit, OnDestroy {
  private elementRef = inject(ElementRef);
  private renderer = inject(Renderer2);
  private clsMonitoring = inject(CLSMonitoringService);
  private fontOptimization = inject(FontOptimizationService);

  @Input() clsConfig: CLSOptimizationConfig = {
    reserveSpace: true,
    enableSkeleton: false,
    skeletonDuration: 1500,
    monitorShifts: true,
    preventFontShifts: true,
    enableImageSizing: true
  };

  @Input() isLoading = signal<boolean>(false);

  private resizeObserver?: ResizeObserver;
  private mutationObserver?: MutationObserver;
  private initialDimensions?: { width: number; height: number };
  private skeletonElement?: HTMLElement;
  private clsScore = signal<number>(0);

  constructor() {
    // Effect to handle loading state changes
    effect(() => {
      const loading = this.isLoading();
      if (loading && this.clsConfig.enableSkeleton) {
        this.showSkeleton();
      } else {
        this.hideSkeleton();
      }
    });

    // Effect to monitor CLS score changes
    effect(() => {
      const score = this.clsScore();
      if (score > 0.1) {
        console.warn(`🚨 High CLS detected on element:`, this.elementRef.nativeElement, `Score: ${score.toFixed(4)}`);
      }
    });
  }

  ngOnInit(): void {
    this.initializeOptimizations();
  }

  ngOnDestroy(): void {
    this.cleanup();
  }

  /**
   * Initialize all CLS optimizations
   */
  private initializeOptimizations(): void {
    const element = this.elementRef.nativeElement;

    // Apply base CLS optimization classes
    this.renderer.addClass(element, 'cls-optimized');

    if (this.clsConfig.reserveSpace) {
      this.setupSpaceReservation();
    }

    if (this.clsConfig.monitorShifts) {
      this.setupShiftMonitoring();
    }

    if (this.clsConfig.preventFontShifts) {
      this.setupFontOptimization();
    }

    if (this.clsConfig.enableImageSizing) {
      this.setupImageSizing();
    }

    // Add CSS custom properties for configuration
    this.applyCSSProperties();
  }

  /**
   * Setup space reservation to prevent layout shifts
   */
  private setupSpaceReservation(): void {
    const element = this.elementRef.nativeElement;

    // Store initial dimensions
    const rect = element.getBoundingClientRect();
    this.initialDimensions = {
      width: rect.width,
      height: rect.height
    };

    // Apply minimum dimensions
    if (this.clsConfig.minHeight) {
      this.renderer.setStyle(element, 'min-height', this.clsConfig.minHeight);
    }

    if (this.clsConfig.aspectRatio) {
      this.renderer.setStyle(element, 'aspect-ratio', this.clsConfig.aspectRatio);
    }

    // Ensure element has explicit dimensions if content is dynamic
    if (rect.width > 0 && rect.height > 0) {
      this.renderer.setStyle(element, 'width', `${rect.width}px`);
      this.renderer.setStyle(element, 'height', `${rect.height}px`);
    }

    console.log(`📐 Space reserved for element: ${rect.width}×${rect.height}`);
  }

  /**
   * Setup layout shift monitoring
   */
  private setupShiftMonitoring(): void {
    // Subscribe to CLS metrics
    this.clsMonitoring.getMetricsObservable().subscribe(metrics => {
      this.clsScore.set(metrics.totalCLS);
    });

    // Setup ResizeObserver to detect size changes
    if ('ResizeObserver' in window) {
      this.resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          this.handleResize(entry);
        }
      });

      this.resizeObserver.observe(this.elementRef.nativeElement);
    }

    // Setup MutationObserver to detect DOM changes
    this.mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        this.handleMutation(mutation);
      });
    });

    this.mutationObserver.observe(this.elementRef.nativeElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class']
    });
  }

  /**
   * Handle element resize
   */
  private handleResize(entry: ResizeObserverEntry): void {
    const { width, height } = entry.contentRect;
    
    if (this.initialDimensions) {
      const widthChange = Math.abs(width - this.initialDimensions.width);
      const heightChange = Math.abs(height - this.initialDimensions.height);
      
      // Log significant size changes
      if (widthChange > 5 || heightChange > 5) {
        console.log(`📏 Element resized: ${this.initialDimensions.width}×${this.initialDimensions.height} → ${width}×${height}`);
      }
    }
  }

  /**
   * Handle DOM mutations
   */
  private handleMutation(mutation: MutationRecord): void {
    if (mutation.type === 'childList') {
      // Content was added or removed
      if (mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0) {
        console.log('🔄 DOM content changed, potential layout shift');
      }
    } else if (mutation.type === 'attributes') {
      // Attributes changed
      const target = mutation.target as Element;
      if (mutation.attributeName === 'style' || mutation.attributeName === 'class') {
        console.log('🎨 Element styling changed, potential layout shift');
      }
    }
  }

  /**
   * Setup font optimization
   */
  private setupFontOptimization(): void {
    const element = this.elementRef.nativeElement;

    // Add font loading class
    this.renderer.addClass(element, 'font-loading');

    // Listen for font loading completion
    this.fontOptimization.getFontLoadingObservable().subscribe(loaded => {
      if (loaded) {
        this.renderer.removeClass(element, 'font-loading');
        this.renderer.addClass(element, 'fonts-loaded');
        console.log('🔤 Fonts loaded for element');
      }
    });
  }

  /**
   * Setup image sizing optimization
   */
  private setupImageSizing(): void {
    const element = this.elementRef.nativeElement;
    const images = element.querySelectorAll('img');

    images.forEach((img: HTMLImageElement) => {
      // Ensure images have explicit dimensions
      if (!img.width || !img.height) {
        // Set default aspect ratio if not specified
        if (!img.style.aspectRatio) {
          this.renderer.setStyle(img, 'aspect-ratio', '16/9');
        }
        
        // Set object-fit to prevent distortion
        this.renderer.setStyle(img, 'object-fit', 'cover');
        
        console.log('🖼️ Applied sizing constraints to image');
      }

      // Add loading attribute if not present
      if (!img.getAttribute('loading')) {
        this.renderer.setAttribute(img, 'loading', 'lazy');
      }

      // Add decoding attribute for better performance
      if (!img.getAttribute('decoding')) {
        this.renderer.setAttribute(img, 'decoding', 'async');
      }
    });
  }

  /**
   * Apply CSS custom properties for configuration
   */
  private applyCSSProperties(): void {
    const element = this.elementRef.nativeElement;

    if (this.clsConfig.minHeight) {
      this.renderer.setStyle(element, '--cls-min-height', this.clsConfig.minHeight);
    }

    if (this.clsConfig.aspectRatio) {
      this.renderer.setStyle(element, '--cls-aspect-ratio', this.clsConfig.aspectRatio);
    }

    this.renderer.setStyle(element, '--cls-skeleton-duration', `${this.clsConfig.skeletonDuration}ms`);
  }

  /**
   * Show skeleton loading state
   */
  private showSkeleton(): void {
    if (this.skeletonElement) return;

    const element = this.elementRef.nativeElement;
    
    // Create skeleton element
    this.skeletonElement = this.renderer.createElement('div');
    this.renderer.addClass(this.skeletonElement, 'cls-skeleton');
    this.renderer.addClass(this.skeletonElement, 'skeleton-element');
    
    // Match parent dimensions
    const rect = element.getBoundingClientRect();
    this.renderer.setStyle(this.skeletonElement, 'width', '100%');
    this.renderer.setStyle(this.skeletonElement, 'height', '100%');
    this.renderer.setStyle(this.skeletonElement, 'position', 'absolute');
    this.renderer.setStyle(this.skeletonElement, 'top', '0');
    this.renderer.setStyle(this.skeletonElement, 'left', '0');
    this.renderer.setStyle(this.skeletonElement, 'z-index', '1');
    
    // Insert skeleton
    this.renderer.appendChild(element, this.skeletonElement);
    
    // Auto-hide after duration
    setTimeout(() => {
      this.hideSkeleton();
    }, this.clsConfig.skeletonDuration);
  }

  /**
   * Hide skeleton loading state
   */
  private hideSkeleton(): void {
    if (this.skeletonElement) {
      this.renderer.removeChild(this.elementRef.nativeElement, this.skeletonElement);
      this.skeletonElement = undefined;
    }
  }

  /**
   * Cleanup observers and resources
   */
  private cleanup(): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }

    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
    }

    this.hideSkeleton();
  }

  /**
   * Public API: Update configuration
   */
  updateConfig(newConfig: Partial<CLSOptimizationConfig>): void {
    this.clsConfig = { ...this.clsConfig, ...newConfig };
    this.applyCSSProperties();
  }

  /**
   * Public API: Get current CLS score for this element
   */
  getCurrentCLSScore(): number {
    return this.clsScore();
  }

  /**
   * Public API: Force skeleton display
   */
  showSkeletonLoader(): void {
    this.showSkeleton();
  }

  /**
   * Public API: Force skeleton hide
   */
  hideSkeletonLoader(): void {
    this.hideSkeleton();
  }
}