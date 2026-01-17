import { 
  Directive, 
  Input, 
  Output, 
  EventEmitter, 
  ElementRef, 
  OnInit, 
  OnDestroy, 
  inject,
  ChangeDetectorRef
} from '@angular/core';
import { FIDOptimizationService } from '../../core/services/fid-optimization.service';

export interface FIDOptimizationConfig {
  enableOnPush: boolean;
  enableEventOptimization: boolean;
  enableTaskBreaking: boolean;
  enableIdleCallback: boolean;
  maxTaskDuration: number;
  debounceDelay: number;
  throttleDelay: number;
}

/**
 * FID Optimization Directive
 * 
 * Applies First Input Delay optimizations to any element:
 * - Optimizes event listeners
 * - Implements task breaking
 * - Uses idle callbacks for non-critical work
 * - Debounces/throttles events
 * - Monitors FID metrics
 */
@Directive({
  selector: '[fidOptimization]',
  standalone: true
})
export class FIDOptimizationDirective implements OnInit, OnDestroy {
  private elementRef = inject(ElementRef);
  private fidService = inject(FIDOptimizationService);
  private cdr = inject(ChangeDetectorRef);

  @Input() fidConfig: FIDOptimizationConfig = {
    enableOnPush: true,
    enableEventOptimization: true,
    enableTaskBreaking: true,
    enableIdleCallback: true,
    maxTaskDuration: 50,
    debounceDelay: 100,
    throttleDelay: 16
  };

  @Output() fidMetric = new EventEmitter<any>();
  @Output() longTask = new EventEmitter<number>();

  private eventListeners: Array<{ event: string, handler: EventListener }> = [];
  private debounceTimers = new Map<string, number>();
  private throttleTimers = new Map<string, number>();

  ngOnInit(): void {
    this.applyFIDOptimizations();
  }

  ngOnDestroy(): void {
    this.cleanup();
  }

  /**
   * Apply FID optimizations to the element
   */
  private applyFIDOptimizations(): void {
    if (this.fidConfig.enableEventOptimization) {
      this.optimizeEventListeners();
    }

    if (this.fidConfig.enableOnPush) {
      this.optimizeChangeDetection();
    }

    this.monitorElementInteractions();
  }

  /**
   * Optimize event listeners for better FID
   */
  private optimizeEventListeners(): void {
    const element = this.elementRef.nativeElement;
    
    // Common interactive events
    const interactiveEvents = ['click', 'keydown', 'touchstart', 'input'];
    
    interactiveEvents.forEach(eventType => {
      const optimizedHandler = this.createOptimizedEventHandler(eventType);
      
      element.addEventListener(eventType, optimizedHandler, {
        passive: eventType === 'touchstart' || eventType === 'scroll',
        capture: false
      });

      this.eventListeners.push({
        event: eventType,
        handler: optimizedHandler
      });
    });

    console.log(`🎯 FID optimized event listeners for ${element.tagName}`);
  }

  /**
   * Create optimized event handler
   */
  private createOptimizedEventHandler(eventType: string): EventListener {
    return (event: Event) => {
      const startTime = performance.now();

      // Debounce rapid events
      if (this.shouldDebounce(eventType)) {
        this.debounceEvent(eventType, () => {
          this.processEvent(event, startTime);
        });
        return;
      }

      // Throttle high-frequency events
      if (this.shouldThrottle(eventType)) {
        this.throttleEvent(eventType, () => {
          this.processEvent(event, startTime);
        });
        return;
      }

      // Process immediately for critical events
      this.processEvent(event, startTime);
    };
  }

  /**
   * Process event with FID optimization
   */
  private processEvent(event: Event, startTime: number): void {
    // Break up processing if it might be long-running
    if (this.fidConfig.enableTaskBreaking) {
      this.fidService.scheduleIdleTask(() => {
        this.handleEventProcessing(event, startTime);
      });
    } else {
      this.handleEventProcessing(event, startTime);
    }
  }

  /**
   * Handle event processing
   */
  private handleEventProcessing(event: Event, startTime: number): void {
    try {
      // Emit the original event
      const processingTime = performance.now() - startTime;
      
      if (processingTime > this.fidConfig.maxTaskDuration) {
        this.longTask.emit(processingTime);
        console.warn(`⚠️ Long event processing: ${processingTime.toFixed(2)}ms`);
      }

      // Emit FID metric
      this.fidMetric.emit({
        eventType: event.type,
        processingTime,
        timestamp: startTime,
        target: event.target
      });

    } catch (error) {
      console.error('Error processing event:', error);
    }
  }

  /**
   * Optimize change detection
   */
  private optimizeChangeDetection(): void {
    if (this.fidConfig.enableOnPush) {
      // Detach from change detection and manually trigger when needed
      this.cdr.detach();
      
      // Re-attach during user interactions
      const element = this.elementRef.nativeElement;
      
      const reattachEvents = ['mouseenter', 'focus', 'touchstart'];
      
      reattachEvents.forEach(eventType => {
        element.addEventListener(eventType, () => {
          this.cdr.reattach();
          
          // Detach again after a short delay
          setTimeout(() => {
            this.cdr.detach();
          }, 100);
        });
      });
    }
  }

  /**
   * Monitor element interactions for FID metrics
   */
  private monitorElementInteractions(): void {
    const element = this.elementRef.nativeElement;
    
    // Track first interaction with this element
    let firstInteraction = true;
    
    const interactionHandler = (event: Event) => {
      if (firstInteraction) {
        firstInteraction = false;
        
        const fidMetric = {
          element: element.tagName,
          eventType: event.type,
          timestamp: performance.now(),
          isFirstInteraction: true
        };
        
        this.fidMetric.emit(fidMetric);
        console.log('🎯 First interaction tracked:', fidMetric);
      }
    };

    ['click', 'keydown', 'touchstart'].forEach(eventType => {
      element.addEventListener(eventType, interactionHandler, { once: true });
    });
  }

  /**
   * Check if event should be debounced
   */
  private shouldDebounce(eventType: string): boolean {
    return ['input', 'scroll', 'resize'].includes(eventType);
  }

  /**
   * Check if event should be throttled
   */
  private shouldThrottle(eventType: string): boolean {
    return ['mousemove', 'touchmove', 'scroll'].includes(eventType);
  }

  /**
   * Debounce event handler
   */
  private debounceEvent(eventType: string, handler: () => void): void {
    const existingTimer = this.debounceTimers.get(eventType);
    
    if (existingTimer) {
      clearTimeout(existingTimer);
    }

    const timer = window.setTimeout(() => {
      handler();
      this.debounceTimers.delete(eventType);
    }, this.fidConfig.debounceDelay);

    this.debounceTimers.set(eventType, timer);
  }

  /**
   * Throttle event handler
   */
  private throttleEvent(eventType: string, handler: () => void): void {
    const existingTimer = this.throttleTimers.get(eventType);
    
    if (!existingTimer) {
      handler();
      
      const timer = window.setTimeout(() => {
        this.throttleTimers.delete(eventType);
      }, this.fidConfig.throttleDelay);

      this.throttleTimers.set(eventType, timer);
    }
  }

  /**
   * Cleanup resources
   */
  private cleanup(): void {
    const element = this.elementRef.nativeElement;
    
    // Remove event listeners
    this.eventListeners.forEach(({ event, handler }) => {
      element.removeEventListener(event, handler);
    });

    // Clear timers
    this.debounceTimers.forEach(timer => clearTimeout(timer));
    this.throttleTimers.forEach(timer => clearTimeout(timer));

    this.eventListeners = [];
    this.debounceTimers.clear();
    this.throttleTimers.clear();
  }
}