import { CACHE_CONFIG, CACHE_LIMITS, CACHE_METRICS_CONFIG } from './cache-config';

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
  createdAt: number;
  size: number;
  hits: number;
}

interface CacheMetrics {
  totalHits: number;
  totalMisses: number;
  hitRate: number;
  totalSize: number;
  entryCount: number;
  oldestEntry: number | null;
  newestEntry: number | null;
}

export class CacheService {
  private static instance: CacheService;
  private cache = new Map<string, CacheEntry<any>>();
  private readonly defaultTTL = CACHE_CONFIG.MEDIUM.TTL;
  private metrics = {
    hits: 0,
    misses: 0,
    sets: 0,
    deletes: 0
  };
  private metricsInterval: NodeJS.Timeout | null = null;

  private constructor() {
    this.startMetricsLogging();
    this.startPeriodicCleanup();
  }

  static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService();
    }
    return CacheService.instance;
  }

  /**
   * Get value from cache
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      this.metrics.misses++;
      return null;
    }
    
    // Check if expired
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      this.metrics.misses++;
      return null;
    }
    
    // Update hit count
    entry.hits++;
    this.metrics.hits++;
    
    return entry.data as T;
  }

  /**
   * Set value in cache
   */
  set<T>(key: string, data: T, ttl?: number): void {
    // Check if we need to cleanup before adding
    if (this.shouldCleanup()) {
      this.cleanup();
    }

    const now = Date.now();
    const expiresAt = now + (ttl || this.defaultTTL);
    const size = this.estimateSize(data);

    this.cache.set(key, {
      data,
      expiresAt,
      createdAt: now,
      size,
      hits: 0
    });

    this.metrics.sets++;
  }

  /**
   * Invalidate a specific cache key
   */
  invalidate(key: string): void {
    if (this.cache.delete(key)) {
      this.metrics.deletes++;
    }
  }

  /**
   * Invalidate cache keys matching a pattern
   */
  invalidatePattern(pattern: string): void {
    const regex = new RegExp(pattern.replace(/\*/g, '.*'));
    const keysToDelete: string[] = [];
    
    this.cache.forEach((_, key) => {
      if (regex.test(key)) {
        keysToDelete.push(key);
      }
    });
    
    keysToDelete.forEach(key => {
      this.cache.delete(key);
      this.metrics.deletes++;
    });
  }

  /**
   * Invalidate multiple patterns at once
   */
  invalidatePatterns(patterns: string[]): void {
    patterns.forEach(pattern => this.invalidatePattern(pattern));
  }

  /**
   * Clear all cache
   */
  clear(): void {
    const size = this.cache.size;
    this.cache.clear();
    this.metrics.deletes += size;
  }

  /**
   * Check if a key exists and is not expired
   */
  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;
    
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }

  /**
   * Get or set pattern - fetch from cache or execute function and cache result
   */
  async getOrSet<T>(
    key: string,
    fetchFn: () => Promise<T>,
    ttl?: number
  ): Promise<T> {
    const cached = this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    const data = await fetchFn();
    this.set(key, data, ttl);
    return data;
  }

  /**
   * Get cache statistics
   */
  getStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }

  /**
   * Get detailed cache metrics
   */
  getMetrics(): CacheMetrics {
    const totalRequests = this.metrics.hits + this.metrics.misses;
    const hitRate = totalRequests > 0 ? (this.metrics.hits / totalRequests) * 100 : 0;
    
    let totalSize = 0;
    let oldestEntry: number | null = null;
    let newestEntry: number | null = null;

    this.cache.forEach(entry => {
      totalSize += entry.size;
      
      if (oldestEntry === null || entry.createdAt < oldestEntry) {
        oldestEntry = entry.createdAt;
      }
      
      if (newestEntry === null || entry.createdAt > newestEntry) {
        newestEntry = entry.createdAt;
      }
    });

    return {
      totalHits: this.metrics.hits,
      totalMisses: this.metrics.misses,
      hitRate: Math.round(hitRate * 100) / 100,
      totalSize,
      entryCount: this.cache.size,
      oldestEntry,
      newestEntry
    };
  }

  /**
   * Get top accessed cache entries
   */
  getTopEntries(limit: number = 10): Array<{ key: string; hits: number; size: number }> {
    const entries: Array<{ key: string; hits: number; size: number }> = [];
    
    this.cache.forEach((entry, key) => {
      entries.push({ key, hits: entry.hits, size: entry.size });
    });
    
    return entries
      .sort((a, b) => b.hits - a.hits)
      .slice(0, limit);
  }

  /**
   * Reset metrics
   */
  resetMetrics(): void {
    this.metrics = {
      hits: 0,
      misses: 0,
      sets: 0,
      deletes: 0
    };
  }

  /**
   * Cleanup expired entries
   */
  cleanup(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];
    
    this.cache.forEach((entry, key) => {
      if (now > entry.expiresAt) {
        keysToDelete.push(key);
      }
    });
    
    keysToDelete.forEach(key => {
      this.cache.delete(key);
      this.metrics.deletes++;
    });

    if (keysToDelete.length > 0) {
      console.log(`[Cache] Cleaned up ${keysToDelete.length} expired entries`);
    }
  }

  /**
   * Cleanup least recently used entries when cache is full
   */
  private cleanupLRU(): void {
    const entries: Array<{ key: string; hits: number; createdAt: number }> = [];
    
    this.cache.forEach((entry, key) => {
      entries.push({ key, hits: entry.hits, createdAt: entry.createdAt });
    });
    
    // Sort by hits (ascending) and then by age (oldest first)
    entries.sort((a, b) => {
      if (a.hits !== b.hits) {
        return a.hits - b.hits;
      }
      return a.createdAt - b.createdAt;
    });
    
    // Remove 20% of least used entries
    const toRemove = Math.ceil(entries.length * 0.2);
    for (let i = 0; i < toRemove; i++) {
      this.cache.delete(entries[i].key);
      this.metrics.deletes++;
    }
    
    console.log(`[Cache] LRU cleanup removed ${toRemove} entries`);
  }

  /**
   * Check if cleanup is needed
   */
  private shouldCleanup(): boolean {
    return this.cache.size >= CACHE_LIMITS.MAX_ENTRIES * CACHE_LIMITS.CLEANUP_THRESHOLD;
  }

  /**
   * Estimate size of data in bytes
   */
  private estimateSize(data: any): number {
    try {
      const str = JSON.stringify(data);
      return new Blob([str]).size;
    } catch {
      return 0;
    }
  }

  /**
   * Start periodic cleanup of expired entries
   */
  private startPeriodicCleanup(): void {
    // Run cleanup every 5 minutes
    setInterval(() => {
      this.cleanup();
    }, 300000);
  }

  /**
   * Start metrics logging
   */
  private startMetricsLogging(): void {
    if (!CACHE_METRICS_CONFIG.ENABLED) return;

    this.metricsInterval = setInterval(() => {
      const metrics = this.getMetrics();
      console.log('[Cache Metrics]', {
        hitRate: `${metrics.hitRate}%`,
        entries: metrics.entryCount,
        size: `${(metrics.totalSize / 1024).toFixed(2)} KB`,
        hits: this.metrics.hits,
        misses: this.metrics.misses
      });
    }, CACHE_METRICS_CONFIG.LOG_INTERVAL);
  }

  /**
   * Stop metrics logging
   */
  stopMetricsLogging(): void {
    if (this.metricsInterval) {
      clearInterval(this.metricsInterval);
      this.metricsInterval = null;
    }
  }

  /**
   * Destroy cache service (cleanup)
   */
  destroy(): void {
    this.stopMetricsLogging();
    this.clear();
  }
}

export const cacheService = CacheService.getInstance();
