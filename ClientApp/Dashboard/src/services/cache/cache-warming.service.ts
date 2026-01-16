import { cacheService } from './cache.service';
import { CACHE_WARMING_CONFIG } from './cache-config';
import { authService } from '../auth';

/**
 * Cache Warming Service
 * Preloads frequently accessed data into cache on app start
 */
export class CacheWarmingService {
  private static instance: CacheWarmingService;
  private isWarming = false;
  private warmingPromise: Promise<void> | null = null;

  private constructor() {}

  static getInstance(): CacheWarmingService {
    if (!CacheWarmingService.instance) {
      CacheWarmingService.instance = new CacheWarmingService();
    }
    return CacheWarmingService.instance;
  }

  /**
   * Warm up the cache by preloading critical data
   */
  async warmCache(): Promise<void> {
    if (!CACHE_WARMING_CONFIG.ENABLED) {
      console.log('[Cache Warming] Disabled in configuration');
      return;
    }

    if (this.isWarming) {
      console.log('[Cache Warming] Already in progress, waiting...');
      return this.warmingPromise || Promise.resolve();
    }

    this.isWarming = true;
    console.log('[Cache Warming] Starting cache warm-up...');

    this.warmingPromise = this.performWarming();
    
    try {
      await this.warmingPromise;
      console.log('[Cache Warming] Completed successfully');
    } catch (error) {
      console.error('[Cache Warming] Failed:', error);
    } finally {
      this.isWarming = false;
      this.warmingPromise = null;
    }
  }

  /**
   * Perform the actual cache warming
   */
  private async performWarming(): Promise<void> {
    const token = authService.getToken();
    if (!token) {
      console.log('[Cache Warming] Skipped - user not authenticated');
      return;
    }

    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5100/api';
    const results = await Promise.allSettled(
      CACHE_WARMING_CONFIG.ENDPOINTS.map(config =>
        this.warmEndpoint(baseUrl + config.endpoint, config.ttl)
      )
    );

    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    console.log(`[Cache Warming] Results: ${successful} successful, ${failed} failed`);
  }

  /**
   * Warm a specific endpoint
   */
  private async warmEndpoint(url: string, ttl: number): Promise<void> {
    try {
      const token = authService.getToken();
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      cacheService.set(url, data, ttl);
      
      console.log(`[Cache Warming] Warmed: ${url}`);
    } catch (error) {
      console.warn(`[Cache Warming] Failed to warm ${url}:`, error);
      throw error;
    }
  }

  /**
   * Check if cache warming is in progress
   */
  isWarmingInProgress(): boolean {
    return this.isWarming;
  }
}

export const cacheWarmingService = CacheWarmingService.getInstance();
