import { 
  Directive, 
  Input, 
  ViewContainerRef, 
  OnInit, 
  OnDestroy, 
  inject,
  signal,
  effect,
  Type
} from '@angular/core';
import { LazyLoadingService } from '../../core/services/lazy-loading.service';
import { ComponentLoader, ComponentLoaderConfig } from '../../core/utils/component-loader.util';

/**
 * Lazy Load Directive
 * 
 * Declaratively load components lazily with Angular 19 signals
 * 
 * Usage:
 * <div *lazyLoad="'MyComponent'; module: 'my-module'; config: loadConfig"></div>
 */
@Directive({
  selector: '[lazyLoad]',
  standalone: true
})
export class LazyLoadDirective implements OnInit, OnDestroy {
  private viewContainer = inject(ViewContainerRef);
  private lazyLoadingService = inject(LazyLoadingService);
  private componentLoader = new ComponentLoader();

  // Inputs using Angular 19 signal-based approach
  @Input({ required: true }) lazyLoad!: string; // Component name
  @Input({ required: true }) module!: string; // Module name
  @Input() importFn?: () => Promise<{ [key: string]: Type<any> }>;
  @Input() config: ComponentLoaderConfig = {};
  @Input() loadImmediately: boolean = true;
  @Input() preload: boolean = false;

  // Internal signals
  private _loading = signal(false);
  private _loaded = signal(false);
  private _error = signal<string | null>(null);

  // Public readonly signals
  readonly loading = this._loading.asReadonly();
  readonly loaded = this._loaded.asReadonly();
  readonly error = this._error.asReadonly();

  constructor() {
    // React to loading state changes
    effect(() => {
      if (this._loading()) {
        this.showLoadingState();
      }
    });

    // React to error state changes
    effect(() => {
      const error = this._error();
      if (error) {
        this.showErrorState(error);
      }
    });
  }

  async ngOnInit(): Promise<void> {
    if (!this.importFn) {
      this._error.set('Import function is required for lazy loading');
      return;
    }

    if (this.preload) {
      this.preloadComponent();
    }

    if (this.loadImmediately) {
      await this.loadComponent();
    }
  }

  ngOnDestroy(): void {
    this.viewContainer.clear();
  }

  /**
   * Manually trigger component loading
   */
  async loadComponent(): Promise<void> {
    if (this._loaded() || this._loading() || !this.importFn) {
      return;
    }

    this._loading.set(true);
    this._error.set(null);

    try {
      await this.componentLoader.loadComponent(
        this.viewContainer,
        this.importFn,
        this.lazyLoad,
        this.module,
        {
          ...this.config,
          showLoadingIndicator: false // We handle loading state ourselves
        }
      );

      this._loaded.set(true);
      this._loading.set(false);
    } catch (error) {
      this._loading.set(false);
      this._error.set(error instanceof Error ? error.message : 'Failed to load component');
    }
  }

  /**
   * Preload the component without rendering
   */
  async preloadComponent(): Promise<void> {
    if (!this.importFn) return;

    try {
      await this.componentLoader.preloadComponent(this.importFn, this.module);
    } catch (error) {
      console.warn(`Failed to preload component ${this.lazyLoad}:`, error);
    }
  }

  /**
   * Retry loading after an error
   */
  async retry(): Promise<void> {
    this._error.set(null);
    await this.loadComponent();
  }

  private showLoadingState(): void {
    this.viewContainer.clear();
    
    const loadingTemplate = this.config.loadingTemplate || `
      <div class="lazy-load-spinner" style="
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2rem;
        color: #6b7280;
      ">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span class="ml-2">Loading ${this.lazyLoad}...</span>
      </div>
    `;

    const div = document.createElement('div');
    div.innerHTML = loadingTemplate;
    div.className = 'lazy-load-loading';
    
    const container = this.viewContainer.element.nativeElement;
    container.appendChild(div);
  }

  private showErrorState(error: string): void {
    this.viewContainer.clear();
    
    const errorTemplate = this.config.errorTemplate || `
      <div class="lazy-load-error" style="
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 2rem;
        color: #dc2626;
        background-color: #fef2f2;
        border: 1px solid #fecaca;
        border-radius: 0.5rem;
        margin: 1rem;
      ">
        <div class="text-lg font-semibold mb-2">Failed to load ${this.lazyLoad}</div>
        <div class="text-sm text-gray-600 mb-4">${error}</div>
        <button class="retry-btn px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors">
          Retry
        </button>
      </div>
    `;

    const div = document.createElement('div');
    div.innerHTML = errorTemplate;
    div.className = 'lazy-load-error-container';
    
    // Add retry functionality
    const retryButton = div.querySelector('.retry-btn');
    if (retryButton) {
      retryButton.addEventListener('click', () => {
        this.retry();
      });
    }
    
    const container = this.viewContainer.element.nativeElement;
    container.appendChild(div);
  }
}

/**
 * Lazy Load Trigger Directive
 * 
 * Triggers lazy loading based on intersection observer (viewport visibility)
 * 
 * Usage:
 * <div *lazyLoadTrigger="loadConfig" (onVisible)="loadMyComponent()"></div>
 */
@Directive({
  selector: '[lazyLoadTrigger]',
  standalone: true
})
export class LazyLoadTriggerDirective implements OnInit, OnDestroy {
  @Input() lazyLoadTrigger: { threshold?: number; rootMargin?: string } = {};
  @Input() once: boolean = true;

  private observer?: IntersectionObserver;
  private element = inject(ViewContainerRef).element.nativeElement;
  private hasTriggered = false;

  ngOnInit(): void {
    this.setupIntersectionObserver();
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  private setupIntersectionObserver(): void {
    const options = {
      threshold: this.lazyLoadTrigger.threshold || 0.1,
      rootMargin: this.lazyLoadTrigger.rootMargin || '50px'
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && (!this.once || !this.hasTriggered)) {
          this.hasTriggered = true;
          this.element.dispatchEvent(new CustomEvent('onVisible', {
            detail: { entry }
          }));
          
          if (this.once && this.observer) {
            this.observer.disconnect();
          }
        }
      });
    }, options);

    this.observer.observe(this.element);
  }
}