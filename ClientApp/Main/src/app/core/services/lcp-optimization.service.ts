import { Injectable, signal, computed, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

export interface LCPMetrics {
  value: number;
  element?: Element;
  url?: string;
  timestamp: number;
  rating: 'good' | 'needs-improvement' | 'poor';
}

export interface ResourceHint {
  href: string;
  as: string;
  type?: string;
  crossorigin?: string;
  fetchpriority?: 'high' | 'low' | 'auto';
}

export interface CriticalResource {
  url: string;
  type: 'image' | 'font' | 'css' | 'js';
  priority: 'critical' | 'high' | 'medium' | 'low';
  preload: boolean;
  prefetch: boolean;
}

/**
 * LCP Optimization Service
 * 
 * Optimizes Largest Contentful Paint through:
 * - Critical resource preloading and prefetching
 * - Resource prioritization and scheduling
 * - Render-blocking resource optimization
 * - Performance monitoring and metrics collection
 */
@Injectable({
  providedIn: 'root'
})
export class LCPOptimizationService {
  private document = inject(DOCUMENT);
  
  private _lcpMetrics = signal<LCPMetrics[]>([]);
  private _criticalResources = signal<Map<string, CriticalResource>>(new Map());
  private _resourceHints = signal<ResourceHint[]>([]);
  
  readonly lcpMetrics = this._lcpMetrics.asReadonly();
  readonly criticalResources = computed(() => Array.from(this._criticalResources().values()));
  readonly resourceHints = this._resourceHints.asReadonly();
  
  readonly currentLCP = computed(() => {
    const metrics = this.lcpMetrics();
    return metrics.length > 0 ? metrics[metrics.length - 1] : null;
  });
  
  readonly averageLCP = computed(() => {
    const metrics = this.lcpMetrics();
    if (metrics.length === 0) return 0;
    return metrics.reduce((sum, metric) => sum + metric.value, 0) / metrics.length;
  });

  constructor() {
    this.initializeLCPObserver();
    this.setupCriticalResourcePreloading();
  }

  /**
   * Add critical resource for preloading
   */
  addCriticalResource(resource: CriticalResource): void {
    this._criticalResources.update(resources => {
      const newResources = new Map(resources);
      newResources.set(resource.url, resource);
      return newResources;
    });

    if (resource.preload) {
      this.preloadResource(resource);
    }
    
    if (resource.prefetch) {
      this.prefetchResource(resource);
    }
  }

  /**
   * Preload critical resources
   */
  preloadResource(resource: CriticalResource): void {
    const hint: ResourceHint = {
      href: resource.url,
      as: resource.type === 'image' ? 'image' : resource.type === 'font' ? 'font' : 'fetch',
      fetchpriority: resource.priority === 'critical' ? 'high' : 'auto'
    };

    if (resource.type === 'font') {
      hint.crossorigin = 'anonymous';
    }

    this.addResourceHint('preload', hint);
  }

  /**
   * Prefetch resources for future navigation
   */
  prefetchResource(resource: CriticalResource): void {
    const hint: ResourceHint = {
      href: resource.url,
      as: resource.type === 'image' ? 'image' : 'fetch'
    };

    this.addResourceHint('prefetch', hint);
  }

  /**
   * Add resource hint to document head
   */
  addResourceHint(rel: 'preload' | 'prefetch' | 'preconnect' | 'dns-prefetch', hint: ResourceHint): void {
    // Check if hint already exists
    const existingHint = this.document.querySelector(
      `link[rel="${rel}"][href="${hint.href}"]`
    );
    
    if (existingHint) return;

    const link = this.document.createElement('link');
    link.rel = rel;
    link.href = hint.href;
    
    if (hint.as) link.setAttribute('as', hint.as);
    if (hint.type) link.type = hint.type;
    if (hint.crossorigin) link.crossOrigin = hint.crossorigin;
    if (hint.fetchpriority) link.setAttribute('fetchpriority', hint.fetchpriority);

    this.document.head.appendChild(link);
    
    this._resourceHints.update(hints => [...hints, hint]);
  }

  /**
   * Optimize critical rendering path
   */
  optimizeCriticalRenderingPath(): void {
    // Preconnect to external domains
    this.preconnectToExternalDomains();
    
    // Preload critical fonts
    this.preloadCriticalFonts();
    
    // Optimize CSS delivery
    this.optimizeCSSDelivery();
    
    // Prioritize above-the-fold images
    this.prioritizeAboveFoldImages();
  }

  /**
   * Get LCP optimization recommendations
   */
  getLCPRecommendations(): string[] {
    const recommendations: string[] = [];
    const currentLCP = this.currentLCP();
    
    if (!currentLCP) {
      recommendations.push('Enable LCP monitoring to get specific recommendations');
      return recommendations;
    }

    // LCP performance thresholds
    if (currentLCP.value > 4000) {
      recommendations.push('LCP is poor (>4s) - immediate optimization needed');
      recommendations.push('Consider reducing server response time');
      recommendations.push('Optimize critical resource loading');
    } else if (currentLCP.value > 2500) {
      recommendations.push('LCP needs improvement (>2.5s) - optimization recommended');
      recommendations.push('Preload LCP element resources');
      recommendations.push('Optimize image formats and compression');
    } else {
      recommendations.push('LCP is good (<2.5s) - maintain current optimizations');
    }

    // Element-specific recommendations
    if (currentLCP.element) {
      const tagName = currentLCP.element.tagName.toLowerCase();
      
      if (tagName === 'img') {
        recommendations.push('LCP element is an image - ensure it\'s optimized and preloaded');
        recommendations.push('Use responsive images with appropriate sizes');
        recommendations.push('Consider using WebP/AVIF formats');
      } else if (tagName === 'video') {
        recommendations.push('LCP element is a video - optimize video loading and poster image');
      } else {
        recommendations.push(`LCP element is ${tagName} - optimize text rendering and font loading`);
      }
    }

    return recommendations;
  }

  /**
   * Monitor LCP improvements
   */
  trackLCPImprovement(): any {
    const metrics = this.lcpMetrics();
    if (metrics.length < 2) {
      return { improvement: 0, trend: 'insufficient-data' };
    }

    const recent = metrics.slice(-5); // Last 5 measurements
    const older = metrics.slice(-10, -5); // Previous 5 measurements
    
    if (older.length === 0) {
      return { improvement: 0, trend: 'insufficient-data' };
    }

    const recentAvg = recent.reduce((sum, m) => sum + m.value, 0) / recent.length;
    const olderAvg = older.reduce((sum, m) => sum + m.value, 0) / older.length;
    
    const improvement = ((olderAvg - recentAvg) / olderAvg) * 100;
    
    return {
      improvement: Math.round(improvement),
      trend: improvement > 5 ? 'improving' : improvement < -5 ? 'degrading' : 'stable',
      recentAverage: Math.round(recentAvg),
      previousAverage: Math.round(olderAvg)
    };
  }

  /**
   * Clear LCP metrics
   */
  clearMetrics(): void {
    this._lcpMetrics.set([]);
  }

  private initializeLCPObserver(): void {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
      return;
    }

    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        
        entries.forEach((entry: any) => {
          if (entry.entryType === 'largest-contentful-paint') {
            const lcpMetric: LCPMetrics = {
              value: entry.startTime,
              element: entry.element,
              url: entry.url,
              timestamp: Date.now(),
              rating: this.rateLCP(entry.startTime)
            };
            
            this._lcpMetrics.update(metrics => [...metrics, lcpMetric]);
            
            // Log LCP for debugging
            console.log(`🎯 LCP: ${entry.startTime.toFixed(2)}ms`, {
              element: entry.element,
              rating: lcpMetric.rating
            });
          }
        });
      });

      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (error) {
      console.warn('LCP observer not supported:', error);
    }
  }

  private rateLCP(value: number): 'good' | 'needs-improvement' | 'poor' {
    if (value <= 2500) return 'good';
    if (value <= 4000) return 'needs-improvement';
    return 'poor';
  }

  private setupCriticalResourcePreloading(): void {
    // Add common critical resources
    const criticalResources: CriticalResource[] = [
      // Critical fonts
      {
        url: '/assets/fonts/inter-var.woff2',
        type: 'font',
        priority: 'critical',
        preload: true,
        prefetch: false
      },
      // Hero images
      {
        url: '/assets/images/hero-image.webp',
        type: 'image',
        priority: 'critical',
        preload: true,
        prefetch: false
      },
      // Critical CSS
      {
        url: '/assets/css/critical.css',
        type: 'css',
        priority: 'critical',
        preload: true,
        prefetch: false
      }
    ];

    criticalResources.forEach(resource => {
      this.addCriticalResource(resource);
    });
  }

  private preconnectToExternalDomains(): void {
    const externalDomains = [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
      'https://cdn.jsdelivr.net',
      'https://unpkg.com'
    ];

    externalDomains.forEach(domain => {
      this.addResourceHint('preconnect', { href: domain, as: 'fetch' });
    });
  }

  private preloadCriticalFonts(): void {
    const criticalFonts = [
      '/assets/fonts/inter-var.woff2',
      '/assets/fonts/inter-bold.woff2'
    ];

    criticalFonts.forEach(font => {
      this.addCriticalResource({
        url: font,
        type: 'font',
        priority: 'critical',
        preload: true,
        prefetch: false
      });
    });
  }

  private optimizeCSSDelivery(): void {
    // Inline critical CSS would be handled at build time
    // Here we can preload non-critical CSS
    const nonCriticalCSS = [
      '/assets/css/components.css',
      '/assets/css/utilities.css'
    ];

    nonCriticalCSS.forEach(css => {
      this.addResourceHint('preload', {
        href: css,
        as: 'style',
        fetchpriority: 'low'
      });
    });
  }

  private prioritizeAboveFoldImages(): void {
    // This would typically be called with specific image URLs
    // For demo purposes, we'll add some common patterns
    const aboveFoldImages = [
      '/assets/images/hero-banner.webp',
      '/assets/images/logo.svg'
    ];

    aboveFoldImages.forEach(image => {
      this.addCriticalResource({
        url: image,
        type: 'image',
        priority: 'high',
        preload: true,
        prefetch: false
      });
    });
  }
}