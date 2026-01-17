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
  templateUrl: './cls-optimized-image.component.html',
  styleUrls: ['./cls-optimized-image.component.scss'],
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