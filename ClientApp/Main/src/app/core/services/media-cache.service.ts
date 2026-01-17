import { Injectable, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { EventTrackingService } from './event-tracking.service';

export interface CachedMedia {
  id: string;
  url: string;
  type: 'video' | 'audio' | 'image';
  size: number;
  cachedAt: Date;
  lastAccessed: Date;
  expiresAt: Date;
  quality?: string;
  duration?: number;
  metadata: Record<string, any>;
}

export interface CacheStats {
  totalSize: number;
  totalItems: number;
  availableSpace: number;
  usedSpace: number;
  hitRate: number;
  missRate: number;
}

export interface CacheConfig {
  maxSize: number; // in bytes
  maxAge: number; // in milliseconds
  enableAutoCleanup: boolean;
  cleanupInterval: number;
  compressionEnabled: boolean;
  preloadEnabled: boolean;
  backgroundSync: boolean;
}

/**
 * Media Cache Service
 * 
 * Provides offline media caching capabilities:
 * - Service Worker integration for media caching
 * - Cache size management and cleanup
 * - Preloading and background sync
 * - Cache statistics and monitoring
 * - Compression and optimization
 */
@Injectable({
  providedIn: 'root'
})
export class MediaCacheService {
  private document = inject(DOCUMENT);
  private eventTrackingService = inject(EventTrackingService);

  private config: CacheConfig = {
    maxSize: 500 * 1024 * 1024, // 500MB
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    enableAutoCleanup: true,
    cleanupInterval: 60 * 60 * 1000, // 1 hour
    compressionEnabled: true,
    preloadEnabled: true,
    backgroundSync: true
  };

  private cachedMedia = new BehaviorSubject<CachedMedia[]>([]);
  private cacheStats = new BehaviorSubject<CacheStats>({
    totalSize: 0,
    totalItems: 0,
    availableSpace: 0,
    usedSpace: 0,
    hitRate: 0,
    missRate: 0
  });

  private isServiceWorkerSupported = false;
  private cache?: Cache;
  private cleanupTimer?: number;
  private hitCount = 0;
  private missCount = 0;

  public readonly cachedMedia$ = this.cachedMedia.asObservable();
  public readonly cacheStats$ = this.cacheStats.asObservable();

  constructor() {
    this.initializeCache();
  }

  /**
   * Initialize media cache
   */
  private async initializeCache(): Promise<void> {
    this.isServiceWorkerSupported = 'serviceWorker' in navigator && 'caches' in window;
    
    if (!this.isServiceWorkerSupported) {
      console.warn('Service Worker or Cache API not supported');
      return;
    }

    try {
      // Open cache
      this.cache = await caches.open('media-cache-v1');
      
      // Load existing cached media
      await this.loadCachedMedia();
      
      // Setup cleanup timer
      if (this.config.enableAutoCleanup) {
        this.setupCleanupTimer();
      }
      
      // Update cache stats
      await this.updateCacheStats();
      
      console.log('📦 Media cache initialized');
    } catch (error) {
      console.error('Failed to initialize media cache:', error);
    }
  }

  /**
   * Cache media item
   */
  async cacheMedia(url: string, type: CachedMedia['type'], metadata: Record<string, any> = {}): Promise<boolean> {
    if (!this.cache) {
      console.warn('Cache not available');
      return false;
    }

    try {
      // Check if already cached
      const existing = await this.getCachedMedia(url);
      if (existing) {
        // Update last accessed time
        existing.lastAccessed = new Date();
        await this.updateCachedMediaList();
        this.hitCount++;
        return true;
      }

      // Fetch the media
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch media: ${response.status}`);
      }

      // Check cache size limits
      const contentLength = parseInt(response.headers.get('content-length') || '0');
      if (contentLength > 0) {
        const canCache = await this.ensureCacheSpace(contentLength);
        if (!canCache) {
          console.warn('Cannot cache media: insufficient space');
          return false;
        }
      }

      // Clone response for caching
      const responseClone = response.clone();
      
      // Cache the response
      await this.cache.put(url, responseClone);

      // Add to cached media list
      const cachedItem: CachedMedia = {
        id: this.generateCacheId(),
        url,
        type,
        size: contentLength,
        cachedAt: new Date(),
        lastAccessed: new Date(),
        expiresAt: new Date(Date.now() + this.config.maxAge),
        metadata
      };

      const currentMedia = this.cachedMedia.value;
      currentMedia.push(cachedItem);
      this.cachedMedia.next(currentMedia);
      
      await this.updateCachedMediaList();
      await this.updateCacheStats();
      
      this.eventTrackingService.trackCustomEvent({
        name: 'media_cached',
        category: 'media_cache',
        action: 'cache',
        parameters: {
          media_type: type,
          media_size: contentLength,
          cache_size: this.cacheStats.value.totalSize
        }
      });

      console.log('📦 Media cached:', url);
      return true;
    } catch (error) {
      console.error('Failed to cache media:', error);
      this.missCount++;
      return false;
    }
  }

  /**
   * Get cached media response
   */
  async getCachedMediaResponse(url: string): Promise<Response | null> {
    if (!this.cache) return null;

    try {
      const response = await this.cache.match(url);
      if (response) {
        // Update last accessed time
        const cachedItem = await this.getCachedMedia(url);
        if (cachedItem) {
          cachedItem.lastAccessed = new Date();
          await this.updateCachedMediaList();
        }
        
        this.hitCount++;
        return response;
      }
      
      this.missCount++;
      return null;
    } catch (error) {
      console.error('Failed to get cached media:', error);
      this.missCount++;
      return null;
    }
  }

  /**
   * Check if media is cached
   */
  async isMediaCached(url: string): Promise<boolean> {
    if (!this.cache) return false;
    
    try {
      const response = await this.cache.match(url);
      return !!response;
    } catch (error) {
      return false;
    }
  }

  /**
   * Remove media from cache
   */
  async removeCachedMedia(url: string): Promise<boolean> {
    if (!this.cache) return false;

    try {
      const deleted = await this.cache.delete(url);
      
      if (deleted) {
        // Remove from cached media list
        const currentMedia = this.cachedMedia.value;
        const filteredMedia = currentMedia.filter(item => item.url !== url);
        this.cachedMedia.next(filteredMedia);
        
        await this.updateCachedMediaList();
        await this.updateCacheStats();
        
        this.eventTrackingService.trackCustomEvent({
          name: 'media_uncached',
          category: 'media_cache',
          action: 'remove',
          parameters: { media_url: url }
        });
      }
      
      return deleted;
    } catch (error) {
      console.error('Failed to remove cached media:', error);
      return false;
    }
  }

  /**
   * Clear all cached media
   */
  async clearCache(): Promise<boolean> {
    if (!this.cache) return false;

    try {
      const keys = await this.cache.keys();
      const deletePromises = keys.map(request => this.cache!.delete(request));
      await Promise.all(deletePromises);
      
      this.cachedMedia.next([]);
      await this.updateCachedMediaList();
      await this.updateCacheStats();
      
      this.eventTrackingService.trackCustomEvent({
        name: 'media_cache_cleared',
        category: 'media_cache',
        action: 'clear_all'
      });
      
      console.log('📦 Media cache cleared');
      return true;
    } catch (error) {
      console.error('Failed to clear cache:', error);
      return false;
    }
  }

  /**
   * Get cached media item by URL
   */
  private async getCachedMedia(url: string): Promise<CachedMedia | null> {
    const cachedMedia = this.cachedMedia.value;
    return cachedMedia.find(item => item.url === url) || null;
  }

  /**
   * Load cached media from storage
   */
  private async loadCachedMedia(): Promise<void> {
    try {
      const stored = localStorage.getItem('cached-media-list');
      if (stored) {
        const cachedMedia = JSON.parse(stored) as CachedMedia[];
        // Convert date strings back to Date objects
        cachedMedia.forEach(item => {
          item.cachedAt = new Date(item.cachedAt);
          item.lastAccessed = new Date(item.lastAccessed);
          item.expiresAt = new Date(item.expiresAt);
        });
        this.cachedMedia.next(cachedMedia);
      }
    } catch (error) {
      console.error('Failed to load cached media list:', error);
    }
  }

  /**
   * Update cached media list in storage
   */
  private async updateCachedMediaList(): Promise<void> {
    try {
      const cachedMedia = this.cachedMedia.value;
      localStorage.setItem('cached-media-list', JSON.stringify(cachedMedia));
    } catch (error) {
      console.error('Failed to update cached media list:', error);
    }
  }

  /**
   * Ensure cache has enough space
   */
  private async ensureCacheSpace(requiredSize: number): Promise<boolean> {
    const stats = this.cacheStats.value;
    
    if (stats.usedSpace + requiredSize <= this.config.maxSize) {
      return true;
    }

    // Try to free up space by removing old items
    const freedSpace = await this.cleanupExpiredMedia();
    
    if (stats.usedSpace - freedSpace + requiredSize <= this.config.maxSize) {
      return true;
    }

    // Remove least recently used items
    return await this.cleanupLRUMedia(requiredSize);
  }

  /**
   * Cleanup expired media
   */
  private async cleanupExpiredMedia(): Promise<number> {
    const now = new Date();
    const cachedMedia = this.cachedMedia.value;
    const expiredMedia = cachedMedia.filter(item => item.expiresAt < now);
    
    let freedSpace = 0;
    
    for (const item of expiredMedia) {
      const removed = await this.removeCachedMedia(item.url);
      if (removed) {
        freedSpace += item.size;
      }
    }
    
    if (expiredMedia.length > 0) {
      console.log(`📦 Cleaned up ${expiredMedia.length} expired media items, freed ${this.formatBytes(freedSpace)}`);
    }
    
    return freedSpace;
  }

  /**
   * Cleanup least recently used media
   */
  private async cleanupLRUMedia(requiredSize: number): Promise<boolean> {
    const cachedMedia = this.cachedMedia.value;
    
    // Sort by last accessed time (oldest first)
    const sortedMedia = [...cachedMedia].sort((a, b) => 
      a.lastAccessed.getTime() - b.lastAccessed.getTime()
    );
    
    let freedSpace = 0;
    let removedCount = 0;
    
    for (const item of sortedMedia) {
      if (freedSpace >= requiredSize) break;
      
      const removed = await this.removeCachedMedia(item.url);
      if (removed) {
        freedSpace += item.size;
        removedCount++;
      }
    }
    
    if (removedCount > 0) {
      console.log(`📦 Cleaned up ${removedCount} LRU media items, freed ${this.formatBytes(freedSpace)}`);
    }
    
    return freedSpace >= requiredSize;
  }

  /**
   * Setup cleanup timer
   */
  private setupCleanupTimer(): void {
    this.cleanupTimer = window.setInterval(() => {
      this.cleanupExpiredMedia();
    }, this.config.cleanupInterval);
  }

  /**
   * Update cache statistics
   */
  private async updateCacheStats(): Promise<void> {
    try {
      const cachedMedia = this.cachedMedia.value;
      const totalSize = cachedMedia.reduce((sum, item) => sum + item.size, 0);
      const totalItems = cachedMedia.length;
      
      // Estimate available space (this is approximate)
      let availableSpace = this.config.maxSize - totalSize;
      
      // Try to get actual storage quota if available
      if ('storage' in navigator && 'estimate' in navigator.storage) {
        try {
          const estimate = await navigator.storage.estimate();
          if (estimate.quota && estimate.usage) {
            availableSpace = estimate.quota - estimate.usage;
          }
        } catch (error) {
          // Fallback to configured max size
        }
      }
      
      const totalRequests = this.hitCount + this.missCount;
      const hitRate = totalRequests > 0 ? (this.hitCount / totalRequests) * 100 : 0;
      const missRate = totalRequests > 0 ? (this.missCount / totalRequests) * 100 : 0;
      
      this.cacheStats.next({
        totalSize,
        totalItems,
        availableSpace: Math.max(0, availableSpace),
        usedSpace: totalSize,
        hitRate,
        missRate
      });
    } catch (error) {
      console.error('Failed to update cache stats:', error);
    }
  }

  /**
   * Generate cache ID
   */
  private generateCacheId(): string {
    return `cache_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Format bytes to human readable string
   */
  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): CacheStats {
    return this.cacheStats.value;
  }

  /**
   * Get cached media list
   */
  getCachedMediaList(): CachedMedia[] {
    return this.cachedMedia.value;
  }

  /**
   * Update cache configuration
   */
  updateConfig(newConfig: Partial<CacheConfig>): void {
    this.config = { ...this.config, ...newConfig };
    
    // Restart cleanup timer if interval changed
    if (newConfig.cleanupInterval && this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.setupCleanupTimer();
    }
  }

  /**
   * Get cache configuration
   */
  getConfig(): CacheConfig {
    return { ...this.config };
  }

  /**
   * Check if service worker is supported
   */
  isSupported(): boolean {
    return this.isServiceWorkerSupported;
  }

  /**
   * Cleanup on destroy
   */
  destroy(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
    }
  }
}