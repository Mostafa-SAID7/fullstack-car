import { Injectable, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { BehaviorSubject, Observable, interval } from 'rxjs';
import { AnalyticsService } from './analytics.service';
import { EventTrackingService } from './event-tracking.service';

export interface PerformanceMetrics {
  // Core Web Vitals
  cls: number | null;
  fid: number | null;
  lcp: number | null;
  fcp: number | null;
  ttfb: number | null;
  
  // Navigation Timing
  navigationTiming: {
    dnsLookup: number;
    tcpConnect: number;
    request: number;
    response: number;
    domProcessing: number;
    loadComplete: number;
  } | null;
  
  // Resource Timing
  resourceTiming: {
    totalResources: number;
    slowResources: ResourceTiming[];
    largestResources: ResourceTiming[];
  };
  
  // Memory Usage
  memoryUsage: {
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  } | null;
  
  // Frame Rate
  frameRate: {
    current: number;
    average: number;
    min: number;
    max: number;
  };
  
  // Bundle Analysis
  bundleMetrics: {
    totalSize: number;
    loadTime: number;
    chunkCount: number;
  };
  
  timestamp: Date;
}

export interface ResourceTiming {
  name: string;
  duration: number;
  size: number;
  type: string;
}

export interface PerformanceAlert {
  id: string;
  type: 'warning' | 'error' | 'info';
  metric: string;
  value: number;
  threshold: number;
  message: string;
  timestamp: Date;
  resolved: boolean;
}

export interface PerformanceConfig {
  enableCoreWebVitals: boolean;
  enableResourceMonitoring: boolean;
  enableMemoryMonitoring: boolean;
  enableFrameRateMonitoring: boolean;
  enableBundleAnalysis: boolean;
  monitoringInterval: number;
  alertThresholds: {
    cls: number;
    fid: number;
    lcp: number;
    memoryUsage: number;
    frameRate: number;
  };
}

/**
 * Performance Monitoring Service
 * 
 * Comprehensive performance monitoring and alerting:
 * - Core Web Vitals tracking (CLS, FID, LCP)
 * - Navigation and resource timing
 * - Memory usage monitoring
 * - Frame rate tracking
 * - Bundle size analysis
 * - Performance alerts and recommendations
 */
@Injectable({
  providedIn: 'root'
})
export class PerformanceMonitoringService {
  private document = inject(DOCUMENT);
  private analyticsService = inject(AnalyticsService);
  private eventTrackingService = inject(EventTrackingService);

  private config: PerformanceConfig = {
    enableCoreWebVitals: true,
    enableResourceMonitoring: true,
    enableMemoryMonitoring: true,
    enableFrameRateMonitoring: true,
    enableBundleAnalysis: true,
    monitoringInterval: 5000, // 5 seconds
    alertThresholds: {
      cls: 0.1,
      fid: 100,
      lcp: 2500,
      memoryUsage: 50 * 1024 * 1024, // 50MB
      frameRate: 30
    }
  };

  private performanceMetrics = new BehaviorSubject<PerformanceMetrics | null>(null);
  private performanceAlerts = new BehaviorSubject<PerformanceAlert[]>([]);
  private isMonitoring = false;
  private performanceObserver?: PerformanceObserver;
  private frameRateMonitor?: number;
  private memoryMonitor?: number;

  public readonly performanceMetrics$ = this.performanceMetrics.asObservable();
  public readonly performanceAlerts$ = this.performanceAlerts.asObservable();

  // Frame rate tracking
  private frameCount = 0;
  private frameRates: number[] = [];
  private lastFrameTime = performance.now();

  constructor() {
    this.initializePerformanceMonitoring();
  }

  /**
   * Initialize performance monitoring
   */
  private initializePerformanceMonitoring(): void {
    if (typeof window === 'undefined') return;

    this.startMonitoring();
    console.log('📊 Performance monitoring initialized');
  }

  /**
   * Start performance monitoring
   */
  startMonitoring(): void {
    if (this.isMonitoring) return;

    this.isMonitoring = true;

    // Core Web Vitals monitoring
    if (this.config.enableCoreWebVitals) {
      this.setupCoreWebVitalsMonitoring();
    }

    // Resource monitoring
    if (this.config.enableResourceMonitoring) {
      this.setupResourceMonitoring();
    }

    // Memory monitoring
    if (this.config.enableMemoryMonitoring) {
      this.setupMemoryMonitoring();
    }

    // Frame rate monitoring
    if (this.config.enableFrameRateMonitoring) {
      this.setupFrameRateMonitoring();
    }

    // Bundle analysis
    if (this.config.enableBundleAnalysis) {
      this.setupBundleAnalysis();
    }

    // Periodic metrics collection
    this.setupPeriodicCollection();

    console.log('📊 Performance monitoring started');
  }

  /**
   * Stop performance monitoring
   */
  stopMonitoring(): void {
    if (!this.isMonitoring) return;

    this.isMonitoring = false;

    if (this.performanceObserver) {
      this.performanceObserver.disconnect();
    }

    if (this.frameRateMonitor) {
      cancelAnimationFrame(this.frameRateMonitor);
    }

    if (this.memoryMonitor) {
      clearInterval(this.memoryMonitor);
    }

    console.log('📊 Performance monitoring stopped');
  }

  /**
   * Setup Core Web Vitals monitoring
   */
  private setupCoreWebVitalsMonitoring(): void {
    if (!('PerformanceObserver' in window)) {
      console.warn('PerformanceObserver not supported');
      return;
    }

    try {
      // CLS (Cumulative Layout Shift)
      const clsObserver = new PerformanceObserver((list) => {
        let clsValue = 0;
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        }
        
        if (clsValue > 0) {
          this.updateMetric('cls', clsValue);
          this.checkAlert('cls', clsValue);
          
          // Track in analytics
          this.analyticsService.trackWebVitals({
            name: 'CLS',
            value: clsValue,
            rating: clsValue <= 0.1 ? 'good' : clsValue <= 0.25 ? 'needs-improvement' : 'poor'
          });
        }
      });
      
      clsObserver.observe({ entryTypes: ['layout-shift'] });

      // FID (First Input Delay)
      const fidObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const fidValue = (entry as any).processingStart - entry.startTime;
          this.updateMetric('fid', fidValue);
          this.checkAlert('fid', fidValue);
          
          // Track in analytics
          this.analyticsService.trackWebVitals({
            name: 'FID',
            value: fidValue,
            rating: fidValue <= 100 ? 'good' : fidValue <= 300 ? 'needs-improvement' : 'poor'
          });
        }
      });
      
      fidObserver.observe({ entryTypes: ['first-input'] });

      // LCP (Largest Contentful Paint)
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        const lcpValue = lastEntry.startTime;
        
        this.updateMetric('lcp', lcpValue);
        this.checkAlert('lcp', lcpValue);
        
        // Track in analytics
        this.analyticsService.trackWebVitals({
          name: 'LCP',
          value: lcpValue,
          rating: lcpValue <= 2500 ? 'good' : lcpValue <= 4000 ? 'needs-improvement' : 'poor'
        });
      });
      
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // FCP (First Contentful Paint)
      const fcpObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            this.updateMetric('fcp', entry.startTime);
          }
        }
      });
      
      fcpObserver.observe({ entryTypes: ['paint'] });

      this.performanceObserver = clsObserver; // Store reference for cleanup
    } catch (error) {
      console.error('Failed to setup Core Web Vitals monitoring:', error);
    }
  }

  /**
   * Setup resource monitoring
   */
  private setupResourceMonitoring(): void {
    // Monitor resource loading
    const resourceObserver = new PerformanceObserver((list) => {
      const resources = list.getEntries() as PerformanceResourceTiming[];
      
      resources.forEach(resource => {
        const duration = resource.responseEnd - resource.startTime;
        const size = resource.transferSize || 0;
        
        // Track slow resources
        if (duration > 1000) { // Slower than 1 second
          this.addSlowResource({
            name: resource.name,
            duration,
            size,
            type: this.getResourceType(resource.name)
          });
        }
        
        // Track large resources
        if (size > 500 * 1024) { // Larger than 500KB
          this.addLargeResource({
            name: resource.name,
            duration,
            size,
            type: this.getResourceType(resource.name)
          });
        }
      });
    });
    
    resourceObserver.observe({ entryTypes: ['resource'] });
  }

  /**
   * Setup memory monitoring
   */
  private setupMemoryMonitoring(): void {
    if (!('memory' in performance)) {
      console.warn('Memory API not supported');
      return;
    }

    this.memoryMonitor = window.setInterval(() => {
      const memory = (performance as any).memory;
      
      if (memory) {
        const memoryUsage = {
          usedJSHeapSize: memory.usedJSHeapSize,
          totalJSHeapSize: memory.totalJSHeapSize,
          jsHeapSizeLimit: memory.jsHeapSizeLimit
        };
        
        this.updateMemoryUsage(memoryUsage);
        this.checkAlert('memoryUsage', memory.usedJSHeapSize);
      }
    }, this.config.monitoringInterval);
  }

  /**
   * Setup frame rate monitoring
   */
  private setupFrameRateMonitoring(): void {
    const measureFrameRate = () => {
      const now = performance.now();
      const delta = now - this.lastFrameTime;
      const fps = 1000 / delta;
      
      this.frameRates.push(fps);
      
      // Keep only last 60 measurements (about 1 second at 60fps)
      if (this.frameRates.length > 60) {
        this.frameRates.shift();
      }
      
      const avgFps = this.frameRates.reduce((sum, rate) => sum + rate, 0) / this.frameRates.length;
      
      this.updateFrameRate({
        current: fps,
        average: avgFps,
        min: Math.min(...this.frameRates),
        max: Math.max(...this.frameRates)
      });
      
      this.checkAlert('frameRate', avgFps);
      this.lastFrameTime = now;
      
      if (this.isMonitoring) {
        this.frameRateMonitor = requestAnimationFrame(measureFrameRate);
      }
    };
    
    this.frameRateMonitor = requestAnimationFrame(measureFrameRate);
  }

  /**
   * Setup bundle analysis
   */
  private setupBundleAnalysis(): void {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
        
        // Calculate bundle metrics
        const jsResources = resources.filter(r => r.name.includes('.js'));
        const totalSize = jsResources.reduce((sum, r) => sum + (r.transferSize || 0), 0);
        const loadTime = navigation.loadEventEnd - navigation.loadEventStart;
        
        this.updateBundleMetrics({
          totalSize,
          loadTime,
          chunkCount: jsResources.length
        });
        
        // Track in analytics
        this.analyticsService.trackPerformance({
          metric_name: 'bundle_size',
          value: totalSize,
          unit: 'bytes'
        });
      }, 1000);
    });
  }

  /**
   * Setup periodic metrics collection
   */
  private setupPeriodicCollection(): void {
    interval(this.config.monitoringInterval).subscribe(() => {
      if (this.isMonitoring) {
        this.collectNavigationTiming();
        this.collectTTFB();
      }
    });
  }

  /**
   * Collect navigation timing metrics
   */
  private collectNavigationTiming(): void {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    if (navigation) {
      const timing = {
        dnsLookup: navigation.domainLookupEnd - navigation.domainLookupStart,
        tcpConnect: navigation.connectEnd - navigation.connectStart,
        request: navigation.responseStart - navigation.requestStart,
        response: navigation.responseEnd - navigation.responseStart,
        domProcessing: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart
      };
      
      this.updateNavigationTiming(timing);
    }
  }

  /**
   * Collect TTFB (Time to First Byte)
   */
  private collectTTFB(): void {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    if (navigation) {
      const ttfb = navigation.responseStart - navigation.requestStart;
      this.updateMetric('ttfb', ttfb);
    }
  }

  /**
   * Update specific metric
   */
  private updateMetric(metric: keyof PerformanceMetrics, value: number): void {
    const currentMetrics = this.performanceMetrics.value || this.createEmptyMetrics();
    (currentMetrics as any)[metric] = value;
    currentMetrics.timestamp = new Date();
    this.performanceMetrics.next(currentMetrics);
  }

  /**
   * Update navigation timing
   */
  private updateNavigationTiming(timing: PerformanceMetrics['navigationTiming']): void {
    const currentMetrics = this.performanceMetrics.value || this.createEmptyMetrics();
    currentMetrics.navigationTiming = timing;
    currentMetrics.timestamp = new Date();
    this.performanceMetrics.next(currentMetrics);
  }

  /**
   * Update memory usage
   */
  private updateMemoryUsage(memory: PerformanceMetrics['memoryUsage']): void {
    const currentMetrics = this.performanceMetrics.value || this.createEmptyMetrics();
    currentMetrics.memoryUsage = memory;
    currentMetrics.timestamp = new Date();
    this.performanceMetrics.next(currentMetrics);
  }

  /**
   * Update frame rate
   */
  private updateFrameRate(frameRate: PerformanceMetrics['frameRate']): void {
    const currentMetrics = this.performanceMetrics.value || this.createEmptyMetrics();
    currentMetrics.frameRate = frameRate;
    currentMetrics.timestamp = new Date();
    this.performanceMetrics.next(currentMetrics);
  }

  /**
   * Update bundle metrics
   */
  private updateBundleMetrics(bundle: PerformanceMetrics['bundleMetrics']): void {
    const currentMetrics = this.performanceMetrics.value || this.createEmptyMetrics();
    currentMetrics.bundleMetrics = bundle;
    currentMetrics.timestamp = new Date();
    this.performanceMetrics.next(currentMetrics);
  }

  /**
   * Add slow resource
   */
  private addSlowResource(resource: ResourceTiming): void {
    const currentMetrics = this.performanceMetrics.value || this.createEmptyMetrics();
    currentMetrics.resourceTiming.slowResources.push(resource);
    
    // Keep only last 10 slow resources
    if (currentMetrics.resourceTiming.slowResources.length > 10) {
      currentMetrics.resourceTiming.slowResources.shift();
    }
    
    this.performanceMetrics.next(currentMetrics);
  }

  /**
   * Add large resource
   */
  private addLargeResource(resource: ResourceTiming): void {
    const currentMetrics = this.performanceMetrics.value || this.createEmptyMetrics();
    currentMetrics.resourceTiming.largestResources.push(resource);
    
    // Keep only last 10 large resources
    if (currentMetrics.resourceTiming.largestResources.length > 10) {
      currentMetrics.resourceTiming.largestResources.shift();
    }
    
    this.performanceMetrics.next(currentMetrics);
  }

  /**
   * Check performance alerts
   */
  private checkAlert(metric: string, value: number): void {
    const threshold = this.config.alertThresholds[metric as keyof typeof this.config.alertThresholds];
    
    if (!threshold) return;
    
    let shouldAlert = false;
    let alertType: 'warning' | 'error' | 'info' = 'info';
    
    switch (metric) {
      case 'cls':
        shouldAlert = value > threshold;
        alertType = value > 0.25 ? 'error' : 'warning';
        break;
      case 'fid':
        shouldAlert = value > threshold;
        alertType = value > 300 ? 'error' : 'warning';
        break;
      case 'lcp':
        shouldAlert = value > threshold;
        alertType = value > 4000 ? 'error' : 'warning';
        break;
      case 'memoryUsage':
        shouldAlert = value > threshold;
        alertType = 'warning';
        break;
      case 'frameRate':
        shouldAlert = value < threshold;
        alertType = value < 20 ? 'error' : 'warning';
        break;
    }
    
    if (shouldAlert) {
      this.addAlert({
        id: `${metric}_${Date.now()}`,
        type: alertType,
        metric,
        value,
        threshold,
        message: this.getAlertMessage(metric, value, threshold),
        timestamp: new Date(),
        resolved: false
      });
    }
  }

  /**
   * Add performance alert
   */
  private addAlert(alert: PerformanceAlert): void {
    const currentAlerts = this.performanceAlerts.value;
    currentAlerts.push(alert);
    
    // Keep only last 50 alerts
    if (currentAlerts.length > 50) {
      currentAlerts.shift();
    }
    
    this.performanceAlerts.next(currentAlerts);
    
    // Track alert in analytics
    this.eventTrackingService.trackCustomEvent({
      name: 'performance_alert',
      category: 'performance',
      action: 'alert_triggered',
      label: alert.metric,
      value: alert.value,
      parameters: {
        alert_type: alert.type,
        threshold: alert.threshold,
        message: alert.message
      }
    });
    
    console.warn(`Performance Alert: ${alert.message}`);
  }

  /**
   * Get alert message
   */
  private getAlertMessage(metric: string, value: number, threshold: number): string {
    const messages = {
      cls: `Cumulative Layout Shift (${value.toFixed(3)}) exceeds threshold (${threshold})`,
      fid: `First Input Delay (${value.toFixed(0)}ms) exceeds threshold (${threshold}ms)`,
      lcp: `Largest Contentful Paint (${value.toFixed(0)}ms) exceeds threshold (${threshold}ms)`,
      memoryUsage: `Memory usage (${(value / 1024 / 1024).toFixed(1)}MB) exceeds threshold (${(threshold / 1024 / 1024).toFixed(1)}MB)`,
      frameRate: `Frame rate (${value.toFixed(1)}fps) below threshold (${threshold}fps)`
    };
    
    return messages[metric as keyof typeof messages] || `${metric} performance issue detected`;
  }

  /**
   * Get resource type from URL
   */
  private getResourceType(url: string): string {
    if (url.includes('.js')) return 'javascript';
    if (url.includes('.css')) return 'stylesheet';
    if (url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/)) return 'image';
    if (url.match(/\.(woff|woff2|ttf|eot)$/)) return 'font';
    if (url.includes('.json')) return 'json';
    return 'other';
  }

  /**
   * Create empty metrics object
   */
  private createEmptyMetrics(): PerformanceMetrics {
    return {
      cls: null,
      fid: null,
      lcp: null,
      fcp: null,
      ttfb: null,
      navigationTiming: null,
      resourceTiming: {
        totalResources: 0,
        slowResources: [],
        largestResources: []
      },
      memoryUsage: null,
      frameRate: {
        current: 0,
        average: 0,
        min: 0,
        max: 0
      },
      bundleMetrics: {
        totalSize: 0,
        loadTime: 0,
        chunkCount: 0
      },
      timestamp: new Date()
    };
  }

  /**
   * Resolve alert
   */
  resolveAlert(alertId: string): void {
    const currentAlerts = this.performanceAlerts.value;
    const alert = currentAlerts.find(a => a.id === alertId);
    
    if (alert) {
      alert.resolved = true;
      this.performanceAlerts.next(currentAlerts);
    }
  }

  /**
   * Get performance recommendations
   */
  getPerformanceRecommendations(): string[] {
    const metrics = this.performanceMetrics.value;
    const recommendations: string[] = [];

    if (!metrics) return recommendations;

    // CLS recommendations
    if (metrics.cls && metrics.cls > 0.1) {
      recommendations.push('Reduce Cumulative Layout Shift by setting dimensions for images and ads');
      recommendations.push('Avoid inserting content above existing content');
    }

    // FID recommendations
    if (metrics.fid && metrics.fid > 100) {
      recommendations.push('Reduce First Input Delay by breaking up long tasks');
      recommendations.push('Use web workers for heavy computations');
    }

    // LCP recommendations
    if (metrics.lcp && metrics.lcp > 2500) {
      recommendations.push('Optimize Largest Contentful Paint by preloading key resources');
      recommendations.push('Use efficient image formats and compression');
    }

    // Memory recommendations
    if (metrics.memoryUsage && metrics.memoryUsage.usedJSHeapSize > this.config.alertThresholds.memoryUsage) {
      recommendations.push('Reduce memory usage by cleaning up event listeners');
      recommendations.push('Use object pooling for frequently created objects');
    }

    // Frame rate recommendations
    if (metrics.frameRate.average < 30) {
      recommendations.push('Improve frame rate by optimizing animations');
      recommendations.push('Use CSS transforms instead of changing layout properties');
    }

    return recommendations;
  }

  /**
   * Get performance score
   */
  getPerformanceScore(): number {
    const metrics = this.performanceMetrics.value;
    if (!metrics) return 0;

    let score = 100;

    // CLS scoring
    if (metrics.cls !== null) {
      if (metrics.cls > 0.25) score -= 20;
      else if (metrics.cls > 0.1) score -= 10;
    }

    // FID scoring
    if (metrics.fid !== null) {
      if (metrics.fid > 300) score -= 20;
      else if (metrics.fid > 100) score -= 10;
    }

    // LCP scoring
    if (metrics.lcp !== null) {
      if (metrics.lcp > 4000) score -= 20;
      else if (metrics.lcp > 2500) score -= 10;
    }

    // Frame rate scoring
    if (metrics.frameRate.average < 20) score -= 15;
    else if (metrics.frameRate.average < 30) score -= 10;

    return Math.max(0, score);
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<PerformanceConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Get current configuration
   */
  getConfig(): PerformanceConfig {
    return { ...this.config };
  }

  /**
   * Get current metrics
   */
  getCurrentMetrics(): PerformanceMetrics | null {
    return this.performanceMetrics.value;
  }

  /**
   * Get current alerts
   */
  getCurrentAlerts(): PerformanceAlert[] {
    return this.performanceAlerts.value;
  }

  /**
   * Clear all alerts
   */
  clearAlerts(): void {
    this.performanceAlerts.next([]);
  }

  /**
   * Export performance data
   */
  exportPerformanceData(): string {
    return JSON.stringify({
      config: this.config,
      metrics: this.performanceMetrics.value,
      alerts: this.performanceAlerts.value,
      recommendations: this.getPerformanceRecommendations(),
      score: this.getPerformanceScore(),
      timestamp: new Date().toISOString()
    }, null, 2);
  }
}