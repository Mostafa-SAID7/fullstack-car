import {
  Directive,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  OnInit,
  OnDestroy,
  inject,
  signal,
  effect
} from '@angular/core';

export interface LazyLoadConfig {
  rootMargin?: string;
  threshold?: number;
  enableRetry?: boolean;
  maxRetries?: number;
  retryDelay?: number;
  placeholder?: string;
  errorPlaceholder?: string;
}

export interface LazyLoadEvent {
  element: HTMLElement;
  src: string;
  loadTime: number;
  retryCount: number;
}

/**
 * Lazy Media Directive
 * 
 * Provides lazy loading for images, videos, and other media elements
 * using Intersection Observer API with retry logic and error handling
 */
@Directive({
  selector: '[lazyMedia]',
  standalone: true
})
export class LazyMediaDirective implements OnInit, OnDestroy {
  private elementRef = inject(ElementRef);
  
  @Input() lazyMedia!: string; // The actual src to load
  @Input() lazySrc?: string; // Alternative syntax
  @Input() lazyConfig: LazyLoadConfig = {};
  @Input() lazyPlaceholder?: string;
  @Input() lazyErrorPlaceholder?: string;

  @Output() lazyLoad = new EventEmitter<LazyLoadEvent>();
  @Output() lazyError = new EventEmitter<{ element: HTMLElement; error: string | Event; retryCount: number }>();
  @Output() lazyRetry = new EventEmitter<{ element: HTMLElement; retryCount: number }>();

  private intersectionObserver?: IntersectionObserver;
  private loadStartTime = 0;
  private retryCount = 0;
  private retryTimeout?: number;

  // Signals for reactive state
  private _isLoading = signal(false);
  private _isLoaded = signal(false);
  private _hasError = signal(false);

  readonly isLoading = this._isLoading.asReadonly();
  readonly isLoaded = this._isLoaded.asReadonly();
  readonly hasError = this._hasError.asReadonly();

  // Default configuration
  private defaultConfig: Required<LazyLoadConfig> = {
    rootMargin: '50px 0px',
    threshold: 0.1,
    enableRetry: true,
    maxRetries: 3,
    retryDelay: 1000,
    placeholder: '',
    errorPlaceholder: ''
  };

  constructor() {
    // Effect to handle configuration changes
    effect(() => {
      if (this._hasError() && this.config.enableRetry && this.retryCount < this.config.maxRetries) {
        this.scheduleRetry();
      }
    });
  }

  ngOnInit(): void {
    this.setupLazyLoading();
  }

  ngOnDestroy(): void {
    this.cleanup();
  }

  private get config(): Required<LazyLoadConfig> {
    return {
      ...this.defaultConfig,
      ...this.lazyConfig,
      placeholder: this.lazyPlaceholder || this.lazyConfig.placeholder || this.defaultConfig.placeholder,
      errorPlaceholder: this.lazyErrorPlaceholder || this.lazyConfig.errorPlaceholder || this.defaultConfig.errorPlaceholder
    };
  }

  private get targetSrc(): string {
    return this.lazyMedia || this.lazySrc || '';
  }

  private setupLazyLoading(): void {
    const element = this.elementRef.nativeElement;
    
    // Set initial placeholder if provided
    if (this.config.placeholder) {
      this.setElementSrc(this.config.placeholder);
    }

    // Check if IntersectionObserver is supported
    if (!('IntersectionObserver' in window)) {
      // Fallback: load immediately
      this.loadMedia();
      return;
    }

    // Set up intersection observer
    this.intersectionObserver = new IntersectionObserver(
      (entries) => this.handleIntersection(entries),
      {
        rootMargin: this.config.rootMargin,
        threshold: this.config.threshold
      }
    );

    this.intersectionObserver.observe(element);
  }

  private handleIntersection(entries: IntersectionObserverEntry[]): void {
    entries.forEach(entry => {
      if (entry.isIntersecting && !this._isLoaded() && !this._isLoading()) {
        this.loadMedia();
        // Stop observing once we start loading
        if (this.intersectionObserver) {
          this.intersectionObserver.unobserve(entry.target);
        }
      }
    });
  }

  private loadMedia(): void {
    if (!this.targetSrc || this._isLoaded() || this._isLoading()) {
      return;
    }

    const element = this.elementRef.nativeElement;
    this.loadStartTime = performance.now();
    this._isLoading.set(true);
    this._hasError.set(false);

    // Handle different element types
    if (element.tagName.toLowerCase() === 'img') {
      this.loadImage(element as HTMLImageElement);
    } else if (element.tagName.toLowerCase() === 'video') {
      this.loadVideo(element as HTMLVideoElement);
    } else if (element.tagName.toLowerCase() === 'iframe') {
      this.loadIframe(element as HTMLIFrameElement);
    } else {
      // Generic element with background image
      this.loadBackgroundImage(element);
    }
  }

  private loadImage(img: HTMLImageElement): void {
    const tempImg = new Image();
    
    tempImg.onload = () => {
      this.setElementSrc(this.targetSrc);
      this.onLoadSuccess();
    };
    
    tempImg.onerror = (error) => {
      this.onLoadError(error);
    };
    
    tempImg.src = this.targetSrc;
  }

  private loadVideo(video: HTMLVideoElement): void {
    const handleLoad = () => {
      this.onLoadSuccess();
      video.removeEventListener('loadeddata', handleLoad);
      video.removeEventListener('error', handleError);
    };

    const handleError = (error: Event) => {
      this.onLoadError(error);
      video.removeEventListener('loadeddata', handleLoad);
      video.removeEventListener('error', handleError);
    };

    video.addEventListener('loadeddata', handleLoad);
    video.addEventListener('error', handleError);
    
    this.setElementSrc(this.targetSrc);
  }

  private loadIframe(iframe: HTMLIFrameElement): void {
    const handleLoad = () => {
      this.onLoadSuccess();
      iframe.removeEventListener('load', handleLoad);
      iframe.removeEventListener('error', handleError);
    };

    const handleError = (error: Event) => {
      this.onLoadError(error);
      iframe.removeEventListener('load', handleLoad);
      iframe.removeEventListener('error', handleError);
    };

    iframe.addEventListener('load', handleLoad);
    iframe.addEventListener('error', handleError);
    
    this.setElementSrc(this.targetSrc);
  }

  private loadBackgroundImage(element: HTMLElement): void {
    const tempImg = new Image();
    
    tempImg.onload = () => {
      element.style.backgroundImage = `url(${this.targetSrc})`;
      this.onLoadSuccess();
    };
    
    tempImg.onerror = (error) => {
      this.onLoadError(error);
    };
    
    tempImg.src = this.targetSrc;
  }

  private setElementSrc(src: string): void {
    const element = this.elementRef.nativeElement;
    
    if (element.tagName.toLowerCase() === 'img') {
      (element as HTMLImageElement).src = src;
    } else if (element.tagName.toLowerCase() === 'video') {
      (element as HTMLVideoElement).src = src;
    } else if (element.tagName.toLowerCase() === 'iframe') {
      (element as HTMLIFrameElement).src = src;
    } else {
      element.style.backgroundImage = `url(${src})`;
    }
  }

  private onLoadSuccess(): void {
    const loadTime = performance.now() - this.loadStartTime;
    
    this._isLoading.set(false);
    this._isLoaded.set(true);
    this._hasError.set(false);

    const event: LazyLoadEvent = {
      element: this.elementRef.nativeElement,
      src: this.targetSrc,
      loadTime,
      retryCount: this.retryCount
    };

    this.lazyLoad.emit(event);

    // Log performance metrics for high-priority images
    if (loadTime > 1000) {
      console.warn(`🐌 Slow lazy load: ${this.targetSrc} took ${loadTime.toFixed(2)}ms`);
    }
  }

  private onLoadError(error: string | Event): void {
    this._isLoading.set(false);
    this._hasError.set(true);

    // Set error placeholder if provided
    if (this.config.errorPlaceholder) {
      this.setElementSrc(this.config.errorPlaceholder);
    }

    this.lazyError.emit({
      element: this.elementRef.nativeElement,
      error,
      retryCount: this.retryCount
    });

    const errorMessage = typeof error === 'string' ? error : 'Failed to load media';
    console.warn(`Failed to lazy load: ${this.targetSrc} (attempt ${this.retryCount + 1}) - ${errorMessage}`);
  }

  private scheduleRetry(): void {
    if (this.retryTimeout) {
      clearTimeout(this.retryTimeout);
    }

    const delay = this.config.retryDelay * Math.pow(2, this.retryCount); // Exponential backoff
    
    this.retryTimeout = window.setTimeout(() => {
      this.retryCount++;
      this._hasError.set(false);
      
      this.lazyRetry.emit({
        element: this.elementRef.nativeElement,
        retryCount: this.retryCount
      });
      
      this.loadMedia();
    }, delay);
  }

  private cleanup(): void {
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
    
    if (this.retryTimeout) {
      clearTimeout(this.retryTimeout);
    }
  }
}

/**
 * Lazy Background Directive
 * 
 * Specialized directive for lazy loading background images
 */
@Directive({
  selector: '[lazyBackground]',
  standalone: true
})
export class LazyBackgroundDirective implements OnInit, OnDestroy {
  private elementRef = inject(ElementRef);
  
  @Input() lazyBackground!: string;
  @Input() lazyBackgroundConfig: LazyLoadConfig = {};

  @Output() backgroundLoad = new EventEmitter<LazyLoadEvent>();
  @Output() backgroundError = new EventEmitter<string | Event>();

  private intersectionObserver?: IntersectionObserver;
  private loadStartTime = 0;

  ngOnInit(): void {
    this.setupLazyLoading();
  }

  ngOnDestroy(): void {
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
  }

  private setupLazyLoading(): void {
    if (!('IntersectionObserver' in window)) {
      this.loadBackground();
      return;
    }

    const config = {
      rootMargin: '50px 0px',
      threshold: 0.1,
      ...this.lazyBackgroundConfig
    };

    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.loadBackground();
            this.intersectionObserver?.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: config.rootMargin,
        threshold: config.threshold
      }
    );

    this.intersectionObserver.observe(this.elementRef.nativeElement);
  }

  private loadBackground(): void {
    if (!this.lazyBackground) return;

    this.loadStartTime = performance.now();
    const element = this.elementRef.nativeElement;
    
    const tempImg = new Image();
    
    tempImg.onload = () => {
      element.style.backgroundImage = `url(${this.lazyBackground})`;
      element.classList.add('lazy-loaded');
      
      const loadTime = performance.now() - this.loadStartTime;
      
      this.backgroundLoad.emit({
        element,
        src: this.lazyBackground,
        loadTime,
        retryCount: 0
      });
    };
    
    tempImg.onerror = (error) => {
      element.classList.add('lazy-error');
      this.backgroundError.emit(error);
    };
    
    tempImg.src = this.lazyBackground;
  }
}