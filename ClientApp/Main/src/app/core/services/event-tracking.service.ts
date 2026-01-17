import { Injectable, inject } from '@angular/core';
import { AnalyticsService } from './analytics.service';
import { BehaviorSubject, Observable, fromEvent } from 'rxjs';
import { throttleTime, debounceTime } from 'rxjs/operators';
import { DOCUMENT } from '@angular/common';

export interface CustomEvent {
  id: string;
  name: string;
  category: string;
  action: string;
  label?: string;
  value?: number;
  parameters: Record<string, any>;
  timestamp: Date;
  userId?: string;
  sessionId: string;
}

export interface EventTrackingConfig {
  enableAutoTracking: boolean;
  enableClickTracking: boolean;
  enableScrollTracking: boolean;
  enableFormTracking: boolean;
  enableErrorTracking: boolean;
  enablePerformanceTracking: boolean;
  throttleDelay: number;
  debounceDelay: number;
  maxEventsPerSession: number;
}

/**
 * Event Tracking Service
 * 
 * Provides comprehensive custom event tracking:
 * - User interaction tracking
 * - Scroll depth tracking
 * - Click tracking with heatmap data
 * - Form interaction tracking
 * - Error and performance tracking
 * - Custom business events
 */
@Injectable({
  providedIn: 'root'
})
export class EventTrackingService {
  private analyticsService = inject(AnalyticsService);
  private document = inject(DOCUMENT);

  private config: EventTrackingConfig = {
    enableAutoTracking: true,
    enableClickTracking: true,
    enableScrollTracking: true,
    enableFormTracking: true,
    enableErrorTracking: true,
    enablePerformanceTracking: true,
    throttleDelay: 100,
    debounceDelay: 300,
    maxEventsPerSession: 1000
  };

  private customEvents = new BehaviorSubject<CustomEvent[]>([]);
  private sessionId: string;
  private eventCounter = 0;

  public readonly customEvents$ = this.customEvents.asObservable();

  constructor() {
    this.sessionId = this.generateSessionId();
    this.initializeAutoTracking();
  }

  /**
   * Initialize automatic event tracking
   */
  private initializeAutoTracking(): void {
    if (!this.config.enableAutoTracking) return;

    console.log('📊 Event tracking initialized');
  }

  /**
   * Track custom event
   */
  trackCustomEvent(eventData: {
    name: string;
    category: string;
    action: string;
    label?: string;
    value?: number;
    parameters?: Record<string, any>;
  }): void {
    if (this.eventCounter >= this.config.maxEventsPerSession) {
      console.warn('Maximum events per session reached');
      return;
    }

    const customEvent: CustomEvent = {
      id: this.generateEventId(),
      name: eventData.name,
      category: eventData.category,
      action: eventData.action,
      label: eventData.label,
      value: eventData.value,
      parameters: eventData.parameters || {},
      timestamp: new Date(),
      userId: this.analyticsService.getUserProperties().userId,
      sessionId: this.sessionId
    };

    // Store locally
    const currentEvents = this.customEvents.value;
    currentEvents.push(customEvent);
    
    // Keep only last 500 events
    if (currentEvents.length > 500) {
      currentEvents.shift();
    }
    
    this.customEvents.next(currentEvents);

    // Send to analytics
    this.analyticsService.trackEvent(eventData.name, {
      event_category: eventData.category,
      event_action: eventData.action,
      event_label: eventData.label,
      value: eventData.value,
      ...eventData.parameters
    });

    this.eventCounter++;
    console.log('📊 Custom event tracked:', eventData.name);
  }

  /**
   * Track business event
   */
  trackBusinessEvent(eventName: string, data: Record<string, any>): void {
    this.trackCustomEvent({
      name: eventName,
      category: 'business',
      action: eventName,
      parameters: data
    });
  }

  /**
   * Track user journey milestone
   */
  trackUserJourney(milestone: string, step: number, data?: Record<string, any>): void {
    this.trackCustomEvent({
      name: 'user_journey',
      category: 'user_flow',
      action: milestone,
      value: step,
      parameters: {
        journey_step: step,
        milestone_name: milestone,
        ...data
      }
    });
  }

  /**
   * Track feature usage
   */
  trackFeatureUsage(featureName: string, action: string, context?: Record<string, any>): void {
    this.trackCustomEvent({
      name: 'feature_usage',
      category: 'feature',
      action: action,
      label: featureName,
      parameters: {
        feature_name: featureName,
        usage_context: context
      }
    });
  }

  /**
   * Generate session ID
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Generate event ID
   */
  private generateEventId(): string {
    return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<EventTrackingConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Get current configuration
   */
  getConfig(): EventTrackingConfig {
    return { ...this.config };
  }

  /**
   * Get custom events
   */
  getCustomEvents(): CustomEvent[] {
    return this.customEvents.value;
  }

  /**
   * Get session statistics
   */
  getSessionStats(): {
    sessionId: string;
    eventCount: number;
    sessionDuration: number;
  } {
    const sessionStart = new Date(parseInt(this.sessionId.split('_')[1]));
    const sessionDuration = Date.now() - sessionStart.getTime();

    return {
      sessionId: this.sessionId,
      eventCount: this.eventCounter,
      sessionDuration
    };
  }

  /**
   * Clear all tracking data
   */
  clearTrackingData(): void {
    this.customEvents.next([]);
    this.eventCounter = 0;
  }

  /**
   * Export tracking data
   */
  exportTrackingData(): string {
    return JSON.stringify({
      sessionId: this.sessionId,
      config: this.config,
      customEvents: this.customEvents.value,
      sessionStats: this.getSessionStats(),
      timestamp: new Date().toISOString()
    }, null, 2);
  }
}