import { Injectable, inject, signal, computed } from '@angular/core';
import { Platform } from '@angular/cdk/platform';
import { PWAService } from './pwa.service';

export interface CacheConfig {
  name: string;
  version: string;
  maxAge: number; // in milliseconds
  maxEntries: number;
  strategy: 'cache-first' | 'network-first' | 'cache-only' | 'network-only' | 'stale-while-revalidate';
}

export interface CacheEntry {
  url: string;
  response: Response;
  timestamp: number;
  headers: Record<string, string>;
}

@Injectable({
  providedIn: 'root'
})
export class CacheService {
  private platform = inject(Platform);
  private pwaService = inject(PWAService);

  // Cache configurations for different content types
  private readonly cacheConfigs: Record<string, CacheConfig> = {
    api: {
      name: 'api-cache-v1',
      version: '1.0.0',
      maxAge: 5 * 60 * 1000, // 5 minutes
      maxEntries: 100,
      strategy: 'network-first'
    },
    static: {
      name: 'static-cache-v1',
      version: '1.0.0',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      maxEntries: 200,
      strategy: 'cache-first'
    },
    images: {
      name: 'images-cache-v1',
      version: '1.0.0',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      maxEntries: 150,
      strategy: 'cache-first'
    },
    media: {
      name: 'media-cache-v1',
      version: '1.0.0',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      maxEntries: 50,
      strategy: 'cache-first'
    }
  };

  // Reactive state
  private _cacheStatus = signal<Record<string, boolean>>({});
  private _cacheSize = signal<Record<string, number>>({});

  // Public readonly signals
  readonly cacheStatus = this._cacheStatus.asReadonly();
  readonly cacheSize = this._cacheSize.asReadonly();
  readonly totalCacheSize = computed(() => 
    Object.values(this._cacheSize()).reduce((total, size) => total + size, 0)
  );

  constructor() {
    this.initializeCaches();
  }

  /**
   * Initialize all caches
   */
  private async initializeCaches(): Promise<void> {
    if (!this.isCacheSupported()) {
      console.warn('Cache API not supported');
      return;
    }

    try {
      for (const [type, config] of Object.entries(this.cacheConfigs)) {
        await this.openCache(config.name);
        this._cacheStatus.update(status => ({ ...status, [type]: true }));
      }
      
      await this.updateCacheSizes();
    } catch (error) {
      console.error('Failed to initialize caches:', error);
    }
  }

  /**
   * Check if Cache API is supported
   */
  private isCacheSupported(): boolean {
    return this.platform.isBrowser && 'caches' in window;
  }

  /**
   * Open a cache by name
   */
  private async openCache(cacheName: string): Promise<Cache> {
    return await caches.open(cacheName);
  }

  /**
   * Cache a request/response pair
   */
  async cacheRequest(
    request: Request | string, 
    response: Response, 
    cacheType: keyof typeof this.cacheConfigs = 'api'
  ): Promise<void> {
    if (!this.isCacheSupported()) return;

    try {
      const config = this.cacheConfigs[cacheType];
      const cache = await this.openCache(config.name);
      
      // Clone response before caching
      const responseClone = response.clone();
      
      // Add timestamp header for cache management
      const headers = new Headers(responseClone.headers);
      headers.set('cached-at', Date.now().toString());
      
      const cachedResponse = new Response(responseClone.body, {
        status: responseClone.status,
        statusText: responseClone.statusText,
        headers
      });

      await cache.put(request, cachedResponse);
      await this.cleanupCache(config);
      await this.updateCacheSizes();
    } catch (error) {
      console.error('Failed to cache request:', error);
    }
  }

  /**
   * Get cached response
   */
  async getCachedResponse(
    request: Request | string,
    cacheType: keyof typeof this.cacheConfigs = 'api'
  ): Promise<Response | null> {
    if (!this.isCacheSupported()) return null;

    try {
      const config = this.cacheConfigs[cacheType];
      const cache = await this.openCache(config.name);
      const cachedResponse = await cache.match(request);

      if (!cachedResponse) return null;

      // Check if cache entry is still valid
      const cachedAt = cachedResponse.headers.get('cached-at');
      if (cachedAt) {
        const age = Date.now() - parseInt(cachedAt);
        if (age > config.maxAge) {
          await cache.delete(request);
          return null;
        }
      }

      return cachedResponse;
    } catch (error) {
      console.error('Failed to get cached response:', error);
      return null;
    }
  }

  /**
   * Fetch with caching strategy
   */
  async fetchWithCache(
    request: Request | string,
    cacheType: keyof typeof this.cacheConfigs = 'api'
  ): Promise<Response> {
    const config = this.cacheConfigs[cacheType];
    
    switch (config.strategy) {
      case 'cache-first':
        return await this.cacheFirstStrategy(request, cacheType);
      case 'network-first':
        return await this.networkFirstStrategy(request, cacheType);
      case 'cache-only':
        return await this.cacheOnlyStrategy(request, cacheType);
      case 'network-only':
        return await this.networkOnlyStrategy(request);
      case 'stale-while-revalidate':
        return await this.staleWhileRevalidateStrategy(request, cacheType);
      default:
        return await this.networkFirstStrategy(request, cacheType);
    }
  }

  /**
   * Cache-first strategy
   */
  private async cacheFirstStrategy(
    request: Request | string,
    cacheType: keyof typeof this.cacheConfigs
  ): Promise<Response> {
    const cachedResponse = await this.getCachedResponse(request, cacheType);
    
    if (cachedResponse) {
      return cachedResponse;
    }

    try {
      const networkResponse = await fetch(request);
      if (networkResponse.ok) {
        await this.cacheRequest(request, networkResponse, cacheType);
      }
      return networkResponse;
    } catch (error) {
      throw new Error('Network request failed and no cache available');
    }
  }

  /**
   * Network-first strategy
   */
  private async networkFirstStrategy(
    request: Request | string,
    cacheType: keyof typeof this.cacheConfigs
  ): Promise<Response> {
    try {
      const networkResponse = await fetch(request);
      if (networkResponse.ok) {
        await this.cacheRequest(request, networkResponse, cacheType);
      }
      return networkResponse;
    } catch (error) {
      const cachedResponse = await this.getCachedResponse(request, cacheType);
      if (cachedResponse) {
        return cachedResponse;
      }
      throw error;
    }
  }

  /**
   * Cache-only strategy
   */
  private async cacheOnlyStrategy(
    request: Request | string,
    cacheType: keyof typeof this.cacheConfigs
  ): Promise<Response> {
    const cachedResponse = await this.getCachedResponse(request, cacheType);
    if (cachedResponse) {
      return cachedResponse;
    }
    throw new Error('No cache available');
  }

  /**
   * Network-only strategy
   */
  private async networkOnlyStrategy(request: Request | string): Promise<Response> {
    return await fetch(request);
  }

  /**
   * Stale-while-revalidate strategy
   */
  private async staleWhileRevalidateStrategy(
    request: Request | string,
    cacheType: keyof typeof this.cacheConfigs
  ): Promise<Response> {
    const cachedResponse = await this.getCachedResponse(request, cacheType);
    
    // Start network request in background
    const networkPromise = fetch(request).then(response => {
      if (response.ok) {
        this.cacheRequest(request, response, cacheType);
      }
      return response;
    }).catch(() => null);

    // Return cached response immediately if available
    if (cachedResponse) {
      return cachedResponse;
    }

    // Wait for network response if no cache
    const networkResponse = await networkPromise;
    if (networkResponse) {
      return networkResponse;
    }

    throw new Error('Network request failed and no cache available');
  }

  /**
   * Cleanup old cache entries
   */
  private async cleanupCache(config: CacheConfig): Promise<void> {
    try {
      const cache = await this.openCache(config.name);
      const requests = await cache.keys();

      if (requests.length <= config.maxEntries) return;

      // Sort by timestamp and remove oldest entries
      const entries = await Promise.all(
        requests.map(async (request) => {
          const response = await cache.match(request);
          const cachedAt = response?.headers.get('cached-at') || '0';
          return { request, timestamp: parseInt(cachedAt) };
        })
      );

      entries.sort((a, b) => a.timestamp - b.timestamp);
      const toDelete = entries.slice(0, entries.length - config.maxEntries);

      await Promise.all(
        toDelete.map(entry => cache.delete(entry.request))
      );
    } catch (error) {
      console.error('Failed to cleanup cache:', error);
    }
  }

  /**
   * Update cache sizes
   */
  private async updateCacheSizes(): Promise<void> {
    if (!this.isCacheSupported()) return;

    try {
      const sizes: Record<string, number> = {};
      
      for (const [type, config] of Object.entries(this.cacheConfigs)) {
        const cache = await this.openCache(config.name);
        const requests = await cache.keys();
        
        let totalSize = 0;
        for (const request of requests) {
          const response = await cache.match(request);
          if (response) {
            const blob = await response.blob();
            totalSize += blob.size;
          }
        }
        
        sizes[type] = totalSize;
      }
      
      this._cacheSize.set(sizes);
    } catch (error) {
      console.error('Failed to update cache sizes:', error);
    }
  }

  /**
   * Clear specific cache
   */
  async clearCache(cacheType: keyof typeof this.cacheConfigs): Promise<void> {
    if (!this.isCacheSupported()) return;

    try {
      const config = this.cacheConfigs[cacheType];
      await caches.delete(config.name);
      
      this._cacheStatus.update(status => ({ ...status, [cacheType]: false }));
      this._cacheSize.update(sizes => ({ ...sizes, [cacheType]: 0 }));
      
      // Reinitialize the cache
      await this.openCache(config.name);
      this._cacheStatus.update(status => ({ ...status, [cacheType]: true }));
    } catch (error) {
      console.error('Failed to clear cache:', error);
    }
  }

  /**
   * Clear all caches
   */
  async clearAllCaches(): Promise<void> {
    if (!this.isCacheSupported()) return;

    try {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map(name => caches.delete(name)));
      
      this._cacheStatus.set({});
      this._cacheSize.set({});
      
      // Reinitialize caches
      await this.initializeCaches();
    } catch (error) {
      console.error('Failed to clear all caches:', error);
    }
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): {
    totalSize: number;
    cacheCount: number;
    hitRate: number;
    cacheTypes: Record<string, { size: number; status: boolean }>;
  } {
    const cacheTypes = Object.keys(this.cacheConfigs).reduce((acc, type) => {
      acc[type] = {
        size: this._cacheSize()[type] || 0,
        status: this._cacheStatus()[type] || false
      };
      return acc;
    }, {} as Record<string, { size: number; status: boolean }>);

    return {
      totalSize: this.totalCacheSize(),
      cacheCount: Object.keys(this.cacheConfigs).length,
      hitRate: 0, // This would be calculated based on actual usage metrics
      cacheTypes
    };
  }

  /**
   * Preload critical resources
   */
  async preloadCriticalResources(urls: string[]): Promise<void> {
    if (!this.isCacheSupported()) return;

    try {
      const cache = await this.openCache(this.cacheConfigs.static.name);
      
      await Promise.all(
        urls.map(async (url) => {
          try {
            const response = await fetch(url);
            if (response.ok) {
              await cache.put(url, response);
            }
          } catch (error) {
            console.warn(`Failed to preload resource: ${url}`, error);
          }
        })
      );
    } catch (error) {
      console.error('Failed to preload critical resources:', error);
    }
  }
}