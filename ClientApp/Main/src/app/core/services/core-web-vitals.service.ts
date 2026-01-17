import { Injectable, inject, signal, computed, effect } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

// Import existing services
import { LCPOptimizationService, LCPMetrics } from './lcp-optimization.service';
import { FIDOptimizationService, FIDMetrics } from './fid-optimization.service';
import { CLSMonitoringService, CLSMetrics } from './cls-monitoring.service';

export interface CoreWebVitalsMetrics {
  lcp: {
    value: number;
    rating: 'good' | 'needs-improvement' | 'poor';
    target: number;
    achieved: boolean;
  };
  fid: {
    value: number;
    rating: 'good' | 'needs-improvement' | 'poor';
    target: number;
    achieved: boolean;
  };
  cls: {
    value: number;
    rating: 'good' | 'needs-improvement' | 'poor';
    target: number;
    achieved: boolean;
  };
  overall: {
    score: number;
    rating: 'good' | 'needs-improvement' | 'poor';
    allTargetsMet: boolean;
  };
  timestamp: number;
}

export interface CoreWebVitalsTargets {
  lcp: number;    // 2500ms
  fid: number;    // 100ms
  cls: number;    // 0.1
}

export interface OptimizationRecommendation {
  metric: 'lcp' | 'fid' | 'cls';
  priority: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  action: string;
  impact: number;
  implemented: boolean;
  estimatedImprovement: string;
}

export interface PerformanceReport {
  timestamp: number;
  url: string;
  metrics: CoreWebVitalsMetrics;
  recommendations: OptimizationRecommendation[];
  optimizationsApplied: string[];
  deviceInfo: {
    userAgent: string;
    viewport: { width: number; height: number };
    connection?: any;
  };
}

/**
 * Core Web Vitals Service
 * 
 * Comprehensive service for monitoring and optimizing Core Web Vitals:
 * - LCP (Largest Contentful Paint) < 2.5s
 * - FID (First Input Delay) < 100ms  
 * - CLS (Cumulative Layout Shift) < 0.1
 * 
 * Features:
 * - Real-time monitoring of all three metrics
 * - Automatic optimization techniques
 * - Performance recommendations
 * - Detailed reporting and analytics
 * - Target achievement tracking
 */
@Injectable({
  providedIn: 'root'
})
export class CoreWebVitalsService {
  private document = inject(DOCUMENT);
  private lcpService = inject(LCPOptimizationService);
  private fidService = inject(FIDOptimizationService);
  private clsService = inject(CLSMonitoringService);

  // Target thresholds for Core Web Vitals
  private readonly targets: CoreWebVitalsTargets = {
    lcp: 2500,  // 2.5 seconds
    fid: 100,   // 100 milliseconds
    cls: 0.1    // 0.1 cumulative layout shift
  };

  // Signals for reactive state management
  private _isOptimizationEnabled = signal<boolean>(false);
  private _appliedOptimizations = signal<string[]>([]);
  private _performanceReports = signal<PerformanceReport[]>([]);

  // Computed signals
  readonly isOptimizationEnabled = this._isOptimizationEnabled.asReadonly();
  readonly appliedOptimizations = this._appliedOptimizations.asReadonly();
  readonly performanceReports = this._performanceReports.asReadonly();

  // Combined metrics observable
  private metricsSubject = new BehaviorSubject<CoreWebVitalsMetrics | null>(null);
  public readonly metrics$ = this.metricsSubject.asObservable();

  // Current metrics computed from individual services
  readonly currentMetrics = computed(() => {
    const lcpMetrics = this.lcpService.currentLCP();
    const fidMetrics = this.fidService.getCurrentMetrics();
    const clsMetrics = this.clsService.getCurrentMetrics();

    if (!lcpMetrics && !fidMetrics && !clsMetrics) {
      return null;
    }

    const lcp = {
      value: lcpMetrics?.value || 0,
      rating: this.rateLCP(lcpMetrics?.value || 0),
      target: this.targets.lcp,
      achieved: (lcpMetrics?.value || 0) <= this.targets.lcp
    };

    const fid = {
      value: fidMetrics.currentFID,
      rating: this.rateFID(fidMetrics.currentFID),
      target: this.targets.fid,
      achieved: fidMetrics.currentFID <= this.targets.fid
    };

    const cls = {
      value: clsMetrics.totalCLS,
      rating: this.rateCLS(clsMetrics.totalCLS),
      target: this.targets.cls,
      achieved: clsMetrics.totalCLS <= this.targets.cls
    };

    const allTargetsMet = lcp.achieved && fid.achieved && cls.achieved;
    const score = this.calculateOverallScore(lcp, fid, cls);
    const overall = {
      score,
      rating: this.rateOverallScore(score),
      allTargetsMet
    };

    const metrics: CoreWebVitalsMetrics = {
      lcp,
      fid,
      cls,
      overall,
      timestamp: Date.now()
    };

    return metrics;
  });

  constructor() {
    this.initializeMonitoring();
    this.setupAutomaticOptimizations();
    this.setupPeriodicReporting();

    // Effect to update metrics observable when computed metrics change
    effect(() => {
      const metrics = this.currentMetrics();
      if (metrics) {
        this.metricsSubject.next(metrics);
      }
    });
  }

  /**
   * Initialize comprehensive monitoring
   */
  private initializeMonitoring(): void {
    console.log('🚀 Core Web Vitals monitoring initialized');
    console.log('📊 Targets:', this.targets);

    // Enable individual service optimizations
    this.fidService.enableOptimization();
    this.clsService.startMonitoring();
    this.lcpService.optimizeCriticalRenderingPath();
  }

  /**
   * Setup automatic optimizations
   */
  private setupAutomaticOptimizations(): void {
    // Apply immediate optimizations
    this.applyImmediateOptimizations();

    // Monitor metrics and apply adaptive optimizations
    this.setupAdaptiveOptimizations();
  }

  /**
   * Apply immediate optimizations that don't require monitoring
   */
  private applyImmediateOptimizations(): void {
    const optimizations: string[] = [];

    // LCP Optimizations
    this.optimizeLCP();
    optimizations.push('LCP Resource Preloading');
    optimizations.push('Critical Rendering Path Optimization');

    // FID Optimizations  
    this.optimizeFID();
    optimizations.push('FID Event Optimization');
    optimizations.push('Task Scheduling');

    // CLS Optimizations
    this.optimizeCLS();
    optimizations.push('CLS Layout Stabilization');
    optimizations.push('Font Loading Optimization');

    // General Performance Optimizations
    this.applyGeneralOptimizations();
    optimizations.push('Bundle Optimization');
    optimizations.push('Resource Hints');

    this._appliedOptimizations.set(optimizations);
    this._isOptimizationEnabled.set(true);

    console.log('⚡ Applied immediate optimizations:', optimizations);
  }

  /**
   * Optimize LCP (Largest Contentful Paint)
   */
  private optimizeLCP(): void {
    // Preload critical resources
    this.lcpService.addCriticalResource({
      url: '/assets/fonts/inter-var.woff2',
      type: 'font',
      priority: 'critical',
      preload: true,
      prefetch: false
    });

    // Preconnect to external domains
    this.lcpService.addResourceHint('preconnect', {
      href: 'https://fonts.googleapis.com',
      as: 'fetch'
    });

    this.lcpService.addResourceHint('preconnect', {
      href: 'https://fonts.gstatic.com',
      as: 'fetch'
    });

    // Preload hero images
    this.preloadHeroImages();

    // Optimize critical CSS
    this.optimizeCriticalCSS();
  }

  /**
   * Optimize FID (First Input Delay)
   */
  private optimizeFID(): void {
    // Enable all FID optimizations
    this.fidService.updateConfig({
      enableOnPushDetection: true,
      enableEventDelegation: true,
      enableInputThrottling: true,
      enableTaskScheduling: true,
      enableCodeSplitting: true,
      throttleDelay: 16, // 60fps
      debounceDelay: 100,
      maxTaskDuration: 5, // 5ms chunks
      enableMetrics: true
    });

    // Break up long tasks
    this.implementTaskBreaking();

    // Optimize JavaScript execution
    this.optimizeJavaScriptExecution();
  }

  /**
   * Optimize CLS (Cumulative Layout Shift)
   */
  private optimizeCLS(): void {
    // Set up layout shift prevention
    this.preventLayoutShifts();

    // Optimize font loading
    this.optimizeFontLoading();

    // Reserve space for dynamic content
    this.reserveSpaceForDynamicContent();

    // Optimize image loading
    this.optimizeImageLoading();
  }

  /**
   * Apply general performance optimizations
   */
  private applyGeneralOptimizations(): void {
    // Enable service worker for caching
    this.enableServiceWorkerCaching();

    // Optimize bundle loading
    this.optimizeBundleLoading();

    // Add performance resource hints
    this.addPerformanceResourceHints();

    // Enable compression
    this.enableCompression();
  }

  /**
   * Setup adaptive optimizations based on real-time metrics
   */
  private setupAdaptiveOptimizations(): void {
    // Monitor metrics every 5 seconds and apply adaptive optimizations
    setInterval(() => {
      const metrics = this.currentMetrics();
      if (!metrics) return;

      this.applyAdaptiveOptimizations(metrics);
    }, 5000);
  }

  /**
   * Apply optimizations based on current metrics
   */
  private applyAdaptiveOptimizations(metrics: CoreWebVitalsMetrics): void {
    const appliedOptimizations = [...this._appliedOptimizations()];

    // LCP adaptive optimizations
    if (!metrics.lcp.achieved && metrics.lcp.value > 3000) {
      if (!appliedOptimizations.includes('Aggressive LCP Optimization')) {
        this.applyAggressiveLCPOptimization();
        appliedOptimizations.push('Aggressive LCP Optimization');
      }
    }

    // FID adaptive optimizations
    if (!metrics.fid.achieved && metrics.fid.value > 200) {
      if (!appliedOptimizations.includes('Aggressive FID Optimization')) {
        this.applyAggressiveFIDOptimization();
        appliedOptimizations.push('Aggressive FID Optimization');
      }
    }

    // CLS adaptive optimizations
    if (!metrics.cls.achieved && metrics.cls.value > 0.15) {
      if (!appliedOptimizations.includes('Aggressive CLS Optimization')) {
        this.applyAggressiveCLSOptimization();
        appliedOptimizations.push('Aggressive CLS Optimization');
      }
    }

    if (appliedOptimizations.length > this._appliedOptimizations().length) {
      this._appliedOptimizations.set(appliedOptimizations);
    }
  }

  /**
   * Setup periodic performance reporting
   */
  private setupPeriodicReporting(): void {
    // Generate performance report every 30 seconds
    setInterval(() => {
      this.generatePerformanceReport();
    }, 30000);
  }

  /**
   * Generate comprehensive performance report
   */
  private generatePerformanceReport(): void {
    const metrics = this.currentMetrics();
    if (!metrics) return;

    const report: PerformanceReport = {
      timestamp: Date.now(),
      url: this.document.location.href,
      metrics,
      recommendations: this.getOptimizationRecommendations(metrics),
      optimizationsApplied: this._appliedOptimizations(),
      deviceInfo: {
        userAgent: navigator.userAgent,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        },
        connection: (navigator as any).connection
      }
    };

    this._performanceReports.update(reports => [...reports.slice(-9), report]); // Keep last 10 reports

    // Log report in development
    if (this.isDevelopment()) {
      this.logPerformanceReport(report);
    }
  }

  /**
   * Get optimization recommendations based on current metrics
   */
  private getOptimizationRecommendations(metrics: CoreWebVitalsMetrics): OptimizationRecommendation[] {
    const recommendations: OptimizationRecommendation[] = [];

    // LCP recommendations
    if (!metrics.lcp.achieved) {
      if (metrics.lcp.value > 4000) {
        recommendations.push({
          metric: 'lcp',
          priority: 'critical',
          title: 'Critical LCP Optimization Required',
          description: 'LCP is significantly above target (>4s). Immediate action required.',
          action: 'Optimize critical resource loading and server response time',
          impact: 40,
          implemented: false,
          estimatedImprovement: '2-3 seconds'
        });
      } else {
        recommendations.push({
          metric: 'lcp',
          priority: 'high',
          title: 'LCP Needs Improvement',
          description: 'LCP is above target but manageable. Focus on resource optimization.',
          action: 'Preload LCP element and optimize images',
          impact: 25,
          implemented: false,
          estimatedImprovement: '0.5-1 second'
        });
      }
    }

    // FID recommendations
    if (!metrics.fid.achieved) {
      if (metrics.fid.value > 300) {
        recommendations.push({
          metric: 'fid',
          priority: 'critical',
          title: 'Critical FID Optimization Required',
          description: 'FID is significantly above target (>300ms). User experience severely impacted.',
          action: 'Break up long JavaScript tasks and optimize event handling',
          impact: 50,
          implemented: false,
          estimatedImprovement: '200-250ms'
        });
      } else {
        recommendations.push({
          metric: 'fid',
          priority: 'high',
          title: 'FID Needs Improvement',
          description: 'FID is above target. Focus on JavaScript optimization.',
          action: 'Enable task scheduling and event throttling',
          impact: 30,
          implemented: false,
          estimatedImprovement: '50-100ms'
        });
      }
    }

    // CLS recommendations
    if (!metrics.cls.achieved) {
      if (metrics.cls.value > 0.25) {
        recommendations.push({
          metric: 'cls',
          priority: 'critical',
          title: 'Critical CLS Optimization Required',
          description: 'CLS is significantly above target (>0.25). Layout shifts are severe.',
          action: 'Reserve space for all dynamic content and optimize font loading',
          impact: 45,
          implemented: false,
          estimatedImprovement: '0.15-0.2 reduction'
        });
      } else {
        recommendations.push({
          metric: 'cls',
          priority: 'high',
          title: 'CLS Needs Improvement',
          description: 'CLS is above target. Focus on layout stability.',
          action: 'Optimize image dimensions and font loading',
          impact: 25,
          implemented: false,
          estimatedImprovement: '0.05-0.1 reduction'
        });
      }
    }

    return recommendations;
  }

  // Helper methods for specific optimizations

  private preloadHeroImages(): void {
    const heroImages = [
      '/assets/images/hero-banner.webp',
      '/assets/images/hero-background.webp'
    ];

    heroImages.forEach(image => {
      this.lcpService.addResourceHint('preload', {
        href: image,
        as: 'image',
        fetchpriority: 'high'
      });
    });
  }

  private optimizeCriticalCSS(): void {
    // Preload critical CSS
    this.lcpService.addResourceHint('preload', {
      href: '/assets/css/critical.css',
      as: 'style',
      fetchpriority: 'high'
    });
  }

  private implementTaskBreaking(): void {
    // Add tasks to FID service queue for optimized execution
    const longRunningTasks = [
      () => this.optimizeDataProcessing(),
      () => this.optimizeRenderingTasks(),
      () => this.optimizeEventHandlers()
    ];

    longRunningTasks.forEach(task => {
      this.fidService.addTask(task);
    });
  }

  private optimizeJavaScriptExecution(): void {
    // Use requestIdleCallback for non-critical tasks
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        this.performNonCriticalTasks();
      });
    }
  }

  private preventLayoutShifts(): void {
    // Add CSS to prevent common layout shifts
    const style = this.document.createElement('style');
    style.textContent = `
      /* Prevent layout shifts */
      img, video, iframe {
        width: 100%;
        height: auto;
        aspect-ratio: attr(width) / attr(height);
      }
      
      /* Reserve space for ads and dynamic content */
      .ad-container {
        min-height: 250px;
        background: #f5f5f5;
      }
      
      /* Optimize font loading */
      @font-face {
        font-family: 'Inter';
        font-display: swap;
        src: url('/assets/fonts/inter-var.woff2') format('woff2');
      }
    `;
    this.document.head.appendChild(style);
  }

  private optimizeFontLoading(): void {
    // Preload critical fonts
    this.lcpService.addResourceHint('preload', {
      href: '/assets/fonts/inter-var.woff2',
      as: 'font',
      type: 'font/woff2',
      crossorigin: 'anonymous'
    });
  }

  private reserveSpaceForDynamicContent(): void {
    // This would typically be handled by components
    // Here we add global CSS for common patterns
    const style = this.document.createElement('style');
    style.textContent = `
      .dynamic-content-placeholder {
        min-height: 200px;
        background: linear-gradient(90deg, #f0f0f0 25%, transparent 37%, #f0f0f0 63%);
        background-size: 400% 100%;
        animation: skeleton-loading 1.5s ease-in-out infinite;
      }
      
      @keyframes skeleton-loading {
        0% { background-position: 100% 50%; }
        100% { background-position: -100% 50%; }
      }
    `;
    this.document.head.appendChild(style);
  }

  private optimizeImageLoading(): void {
    // Add global image optimization
    const style = this.document.createElement('style');
    style.textContent = `
      img {
        content-visibility: auto;
        contain-intrinsic-size: 300px 200px;
      }
    `;
    this.document.head.appendChild(style);
  }

  private enableServiceWorkerCaching(): void {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(error => {
        console.warn('Service Worker registration failed:', error);
      });
    }
  }

  private optimizeBundleLoading(): void {
    // Add resource hints for critical bundles
    const criticalBundles = [
      '/main.js',
      '/vendor.js',
      '/runtime.js'
    ];

    criticalBundles.forEach(bundle => {
      this.lcpService.addResourceHint('preload', {
        href: bundle,
        as: 'script',
        fetchpriority: 'high'
      });
    });
  }

  private addPerformanceResourceHints(): void {
    // DNS prefetch for external domains
    const externalDomains = [
      'https://www.google-analytics.com',
      'https://www.googletagmanager.com'
    ];

    externalDomains.forEach(domain => {
      this.lcpService.addResourceHint('dns-prefetch', {
        href: domain,
        as: 'fetch'
      });
    });
  }

  private enableCompression(): void {
    // This would typically be handled at the server level
    // Here we can add client-side optimizations
    console.log('💡 Enable gzip/brotli compression on server for optimal performance');
  }

  private applyAggressiveLCPOptimization(): void {
    // More aggressive LCP optimizations
    this.lcpService.addResourceHint('preload', {
      href: '/assets/css/app.css',
      as: 'style',
      fetchpriority: 'high'
    });

    console.log('🚀 Applied aggressive LCP optimization');
  }

  private applyAggressiveFIDOptimization(): void {
    // More aggressive FID optimizations
    this.fidService.updateConfig({
      throttleDelay: 8, // Higher frequency
      maxTaskDuration: 3, // Smaller chunks
      enableWebWorkers: true
    });

    console.log('⚡ Applied aggressive FID optimization');
  }

  private applyAggressiveCLSOptimization(): void {
    // More aggressive CLS optimizations
    const style = this.document.createElement('style');
    style.textContent = `
      * {
        contain: layout style paint;
      }
      
      img, video {
        aspect-ratio: 16/9;
      }
    `;
    this.document.head.appendChild(style);

    console.log('🎯 Applied aggressive CLS optimization');
  }

  // Helper methods for task optimization
  private optimizeDataProcessing(): void {
    // Placeholder for data processing optimization
  }

  private optimizeRenderingTasks(): void {
    // Placeholder for rendering optimization
  }

  private optimizeEventHandlers(): void {
    // Placeholder for event handler optimization
  }

  private performNonCriticalTasks(): void {
    // Placeholder for non-critical tasks
  }

  // Utility methods
  private rateLCP(value: number): 'good' | 'needs-improvement' | 'poor' {
    if (value <= 2500) return 'good';
    if (value <= 4000) return 'needs-improvement';
    return 'poor';
  }

  private rateFID(value: number): 'good' | 'needs-improvement' | 'poor' {
    if (value <= 100) return 'good';
    if (value <= 300) return 'needs-improvement';
    return 'poor';
  }

  private rateCLS(value: number): 'good' | 'needs-improvement' | 'poor' {
    if (value <= 0.1) return 'good';
    if (value <= 0.25) return 'needs-improvement';
    return 'poor';
  }

  private calculateOverallScore(lcp: any, fid: any, cls: any): number {
    let score = 0;
    
    // LCP contributes 40% to overall score
    if (lcp.rating === 'good') score += 40;
    else if (lcp.rating === 'needs-improvement') score += 20;
    
    // FID contributes 30% to overall score
    if (fid.rating === 'good') score += 30;
    else if (fid.rating === 'needs-improvement') score += 15;
    
    // CLS contributes 30% to overall score
    if (cls.rating === 'good') score += 30;
    else if (cls.rating === 'needs-improvement') score += 15;
    
    return score;
  }

  private rateOverallScore(score: number): 'good' | 'needs-improvement' | 'poor' {
    if (score >= 80) return 'good';
    if (score >= 50) return 'needs-improvement';
    return 'poor';
  }

  private isDevelopment(): boolean {
    return this.document.location.hostname === 'localhost' || 
           this.document.location.hostname.includes('dev');
  }

  private logPerformanceReport(report: PerformanceReport): void {
    console.group('📊 Core Web Vitals Report');
    console.log('🎯 LCP:', `${(report.metrics.lcp.value / 1000).toFixed(2)}s`, 
                report.metrics.lcp.achieved ? '✅' : '❌');
    console.log('⚡ FID:', `${report.metrics.fid.value.toFixed(2)}ms`, 
                report.metrics.fid.achieved ? '✅' : '❌');
    console.log('📐 CLS:', report.metrics.cls.value.toFixed(4), 
                report.metrics.cls.achieved ? '✅' : '❌');
    console.log('🏆 Overall Score:', `${report.metrics.overall.score}/100`, 
                `(${report.metrics.overall.rating})`);
    console.log('🚀 All Targets Met:', report.metrics.overall.allTargetsMet ? '✅' : '❌');
    
    if (report.recommendations.length > 0) {
      console.log('💡 Recommendations:', report.recommendations.length);
      report.recommendations.forEach((rec, index) => {
        console.log(`  ${index + 1}. [${rec.priority.toUpperCase()}] ${rec.title}`);
      });
    }
    
    console.groupEnd();
  }

  // Public API methods

  /**
   * Get current Core Web Vitals metrics
   */
  getCurrentMetrics(): CoreWebVitalsMetrics | null {
    return this.currentMetrics();
  }

  /**
   * Get metrics observable
   */
  getMetricsObservable(): Observable<CoreWebVitalsMetrics | null> {
    return this.metrics$;
  }

  /**
   * Check if all targets are met
   */
  areAllTargetsMet(): boolean {
    const metrics = this.currentMetrics();
    return metrics?.overall.allTargetsMet || false;
  }

  /**
   * Get optimization recommendations
   */
  getRecommendations(): OptimizationRecommendation[] {
    const metrics = this.currentMetrics();
    return metrics ? this.getOptimizationRecommendations(metrics) : [];
  }

  /**
   * Get latest performance report
   */
  getLatestReport(): PerformanceReport | null {
    const reports = this._performanceReports();
    return reports.length > 0 ? reports[reports.length - 1] : null;
  }

  /**
   * Force generate performance report
   */
  generateReport(): PerformanceReport | null {
    this.generatePerformanceReport();
    return this.getLatestReport();
  }

  /**
   * Reset all metrics
   */
  resetMetrics(): void {
    this.lcpService.clearMetrics();
    this.fidService.resetMetrics();
    this.clsService.resetMetrics();
    this._performanceReports.set([]);
    
    console.log('🔄 All Core Web Vitals metrics reset');
  }

  /**
   * Enable/disable optimization
   */
  toggleOptimization(enabled: boolean): void {
    if (enabled && !this._isOptimizationEnabled()) {
      this.applyImmediateOptimizations();
    } else if (!enabled) {
      this.fidService.disableOptimization();
      this._isOptimizationEnabled.set(false);
      this._appliedOptimizations.set([]);
    }
  }

  /**
   * Update target thresholds
   */
  updateTargets(newTargets: Partial<CoreWebVitalsTargets>): void {
    Object.assign(this.targets, newTargets);
    console.log('🎯 Core Web Vitals targets updated:', this.targets);
  }

  /**
   * Export comprehensive performance data
   */
  exportPerformanceData(): any {
    return {
      timestamp: Date.now(),
      targets: this.targets,
      currentMetrics: this.currentMetrics(),
      appliedOptimizations: this._appliedOptimizations(),
      reports: this._performanceReports(),
      recommendations: this.getRecommendations(),
      deviceInfo: {
        userAgent: navigator.userAgent,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        },
        connection: (navigator as any).connection
      }
    };
  }
}