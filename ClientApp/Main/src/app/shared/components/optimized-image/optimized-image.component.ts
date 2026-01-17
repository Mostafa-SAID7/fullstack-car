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
  inject
} from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ImageOptimizationConfig {
  enableWebP: boolean;
  enableAVIF: boolean;
  enableLazyLoading: boolean;
  enableProgressiveLoading: boolean;
  quality: number;
  sizes: string[];
  placeholder: 'blur' | 'empty' | 'skeleton';
  priority: 'high' | 'medium' | 'low';
}

export interface ImageLoadEvent {
  src: string;
  loadTime: number;
  format: string;
  size: { width: number; height: number };
}

/**
 * Optimized Image Component
 * 
 * Provides advanced image optimization with:
 * - WebP/AVIF format support with fallbacks
 * - Lazy loading with intersection observer
 * - Progressive loading with blur-up effect
 * - Responsive image sizing
 * - Performance monitoring
 */
@Component({
  selector: 'app-optimized-image',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      class="optimized-image-container"
      [class]="containerClass"
      [style.width]="width"
      [style.height]="height">
      
      <!-- Placeholder while loading -->
      @if (isLoading() && config.placeholder !== 'empty') {
        <div class="image-placeholder" [ngClass]="getPlaceholderClass()">
          @switch (config.placeholder) {
            @case ('blur') {
              <div class="blur-placeholder" [style.background-image]="'url(' + blurDataUrl + ')'"></div>
            }
            @case ('skeleton') {
              <div class="skeleton-placeholder">
                <div class="skeleton-shimmer"></div>
              </div>
            }
          }
        </div>
      }

      <!-- Main image with format optimization -->
      <picture 
        #pictureElement
        class="optimized-picture"
        [class.loaded]="isLoaded()"
        [class.loading]="isLoading()"
        [class.error]="hasError()">
        
        <!-- AVIF format (best compression) -->
        @if (config.enableAVIF && avifSrc()) {
          <source 
            [srcset]="avifSrc()" 
            [sizes]="sizes"
            type="image/avif">
        }
        
        <!-- WebP format (good compression, wide support) -->
        @if (config.enableWebP && webpSrc()) {
          <source 
            [srcset]="webpSrc()" 
            [sizes]="sizes"
            type="image/webp">
        }
        
        <!-- Fallback image -->
        <img 
          #imageElement
          [src]="currentSrc()"
          [alt]="alt"
          [width]="imageWidth"
          [height]="imageHeight"
          [loading]="config.enableLazyLoading ? 'lazy' : 'eager'"
          [decoding]="config.priority === 'high' ? 'sync' : 'async'"
          [attr.fetchpriority]="config.priority"
          (load)="onImageLoad($event)"
          (error)="onImageError($event)"
          class="optimized-img"
          [class.fade-in]="config.enableProgressiveLoading">
      </picture>

      <!-- Loading indicator -->
      @if (isLoading() && showLoadingIndicator) {
        <div class="loading-indicator">
          <div class="loading-spinner"></div>
        </div>
      }

      <!-- Error state -->
      @if (hasError()) {
        <div class="error-state">
          <div class="error-icon">⚠️</div>
          <div class="error-message">Failed to load image</div>
          @if (enableRetry) {
            <button (click)="retryLoad()" class="retry-button">Retry</button>
          }
        </div>
      }

      <!-- Performance metrics (development only) -->
      @if (showMetrics && loadMetrics()) {
        <div class="performance-metrics">
          <div class="metric">
            <span class="label">Load Time:</span>
            <span class="value">{{ loadMetrics()?.loadTime }}ms</span>
          </div>
          <div class="metric">
            <span class="label">Format:</span>
            <span class="value">{{ loadMetrics()?.format }}</span>
          </div>
          <div class="metric">
            <span class="label">Size:</span>
            <span class="value">{{ loadMetrics()?.size.width }}x{{ loadMetrics()?.size.height }}</span>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .optimized-image-container {
      position: relative;
      display: inline-block;
      overflow: hidden;
    }

    .optimized-picture {
      display: block;
      width: 100%;
      height: 100%;
    }

    .optimized-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: opacity 0.3s ease-in-out;
    }

    .optimized-img.fade-in {
      opacity: 0;
    }

    .optimized-picture.loaded .optimized-img.fade-in {
      opacity: 1;
    }

    /* Placeholder styles */
    .image-placeholder {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
    }

    .blur-placeholder {
      width: 100%;
      height: 100%;
      background-size: cover;
      background-position: center;
      filter: blur(10px);
      transform: scale(1.1);
      transition: opacity 0.3s ease-in-out;
    }

    .skeleton-placeholder {
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
    }

    .skeleton-shimmer {
      width: 100%;
      height: 100%;
      background: linear-gradient(
        90deg,
        transparent 25%,
        rgba(255, 255, 255, 0.5) 50%,
        transparent 75%
      );
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
    }

    @keyframes shimmer {
      0% {
        background-position: -200% 0;
      }
      100% {
        background-position: 200% 0;
      }
    }

    /* Loading indicator */
    .loading-indicator {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 2;
    }

    .loading-spinner {
      width: 24px;
      height: 24px;
      border: 2px solid #f3f3f3;
      border-top: 2px solid #3498db;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    /* Error state */
    .error-state {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: #f8f9fa;
      color: #6c757d;
      z-index: 3;
    }

    .error-icon {
      font-size: 2rem;
      margin-bottom: 0.5rem;
    }

    .error-message {
      font-size: 0.875rem;
      margin-bottom: 1rem;
      text-align: center;
    }

    .retry-button {
      padding: 0.5rem 1rem;
      background: #007bff;
      color: white;
      border: none;
      border-radius: 0.25rem;
      cursor: pointer;
      font-size: 0.875rem;
      transition: background-color 0.2s;
    }

    .retry-button:hover {
      background: #0056b3;
    }

    /* Performance metrics */
    .performance-metrics {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 0.5rem;
      font-size: 0.75rem;
      z-index: 4;
    }

    .metric {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.25rem;
    }

    .metric:last-child {
      margin-bottom: 0;
    }

    .label {
      font-weight: 500;
    }

    .value {
      font-family: monospace;
    }

    /* Responsive behavior */
    @media (max-width: 768px) {
      .performance-metrics {
        font-size: 0.625rem;
        padding: 0.25rem;
      }
    }
  `]
})
export class OptimizedImageComponent implements OnInit, OnDestroy {
  @ViewChild('imageElement') imageElement!: ElementRef<HTMLImageElement>;
  @ViewChild('pictureElement') pictureElement!: ElementRef<HTMLPictureElement>;

  // Input properties
  @Input({ required: true }) src!: string;
  @Input() alt: string = '';
  @Input() width: string = 'auto';
  @Input() height: string = 'auto';
  @Input() imageWidth?: number;
  @Input() imageHeight?: number;
  @Input() sizes: string = '100vw';
  @Input() containerClass: string = '';
  @Input() showLoadingIndicator: boolean = true;
  @Input() showMetrics: boolean = false;
  @Input() enableRetry: boolean = true;
  @Input() blurDataUrl: string = '';
  
  @Input() config: ImageOptimizationConfig = {
    enableWebP: true,
    enableAVIF: true,
    enableLazyLoading: true,
    enableProgressiveLoading: true,
    quality: 80,
    sizes: ['320w', '640w', '1024w', '1920w'],
    placeholder: 'skeleton',
    priority: 'medium'
  };

  // Output events
  @Output() imageLoad = new EventEmitter<ImageLoadEvent>();
  @Output() imageError = new EventEmitter<Event>();
  @Output() loadStart = new EventEmitter<void>();

  private elementRef = inject(ElementRef);
  private intersectionObserver?: IntersectionObserver;
  private loadStartTime = 0;

  // Signals for reactive state
  private _isLoading = signal(true);
  private _isLoaded = signal(false);
  private _hasError = signal(false);
  private _currentSrc = signal('');
  private _loadMetrics = signal<ImageLoadEvent | null>(null);

  // Computed values
  readonly isLoading = this._isLoading.asReadonly();
  readonly isLoaded = this._isLoaded.asReadonly();
  readonly hasError = this._hasError.asReadonly();
  readonly currentSrc = this._currentSrc.asReadonly();
  readonly loadMetrics = this._loadMetrics.asReadonly();

  // Computed image sources with format optimization
  readonly webpSrc = computed(() => this.generateWebPSrc(this.src));
  readonly avifSrc = computed(() => this.generateAVIFSrc(this.src));

  constructor() {
    // Effect to handle src changes
    effect(() => {
      const src = this.src;
      if (src) {
        this.resetState();
        this.loadImage();
      }
    });
  }

  ngOnInit(): void {
    if (this.config.enableLazyLoading) {
      this.setupIntersectionObserver();
    } else {
      this.loadImage();
    }
  }

  ngOnDestroy(): void {
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
  }

  /**
   * Handle image load event
   */
  onImageLoad(event: Event): void {
    const img = event.target as HTMLImageElement;
    const loadTime = performance.now() - this.loadStartTime;
    
    this._isLoading.set(false);
    this._isLoaded.set(true);
    this._hasError.set(false);

    // Determine the actual format used
    const format = this.determineLoadedFormat(img.currentSrc || img.src);
    
    const metrics: ImageLoadEvent = {
      src: img.src,
      loadTime,
      format,
      size: {
        width: img.naturalWidth,
        height: img.naturalHeight
      }
    };

    this._loadMetrics.set(metrics);
    this.imageLoad.emit(metrics);

    // Log performance metrics
    if (this.config.priority === 'high') {
      console.log(`🖼️ High-priority image loaded in ${loadTime.toFixed(2)}ms (${format})`);
    }
  }

  /**
   * Handle image error event
   */
  onImageError(event: Event): void {
    this._isLoading.set(false);
    this._isLoaded.set(false);
    this._hasError.set(true);
    
    this.imageError.emit(event);
    console.warn('Failed to load image:', this.src);
  }

  /**
   * Retry loading the image
   */
  retryLoad(): void {
    this.resetState();
    this.loadImage();
  }

  /**
   * Get placeholder CSS classes
   */
  getPlaceholderClass(): string {
    const classes = ['image-placeholder'];
    
    if (this.config.placeholder === 'blur') {
      classes.push('blur-placeholder');
    } else if (this.config.placeholder === 'skeleton') {
      classes.push('skeleton-placeholder');
    }

    return classes.join(' ');
  }

  private setupIntersectionObserver(): void {
    if (!('IntersectionObserver' in window)) {
      // Fallback for browsers without IntersectionObserver
      this.loadImage();
      return;
    }

    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.loadImage();
            this.intersectionObserver?.disconnect();
          }
        });
      },
      {
        rootMargin: '50px 0px', // Start loading 50px before entering viewport
        threshold: 0.1
      }
    );

    this.intersectionObserver.observe(this.elementRef.nativeElement);
  }

  private loadImage(): void {
    if (this._isLoaded() || this._isLoading()) {
      return;
    }

    this.loadStartTime = performance.now();
    this._isLoading.set(true);
    this._currentSrc.set(this.src);
    this.loadStart.emit();
  }

  private resetState(): void {
    this._isLoading.set(false);
    this._isLoaded.set(false);
    this._hasError.set(false);
    this._loadMetrics.set(null);
  }

  private generateWebPSrc(src: string): string {
    if (!this.config.enableWebP || !src) return '';
    
    // Simple WebP conversion - in real implementation, this would
    // integrate with your image optimization service
    return src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
  }

  private generateAVIFSrc(src: string): string {
    if (!this.config.enableAVIF || !src) return '';
    
    // Simple AVIF conversion - in real implementation, this would
    // integrate with your image optimization service
    return src.replace(/\.(jpg|jpeg|png|webp)$/i, '.avif');
  }

  private determineLoadedFormat(src: string): string {
    if (src.includes('.avif')) return 'AVIF';
    if (src.includes('.webp')) return 'WebP';
    if (src.includes('.jpg') || src.includes('.jpeg')) return 'JPEG';
    if (src.includes('.png')) return 'PNG';
    if (src.includes('.gif')) return 'GIF';
    if (src.includes('.svg')) return 'SVG';
    return 'Unknown';
  }
}