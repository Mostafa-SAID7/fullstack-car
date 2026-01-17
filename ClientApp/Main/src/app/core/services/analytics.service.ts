import { Injectable, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';

export interface AnalyticsConfig {
  measurementId: string;
  enablePageTracking: boolean;
  enableEventTracking: boolean;
  enableEcommerce: boolean;
  enableUserProperties: boolean;
  enableCustomDimensions: boolean;
  debugMode: boolean;
  cookieConsent: boolean;
}

export interface AnalyticsEvent {
  eventName: string;
  parameters: Record<string, any>;
  timestamp: Date;
}

export interface UserProperties {
  userId?: string;
  userType?: 'premium' | 'free' | 'trial';
  signupDate?: string;
  lastLoginDate?: string;
  preferences?: Record<string, any>;
}

export interface EcommerceItem {
  item_id: string;
  item_name: string;
  category: string;
  quantity: number;
  price: number;
  currency?: string;
}

export interface EcommerceEvent {
  transaction_id: string;
  value: number;
  currency: string;
  items: EcommerceItem[];
}

/**
 * Analytics Service
 * 
 * Integrates Google Analytics 4 for comprehensive tracking:
 * - Page view tracking
 * - Custom event tracking
 * - E-commerce tracking
 * - User property management
 * - Performance monitoring
 * - GDPR compliance
 */
@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private document = inject(DOCUMENT);
  private router = inject(Router);

  private config: AnalyticsConfig = {
    measurementId: 'G-XXXXXXXXXX', // Replace with actual GA4 measurement ID
    enablePageTracking: true,
    enableEventTracking: true,
    enableEcommerce: true,
    enableUserProperties: true,
    enableCustomDimensions: true,
    debugMode: false,
    cookieConsent: false
  };

  private analyticsEvents = new BehaviorSubject<AnalyticsEvent[]>([]);
  private userProperties = new BehaviorSubject<UserProperties>({});
  private isInitialized = false;
  private gtag: any;

  public readonly analyticsEvents$ = this.analyticsEvents.asObservable();
  public readonly userProperties$ = this.userProperties.asObservable();

  constructor() {
    this.initializeAnalytics();
    this.setupRouteTracking();
  }

  /**
   * Initialize Google Analytics 4
   */
  private async initializeAnalytics(): Promise<void> {
    if (this.isInitialized || !this.config.cookieConsent) {
      return;
    }

    try {
      // Load Google Analytics script
      await this.loadGoogleAnalytics();
      
      // Configure GA4
      this.gtag('config', this.config.measurementId, {
        page_title: this.document.title,
        page_location: window.location.href,
        debug_mode: this.config.debugMode,
        send_page_view: this.config.enablePageTracking
      });

      this.isInitialized = true;
      console.log('📊 Google Analytics 4 initialized');
      
      // Track initial page view
      if (this.config.enablePageTracking) {
        this.trackPageView();
      }
    } catch (error) {
      console.error('Failed to initialize Google Analytics:', error);
    }
  }

  /**
   * Load Google Analytics script
   */
  private loadGoogleAnalytics(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Check if gtag is already loaded
      if (window.gtag) {
        this.gtag = window.gtag;
        resolve();
        return;
      }

      // Create gtag function
      window.dataLayer = window.dataLayer || [];
      this.gtag = function() {
        window.dataLayer.push(arguments);
      };
      window.gtag = this.gtag;

      // Set initial timestamp
      this.gtag('js', new Date());

      // Load GA4 script
      const script = this.document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${this.config.measurementId}`;
      
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Google Analytics script'));
      
      this.document.head.appendChild(script);
    });
  }

  /**
   * Setup automatic route tracking
   */
  private setupRouteTracking(): void {
    if (!this.config.enablePageTracking) return;

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        if (this.isInitialized) {
          this.trackPageView(event.urlAfterRedirects);
        }
      });
  }

  /**
   * Track page view
   */
  trackPageView(url?: string): void {
    if (!this.isInitialized || !this.config.enablePageTracking) return;

    const pageUrl = url || window.location.pathname + window.location.search;
    const pageTitle = this.document.title;

    this.gtag('config', this.config.measurementId, {
      page_path: pageUrl,
      page_title: pageTitle
    });

    // Also send as event for more detailed tracking
    this.trackEvent('page_view', {
      page_path: pageUrl,
      page_title: pageTitle,
      page_location: window.location.href
    });

    console.log('📊 Page view tracked:', pageUrl);
  }

  /**
   * Track custom event
   */
  trackEvent(eventName: string, parameters: Record<string, any> = {}): void {
    if (!this.isInitialized || !this.config.enableEventTracking) return;

    // Send to Google Analytics
    this.gtag('event', eventName, parameters);

    // Store locally for debugging/monitoring
    const event: AnalyticsEvent = {
      eventName,
      parameters,
      timestamp: new Date()
    };

    const currentEvents = this.analyticsEvents.value;
    currentEvents.push(event);
    
    // Keep only last 100 events
    if (currentEvents.length > 100) {
      currentEvents.shift();
    }
    
    this.analyticsEvents.next(currentEvents);

    console.log('📊 Event tracked:', eventName, parameters);
  }

  /**
   * Track user interaction
   */
  trackUserInteraction(action: string, element: string, value?: number): void {
    this.trackEvent('user_interaction', {
      action,
      element,
      value
    });
  }

  /**
   * Track performance metrics
   */
  trackPerformance(metrics: {
    metric_name: string;
    value: number;
    unit?: string;
  }): void {
    this.trackEvent('performance_metric', {
      custom_metric_name: metrics.metric_name,
      custom_metric_value: metrics.value,
      custom_metric_unit: metrics.unit || 'ms'
    });
  }

  /**
   * Track Core Web Vitals
   */
  trackWebVitals(vitals: {
    name: 'CLS' | 'FID' | 'LCP' | 'FCP' | 'TTFB';
    value: number;
    rating: 'good' | 'needs-improvement' | 'poor';
  }): void {
    this.trackEvent('web_vitals', {
      metric_name: vitals.name,
      metric_value: vitals.value,
      metric_rating: vitals.rating
    });
  }

  /**
   * Track search
   */
  trackSearch(searchTerm: string, resultsCount?: number): void {
    this.trackEvent('search', {
      search_term: searchTerm,
      results_count: resultsCount
    });
  }

  /**
   * Track content engagement
   */
  trackContentEngagement(contentId: string, contentType: string, action: string): void {
    this.trackEvent('content_engagement', {
      content_id: contentId,
      content_type: contentType,
      engagement_action: action
    });
  }

  /**
   * Track video interaction
   */
  trackVideoInteraction(videoId: string, action: 'play' | 'pause' | 'complete' | 'seek', progress?: number): void {
    this.trackEvent('video_interaction', {
      video_id: videoId,
      video_action: action,
      video_progress: progress
    });
  }

  /**
   * Track form interaction
   */
  trackFormInteraction(formName: string, action: 'start' | 'complete' | 'abandon', fieldName?: string): void {
    this.trackEvent('form_interaction', {
      form_name: formName,
      form_action: action,
      field_name: fieldName
    });
  }

  /**
   * Track e-commerce purchase
   */
  trackPurchase(transaction: EcommerceEvent): void {
    if (!this.config.enableEcommerce) return;

    this.gtag('event', 'purchase', {
      transaction_id: transaction.transaction_id,
      value: transaction.value,
      currency: transaction.currency,
      items: transaction.items
    });
  }

  /**
   * Track add to cart
   */
  trackAddToCart(item: EcommerceItem): void {
    if (!this.config.enableEcommerce) return;

    this.gtag('event', 'add_to_cart', {
      currency: item.currency || 'USD',
      value: item.price * item.quantity,
      items: [item]
    });
  }

  /**
   * Track view item
   */
  trackViewItem(item: EcommerceItem): void {
    if (!this.config.enableEcommerce) return;

    this.gtag('event', 'view_item', {
      currency: item.currency || 'USD',
      value: item.price,
      items: [item]
    });
  }

  /**
   * Set user properties
   */
  setUserProperties(properties: UserProperties): void {
    if (!this.isInitialized || !this.config.enableUserProperties) return;

    // Update local state
    const currentProperties = this.userProperties.value;
    const updatedProperties = { ...currentProperties, ...properties };
    this.userProperties.next(updatedProperties);

    // Send to Google Analytics
    Object.entries(properties).forEach(([key, value]) => {
      this.gtag('config', this.config.measurementId, {
        user_properties: {
          [key]: value
        }
      });
    });

    console.log('📊 User properties updated:', properties);
  }

  /**
   * Set user ID
   */
  setUserId(userId: string): void {
    if (!this.isInitialized) return;

    this.gtag('config', this.config.measurementId, {
      user_id: userId
    });

    this.setUserProperties({ userId });
  }

  /**
   * Track exception
   */
  trackException(error: Error, fatal: boolean = false): void {
    this.trackEvent('exception', {
      description: error.message,
      fatal,
      stack_trace: error.stack
    });
  }

  /**
   * Track timing
   */
  trackTiming(category: string, variable: string, value: number, label?: string): void {
    this.trackEvent('timing_complete', {
      timing_category: category,
      timing_variable: variable,
      timing_value: value,
      timing_label: label
    });
  }

  /**
   * Enable cookie consent and initialize analytics
   */
  enableCookieConsent(): void {
    this.config.cookieConsent = true;
    if (!this.isInitialized) {
      this.initializeAnalytics();
    }
  }

  /**
   * Disable analytics and clear data
   */
  disableCookieConsent(): void {
    this.config.cookieConsent = false;
    
    // Disable GA4 tracking
    if (this.isInitialized) {
      this.gtag('config', this.config.measurementId, {
        send_page_view: false
      });
    }

    // Clear local data
    this.analyticsEvents.next([]);
    this.userProperties.next({});
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<AnalyticsConfig>): void {
    this.config = { ...this.config, ...newConfig };
    
    if (this.config.cookieConsent && !this.isInitialized) {
      this.initializeAnalytics();
    }
  }

  /**
   * Get current configuration
   */
  getConfig(): AnalyticsConfig {
    return { ...this.config };
  }

  /**
   * Get analytics events
   */
  getAnalyticsEvents(): AnalyticsEvent[] {
    return this.analyticsEvents.value;
  }

  /**
   * Get user properties
   */
  getUserProperties(): UserProperties {
    return this.userProperties.value;
  }

  /**
   * Check if analytics is initialized
   */
  isAnalyticsInitialized(): boolean {
    return this.isInitialized;
  }

  /**
   * Clear all analytics data
   */
  clearAnalyticsData(): void {
    this.analyticsEvents.next([]);
    this.userProperties.next({});
  }

  /**
   * Export analytics data for debugging
   */
  exportAnalyticsData(): string {
    return JSON.stringify({
      config: this.config,
      events: this.analyticsEvents.value,
      userProperties: this.userProperties.value,
      isInitialized: this.isInitialized,
      timestamp: new Date().toISOString()
    }, null, 2);
  }
}

// Extend Window interface for gtag
declare global {
  interface Window {
    gtag: any;
    dataLayer: any[];
  }
}