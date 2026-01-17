import { Injectable, signal, computed, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

export interface PreloadResource {
  href: string;
  as: 'script' | 'style' | 'image' | 'font' | 'fetch' | 'document';
  type?: string;
  crossorigin?: 'anonymous' | 'use-credentials';
  fetchpriority?: 'high' | 'low' | 'auto';
  media?: string;
  integrity?: string;
}

export interface PrefetchResource {
  href: string;
  as?: string;
  type?: string;
}

export interface PreconnectDomain {
  href: string;
  crossorigin?: boolean;
}

export interface ResourceLoadMetrics {
  url: string;
  loadTime: number;
  size?: number;
  cached: boolean;
  preloaded: boolean;
}

/**
 * Resource Preloading Service
 * 
 * Manages resource preloading, prefetching, and preconnecting
 * to optimize loading performance and reduce latency
 */
@Injectable({
  providedIn: 'root'
})
export class ResourcePreloadingService {
  private document = inject(DOCUMENT);
  
  private _preloadedResources = signal<Map<string, PreloadResource>>(new Map());
  private _prefetchedResources = signal<Map<string, PrefetchResource>>(new Map());
  private _preconnectedDomains = signal<Map<string, PreconnectDomain>>(new Map());
  private _loadMetrics = signal<ResourceLoadMetrics[]>([]);

  readonly preloadedResources = computed(() => Array.from(this._preloadedResources().values()));
  readonly prefetchedResources = computed(() => Array.from(this._prefetchedResources().values()));
  readonly preconnectedDomains = computed(() => Array.from(this._preconnectedDomains().values()));
  readonly loadMetrics = this._loadMetrics.asReadonly();

  readonly preloadStats = computed(() => {
    const metrics = this.loadMetrics();
    const preloadedMetrics = metrics.filter(m => m.preloaded);
    
    return {
      totalPreloaded: this.preloadedResources().length,
      successfulPreloads: preloadedMetrics.length,
      averageLoadTime: preloadedMetrics.length > 0 
        ? preloadedMetrics.reduce((sum, m) => sum + m.loadTime, 0) / preloadedMetrics.length 
        : 0,
      cacheHitRate: preloadedMetrics.length > 0
        ? (preloadedMetrics.filter(m => m.cached).length / preloadedMetrics.length) * 100
        : 0
    };
  });

  constructor() {
    this.setupDefaultPreconnections();
    this.initializeResourceMonitoring();
  }

  /**
   * Preload a critical resource
   */
  preload(resource: PreloadResource): void {
    // Check if already preloaded
    if (this._preloadedResources().has(resource.href)) {
      return;
    }

    const link = this.document.createElement('link');
    link.rel = 'preload';
    link.href = resource.href;
    link.as = resource.as;
    
    if (resource.type) link.type = resource.type;
    if (resource.crossorigin) link.crossOrigin = resource.crossorigin;
    if (resource.fetchpriority) link.setAttribute('fetchpriority', resource.fetchpriority);
    if (resource.media) link.media = resource.media;
    if (resource.integrity) link.integrity = resource.integrity;

    // Add load event listener for metrics
    link.addEventListener('load', () => {
      this.recordResourceLoad(resource.href, true);
    });

    link.addEventListener('error', () => {
      console.warn(`Failed to preload resource: ${resource.href}`);
    });

    this.document.head.appendChild(link);
    
    this._preloadedResources.update(resources => {
      const newResources = new Map(resources);
      newResources.set(resource.href, resource);
      return newResources;
    });
  }

  /**
   * Prefetch a resource for future navigation
   */
  prefetch(resource: PrefetchResource): void {
    // Check if already prefetched
    if (this._prefetchedResources().has(resource.href)) {
      return;
    }

    const link = this.document.createElement('link');
    link.rel = 'prefetch';
    link.href = resource.href;
    
    if (resource.as) link.as = resource.as;
    if (resource.type) link.type = resource.type;

    this.document.head.appendChild(link);
    
    this._prefetchedResources.update(resources => {
      const newResources = new Map(resources);
      newResources.set(resource.href, resource);
      return newResources;
    });
  }

  /**
   * Preconnect to external domains
   */
  preconnect(domain: PreconnectDomain): void {
    // Check if already preconnected
    if (this._preconnectedDomains().has(domain.href)) {
      return;
    }

    const link = this.document.createElement('link');
    link.rel = 'preconnect';
    link.href = domain.href;
    
    if (domain.crossorigin) {
      link.crossOrigin = 'anonymous';
    }

    this.document.head.appendChild(link);
    
    this._preconnectedDomains.update(domains => {
      const newDomains = new Map(domains);
      newDomains.set(domain.href, domain);
      return newDomains;
    });
  }

  /**
   * DNS prefetch for external domains
   */
  dnsPrefetch(domain: string): void {
    const link = this.document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = domain;
    this.document.head.appendChild(link);
  }

  /**
   * Preload critical above-the-fold images
   */
  preloadCriticalImages(images: string[]): void {
    images.forEach(imageUrl => {
      this.preload({
        href: imageUrl,
        as: 'image',
        fetchpriority: 'high'
      });
    });
  }

  /**
   * Preload critical fonts
   */
  preloadCriticalFonts(fonts: string[]): void {
    fonts.forEach(fontUrl => {
      this.preload({
        href: fontUrl,
        as: 'font',
        type: 'font/woff2',
        crossorigin: 'anonymous',
        fetchpriority: 'high'
      });
    });
  }

  /**
   * Preload critical CSS
   */
  preloadCriticalCSS(cssFiles: string[]): void {
    cssFiles.forEach(cssUrl => {
      this.preload({
        href: cssUrl,
        as: 'style',
        fetchpriority: 'high'
      });
    });
  }

  /**
   * Preload JavaScript modules
   */
  preloadJavaScript(jsFiles: string[]): void {
    jsFiles.forEach(jsUrl => {
      this.preload({
        href: jsUrl,
        as: 'script',
        fetchpriority: 'low' // Usually not critical for initial render
      });
    });
  }

  /**
   * Intelligent preloading based on user behavior
   */
  intelligentPreload(routes: string[]): void {
    // Preload likely next routes based on current route
    const currentPath = window.location.pathname;
    const likelyRoutes = this.predictNextRoutes(currentPath, routes);
    
    likelyRoutes.forEach(route => {
      this.prefetch({ href: route });
    });
  }

  /**
   * Preload resources based on viewport intersection
   */
  preloadOnIntersection(element: Element, resources: PreloadResource[]): void {
    if (!('IntersectionObserver' in window)) {
      // Fallback: preload immediately
      resources.forEach(resource => this.preload(resource));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            resources.forEach(resource => this.preload(resource));
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '100px' } // Start preloading 100px before element enters viewport
    );

    observer.observe(element);
  }

  /**
   * Adaptive preloading based on connection speed
   */
  adaptivePreload(resources: PreloadResource[]): void {
    const connection = (navigator as any).connection;
    
    if (!connection) {
      // No connection info, preload high priority only
      resources
        .filter(r => r.fetchpriority === 'high')
        .forEach(r => this.preload(r));
      return;
    }

    const effectiveType = connection.effectiveType;
    
    switch (effectiveType) {
      case 'slow-2g':
      case '2g':
        // Only preload critical resources on slow connections
        resources
          .filter(r => r.fetchpriority === 'high')
          .slice(0, 2) // Limit to 2 resources
          .forEach(r => this.preload(r));
        break;
        
      case '3g':
        // Preload high and medium priority resources
        resources
          .filter(r => r.fetchpriority === 'high' || r.fetchpriority === 'auto')
          .slice(0, 5) // Limit to 5 resources
          .forEach(r => this.preload(r));
        break;
        
      case '4g':
      default:
        // Preload all resources on fast connections
        resources.forEach(r => this.preload(r));
        break;
    }
  }

  /**
   * Get preloading recommendations
   */
  getPreloadingRecommendations(): string[] {
    const recommendations: string[] = [];
    const stats = this.preloadStats();
    
    if (stats.totalPreloaded === 0) {
      recommendations.push('No resources are being preloaded - consider preloading critical resources');
    }
    
    if (stats.cacheHitRate < 50) {
      recommendations.push('Low cache hit rate - ensure preloaded resources are actually used');
    }
    
    if (stats.averageLoadTime > 500) {
      recommendations.push('High average load time for preloaded resources - optimize resource sizes');
    }
    
    const preconnectedCount = this.preconnectedDomains().length;
    if (preconnectedCount === 0) {
      recommendations.push('No domains preconnected - add preconnect hints for external resources');
    }
    
    return recommendations;
  }

  /**
   * Clear all preloading data
   */
  clearPreloadingData(): void {
    this._preloadedResources.set(new Map());
    this._prefetchedResources.set(new Map());
    this._preconnectedDomains.set(new Map());
    this._loadMetrics.set([]);
  }

  private setupDefaultPreconnections(): void {
    // Common external domains to preconnect
    const commonDomains = [
      { href: 'https://fonts.googleapis.com', crossorigin: true },
      { href: 'https://fonts.gstatic.com', crossorigin: true },
      { href: 'https://cdn.jsdelivr.net', crossorigin: false },
      { href: 'https://unpkg.com', crossorigin: false }
    ];

    commonDomains.forEach(domain => {
      this.preconnect(domain);
    });
  }

  private initializeResourceMonitoring(): void {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
      return;
    }

    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        
        entries.forEach((entry: any) => {
          if (entry.entryType === 'resource') {
            const isPreloaded = this._preloadedResources().has(entry.name);
            
            this._loadMetrics.update(metrics => [...metrics, {
              url: entry.name,
              loadTime: entry.duration,
              size: entry.transferSize,
              cached: entry.transferSize === 0,
              preloaded: isPreloaded
            }]);
          }
        });
      });

      observer.observe({ entryTypes: ['resource'] });
    } catch (error) {
      console.warn('Resource monitoring not supported:', error);
    }
  }

  private recordResourceLoad(url: string, preloaded: boolean): void {
    const startTime = performance.now();
    
    // This would be called when a resource finishes loading
    this._loadMetrics.update(metrics => [...metrics, {
      url,
      loadTime: performance.now() - startTime,
      cached: false, // Would be determined by actual load
      preloaded
    }]);
  }

  private predictNextRoutes(currentPath: string, allRoutes: string[]): string[] {
    // Simple prediction based on common navigation patterns
    const predictions: string[] = [];
    
    // If on home page, predict common next pages
    if (currentPath === '/' || currentPath === '/home') {
      predictions.push('/about', '/products', '/services');
    }
    
    // If on a category page, predict detail pages
    if (currentPath.includes('/category/')) {
      predictions.push('/product/', '/details/');
    }
    
    // If on a product page, predict related pages
    if (currentPath.includes('/product/')) {
      predictions.push('/cart', '/checkout', '/reviews');
    }
    
    return predictions
      .filter(route => allRoutes.includes(route))
      .slice(0, 3); // Limit to 3 predictions
  }
}