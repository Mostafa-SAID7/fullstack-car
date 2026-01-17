import { Injectable, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { EventTrackingService } from './event-tracking.service';
import { MediaCacheService } from './media-cache.service';

export interface MediaQuality {
  label: string;
  width: number;
  height: number;
  bitrate: number;
  url: string;
}

export interface AdaptiveStreamingConfig {
  enableAdaptiveBitrate: boolean;
  enableBandwidthDetection: boolean;
  bufferSize: number; // seconds
  maxBufferSize: number; // seconds
  bitrateThresholds: {
    low: number;
    medium: number;
    high: number;
    ultra: number;
  };
  qualityLevels: MediaQuality[];
}

export interface LoadingOptimization {
  enablePreloading: boolean;
  enableLazyLoading: boolean;
  enableProgressiveLoading: boolean;
  preloadDistance: number; // pixels
  chunkSize: number; // bytes
  maxConcurrentLoads: number;
}

export interface NetworkCondition {
  effectiveType: '2g' | '3g' | '4g' | 'slow-2g';
  downlink: number; // Mbps
  rtt: number; // ms
  saveData: boolean;
}

export interface MediaMetrics {
  loadTime: number;
  bufferHealth: number;
  droppedFrames: number;
  bandwidth: number;
  quality: string;
  rebufferCount: number;
  rebufferTime: number;
}

/**
 * Media Optimization Service
 * 
 * Provides intelligent media loading and streaming optimization:
 * - Adaptive bitrate streaming based on network conditions
 * - Progressive loading and lazy loading
 * - Bandwidth detection and quality adjustment
 * - Buffer management and preloading
 * - Performance monitoring and metrics
 */
@Injectable({
  providedIn: 'root'
})
export class MediaOptimizationService {
  private document = inject(DOCUMENT);
  private eventTrackingService = inject(EventTrackingService);
  private mediaCacheService = inject(MediaCacheService);

  private adaptiveConfig: AdaptiveStreamingConfig = {
    enableAdaptiveBitrate: true,
    enableBandwidthDetection: true,
    bufferSize: 10, // 10 seconds
    maxBufferSize: 30, // 30 seconds
    bitrateThresholds: {
      low: 0.5, // 500 kbps
      medium: 1.5, // 1.5 Mbps
      high: 5, // 5 Mbps
      ultra: 15 // 15 Mbps
    },
    qualityLevels: []
  };

  private loadingConfig: LoadingOptimization = {
    enablePreloading: true,
    enableLazyLoading: true,
    enableProgressiveLoading: true,
    preloadDistance: 1000, // 1000px
    chunkSize: 1024 * 1024, // 1MB chunks
    maxConcurrentLoads: 3
  };

  private networkCondition = new BehaviorSubject<NetworkCondition>({
    effectiveType: '4g',
    downlink: 10,
    rtt: 100,
    saveData: false
  });

  private mediaMetrics = new BehaviorSubject<MediaMetrics>({
    loadTime: 0,
    bufferHealth: 0,
    droppedFrames: 0,
    bandwidth: 0,
    quality: 'auto',
    rebufferCount: 0,
    rebufferTime: 0
  });

  private currentLoads = new Map<string, AbortController>();
  private bandwidthHistory: number[] = [];
  private intersectionObserver?: IntersectionObserver;

  public readonly networkCondition$ = this.networkCondition.asObservable();
  public readonly mediaMetrics$ = this.mediaMetrics.asObservable();

  constructor() {
    this.initializeOptimization();
  }

  /**
   * Initialize media optimization
   */
  private initializeOptimization(): void {
    this.setupNetworkDetection();
    this.setupIntersectionObserver();
    this.monitorNetworkConditions();
    
    console.log('🚀 Media optimization initialized');
  }

  /**
   * Setup network condition detection
   */
  private setupNetworkDetection(): void {
    // Network Information API
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      
      const updateNetworkInfo = () => {
        this.networkCondition.next({
          effectiveType: connection.effectiveType || '4g',
          downlink: connection.downlink || 10,
          rtt: connection.rtt || 100,
          saveData: connection.saveData || false
        });
      };

      updateNetworkInfo();
      connection.addEventListener('change', updateNetworkInfo);
    }

    // Fallback bandwidth detection
    this.detectBandwidth();
  }

  /**
   * Setup intersection observer for lazy loading
   */
  private setupIntersectionObserver(): void {
    if (!('IntersectionObserver' in window)) return;

    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const element = entry.target as HTMLElement;
            const mediaUrl = element.dataset['mediaUrl'];
            const mediaType = element.dataset['mediaType'] as 'video' | 'audio' | 'image';
            
            if (mediaUrl && mediaType) {
              this.preloadMedia(mediaUrl, mediaType);
            }
          }
        });
      },
      {
        rootMargin: `${this.loadingConfig.preloadDistance}px`,
        threshold: 0.1
      }
    );
  }

  /**
   * Detect bandwidth using small test downloads
   */
  private async detectBandwidth(): Promise<number> {
    try {
      const testUrl = '/assets/bandwidth-test.jpg'; // Small test file
      const startTime = performance.now();
      
      const response = await fetch(testUrl + '?t=' + Date.now(), {
        cache: 'no-cache'
      });
      
      const endTime = performance.now();
      const duration = (endTime - startTime) / 1000; // seconds
      const bytes = parseInt(response.headers.get('content-length') || '0');
      
      if (bytes > 0 && duration > 0) {
        const bandwidth = (bytes * 8) / (duration * 1000 * 1000); // Mbps
        this.bandwidthHistory.push(bandwidth);
        
        // Keep only last 10 measurements
        if (this.bandwidthHistory.length > 10) {
          this.bandwidthHistory.shift();
        }
        
        const avgBandwidth = this.bandwidthHistory.reduce((sum, bw) => sum + bw, 0) / this.bandwidthHistory.length;
        
        // Update network condition
        const current = this.networkCondition.value;
        this.networkCondition.next({
          ...current,
          downlink: avgBandwidth
        });
        
        return avgBandwidth;
      }
    } catch (error) {
      console.warn('Bandwidth detection failed:', error);
    }
    
    return this.networkCondition.value.downlink;
  }

  /**
   * Get optimal quality based on network conditions
   */
  getOptimalQuality(availableQualities: MediaQuality[]): MediaQuality | null {
    if (!this.adaptiveConfig.enableAdaptiveBitrate || availableQualities.length === 0) {
      return availableQualities[0] || null;
    }

    const networkCondition = this.networkCondition.value;
    const bandwidth = networkCondition.downlink;
    const saveData = networkCondition.saveData;
    
    // If save data is enabled, prefer lower quality
    if (saveData) {
      return availableQualities.reduce((prev, curr) => 
        prev.bitrate < curr.bitrate ? prev : curr
      );
    }

    // Find best quality for current bandwidth
    const suitableQualities = availableQualities.filter(quality => {
      const requiredBandwidth = quality.bitrate / 1000; // Convert to Mbps
      return requiredBandwidth <= bandwidth * 0.8; // Use 80% of available bandwidth
    });

    if (suitableQualities.length === 0) {
      // Return lowest quality if none suitable
      return availableQualities.reduce((prev, curr) => 
        prev.bitrate < curr.bitrate ? prev : curr
      );
    }

    // Return highest suitable quality
    return suitableQualities.reduce((prev, curr) => 
      prev.bitrate > curr.bitrate ? prev : curr
    );
  }

  /**
   * Optimize media loading based on element visibility
   */
  optimizeMediaLoading(element: HTMLElement, mediaUrl: string, mediaType: 'video' | 'audio' | 'image'): void {
    if (!this.loadingConfig.enableLazyLoading) {
      // Load immediately if lazy loading is disabled
      this.loadMedia(mediaUrl, mediaType);
      return;
    }

    // Add to intersection observer for lazy loading
    element.dataset['mediaUrl'] = mediaUrl;
    element.dataset['mediaType'] = mediaType;
    
    if (this.intersectionObserver) {
      this.intersectionObserver.observe(element);
    }
  }

  /**
   * Preload media
   */
  async preloadMedia(url: string, type: 'video' | 'audio' | 'image'): Promise<void> {
    if (!this.loadingConfig.enablePreloading) return;
    
    // Check if already loading or loaded
    if (this.currentLoads.has(url)) return;
    
    // Check concurrent load limit
    if (this.currentLoads.size >= this.loadingConfig.maxConcurrentLoads) {
      console.log('Max concurrent loads reached, queuing:', url);
      return;
    }

    try {
      // Check if already cached
      const isCached = await this.mediaCacheService.isMediaCached(url);
      if (isCached) return;

      const abortController = new AbortController();
      this.currentLoads.set(url, abortController);

      const startTime = performance.now();
      
      if (this.loadingConfig.enableProgressiveLoading) {
        await this.loadProgressively(url, type, abortController.signal);
      } else {
        await this.loadMedia(url, type, abortController.signal);
      }
      
      const loadTime = performance.now() - startTime;
      
      // Update metrics
      this.updateLoadMetrics(loadTime, url);
      
      // Cache the media
      await this.mediaCacheService.cacheMedia(url, type);
      
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        console.error('Failed to preload media:', error);
      }
    } finally {
      this.currentLoads.delete(url);
    }
  }

  /**
   * Load media progressively in chunks
   */
  private async loadProgressively(url: string, type: string, signal?: AbortSignal): Promise<void> {
    try {
      // Get content length first
      const headResponse = await fetch(url, { 
        method: 'HEAD',
        signal
      });
      
      const contentLength = parseInt(headResponse.headers.get('content-length') || '0');
      if (contentLength === 0) {
        // Fallback to regular loading
        await this.loadMedia(url, type, signal);
        return;
      }

      const chunkSize = this.loadingConfig.chunkSize;
      const chunks: ArrayBuffer[] = [];
      
      for (let start = 0; start < contentLength; start += chunkSize) {
        if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');
        
        const end = Math.min(start + chunkSize - 1, contentLength - 1);
        
        const response = await fetch(url, {
          headers: {
            'Range': `bytes=${start}-${end}`
          },
          signal
        });
        
        if (response.status === 206) {
          const chunk = await response.arrayBuffer();
          chunks.push(chunk);
        }
      }
      
      // Combine chunks (this is a simplified example)
      console.log(`Progressive loading completed for ${url}`);
      
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        console.error('Progressive loading failed:', error);
        // Fallback to regular loading
        await this.loadMedia(url, type, signal);
      }
    }
  }

  /**
   * Load media normally
   */
  private async loadMedia(url: string, type: string, signal?: AbortSignal): Promise<void> {
    const response = await fetch(url, { signal });
    if (!response.ok) {
      throw new Error(`Failed to load media: ${response.status}`);
    }
    
    // For demonstration, we just consume the response
    await response.blob();
  }

  /**
   * Monitor network conditions continuously
   */
  private monitorNetworkConditions(): void {
    // Periodic bandwidth detection
    setInterval(() => {
      this.detectBandwidth();
    }, 30000); // Every 30 seconds

    // Monitor for network changes
    window.addEventListener('online', () => {
      console.log('Network back online');
      this.detectBandwidth();
    });

    window.addEventListener('offline', () => {
      console.log('Network offline');
    });
  }

  /**
   * Update loading metrics
   */
  private updateLoadMetrics(loadTime: number, url: string): void {
    const currentMetrics = this.mediaMetrics.value;
    
    this.mediaMetrics.next({
      ...currentMetrics,
      loadTime
    });

    this.eventTrackingService.trackCustomEvent({
      name: 'media_load_optimized',
      category: 'media_optimization',
      action: 'load',
      value: Math.round(loadTime),
      parameters: {
        media_url: url,
        load_time: loadTime,
        network_type: this.networkCondition.value.effectiveType,
        bandwidth: this.networkCondition.value.downlink
      }
    });
  }

  /**
   * Cancel media loading
   */
  cancelLoading(url: string): void {
    const controller = this.currentLoads.get(url);
    if (controller) {
      controller.abort();
      this.currentLoads.delete(url);
    }
  }

  /**
   * Cancel all loading operations
   */
  cancelAllLoading(): void {
    this.currentLoads.forEach(controller => controller.abort());
    this.currentLoads.clear();
  }

  /**
   * Update adaptive streaming configuration
   */
  updateAdaptiveConfig(config: Partial<AdaptiveStreamingConfig>): void {
    this.adaptiveConfig = { ...this.adaptiveConfig, ...config };
  }

  /**
   * Update loading optimization configuration
   */
  updateLoadingConfig(config: Partial<LoadingOptimization>): void {
    this.loadingConfig = { ...this.loadingConfig, ...config };
    
    // Update intersection observer margin if changed
    if (config.preloadDistance && this.intersectionObserver) {
      this.intersectionObserver.disconnect();
      this.setupIntersectionObserver();
    }
  }

  /**
   * Get current network condition
   */
  getCurrentNetworkCondition(): NetworkCondition {
    return this.networkCondition.value;
  }

  /**
   * Get current media metrics
   */
  getCurrentMetrics(): MediaMetrics {
    return this.mediaMetrics.value;
  }

  /**
   * Get adaptive streaming configuration
   */
  getAdaptiveConfig(): AdaptiveStreamingConfig {
    return { ...this.adaptiveConfig };
  }

  /**
   * Get loading optimization configuration
   */
  getLoadingConfig(): LoadingOptimization {
    return { ...this.loadingConfig };
  }

  /**
   * Check if media should be preloaded based on conditions
   */
  shouldPreloadMedia(): boolean {
    const networkCondition = this.networkCondition.value;
    
    // Don't preload on slow connections or save data mode
    if (networkCondition.saveData || networkCondition.effectiveType === 'slow-2g' || networkCondition.effectiveType === '2g') {
      return false;
    }
    
    return this.loadingConfig.enablePreloading;
  }

  /**
   * Get recommended buffer size based on network conditions
   */
  getRecommendedBufferSize(): number {
    const networkCondition = this.networkCondition.value;
    
    switch (networkCondition.effectiveType) {
      case 'slow-2g':
      case '2g':
        return Math.min(this.adaptiveConfig.bufferSize, 5); // 5 seconds max
      case '3g':
        return Math.min(this.adaptiveConfig.bufferSize, 10); // 10 seconds max
      default:
        return this.adaptiveConfig.bufferSize;
    }
  }

  /**
   * Cleanup resources
   */
  destroy(): void {
    this.cancelAllLoading();
    
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
  }
}