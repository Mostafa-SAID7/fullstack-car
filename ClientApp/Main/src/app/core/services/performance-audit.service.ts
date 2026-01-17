import { Injectable, inject, signal, computed } from '@angular/core';
import { Platform } from '@angular/cdk/platform';
import { PWAService } from './pwa.service';

export interface PerformanceMetrics {
  // Core Web Vitals
  lcp?: number; // Largest Contentful Paint
  fid?: number; // First Input Delay
  cls?: number; // Cumulative Layout Shift
  
  // Other important metrics
  fcp?: number; // First Contentful Paint
  ttfb?: number; // Time to First Byte
  fmp?: number; // First Meaningful Paint
  tti?: number; // Time to Interactive
  
  // Custom metrics
  domContentLoaded?: number;
  loadComplete?: number;
  
  // Resource metrics
  resourceCount?: number;
  totalResourceSize?: number;
  
  // JavaScript metrics
  jsHeapSize?: number;
  jsHeapSizeLimit?: number;
  
  timestamp: number;
}

export interface PerformanceReport {
  metrics: PerformanceMetrics;
  score: number;
  recommendations: PerformanceRecommendation[];
  timestamp: number;
}

export interface PerformanceRecommendation {
  type: 'critical' | 'warning' | 'info';
  category: 'loading' | 'interactivity' | 'visual-stability' | 'resource' | 'javascript';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  effort: 'high' | 'medium' | 'low';
  action?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PerformanceAuditService {
  private platform = inject(Platform);
  private pwaService = inject(PWAService);

  // Reactive state
  private _currentMetrics = signal<PerformanceMetrics | null>(null);
  private _performanceHistory = signal<PerformanceMetrics[]>([]);
  private _isMonitoring = signal(false);

  // Public readonly signals
  readonly currentMetrics = this._currentMetrics.asReadonly();
  readonly performanceHistory = this._performanceHistory.asReadonly();
  readonly isMonitoring = this._isMonitoring.asReadonly();

  // Computed performance score
  readonly performanceScore = computed(() => {
    const metrics = this._currentMetrics();
    if (!metrics) return 0;
    return this.calculatePerformanceScore(metrics);
  });

  // Core Web Vitals thresholds
  private readonly thresholds = {
    lcp: { good: 2500, needsImprovement: 4000 },
    fid: { good: 100, needsImprovement: 300 },
    cls: { good: 0.1, needsImprovement: 0.25 },
    fcp: { good: 1800, needsImprovement: 3000 },
    ttfb: { good: 800, needsImprovement: 1800 }
  };

  constructor() {
    if (this.platform.isBrowser) {
      this.initializePerformanceMonitoring();
    }
  }

  /**
   * Initialize performance monitoring
   */
  private initializePerformanceMonitoring(): void {
    // Wait for page load to complete
    if (document.readyState === 'complete') {
      this.startMonitoring();
    } else {
      window.addEventListener('load', () => this.startMonitoring());
    }

    // Monitor performance periodically
    setInterval(() => {
      if (this._isMonitoring()) {
        this.collectMetrics();
      }
    }, 30000); // Every 30 seconds
  }

  /**
   * Start performance monitoring
   */
  startMonitoring(): void {
    this._isMonitoring.set(true);
    this.collectMetrics();
    this.setupPerformanceObservers();
  }

  /**
   * Stop performance monitoring
   */
  stopMonitoring(): void {
    this._isMonitoring.set(false);
  }

  /**
   * Collect current performance metrics
   */
  async collectMetrics(): Promise<PerformanceMetrics> {
    const metrics: PerformanceMetrics = {
      timestamp: Date.now()
    };

    if (!this.platform.isBrowser) {
      return metrics;
    }

    try {
      // Navigation timing
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        metrics.domContentLoaded = navigation.domContentLoadedEventEnd - navigation.fetchStart;
        metrics.loadComplete = navigation.loadEventEnd - navigation.fetchStart;
        metrics.ttfb = navigation.responseStart - navigation.fetchStart;
      }

      // Paint timing
      const paintEntries = performance.getEntriesByType('paint');
      paintEntries.forEach(entry => {
        if (entry.name === 'first-contentful-paint') {
          metrics.fcp = entry.startTime;
        }
      });

      // Largest Contentful Paint
      const lcpEntries = performance.getEntriesByType('largest-contentful-paint');
      if (lcpEntries.length > 0) {
        const lastEntry = lcpEntries[lcpEntries.length - 1] as any;
        metrics.lcp = lastEntry.startTime;
      }

      // Layout shift
      const clsEntries = performance.getEntriesByType('layout-shift');
      let clsScore = 0;
      clsEntries.forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsScore += entry.value;
        }
      });
      metrics.cls = clsScore;

      // Resource metrics
      const resourceEntries = performance.getEntriesByType('resource');
      metrics.resourceCount = resourceEntries.length;
      metrics.totalResourceSize = resourceEntries.reduce((total, entry: any) => {
        return total + (entry.transferSize || 0);
      }, 0);

      // Memory metrics (if available)
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        metrics.jsHeapSize = memory.usedJSHeapSize;
        metrics.jsHeapSizeLimit = memory.jsHeapSizeLimit;
      }

      // Time to Interactive (approximation)
      metrics.tti = this.estimateTimeToInteractive();

    } catch (error) {
      console.warn('Failed to collect performance metrics:', error);
    }

    this._currentMetrics.set(metrics);
    this._performanceHistory.update(history => [metrics, ...history.slice(0, 99)]);

    return metrics;
  }

  /**
   * Set up performance observers
   */
  private setupPerformanceObservers(): void {
    if (!('PerformanceObserver' in window)) {
      return;
    }

    try {
      // Largest Contentful Paint observer
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this._currentMetrics.update(metrics => ({
          ...metrics,
          lcp: lastEntry.startTime,
          timestamp: Date.now()
        }));
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // First Input Delay observer
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          this._currentMetrics.update(metrics => ({
            ...metrics,
            fid: entry.processingStart - entry.startTime,
            timestamp: Date.now()
          }));
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });

      // Cumulative Layout Shift observer
      const clsObserver = new PerformanceObserver((list) => {
        let clsScore = this._currentMetrics()?.cls || 0;
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsScore += entry.value;
          }
        });
        this._currentMetrics.update(metrics => ({
          ...metrics,
          cls: clsScore,
          timestamp: Date.now()
        }));
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });

    } catch (error) {
      console.warn('Failed to set up performance observers:', error);
    }
  }

  /**
   * Estimate Time to Interactive
   */
  private estimateTimeToInteractive(): number {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (!navigation) return 0;

    // Simple estimation: DOM content loaded + 1 second for JavaScript execution
    return navigation.domContentLoadedEventEnd - navigation.fetchStart + 1000;
  }

  /**
   * Calculate overall performance score (0-100)
   */
  private calculatePerformanceScore(metrics: PerformanceMetrics): number {
    let score = 100;
    let totalWeight = 0;

    // LCP (25% weight)
    if (metrics.lcp !== undefined) {
      const lcpScore = this.getMetricScore(metrics.lcp, this.thresholds.lcp);
      score += lcpScore * 0.25;
      totalWeight += 0.25;
    }

    // FID (25% weight)
    if (metrics.fid !== undefined) {
      const fidScore = this.getMetricScore(metrics.fid, this.thresholds.fid);
      score += fidScore * 0.25;
      totalWeight += 0.25;
    }

    // CLS (25% weight)
    if (metrics.cls !== undefined) {
      const clsScore = this.getMetricScore(metrics.cls, this.thresholds.cls);
      score += clsScore * 0.25;
      totalWeight += 0.25;
    }

    // FCP (15% weight)
    if (metrics.fcp !== undefined) {
      const fcpScore = this.getMetricScore(metrics.fcp, this.thresholds.fcp);
      score += fcpScore * 0.15;
      totalWeight += 0.15;
    }

    // TTFB (10% weight)
    if (metrics.ttfb !== undefined) {
      const ttfbScore = this.getMetricScore(metrics.ttfb, this.thresholds.ttfb);
      score += ttfbScore * 0.10;
      totalWeight += 0.10;
    }

    return totalWeight > 0 ? Math.round(score / totalWeight) : 0;
  }

  /**
   * Get score for individual metric
   */
  private getMetricScore(value: number, threshold: { good: number; needsImprovement: number }): number {
    if (value <= threshold.good) {
      return 100;
    } else if (value <= threshold.needsImprovement) {
      return 50;
    } else {
      return 0;
    }
  }

  /**
   * Generate performance report with recommendations
   */
  generateReport(): PerformanceReport {
    const metrics = this._currentMetrics();
    if (!metrics) {
      return {
        metrics: { timestamp: Date.now() },
        score: 0,
        recommendations: [],
        timestamp: Date.now()
      };
    }

    const score = this.calculatePerformanceScore(metrics);
    const recommendations = this.generateRecommendations(metrics);

    return {
      metrics,
      score,
      recommendations,
      timestamp: Date.now()
    };
  }

  /**
   * Generate performance recommendations
   */
  private generateRecommendations(metrics: PerformanceMetrics): PerformanceRecommendation[] {
    const recommendations: PerformanceRecommendation[] = [];

    // LCP recommendations
    if (metrics.lcp && metrics.lcp > this.thresholds.lcp.good) {
      recommendations.push({
        type: metrics.lcp > this.thresholds.lcp.needsImprovement ? 'critical' : 'warning',
        category: 'loading',
        title: 'Improve Largest Contentful Paint',
        description: `LCP is ${Math.round(metrics.lcp)}ms. Target is under ${this.thresholds.lcp.good}ms.`,
        impact: 'high',
        effort: 'medium',
        action: 'Optimize images, reduce server response times, eliminate render-blocking resources'
      });
    }

    // FID recommendations
    if (metrics.fid && metrics.fid > this.thresholds.fid.good) {
      recommendations.push({
        type: metrics.fid > this.thresholds.fid.needsImprovement ? 'critical' : 'warning',
        category: 'interactivity',
        title: 'Reduce First Input Delay',
        description: `FID is ${Math.round(metrics.fid)}ms. Target is under ${this.thresholds.fid.good}ms.`,
        impact: 'high',
        effort: 'medium',
        action: 'Break up long tasks, optimize JavaScript execution, use web workers'
      });
    }

    // CLS recommendations
    if (metrics.cls && metrics.cls > this.thresholds.cls.good) {
      recommendations.push({
        type: metrics.cls > this.thresholds.cls.needsImprovement ? 'critical' : 'warning',
        category: 'visual-stability',
        title: 'Minimize Cumulative Layout Shift',
        description: `CLS is ${metrics.cls.toFixed(3)}. Target is under ${this.thresholds.cls.good}.`,
        impact: 'high',
        effort: 'low',
        action: 'Set dimensions for images and embeds, avoid inserting content above existing content'
      });
    }

    // Resource recommendations
    if (metrics.resourceCount && metrics.resourceCount > 100) {
      recommendations.push({
        type: 'warning',
        category: 'resource',
        title: 'Reduce Number of Resources',
        description: `${metrics.resourceCount} resources loaded. Consider bundling and optimization.`,
        impact: 'medium',
        effort: 'medium',
        action: 'Bundle resources, use HTTP/2, implement resource hints'
      });
    }

    // Memory recommendations
    if (metrics.jsHeapSize && metrics.jsHeapSizeLimit) {
      const memoryUsage = (metrics.jsHeapSize / metrics.jsHeapSizeLimit) * 100;
      if (memoryUsage > 80) {
        recommendations.push({
          type: 'warning',
          category: 'javascript',
          title: 'High Memory Usage',
          description: `JavaScript heap is ${Math.round(memoryUsage)}% full.`,
          impact: 'medium',
          effort: 'high',
          action: 'Optimize memory usage, fix memory leaks, use lazy loading'
        });
      }
    }

    return recommendations;
  }

  /**
   * Get Core Web Vitals status
   */
  getCoreWebVitalsStatus(): {
    lcp: 'good' | 'needs-improvement' | 'poor' | 'unknown';
    fid: 'good' | 'needs-improvement' | 'poor' | 'unknown';
    cls: 'good' | 'needs-improvement' | 'poor' | 'unknown';
  } {
    const metrics = this._currentMetrics();
    
    return {
      lcp: this.getMetricStatus(metrics?.lcp, this.thresholds.lcp),
      fid: this.getMetricStatus(metrics?.fid, this.thresholds.fid),
      cls: this.getMetricStatus(metrics?.cls, this.thresholds.cls)
    };
  }

  /**
   * Get metric status
   */
  private getMetricStatus(
    value: number | undefined, 
    threshold: { good: number; needsImprovement: number }
  ): 'good' | 'needs-improvement' | 'poor' | 'unknown' {
    if (value === undefined) return 'unknown';
    if (value <= threshold.good) return 'good';
    if (value <= threshold.needsImprovement) return 'needs-improvement';
    return 'poor';
  }

  /**
   * Export performance data
   */
  exportPerformanceData(): string {
    return JSON.stringify({
      currentMetrics: this._currentMetrics(),
      history: this._performanceHistory(),
      report: this.generateReport()
    }, null, 2);
  }

  /**
   * Clear performance history
   */
  clearHistory(): void {
    this._performanceHistory.set([]);
  }

  /**
   * Measure custom performance mark
   */
  mark(name: string): void {
    if (this.platform.isBrowser && 'performance' in window) {
      performance.mark(name);
    }
  }

  /**
   * Measure time between marks
   */
  measure(name: string, startMark: string, endMark?: string): number {
    if (!this.platform.isBrowser || !('performance' in window)) {
      return 0;
    }

    try {
      if (endMark) {
        performance.measure(name, startMark, endMark);
      } else {
        performance.measure(name, startMark);
      }

      const measures = performance.getEntriesByName(name, 'measure');
      return measures.length > 0 ? measures[measures.length - 1].duration : 0;
    } catch (error) {
      console.warn('Failed to measure performance:', error);
      return 0;
    }
  }
}