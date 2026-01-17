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
import { SkeletonLoaderComponent } from '../skeleton-loader/skeleton-loader.component';

export interface CLSImageConfig {
  enableLazyLoading: boolean;
  enableWebP: boolean;
  enableAVIF: boolean;
  enableBlurPlaceholder: boolean;
  quality: number;
  priority: 'high' | 'medium' | 'low';
  sizes: string;
  aspectRatio?: string;
  objectFit: 'cover' | 'contain' | 'fill' | 'scale-down' | 'none';
}

export interface ImageDimensions {
  width: number;
  height: number;
  aspectRatio: number;
}

/**
 * CLS Optimized Image Component
 * 
 * Prevents Cumulative Layout Shift by:
 * - Reserving exact space before image loads
 * - Using proper width/height attributes
 * - Implementing skeleton loading states
 * - Supporting responsive images with srcset
 * - Optimizing format delivery (WebP/AVIF)
 * - Providing blur-up placeholder effect
 */
@Component({
  selector: 'app-cls-optimized-image',
  standalone: true,
  imports: [CommonModule, SkeletonLoaderComponent],
  template: `
    <div 
      class="cls-image-container"
      [class]="containerClasses()"
      [style.width]="containerWidth()"
      [style.height]="containerHeight()"
      [style.aspect-ratio]="config.aspectRatio || computedAspectRatio()"
      [style.max-width]="maxWidth || '100%'">
      
      <!-- Blur placeholder (shown while loading) -->
      @if (config.enableBlurPlaceholder && blurDataUrl && isLoading()) {
        <div 
          class="blur-placeholder"
          [style.background-image]="'url(' + blurDataUrl + ')'"
          [style.aspect-ratio]="config.aspectRatio || computedAspectRatio()">
        </div>
      }
      
      <!-- Skeleton loader (alternative to blur placeholder) -->
      @if (!config.enableBlurPlaceholder && isLoading()) {
        <app-skeleton-loader
          [config]="{
            variant: 'rectangular',
            width: '100%',
            height: containerHeight(),
            aspectRatio: config.aspectRatio || computedAspectRatio(),
            animation: 'wave'
          }"
          [ariaLabel]="'Loading image: ' + alt">
        </app-skeleton-loader>
      }
      
      <!-- Main image with format optimization -->
      <picture 
        class="cls-image-picture"
        [class.loaded]="isLoaded()"
        [class.loading]="isLoading()"
        [class.error]="hasError()">
        
        <!-- AVIF format (best compression) -->
        @if (config.enableAVIF && avifSrcset()) {
          <source 
            [srcset]="avifSrcset()" 
            [sizes]="config.sizes"
            type="image/avif">
        }
        
        <!-- WebP format (good compression, wide support) -->
        @if (config.enableWebP && webpSrcset()) {
          <source 
            [srcset]="webpSrcset()" 
            [sizes]="config.sizes"
            type="image/webp">
        }
        
        <!-- Fallback image -->
        <img 
          #imageElement
          [src]="src"
          [srcset]="srcset"
          [sizes]="config.sizes"
          [alt]="alt"
          [width]="width"
          [height]="height"
          [loading]="config.enableLazyLoading ? 'lazy' : 'eager'"
          [decoding]="config.priority === 'high' ? 'sync' : 'async'"
          [attr.fetchpriority]="config.priority"
          [style.object-fit]="config.objectFit"
          [style.width]="'100%'"
          [style.height]="'100%'"
          (load)="onImageLoad($event)"
          (error)="onImageError($event)"
          class="cls-optimized-img">
      </picture>

      <!-- Loading indicator -->
      @if (showLoadingIndicator && isLoading()) {
        <div class="loading-indicator">
          <div class="loading-spinner"></div>
        </div>
      }

      <!-- Error state -->
      @if (hasError()) {
        <div class="error-state">
          <div class="error-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <div class="error-message">Failed to load image</div>
          @if (enableRetry) {
            <button (click)="retryLoad()" class="retry-button">
              Retry
            </button>
          }
        </div>
      }

      <!-- Image info overlay (development only) -->
      @if (showImageInfo && isLoaded() && imageDimensions()) {
        <div class="image-info-overlay">
          <div class="info-item">
            <span class="label">Size:</span>
            <span class="value">{{ imageDimensions()!.width }}×{{ imageDimensions()!.height }}</span>
          </div>
          <div class="info-item">
            <span class="label">Ratio:</span>
            <span class="value">{{ imageDimensions()!.aspectRatio.toFixed(2) }}</span>
          </div>
          <div class="info-item">
            <span class="label">Format:</span>
            <span class="value">{{ detectedFormat() }}</span>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .cls-image-container {
      position: relative;
      display: block;
      overflow: hidden;
      background-color: #f3f4f6;
    }

    .blur-placeholder {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      filter: blur(10px);
      transform: scale(1.1);
      z-index: 1;
      transition: opacity 0.3s ease-in-out;
    }

    .cls-image-picture {
      position: relative;
      display: block;
      width: 100%;
      height: 100%;
      z-index: 2;
    }

    .cls-optimized-img {
      display: block;
      width: 100%;
      height: 100%;
      transition: opacity 0.3s ease-in-out;
    }

    .cls-image-picture.loading .cls-optimized-img {
      opacity: 0;
    }

    .cls-image-picture.loaded .cls-optimized-img {
      opacity: 1;
    }

    .cls-image-picture.loaded ~ .blur-placeholder {
      opacity: 0;
    }

    /* Loading indicator */
    .loading-indicator {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 3;
    }

    .loading-spinner {
      width: 24px;
      height: 24px;
      border: 2px solid #e5e7eb;
      border-top: 2px solid #3b82f6;
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
      background: #f9fafb;
      color: #6b7280;
      z-index: 4;
    }

    .error-icon {
      margin-bottom: 0.5rem;
      color: #ef4444;
    }

    .error-message {
      font-size: 0.875rem;
      margin-bottom: 1rem;
      text-align: center;
    }

    .retry-button {
      padding: 0.5rem 1rem;
      background: #3b82f6;
      color: white;
      border: none;
      border-radius: 0.375rem;
      cursor: pointer;
      font-size: 0.875rem;
      transition: background-color 0.2s;
    }

    .retry-button:hover {
      background: #2563eb;
    }

    .retry-button:focus {
      outline: 2px solid #3b82f6;
      outline-offset: 2px;
    }

    /* Image info overlay */
    .image-info-overlay {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 0.5rem;
      font-size: 0.75rem;
      font-family: monospace;
      z-index: 5;
    }

    .info-item {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.25rem;
    }

    .info-item:last-child {
      margin-bottom: 0;
    }

    .info-item .label {
      font-weight: 500;
    }

    .info-item .value {
      font-weight: 700;
    }

    /* Dark mode support */
    .dark .cls-image-container {
      background-color: #374151;
    }

    .dark .error-state {
      background: #1f2937;
      color: #9ca3af;
    }

    .dark .loading-spinner {
      border-color: #4b5563;
      border-top-color: #60a5fa;
    }

    /* High contrast mode */
    .high-contrast .cls-image-container {
      background-color: #000;
      border: 2px solid #fff;
    }

    .high-contrast .error-state {
      background: #000;
      color: #fff;
      border: 2px solid #fff;
    }

    /* Reduced motion */
    @media (prefers-reduced-motion: reduce) {
      .cls-optimized-img,
      .blur-placeholder {
        transition: none;
      }

      .loading-spinner {
        animation: none;
        border: 2px solid #3b82f6;
      }
    }

    /* Responsive behavior */
    @media (max-width: 768px) {
      .image-info-overlay {
        font-size: 0.625rem;
        padding: 0.25rem;
      }

      .loading-spinner {
        width: 20px;
        height: 20px;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CLSOptimizedImageComponent implements OnInit, OnDestroy {
  @ViewChild('imageElement') imageElement!: ElementRef<HTMLImageElement>;

  // Required inputs
  @Input({ required: true }) src!: string;
  @Input({ required: true }) alt!: string;
  @Input({ required: true }) width!: number;
  @Input({ required: true }) height!: number;

  // Optional inputs
  @Input() srcset?: string;
  @Input() maxWidth?: string;
  @Input() blurDataUrl?: string;
  @Input() showLoadingIndicator: boolean = false;
  @Input() showImageInfo: boolean = false;
  @Input() enableRetry: boolean = true;

  @Input() config: CLSImageConfig = {
    enableLazyLoading: true,
    enableWebP: true,
    enableAVIF: true,
    enableBlurPlaceholder: true,
    quality: 80,
    priority: 'medium',
    sizes: '100vw',
    objectFit: 'cover'
  };

  // Output events
  @Output() imageLoad = new EventEmitter<Event>();
  @Output() imageError = new EventEmitter<Event>();
  @Output() loadStart = new EventEmitter<void>();

  private elementRef = inject(ElementRef);
  private intersectionObserver?: IntersectionObserver;

  // Signals for reactive state
  private _isLoading = signal<boolean>(true);
  private _isLoaded = signal<boolean>(false);
  private _hasError = signal<boolean>(false);
  private _imageDimensions = signal<ImageDimensions | null>(null);
  private _detectedFormat = signal<string>('');

  // Computed values
  readonly isLoading = this._isLoading.asReadonly();
  readonly isLoaded = this._isLoaded.asReadonly();
  readonly hasError = this._hasError.asReadonly();
  readonly imageDimensions = this._imageDimensions.asReadonly();
  readonly detectedFormat = this._detectedFormat.asReadonly();

  readonly containerClasses = computed(() => {
    const classes = ['cls-image-container'];
    
    if (this.config.enableLazyLoading) {
      classes.push('lazy-loading');
    }
    
    if (this.config.priority === 'high') {
      classes.push('high-priority');
    }
    
    return classes.join(' ');
  });

  readonly containerWidth = computed(() => {
    return this.maxWidth || `${this.width}px`;
  });

  readonly containerHeight = computed(() => {
    if (this.config.aspectRatio) {
      return 'auto';
    }
    return `${this.height}px`;
  });

  readonly computedAspectRatio = computed(() => {
    if (this.config.aspectRatio) {
      return this.config.aspectRatio;
    }
    return `${this.width} / ${this.height}`;
  });

  readonly webpSrcset = computed(() => {
    if (!this.config.enableWebP) return '';
    return this.generateWebPSrcset(this.srcset || this.src);
  });

  readonly avifSrcset = computed(() => {
    if (!this.config.enableAVIF) return '';
    return this.generateAVIFSrcset(this.srcset || this.src);
  });

  constructor() {
    // Effect to handle src changes
    effect(() => {
      const src = this.src;
      if (src) {
        this.resetState();
        if (!this.config.enableLazyLoading) {
          this.startLoading();
        }
      }
    });
  }

  ngOnInit(): void {
    if (this.config.enableLazyLoading) {
      this.setupIntersectionObserver();
    } else {
      this.startLoading();
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
    
    this._isLoading.set(false);
    this._isLoaded.set(true);
    this._hasError.set(false);

    // Store image dimensions
    const dimensions: ImageDimensions = {
      width: img.naturalWidth,
      height: img.naturalHeight,
      aspectRatio: img.naturalWidth / img.naturalHeight
    };
    this._imageDimensions.set(dimensions);

    // Detect format
    const format = this.determineImageFormat(img.currentSrc || img.src);
    this._detectedFormat.set(format);

    this.imageLoad.emit(event);

    // Log for high-priority images
    if (this.config.priority === 'high') {
      console.log(`🖼️ High-priority image loaded: ${format} (${dimensions.width}×${dimensions.height})`);
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
    this.startLoading();
  }

  private setupIntersectionObserver(): void {
    if (!('IntersectionObserver' in window)) {
      this.startLoading();
      return;
    }

    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.startLoading();
            this.intersectionObserver?.disconnect();
          }
        });
      },
      {
        rootMargin: '50px 0px',
        threshold: 0.1
      }
    );

    this.intersectionObserver.observe(this.elementRef.nativeElement);
  }

  private startLoading(): void {
    if (this._isLoaded() || this._isLoading()) {
      return;
    }

    this._isLoading.set(true);
    this.loadStart.emit();
  }

  private resetState(): void {
    this._isLoading.set(false);
    this._isLoaded.set(false);
    this._hasError.set(false);
    this._imageDimensions.set(null);
    this._detectedFormat.set('');
  }

  private generateWebPSrcset(srcset: string): string {
    if (!srcset) return '';
    
    return srcset.replace(/\.(jpg|jpeg|png)/gi, '.webp');
  }

  private generateAVIFSrcset(srcset: string): string {
    if (!srcset) return '';
    
    return srcset.replace(/\.(jpg|jpeg|png|webp)/gi, '.avif');
  }

  private determineImageFormat(src: string): string {
    if (src.includes('.avif')) return 'AVIF';
    if (src.includes('.webp')) return 'WebP';
    if (src.includes('.jpg') || src.includes('.jpeg')) return 'JPEG';
    if (src.includes('.png')) return 'PNG';
    if (src.includes('.gif')) return 'GIF';
    if (src.includes('.svg')) return 'SVG';
    return 'Unknown';
  }
}