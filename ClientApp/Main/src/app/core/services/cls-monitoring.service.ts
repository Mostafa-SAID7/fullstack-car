import { Injectable, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';

export interface CLSEntry {
  value: number;
  sources: CLSSource[];
  hadRecentInput: boolean;
  timestamp: number;
}

export interface CLSSource {
  node?: Element;
  previousRect: DOMRect;
  currentRect: DOMRect;
}

export interface CLSMetrics {
  totalCLS: number;
  largestShift: number;
  shiftCount: number;
  averageShift: number;
  lastShiftTime: number;
  worstOffenders: CLSOffender[];
}

export interface CLSOffender {
  element: string;
  selector: string;
  shiftValue: number;
  frequency: number;
  lastOccurrence: number;
}

export interface CLSThresholds {
  good: number;      // < 0.1
  needsImprovement: number;  // 0.1 - 0.25
  poor: number;      // > 0.25
}

/**
 * CLS Monitoring Service
 * 
 * Monitors and tracks Cumulative Layout Shift (CLS) metrics:
 * - Real-time CLS score tracking
 * - Layout shift source identification
 * - Performance threshold monitoring
 * - Detailed shift analytics
 * - Automated reporting and alerts
 */
@Injectable({
  providedIn: 'root'
})
export class CLSMonitoringService {
  private document = inject(DOCUMENT);
  
  private readonly thresholds: CLSThresholds = {
    good: 0.1,
    needsImprovement: 0.25,
    poor: 0.25
  };

  private layoutShiftObserver?: PerformanceObserver;
  private clsEntries: CLSEntry[] = [];
  private offenderMap = new Map<string, CLSOffender>();

  private metricsSubject = new BehaviorSubject<CLSMetrics>({
    totalCLS: 0,
    largestShift: 0,
    shiftCount: 0,
    averageShift: 0,
    lastShiftTime: 0,
    worstOffenders: []
  });

  private alertSubject = new BehaviorSubject<string | null>(null);

  public readonly metrics$ = this.metricsSubject.asObservable();
  public readonly alerts$ = this.alertSubject.asObservable();

  constructor() {
    this.initializeCLSMonitoring();
  }

  /**
   * Initialize CLS monitoring
   */
  private initializeCLSMonitoring(): void {
    if (!this.isPerformanceObserverSupported()) {
      console.warn('PerformanceObserver not supported - CLS monitoring disabled');
      return;
    }

    this.setupLayoutShiftObserver();
    this.setupPeriodicReporting();
  }

  /**
   * Check if PerformanceObserver is supported
   */
  private isPerformanceObserverSupported(): boolean {
    return 'PerformanceObserver' in window && 'LayoutShift' in window;
  }

  /**
   * Setup Layout Shift Observer
   */
  private setupLayoutShiftObserver(): void {
    try {
      this.layoutShiftObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'layout-shift') {
            this.processLayoutShiftEntry(entry as any);
          }
        }
      });

      this.layoutShiftObserver.observe({ 
        entryTypes: ['layout-shift'],
        buffered: true 
      });

      console.log('🔍 CLS monitoring initialized');
    } catch (error) {
      console.error('Failed to initialize CLS monitoring:', error);
    }
  }

  /**
   * Process a layout shift entry
   */
  private processLayoutShiftEntry(entry: any): void {
    // Skip shifts caused by user input
    if (entry.hadRecentInput) {
      return;
    }

    const clsEntry: CLSEntry = {
      value: entry.value,
      sources: entry.sources || [],
      hadRecentInput: entry.hadRecentInput,
      timestamp: entry.startTime
    };

    this.clsEntries.push(clsEntry);
    this.updateOffenders(clsEntry);
    this.updateMetrics();
    this.checkThresholds(entry.value);

    // Log significant shifts
    if (entry.value > 0.05) {
      console.warn(`🚨 Significant layout shift detected: ${entry.value.toFixed(4)}`, {
        sources: entry.sources,
        timestamp: entry.startTime
      });
    }
  }

  /**
   * Update offender tracking
   */
  private updateOffenders(entry: CLSEntry): void {
    entry.sources.forEach((source) => {
      if (!source.node) return;

      const element = source.node as Element;
      const selector = this.generateSelector(element);
      const key = `${element.tagName.toLowerCase()}-${selector}`;

      const existing = this.offenderMap.get(key);
      if (existing) {
        existing.shiftValue += entry.value;
        existing.frequency += 1;
        existing.lastOccurrence = entry.timestamp;
      } else {
        this.offenderMap.set(key, {
          element: element.tagName.toLowerCase(),
          selector,
          shiftValue: entry.value,
          frequency: 1,
          lastOccurrence: entry.timestamp
        });
      }
    });
  }

  /**
   * Generate a CSS selector for an element
   */
  private generateSelector(element: Element): string {
    if (element.id) {
      return `#${element.id}`;
    }

    if (element.className) {
      const classes = element.className.split(' ').filter(c => c.trim());
      if (classes.length > 0) {
        return `.${classes.slice(0, 2).join('.')}`;
      }
    }

    // Fallback to tag name with position
    const parent = element.parentElement;
    if (parent) {
      const siblings = Array.from(parent.children);
      const index = siblings.indexOf(element);
      return `${element.tagName.toLowerCase()}:nth-child(${index + 1})`;
    }

    return element.tagName.toLowerCase();
  }

  /**
   * Update CLS metrics
   */
  private updateMetrics(): void {
    if (this.clsEntries.length === 0) return;

    const totalCLS = this.clsEntries.reduce((sum, entry) => sum + entry.value, 0);
    const largestShift = Math.max(...this.clsEntries.map(entry => entry.value));
    const shiftCount = this.clsEntries.length;
    const averageShift = totalCLS / shiftCount;
    const lastShiftTime = Math.max(...this.clsEntries.map(entry => entry.timestamp));

    const worstOffenders = Array.from(this.offenderMap.values())
      .sort((a, b) => b.shiftValue - a.shiftValue)
      .slice(0, 5);

    const metrics: CLSMetrics = {
      totalCLS,
      largestShift,
      shiftCount,
      averageShift,
      lastShiftTime,
      worstOffenders
    };

    this.metricsSubject.next(metrics);
  }

  /**
   * Check CLS thresholds and trigger alerts
   */
  private checkThresholds(shiftValue: number): void {
    const currentMetrics = this.metricsSubject.value;
    
    if (currentMetrics.totalCLS > this.thresholds.poor) {
      this.alertSubject.next(`🚨 Poor CLS score: ${currentMetrics.totalCLS.toFixed(4)} (threshold: ${this.thresholds.poor})`);
    } else if (currentMetrics.totalCLS > this.thresholds.needsImprovement) {
      this.alertSubject.next(`⚠️ CLS needs improvement: ${currentMetrics.totalCLS.toFixed(4)} (threshold: ${this.thresholds.needsImprovement})`);
    }

    // Alert for large individual shifts
    if (shiftValue > 0.1) {
      this.alertSubject.next(`🚨 Large layout shift: ${shiftValue.toFixed(4)}`);
    }
  }

  /**
   * Setup periodic reporting
   */
  private setupPeriodicReporting(): void {
    // Report metrics every 30 seconds in development
    if (!this.isProduction()) {
      setInterval(() => {
        this.reportMetrics();
      }, 30000);
    }
  }

  /**
   * Check if running in production
   */
  private isProduction(): boolean {
    const doc = this.document as Document;
    return doc.location.hostname !== 'localhost' && 
           !doc.location.hostname.includes('dev');
  }

  /**
   * Report current metrics to console
   */
  private reportMetrics(): void {
    const metrics = this.metricsSubject.value;
    
    if (metrics.shiftCount === 0) return;

    console.group('📊 CLS Metrics Report');
    console.log(`Total CLS: ${metrics.totalCLS.toFixed(4)}`);
    console.log(`Largest Shift: ${metrics.largestShift.toFixed(4)}`);
    console.log(`Shift Count: ${metrics.shiftCount}`);
    console.log(`Average Shift: ${metrics.averageShift.toFixed(4)}`);
    
    if (metrics.worstOffenders.length > 0) {
      console.log('Worst Offenders:');
      metrics.worstOffenders.forEach((offender, index) => {
        console.log(`  ${index + 1}. ${offender.element}${offender.selector} - ${offender.shiftValue.toFixed(4)} (${offender.frequency}x)`);
      });
    }
    
    console.groupEnd();
  }

  /**
   * Public API: Get current CLS metrics
   */
  getCurrentMetrics(): CLSMetrics {
    return this.metricsSubject.value;
  }

  /**
   * Public API: Get CLS score classification
   */
  getScoreClassification(score?: number): 'good' | 'needs-improvement' | 'poor' {
    const cls = score ?? this.metricsSubject.value.totalCLS;
    
    if (cls <= this.thresholds.good) return 'good';
    if (cls <= this.thresholds.needsImprovement) return 'needs-improvement';
    return 'poor';
  }

  /**
   * Public API: Reset metrics
   */
  resetMetrics(): void {
    this.clsEntries = [];
    this.offenderMap.clear();
    this.metricsSubject.next({
      totalCLS: 0,
      largestShift: 0,
      shiftCount: 0,
      averageShift: 0,
      lastShiftTime: 0,
      worstOffenders: []
    });
    
    console.log('🔄 CLS metrics reset');
  }

  /**
   * Public API: Get detailed shift entries
   */
  getShiftEntries(): CLSEntry[] {
    return [...this.clsEntries];
  }

  /**
   * Public API: Get metrics observable
   */
  getMetricsObservable(): Observable<CLSMetrics> {
    return this.metrics$;
  }

  /**
   * Public API: Get alerts observable
   */
  getAlertsObservable(): Observable<string | null> {
    return this.alerts$;
  }

  /**
   * Public API: Export metrics for analysis
   */
  exportMetrics(): any {
    const metrics = this.getCurrentMetrics();
    const doc = this.document as Document;
    
    return {
      timestamp: Date.now(),
      url: doc.location.href,
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      metrics,
      entries: this.clsEntries,
      thresholds: this.thresholds
    };
  }

  /**
   * Public API: Start monitoring (if stopped)
   */
  startMonitoring(): void {
    if (!this.layoutShiftObserver) {
      this.initializeCLSMonitoring();
    }
  }

  /**
   * Public API: Stop monitoring
   */
  stopMonitoring(): void {
    if (this.layoutShiftObserver) {
      this.layoutShiftObserver.disconnect();
      this.layoutShiftObserver = undefined;
      console.log('🛑 CLS monitoring stopped');
    }
  }

  /**
   * Public API: Update thresholds
   */
  updateThresholds(newThresholds: Partial<CLSThresholds>): void {
    Object.assign(this.thresholds, newThresholds);
    console.log('🎯 CLS thresholds updated:', this.thresholds);
  }
}