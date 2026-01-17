import { Injectable, signal, computed, inject } from '@angular/core';
import { LazyLoadingService } from './lazy-loading.service';

export interface DynamicFeature {
  name: string;
  description: string;
  importPath: string;
  size?: number;
  dependencies?: string[];
  priority: 'high' | 'medium' | 'low';
}

export interface ImportResult<T = any> {
  module: T;
  loadTime: number;
  size?: number;
}

/**
 * Dynamic Import Service
 * 
 * Manages dynamic imports for heavy features with intelligent loading strategies
 */
@Injectable({
  providedIn: 'root'
})
export class DynamicImportService {
  private lazyLoadingService = inject(LazyLoadingService);
  
  private _features = signal<Map<string, DynamicFeature>>(new Map());
  private _importCache = signal<Map<string, any>>(new Map());
  
  readonly features = computed(() => Array.from(this._features().values()));
  readonly cachedImports = computed(() => Array.from(this._importCache().keys()));

  /**
   * Register a dynamic feature for lazy loading
   */
  registerFeature(feature: DynamicFeature): void {
    this._features.update(features => {
      const newFeatures = new Map(features);
      newFeatures.set(feature.name, feature);
      return newFeatures;
    });
  }

  /**
   * Import a feature dynamically with caching
   */
  async importFeature<T = any>(featureName: string): Promise<ImportResult<T>> {
    const feature = this._features().get(featureName);
    if (!feature) {
      throw new Error(`Feature '${featureName}' not registered`);
    }

    // Check cache first
    const cached = this._importCache().get(featureName);
    if (cached) {
      return {
        module: cached,
        loadTime: 0, // Cached, no load time
        size: feature.size
      };
    }

    const startTime = performance.now();

    try {
      // Dynamic import based on feature configuration
      const module = await this.performDynamicImport<T>(feature);
      const loadTime = performance.now() - startTime;

      // Cache the result
      this._importCache.update(cache => {
        const newCache = new Map(cache);
        newCache.set(featureName, module);
        return newCache;
      });

      return {
        module,
        loadTime,
        size: feature.size
      };
    } catch (error) {
      throw new Error(`Failed to import feature '${featureName}': ${error}`);
    }
  }

  /**
   * Import multiple features in parallel
   */
  async importFeaturesBatch<T = any>(featureNames: string[]): Promise<ImportResult<T>[]> {
    const importPromises = featureNames.map(name => this.importFeature<T>(name));
    return Promise.all(importPromises);
  }

  /**
   * Preload features based on priority
   */
  async preloadFeatures(priority: 'high' | 'medium' | 'low' = 'high'): Promise<void> {
    const featuresToPreload = this.features().filter(f => f.priority === priority);
    
    const preloadPromises = featuresToPreload.map(async (feature) => {
      try {
        await this.importFeature(feature.name);
        console.log(`✅ Preloaded feature: ${feature.name}`);
      } catch (error) {
        console.warn(`⚠️ Failed to preload feature: ${feature.name}`, error);
      }
    });

    await Promise.allSettled(preloadPromises);
  }

  /**
   * Check if a feature is cached
   */
  isFeatureCached(featureName: string): boolean {
    return this._importCache().has(featureName);
  }

  /**
   * Clear import cache
   */
  clearCache(): void {
    this._importCache.set(new Map());
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    const features = this.features();
    const cached = this.cachedImports();
    
    return {
      totalFeatures: features.length,
      cachedFeatures: cached.length,
      cacheHitRate: features.length > 0 ? (cached.length / features.length) * 100 : 0,
      estimatedSavings: this.calculateEstimatedSavings()
    };
  }

  /**
   * Perform the actual dynamic import
   */
  private async performDynamicImport<T>(feature: DynamicFeature): Promise<T> {
    // Use lazy loading service for consistent tracking
    return this.lazyLoadingService.loadComponent(
      () => import(/* webpackChunkName: "[request]" */ feature.importPath),
      feature.name
    );
  }

  /**
   * Calculate estimated performance savings from caching
   */
  private calculateEstimatedSavings(): number {
    const cached = this.cachedImports();
    const features = this.features();
    
    return cached.reduce((savings, featureName) => {
      const feature = features.find(f => f.name === featureName);
      return savings + (feature?.size || 0);
    }, 0);
  }
}

/**
 * Feature Registry
 * 
 * Centralized registry for all dynamic features in the application
 */
@Injectable({
  providedIn: 'root'
})
export class FeatureRegistry {
  private dynamicImportService = inject(DynamicImportService);

  constructor() {
    this.registerCoreFeatures();
  }

  /**
   * Register all core application features
   */
  private registerCoreFeatures(): void {
    // Media Player Features
    this.dynamicImportService.registerFeature({
      name: 'video-player',
      description: 'Advanced video player with streaming capabilities',
      importPath: './features/media/components/video-player/video-player.component',
      size: 150000, // ~150KB
      priority: 'medium',
      dependencies: ['media-controls', 'streaming-engine']
    });

    this.dynamicImportService.registerFeature({
      name: 'audio-player',
      description: 'Podcast and audio streaming player',
      importPath: './features/media/components/audio-player/audio-player.component',
      size: 80000, // ~80KB
      priority: 'medium'
    });

    // Community Features
    this.dynamicImportService.registerFeature({
      name: 'rich-text-editor',
      description: 'Rich text editor for posts and comments',
      importPath: './shared/components/rich-text-editor/rich-text-editor.component',
      size: 200000, // ~200KB
      priority: 'low',
      dependencies: ['text-formatting', 'media-upload']
    });

    this.dynamicImportService.registerFeature({
      name: 'image-gallery',
      description: 'Interactive image gallery with zoom and navigation',
      importPath: './shared/components/image-gallery/image-gallery.component',
      size: 120000, // ~120KB
      priority: 'low'
    });

    // Analytics and Reporting
    this.dynamicImportService.registerFeature({
      name: 'analytics-dashboard',
      description: 'Comprehensive analytics and reporting dashboard',
      importPath: './features/analytics/components/dashboard/analytics-dashboard.component',
      size: 300000, // ~300KB
      priority: 'low',
      dependencies: ['charts', 'data-visualization']
    });

    // Advanced UI Components
    this.dynamicImportService.registerFeature({
      name: 'data-table',
      description: 'Advanced data table with sorting, filtering, and pagination',
      importPath: './shared/components/data-table/data-table.component',
      size: 180000, // ~180KB
      priority: 'medium'
    });

    this.dynamicImportService.registerFeature({
      name: 'chart-library',
      description: 'Interactive charts and data visualization',
      importPath: './shared/components/charts/chart-library.component',
      size: 250000, // ~250KB
      priority: 'low'
    });

    // PWA Features
    this.dynamicImportService.registerFeature({
      name: 'offline-manager',
      description: 'Offline data synchronization and management',
      importPath: './core/services/offline-manager.service',
      size: 100000, // ~100KB
      priority: 'medium'
    });

    this.dynamicImportService.registerFeature({
      name: 'push-notifications',
      description: 'Push notification management and display',
      importPath: './core/services/push-notification.service',
      size: 60000, // ~60KB
      priority: 'high'
    });

    // Development and Debug Tools
    this.dynamicImportService.registerFeature({
      name: 'debug-tools',
      description: 'Development and debugging utilities',
      importPath: './shared/components/debug-tools/debug-tools.component',
      size: 90000, // ~90KB
      priority: 'low'
    });
  }

  /**
   * Get all registered features
   */
  getAllFeatures() {
    return this.dynamicImportService.features();
  }

  /**
   * Import a specific feature
   */
  async loadFeature<T = any>(featureName: string): Promise<ImportResult<T>> {
    return this.dynamicImportService.importFeature<T>(featureName);
  }

  /**
   * Preload critical features
   */
  async preloadCriticalFeatures(): Promise<void> {
    await this.dynamicImportService.preloadFeatures('high');
  }
}