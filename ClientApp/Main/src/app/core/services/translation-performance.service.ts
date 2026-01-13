import { Injectable } from '@angular/core';

export interface TranslationPerformanceMetrics {
  cacheHits: number;
  cacheMisses: number;
  apiCalls: number;
  averageLoadTime: number;
  totalLoadTime: number;
  errorCount: number;
  lastUpdated: Date;
}

export interface LanguageMetrics {
  language: string;
  loadCount: number;
  totalLoadTime: number;
  averageLoadTime: number;
  cacheHitRate: number;
  errorCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class TranslationPerformanceService {
  private metrics: TranslationPerformanceMetrics = {
    cacheHits: 0,
    cacheMisses: 0,
    apiCalls: 0,
    averageLoadTime: 0,
    totalLoadTime: 0,
    errorCount: 0,
    lastUpdated: new Date()
  };

  private languageMetrics = new Map<string, LanguageMetrics>();
  private loadStartTimes = new Map<string, number>();

  /**
   * Record the start of a translation load operation
   */
  recordLoadStart(language: string, requestId: string): void {
    this.loadStartTimes.set(requestId, Date.now());
  }

  /**
   * Record a successful translation load from cache
   */
  recordCacheHit(language: string, requestId: string): void {
    this.metrics.cacheHits++;
    this.updateLanguageMetrics(language, 0, false); // 0ms for cache hit
    this.updateMetrics();
    
    console.log(`[Translation Performance] Cache hit for ${language}`);
  }

  /**
   * Record a translation load that required an API call
   */
  recordCacheMiss(language: string, requestId: string): void {
    this.metrics.cacheMisses++;
    this.metrics.apiCalls++;
    
    const startTime = this.loadStartTimes.get(requestId);
    if (startTime) {
      const loadTime = Date.now() - startTime;
      this.metrics.totalLoadTime += loadTime;
      this.updateLanguageMetrics(language, loadTime, false);
      this.loadStartTimes.delete(requestId);
    }
    
    this.updateMetrics();
    
    console.log(`[Translation Performance] Cache miss for ${language}, API call made`);
  }

  /**
   * Record a translation load error
   */
  recordError(language: string, requestId: string, error: any): void {
    this.metrics.errorCount++;
    
    const startTime = this.loadStartTimes.get(requestId);
    if (startTime) {
      const loadTime = Date.now() - startTime;
      this.updateLanguageMetrics(language, loadTime, true);
      this.loadStartTimes.delete(requestId);
    }
    
    this.updateMetrics();
    
    console.error(`[Translation Performance] Error loading ${language}:`, error);
  }

  /**
   * Update language-specific metrics
   */
  private updateLanguageMetrics(language: string, loadTime: number, isError: boolean): void {
    let langMetrics = this.languageMetrics.get(language);
    
    if (!langMetrics) {
      langMetrics = {
        language,
        loadCount: 0,
        totalLoadTime: 0,
        averageLoadTime: 0,
        cacheHitRate: 0,
        errorCount: 0
      };
      this.languageMetrics.set(language, langMetrics);
    }

    langMetrics.loadCount++;
    langMetrics.totalLoadTime += loadTime;
    langMetrics.averageLoadTime = langMetrics.totalLoadTime / langMetrics.loadCount;
    
    if (isError) {
      langMetrics.errorCount++;
    }

    // Calculate cache hit rate
    const totalRequests = this.metrics.cacheHits + this.metrics.cacheMisses;
    langMetrics.cacheHitRate = totalRequests > 0 ? (this.metrics.cacheHits / totalRequests) * 100 : 0;
  }

  /**
   * Update overall metrics
   */
  private updateMetrics(): void {
    const totalRequests = this.metrics.cacheHits + this.metrics.cacheMisses;
    this.metrics.averageLoadTime = totalRequests > 0 ? this.metrics.totalLoadTime / totalRequests : 0;
    this.metrics.lastUpdated = new Date();
  }

  /**
   * Get overall performance metrics
   */
  getMetrics(): TranslationPerformanceMetrics {
    return { ...this.metrics };
  }

  /**
   * Get performance metrics for a specific language
   */
  getLanguageMetrics(language: string): LanguageMetrics | null {
    return this.languageMetrics.get(language) || null;
  }

  /**
   * Get performance metrics for all languages
   */
  getAllLanguageMetrics(): LanguageMetrics[] {
    return Array.from(this.languageMetrics.values());
  }

  /**
   * Get cache hit rate as a percentage
   */
  getCacheHitRate(): number {
    const totalRequests = this.metrics.cacheHits + this.metrics.cacheMisses;
    return totalRequests > 0 ? (this.metrics.cacheHits / totalRequests) * 100 : 0;
  }

  /**
   * Get performance summary for logging
   */
  getPerformanceSummary(): string {
    const hitRate = this.getCacheHitRate();
    const avgLoadTime = this.metrics.averageLoadTime;
    const errorRate = this.metrics.apiCalls > 0 ? (this.metrics.errorCount / this.metrics.apiCalls) * 100 : 0;

    return `Translation Performance Summary:
    - Cache Hit Rate: ${hitRate.toFixed(1)}%
    - Average Load Time: ${avgLoadTime.toFixed(0)}ms
    - Error Rate: ${errorRate.toFixed(1)}%
    - Total API Calls: ${this.metrics.apiCalls}
    - Languages Loaded: ${this.languageMetrics.size}`;
  }

  /**
   * Reset all metrics
   */
  resetMetrics(): void {
    this.metrics = {
      cacheHits: 0,
      cacheMisses: 0,
      apiCalls: 0,
      averageLoadTime: 0,
      totalLoadTime: 0,
      errorCount: 0,
      lastUpdated: new Date()
    };
    
    this.languageMetrics.clear();
    this.loadStartTimes.clear();
    
    console.log('[Translation Performance] Metrics reset');
  }

  /**
   * Log performance summary to console
   */
  logPerformanceSummary(): void {
    console.log(this.getPerformanceSummary());
    
    if (this.languageMetrics.size > 0) {
      console.table(this.getAllLanguageMetrics());
    }
  }
}