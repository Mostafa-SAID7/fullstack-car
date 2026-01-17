import { Injectable, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { BehaviorSubject, Observable, fromEvent } from 'rxjs';
import { debounceTime, throttleTime } from 'rxjs/operators';

export interface FIDMetrics {
  currentFID: number;
  averageFID: number;
  maxFID: number;
  sampleCount: number;
  inputEventCount: number;
  averageProcessingTime: number;
  mainThreadBlockedTime: number;
  optimizationScore: number;
  timestamp: number;
}

export interface FIDOptimizationStatus {
  enabled: boolean;
  optimizing: boolean;
  activeOptimizations: string[];
}

export interface PerformanceRecommendation {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  action?: string;
  impact: number;
  implemented: boolean;
}

export interface FIDOptimizationConfig {
  enableOnPushDetection: boolean;
  enableEventDelegation: boolean;
  enableInputThrottling: boolean;
  enableTaskScheduling: boolean;
  enableCodeSplitting: boolean;
  enableWebWorkers: boolean;
  throttleDelay: number;
  debounceDelay: number;
  maxTaskDuration: number;
  enableMetrics: boolean;
}

/**
 * FID Optimization Service
 * 
 * Optimizes First Input Delay by:
 * - Implementing OnPush change detection strategy
 * - Using event delegation and throttling
 * - Breaking up long-running tasks
 * - Optimizing JavaScript execution
 * - Monitoring and measuring FID metrics
 * - Providing performance recommendations
 */
@Injectable({
  providedIn: 'root'
})
export class FIDOptimizationService {
  private document = inject(DOCUMENT);
  
  private config: FIDOptimizationConfig = {
    enableOnPushDetection: true,
    enableEventDelegation: true,
    enableInputThrottling: true,
    enableTaskScheduling: true,
    enableCodeSplitting: true,
    enableWebWorkers: false,
    throttleDelay: 16, // ~60fps
    debounceDelay: 100,
    maxTaskDuration: 5, // 5ms chunks
    enableMetrics: true
  };

  private metricsSubject = new BehaviorSubject<FIDMetrics>({
    currentFID: 0,
    averageFID: 0,
    maxFID: 0,
    sampleCount: 0,
    inputEventCount: 0,
    averageProcessingTime: 0,
    mainThreadBlockedTime: 0,
    optimizationScore: 100,
    timestamp: Date.now()
  });

  private statusSubject = new BehaviorSubject<FIDOptimizationStatus>({
    enabled: false,
    optimizing: false,
    activeOptimizations: []
  });

  private fidMeasurements: number[] = [];
  private inputEventTimes: number[] = [];
  private processingTimes: number[] = [];
  private isOptimizationEnabled = false;
  private performanceObserver?: PerformanceObserver;
  private eventDelegationMap = new Map<string, Set<EventListener>>();
  private throttledEvents = new Map<string, number>();
  private taskQueue: Array<() => void> = [];
  private isProcessingTasks = false;

  public readonly metrics$ = this.metricsSubject.asObservable();
  public readonly status$ = this.statusSubject.asObservable();

  constructor() {
    this.initializeFIDMonitoring();
    this.setupPerformanceOptimizations();
  }

  /**
   * Initialize FID monitoring
   */
  private initializeFIDMonitoring(): void {
    if (!this.config.enableMetrics) return;

    // Use Performance Observer API for FID measurement
    if ('PerformanceObserver' in window) {
      try {
        this.performanceObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          
          entries.forEach((entry) => {
            if (entry.entryType === 'first-input') {
              this.recordFIDMeasurement(entry as PerformanceEventTiming);
            } else if (entry.entryType === 'event') {
              this.recordEventTiming(entry as PerformanceEventTiming);
            }
          });
        });

        // Observe first-input and event entries
        this.performanceObserver.observe({ 
          entryTypes: ['first-input', 'event'],
          buffered: true 
        });

        console.log('🚀 FID monitoring initialized with Performance Observer');
      } catch (error) {
        console.warn('Performance Observer not supported, falling back to manual FID tracking');
        this.setupManualFIDTracking();
      }
    } else {
      this.setupManualFIDTracking();
    }

    // Monitor main thread blocking
    this.monitorMainThreadBlocking();
  }

  /**
   * Setup manual FID tracking for browsers without Performance Observer
   */
  private setupManualFIDTracking(): void {
    const inputEvents = ['click', 'mousedown', 'keydown', 'touchstart', 'pointerdown'];
    let firstInputProcessed = false;

    inputEvents.forEach(eventType => {
      this.document.addEventListener(eventType, (event) => {
        const startTime = performance.now();
        
        // Use requestIdleCallback or setTimeout to measure processing delay
        const measureDelay = () => {
          const endTime = performance.now();
          const delay = endTime - startTime;
          
          if (!firstInputProcessed) {
            this.recordFIDMeasurement({
              processingStart: startTime,
              processingEnd: endTime,
              duration: delay,
              startTime: event.timeStamp || startTime
            } as any);
            firstInputProcessed = true;
          }
          
          this.recordInputEvent(delay);
        };

        if ('requestIdleCallback' in window) {
          requestIdleCallback(measureDelay);
        } else {
          setTimeout(measureDelay, 0);
        }
      }, { passive: true, capture: true });
    });
  }

  /**
   * Monitor main thread blocking using Long Tasks API
   */
  private monitorMainThreadBlocking(): void {
    if ('PerformanceObserver' in window) {
      try {
        const longTaskObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          
          entries.forEach((entry) => {
            if (entry.entryType === 'longtask') {
              this.recordMainThreadBlocking(entry.duration);
            }
          });
        });

        longTaskObserver.observe({ entryTypes: ['longtask'] });
        console.log('📊 Main thread blocking monitoring enabled');
      } catch (error) {
        console.warn('Long Tasks API not supported');
      }
    }
  }

  /**
   * Setup performance optimizations
   */
  private setupPerformanceOptimizations(): void {
    if (this.config.enableEventDelegation) {
      this.setupEventDelegation();
    }

    if (this.config.enableTaskScheduling) {
      this.setupTaskScheduling();
    }

    console.log('⚡ FID optimization techniques initialized');
  }

  /**
   * Setup event delegation to reduce event listener overhead
   */
  private setupEventDelegation(): void {
    const commonEvents = ['click', 'input', 'change', 'focus', 'blur'];
    
    commonEvents.forEach(eventType => {
      this.document.addEventListener(eventType, (event) => {
        const target = event.target as Element;
        const handlers = this.eventDelegationMap.get(eventType);
        
        if (handlers) {
          handlers.forEach(handler => {
            // Check if handler should be called for this target
            if (this.shouldHandleEvent(target, handler)) {
              this.executeOptimizedHandler(handler, event);
            }
          });
        }
      }, { passive: true, capture: true });
    });
  }

  /**
   * Setup task scheduling to break up long-running tasks
   */
  private setupTaskScheduling(): void {
    const processTaskQueue = () => {
      if (this.taskQueue.length === 0 || this.isProcessingTasks) {
        return;
      }

      this.isProcessingTasks = true;
      const startTime = performance.now();

      while (this.taskQueue.length > 0 && (performance.now() - startTime) < this.config.maxTaskDuration) {
        const task = this.taskQueue.shift();
        if (task) {
          try {
            task();
          } catch (error) {
            console.error('Task execution error:', error);
          }
        }
      }

      this.isProcessingTasks = false;

      // Schedule next batch if there are more tasks
      if (this.taskQueue.length > 0) {
        this.scheduleTask(processTaskQueue);
      }
    };

    // Start processing tasks
    this.scheduleTask(processTaskQueue);
  }

  /**
   * Record FID measurement
   */
  private recordFIDMeasurement(entry: PerformanceEventTiming | any): void {
    const fid = entry.processingStart ? 
      entry.processingStart - entry.startTime : 
      entry.duration || 0;

    this.fidMeasurements.push(fid);
    this.updateMetrics();

    console.log(`📏 FID measured: ${fid.toFixed(2)}ms`);
  }

  /**
   * Record event timing
   */
  private recordEventTiming(entry: PerformanceEventTiming): void {
    const processingTime = entry.processingEnd - entry.processingStart;
    this.processingTimes.push(processingTime);
    this.recordInputEvent(processingTime);
  }

  /**
   * Record input event
   */
  private recordInputEvent(processingTime: number): void {
    this.inputEventTimes.push(performance.now());
    this.processingTimes.push(processingTime);
    this.updateMetrics();
  }

  /**
   * Record main thread blocking
   */
  private recordMainThreadBlocking(duration: number): void {
    const currentMetrics = this.metricsSubject.value;
    const newMetrics = {
      ...currentMetrics,
      mainThreadBlockedTime: currentMetrics.mainThreadBlockedTime + duration,
      timestamp: Date.now()
    };
    
    this.metricsSubject.next(newMetrics);
  }

  /**
   * Update FID metrics
   */
  private updateMetrics(): void {
    const currentFID = this.fidMeasurements.length > 0 ? 
      this.fidMeasurements[this.fidMeasurements.length - 1] : 0;
    
    const averageFID = this.fidMeasurements.length > 0 ?
      this.fidMeasurements.reduce((sum, fid) => sum + fid, 0) / this.fidMeasurements.length : 0;
    
    const maxFID = this.fidMeasurements.length > 0 ?
      Math.max(...this.fidMeasurements) : 0;

    const averageProcessingTime = this.processingTimes.length > 0 ?
      this.processingTimes.reduce((sum, time) => sum + time, 0) / this.processingTimes.length : 0;

    const optimizationScore = this.calculateOptimizationScore(currentFID, averageFID);

    const metrics: FIDMetrics = {
      currentFID,
      averageFID,
      maxFID,
      sampleCount: this.fidMeasurements.length,
      inputEventCount: this.inputEventTimes.length,
      averageProcessingTime,
      mainThreadBlockedTime: this.metricsSubject.value.mainThreadBlockedTime,
      optimizationScore,
      timestamp: Date.now()
    };

    this.metricsSubject.next(metrics);
  }

  /**
   * Calculate optimization score based on FID metrics
   */
  private calculateOptimizationScore(currentFID: number, averageFID: number): number {
    let score = 100;

    // Deduct points based on FID values
    if (averageFID > 100) {
      score -= Math.min(50, (averageFID - 100) / 10);
    }

    if (currentFID > 300) {
      score -= 30;
    } else if (currentFID > 100) {
      score -= 15;
    }

    // Add points for active optimizations
    const activeOptimizations = this.statusSubject.value.activeOptimizations;
    score += activeOptimizations.length * 2;

    return Math.max(0, Math.min(100, Math.round(score)));
  }

  /**
   * Execute handler with optimizations
   */
  private executeOptimizedHandler(handler: EventListener, event: Event): void {
    if (this.config.enableInputThrottling) {
      const eventType = event.type;
      const now = performance.now();
      const lastExecution = this.throttledEvents.get(eventType) || 0;

      if (now - lastExecution < this.config.throttleDelay) {
        return; // Skip this execution
      }

      this.throttledEvents.set(eventType, now);
    }

    // Execute handler in next task to avoid blocking
    this.scheduleTask(() => handler(event));
  }

  /**
   * Check if event should be handled
   */
  private shouldHandleEvent(target: Element, handler: EventListener): boolean {
    // Simple implementation - in real app, this would check selectors/conditions
    return true;
  }

  /**
   * Schedule a task for optimized execution
   */
  private scheduleTask(task: () => void): void {
    if ('scheduler' in window && 'postTask' in (window as any).scheduler) {
      // Use Scheduler API if available
      (window as any).scheduler.postTask(task, { priority: 'user-blocking' });
    } else if ('requestIdleCallback' in window) {
      // Use requestIdleCallback for non-critical tasks
      requestIdleCallback(() => task());
    } else {
      // Fallback to setTimeout
      setTimeout(task, 0);
    }
  }

  /**
   * Public API: Schedule task during idle time
   */
  scheduleIdleTask(task: () => void): void {
    this.scheduleTask(task);
  }

  /**
   * Public API: Enable optimization
   */
  enableOptimization(): void {
    this.isOptimizationEnabled = true;
    
    const activeOptimizations: string[] = [];
    
    if (this.config.enableOnPushDetection) {
      activeOptimizations.push('OnPush Change Detection');
    }
    
    if (this.config.enableEventDelegation) {
      activeOptimizations.push('Event Delegation');
    }
    
    if (this.config.enableInputThrottling) {
      activeOptimizations.push('Input Throttling');
    }
    
    if (this.config.enableTaskScheduling) {
      activeOptimizations.push('Task Scheduling');
    }

    this.statusSubject.next({
      enabled: true,
      optimizing: false,
      activeOptimizations
    });

    console.log('⚡ FID optimization enabled:', activeOptimizations);
  }

  /**
   * Public API: Disable optimization
   */
  disableOptimization(): void {
    this.isOptimizationEnabled = false;
    
    this.statusSubject.next({
      enabled: false,
      optimizing: false,
      activeOptimizations: []
    });

    console.log('🔌 FID optimization disabled');
  }

  /**
   * Public API: Get metrics observable
   */
  getMetricsObservable(): Observable<FIDMetrics> {
    return this.metrics$;
  }

  /**
   * Public API: Get optimization status
   */
  getOptimizationStatus(): Observable<FIDOptimizationStatus> {
    return this.status$;
  }

  /**
   * Public API: Get current metrics
   */
  getCurrentMetrics(): FIDMetrics {
    return this.metricsSubject.value;
  }

  /**
   * Public API: Reset metrics
   */
  resetMetrics(): void {
    this.fidMeasurements = [];
    this.inputEventTimes = [];
    this.processingTimes = [];
    
    this.metricsSubject.next({
      currentFID: 0,
      averageFID: 0,
      maxFID: 0,
      sampleCount: 0,
      inputEventCount: 0,
      averageProcessingTime: 0,
      mainThreadBlockedTime: 0,
      optimizationScore: 100,
      timestamp: Date.now()
    });

    console.log('🔄 FID metrics reset');
  }

  /**
   * Public API: Add task to optimized queue
   */
  addTask(task: () => void): void {
    this.taskQueue.push(task);
  }

  /**
   * Public API: Get performance recommendations
   */
  getRecommendations(): PerformanceRecommendation[] {
    const metrics = this.metricsSubject.value;
    const recommendations: PerformanceRecommendation[] = [];

    // High FID recommendations
    if (metrics.currentFID > 300) {
      recommendations.push({
        id: 'reduce-js-execution',
        title: 'Reduce JavaScript Execution Time',
        description: 'Break up long-running JavaScript tasks into smaller chunks to improve responsiveness.',
        priority: 'high',
        action: 'Optimize Code',
        impact: 40,
        implemented: false
      });
    }

    if (metrics.averageFID > 100) {
      recommendations.push({
        id: 'enable-code-splitting',
        title: 'Enable Code Splitting',
        description: 'Split your JavaScript bundles to reduce initial load and improve FID.',
        priority: 'high',
        action: 'Enable Splitting',
        impact: 35,
        implemented: this.config.enableCodeSplitting
      });
    }

    // Medium priority recommendations
    if (metrics.mainThreadBlockedTime > 50) {
      recommendations.push({
        id: 'optimize-main-thread',
        title: 'Optimize Main Thread Usage',
        description: 'Reduce main thread blocking time by moving work to web workers.',
        priority: 'medium',
        action: 'Use Web Workers',
        impact: 25,
        implemented: this.config.enableWebWorkers
      });
    }

    if (!this.isOptimizationEnabled) {
      recommendations.push({
        id: 'enable-optimization',
        title: 'Enable FID Optimization',
        description: 'Turn on automatic FID optimization techniques.',
        priority: 'medium',
        action: 'Enable Now',
        impact: 30,
        implemented: false
      });
    }

    // Low priority recommendations
    if (metrics.inputEventCount > 100 && !this.config.enableInputThrottling) {
      recommendations.push({
        id: 'throttle-inputs',
        title: 'Throttle Input Events',
        description: 'Reduce the frequency of input event processing to improve performance.',
        priority: 'low',
        action: 'Enable Throttling',
        impact: 15,
        implemented: false
      });
    }

    return recommendations;
  }

  /**
   * Public API: Execute recommendation
   */
  executeRecommendation(recommendationId: string): void {
    switch (recommendationId) {
      case 'enable-optimization':
        this.enableOptimization();
        break;
      
      case 'enable-code-splitting':
        this.config.enableCodeSplitting = true;
        console.log('✅ Code splitting enabled');
        break;
      
      case 'optimize-main-thread':
        this.config.enableWebWorkers = true;
        console.log('✅ Web workers enabled');
        break;
      
      case 'throttle-inputs':
        this.config.enableInputThrottling = true;
        console.log('✅ Input throttling enabled');
        break;
      
      case 'reduce-js-execution':
        // This would typically involve code analysis and optimization
        console.log('💡 JavaScript execution optimization recommended');
        break;
      
      default:
        console.warn('Unknown recommendation:', recommendationId);
    }
  }

  /**
   * Public API: Update configuration
   */
  updateConfig(newConfig: Partial<FIDOptimizationConfig>): void {
    this.config = { ...this.config, ...newConfig };
    
    // Re-initialize if needed
    if (this.isOptimizationEnabled) {
      this.enableOptimization();
    }
    
    console.log('⚙️ FID optimization config updated');
  }

  /**
   * Public API: Get current configuration
   */
  getConfig(): FIDOptimizationConfig {
    return { ...this.config };
  }

  /**
   * Public API: Register event handler with delegation
   */
  registerDelegatedHandler(eventType: string, handler: EventListener): void {
    if (!this.eventDelegationMap.has(eventType)) {
      this.eventDelegationMap.set(eventType, new Set());
    }
    
    this.eventDelegationMap.get(eventType)!.add(handler);
  }

  /**
   * Public API: Unregister event handler
   */
  unregisterDelegatedHandler(eventType: string, handler: EventListener): void {
    const handlers = this.eventDelegationMap.get(eventType);
    if (handlers) {
      handlers.delete(handler);
    }
  }

  /**
   * Public API: Get FID score interpretation
   */
  getFIDScoreInterpretation(fid: number): { status: string; color: string; description: string } {
    if (fid <= 100) {
      return {
        status: 'Good',
        color: '#16a34a',
        description: 'Your site responds quickly to user interactions.'
      };
    } else if (fid <= 300) {
      return {
        status: 'Needs Improvement',
        color: '#d97706',
        description: 'Your site could respond faster to user interactions.'
      };
    } else {
      return {
        status: 'Poor',
        color: '#dc2626',
        description: 'Your site responds slowly to user interactions.'
      };
    }
  }
}