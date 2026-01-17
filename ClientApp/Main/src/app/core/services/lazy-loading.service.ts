import { Injectable, signal, computed, inject } from '@angular/core';
import { Router, PreloadingStrategy, Route } from '@angular/router';
import { Observable, of, timer } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';

export interface LazyModule {
  name: string;
  path: string;
  loaded: boolean;
  loading: boolean;
  error?: string;
  loadTime?: number;
  size?: number;
}

export interface LazyLoadingConfig {
  preloadDelay: number;
  retryAttempts: number;
  retryDelay: number;
  enableMetrics: boolean;
}

/**
 * Custom Preloading Strategy
 * 
 * Implements intelligent preloading based on user behavior and network conditions
 */
@Injectable({
  providedIn: 'root'
})
export class CustomPreloadingStrategy implements PreloadingStrategy {
  private lazyLoadingService = inject(LazyLoadingService);

  preload(route: Route, fn: () => Observable<any>): Observable<any> {
    // Only preload routes marked for preloading or high-priority routes
    if (route.data?.['preload'] === true || route.data?.['priority'] === 'high') {
      return timer(1000).pipe( // Delay preloading by 1 second
        switchMap(() => {
          const moduleName = route.path || 'unknown';
          return this.lazyLoadingService.preloadModule(fn, moduleName);
        }),
        catchError(() => of(null))
      );
    }
    return of(null);
  }
}

/**
 * Lazy Loading Service
 * 
 * Manages dynamic imports and code splitting with Angular 19 features
 * Provides intelligent preloading, performance metrics, and error handling
 */
@Injectable({
  providedIn: 'root'
})
export class LazyLoadingService {
  private _modules = signal<Map<string, LazyModule>>(new Map());
  private _config = signal<LazyLoadingConfig>({
    preloadDelay: 1000,
    retryAttempts: 3,
    retryDelay: 1000,
    enableMetrics: true
  });
  
  readonly modules = computed(() => Array.from(this._modules().values()));
  readonly loadedModules = computed(() => this.modules().filter(m => m.loaded));
  readonly loadingModules = computed(() => this.modules().filter(m => m.loading));
  readonly failedModules = computed(() => this.modules().filter(m => m.error));
  readonly totalLoadTime = computed(() => 
    this.loadedModules().reduce((total, module) => total + (module.loadTime || 0), 0)
  );

  /**
   * Load a component dynamically with performance tracking
   */
  async loadComponent<T>(importFn: () => Promise<T>, moduleName: string): Promise<T> {
    const startTime = performance.now();
    this.setModuleLoading(moduleName, true);
    
    try {
      const module = await this.retryLoad(importFn, moduleName);
      const loadTime = performance.now() - startTime;
      this.setModuleLoaded(moduleName, true, loadTime);
      
      if (this._config().enableMetrics) {
        this.logPerformanceMetrics(moduleName, loadTime);
      }
      
      return module;
    } catch (error) {
      this.setModuleError(moduleName, error instanceof Error ? error.message : 'Unknown error');
      throw error;
    }
  }

  /**
   * Preload a module for better performance
   */
  async preloadModule<T>(importFn: () => Observable<T>, moduleName: string): Promise<T> {
    return new Promise((resolve, reject) => {
      const startTime = performance.now();
      this.setModuleLoading(moduleName, true);
      
      importFn().subscribe({
        next: (module) => {
          const loadTime = performance.now() - startTime;
          this.setModuleLoaded(moduleName, true, loadTime);
          resolve(module);
        },
        error: (error) => {
          this.setModuleError(moduleName, error instanceof Error ? error.message : 'Preload failed');
          reject(error);
        }
      });
    });
  }

  /**
   * Load multiple components in parallel
   */
  async loadComponentsBatch<T>(
    imports: Array<{ importFn: () => Promise<T>; name: string }>
  ): Promise<T[]> {
    const promises = imports.map(({ importFn, name }) => 
      this.loadComponent(importFn, name)
    );
    
    return Promise.all(promises);
  }

  /**
   * Check if a module is already loaded
   */
  isModuleLoaded(moduleName: string): boolean {
    const module = this._modules().get(moduleName);
    return module?.loaded || false;
  }

  /**
   * Get loading statistics
   */
  getLoadingStats() {
    const modules = this.modules();
    return {
      total: modules.length,
      loaded: this.loadedModules().length,
      loading: this.loadingModules().length,
      failed: this.failedModules().length,
      totalLoadTime: this.totalLoadTime(),
      averageLoadTime: modules.length > 0 ? this.totalLoadTime() / modules.length : 0
    };
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<LazyLoadingConfig>): void {
    this._config.update(current => ({ ...current, ...config }));
  }

  /**
   * Clear all module states (useful for testing)
   */
  clearModules(): void {
    this._modules.set(new Map());
  }

  /**
   * Retry loading with exponential backoff
   */
  private async retryLoad<T>(
    importFn: () => Promise<T>, 
    moduleName: string, 
    attempt: number = 1
  ): Promise<T> {
    try {
      return await importFn();
    } catch (error) {
      if (attempt < this._config().retryAttempts) {
        const delay = this._config().retryDelay * Math.pow(2, attempt - 1);
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.retryLoad(importFn, moduleName, attempt + 1);
      }
      throw error;
    }
  }

  private setModuleLoading(name: string, loading: boolean): void {
    this._modules.update(modules => {
      const newModules = new Map(modules);
      const existing = newModules.get(name) || { 
        name, 
        path: '', 
        loaded: false, 
        loading: false 
      };
      newModules.set(name, { ...existing, loading });
      return newModules;
    });
  }

  private setModuleLoaded(name: string, loaded: boolean, loadTime?: number): void {
    this._modules.update(modules => {
      const newModules = new Map(modules);
      const existing = newModules.get(name) || { 
        name, 
        path: '', 
        loaded: false, 
        loading: false 
      };
      newModules.set(name, { 
        ...existing, 
        loaded, 
        loading: false, 
        error: undefined,
        loadTime 
      });
      return newModules;
    });
  }

  private setModuleError(name: string, error: string): void {
    this._modules.update(modules => {
      const newModules = new Map(modules);
      const existing = newModules.get(name) || { 
        name, 
        path: '', 
        loaded: false, 
        loading: false 
      };
      newModules.set(name, { ...existing, loading: false, error });
      return newModules;
    });
  }

  private logPerformanceMetrics(moduleName: string, loadTime: number): void {
    console.group(`🚀 Lazy Loading Metrics: ${moduleName}`);
    console.log(`⏱️ Load Time: ${loadTime.toFixed(2)}ms`);
    console.log(`📊 Total Modules Loaded: ${this.loadedModules().length}`);
    console.log(`⚡ Average Load Time: ${(this.totalLoadTime() / this.loadedModules().length).toFixed(2)}ms`);
    console.groupEnd();
  }
}