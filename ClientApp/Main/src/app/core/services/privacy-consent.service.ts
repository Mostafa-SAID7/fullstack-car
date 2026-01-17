import { Injectable, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { AnalyticsService } from './analytics.service';
import { EventTrackingService } from './event-tracking.service';
import { PerformanceMonitoringService } from './performance-monitoring.service';

export interface ConsentPreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  personalization: boolean;
  performance: boolean;
}

export interface PrivacyConfig {
  enableGDPRCompliance: boolean;
  enableCCPACompliance: boolean;
  enableCookieConsent: boolean;
  enableDataRetention: boolean;
  dataRetentionDays: number;
  consentExpiryDays: number;
  showConsentBanner: boolean;
  requireExplicitConsent: boolean;
}

export interface UserDataRequest {
  id: string;
  type: 'access' | 'delete' | 'portability' | 'rectification';
  userId: string;
  email: string;
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  requestDate: Date;
  completionDate?: Date;
  data?: any;
}

export interface CookieInfo {
  name: string;
  category: 'necessary' | 'analytics' | 'marketing' | 'personalization' | 'performance';
  purpose: string;
  duration: string;
  provider: string;
  isThirdParty: boolean;
}

/**
 * Privacy Consent Service
 * 
 * Comprehensive privacy and consent management:
 * - GDPR and CCPA compliance
 * - Cookie consent management
 * - User data rights (access, delete, portability)
 * - Privacy-first analytics tracking
 * - Data retention and anonymization
 * - Consent preference management
 */
@Injectable({
  providedIn: 'root'
})
export class PrivacyConsentService {
  private document = inject(DOCUMENT);
  private analyticsService = inject(AnalyticsService);
  private eventTrackingService = inject(EventTrackingService);
  private performanceService = inject(PerformanceMonitoringService);

  private config: PrivacyConfig = {
    enableGDPRCompliance: true,
    enableCCPACompliance: true,
    enableCookieConsent: true,
    enableDataRetention: true,
    dataRetentionDays: 365,
    consentExpiryDays: 365,
    showConsentBanner: true,
    requireExplicitConsent: true
  };

  private consentPreferences = new BehaviorSubject<ConsentPreferences>({
    necessary: true, // Always true - required for basic functionality
    analytics: false,
    marketing: false,
    personalization: false,
    performance: false
  });

  private consentGiven = new BehaviorSubject<boolean>(false);
  private consentTimestamp = new BehaviorSubject<Date | null>(null);
  private userDataRequests = new BehaviorSubject<UserDataRequest[]>([]);
  private isInitialized = false;

  public readonly consentPreferences$ = this.consentPreferences.asObservable();
  public readonly consentGiven$ = this.consentGiven.asObservable();
  public readonly consentTimestamp$ = this.consentTimestamp.asObservable();
  public readonly userDataRequests$ = this.userDataRequests.asObservable();

  // Cookie registry
  private cookieRegistry: CookieInfo[] = [
    {
      name: '_ga',
      category: 'analytics',
      purpose: 'Google Analytics - Used to distinguish users',
      duration: '2 years',
      provider: 'Google',
      isThirdParty: true
    },
    {
      name: '_gid',
      category: 'analytics',
      purpose: 'Google Analytics - Used to distinguish users',
      duration: '24 hours',
      provider: 'Google',
      isThirdParty: true
    },
    {
      name: 'consent_preferences',
      category: 'necessary',
      purpose: 'Stores user consent preferences',
      duration: '1 year',
      provider: 'First Party',
      isThirdParty: false
    },
    {
      name: 'session_id',
      category: 'necessary',
      purpose: 'Maintains user session state',
      duration: 'Session',
      provider: 'First Party',
      isThirdParty: false
    }
  ];

  constructor() {
    this.initializePrivacyService();
  }

  /**
   * Initialize privacy service
   */
  private initializePrivacyService(): void {
    if (typeof window === 'undefined') return;

    this.loadStoredConsent();
    this.checkConsentExpiry();
    this.setupDataRetention();
    this.isInitialized = true;

    console.log('🔒 Privacy consent service initialized');
  }

  /**
   * Load stored consent preferences
   */
  private loadStoredConsent(): void {
    try {
      const storedConsent = localStorage.getItem('privacy_consent');
      const storedTimestamp = localStorage.getItem('consent_timestamp');

      if (storedConsent && storedTimestamp) {
        const preferences = JSON.parse(storedConsent) as ConsentPreferences;
        const timestamp = new Date(storedTimestamp);

        this.consentPreferences.next(preferences);
        this.consentTimestamp.next(timestamp);
        this.consentGiven.next(true);

        // Apply consent to services
        this.applyConsentToServices(preferences);

        console.log('🔒 Loaded stored consent preferences');
      }
    } catch (error) {
      console.error('Failed to load stored consent:', error);
    }
  }

  /**
   * Check if consent has expired
   */
  private checkConsentExpiry(): void {
    const timestamp = this.consentTimestamp.value;
    if (!timestamp) return;

    const expiryDate = new Date(timestamp.getTime() + this.config.consentExpiryDays * 24 * 60 * 60 * 1000);
    const now = new Date();

    if (now > expiryDate) {
      this.resetConsent();
      console.log('🔒 Consent expired, reset required');
    }
  }

  /**
   * Setup data retention policies
   */
  private setupDataRetention(): void {
    if (!this.config.enableDataRetention) return;

    // Check for data cleanup every 24 hours
    setInterval(() => {
      this.cleanupExpiredData();
    }, 24 * 60 * 60 * 1000);
  }

  /**
   * Set user consent preferences
   */
  setConsentPreferences(preferences: Partial<ConsentPreferences>): void {
    const currentPreferences = this.consentPreferences.value;
    const newPreferences: ConsentPreferences = {
      ...currentPreferences,
      ...preferences,
      necessary: true // Always true
    };

    this.consentPreferences.next(newPreferences);
    this.consentGiven.next(true);
    this.consentTimestamp.next(new Date());

    // Store in localStorage
    this.storeConsent(newPreferences);

    // Apply to services
    this.applyConsentToServices(newPreferences);

    // Track consent event
    this.trackConsentEvent('consent_updated', newPreferences);

    console.log('🔒 Consent preferences updated:', newPreferences);
  }

  /**
   * Accept all consent categories
   */
  acceptAllConsent(): void {
    this.setConsentPreferences({
      analytics: true,
      marketing: true,
      personalization: true,
      performance: true
    });
  }

  /**
   * Reject all non-necessary consent
   */
  rejectAllConsent(): void {
    this.setConsentPreferences({
      analytics: false,
      marketing: false,
      personalization: false,
      performance: false
    });
  }

  /**
   * Reset all consent
   */
  resetConsent(): void {
    this.consentPreferences.next({
      necessary: true,
      analytics: false,
      marketing: false,
      personalization: false,
      performance: false
    });
    this.consentGiven.next(false);
    this.consentTimestamp.next(null);

    // Clear stored consent
    localStorage.removeItem('privacy_consent');
    localStorage.removeItem('consent_timestamp');

    // Disable all services
    this.disableAllServices();

    console.log('🔒 Consent reset');
  }

  /**
   * Store consent in localStorage
   */
  private storeConsent(preferences: ConsentPreferences): void {
    try {
      localStorage.setItem('privacy_consent', JSON.stringify(preferences));
      localStorage.setItem('consent_timestamp', new Date().toISOString());
    } catch (error) {
      console.error('Failed to store consent:', error);
    }
  }

  /**
   * Apply consent preferences to services
   */
  private applyConsentToServices(preferences: ConsentPreferences): void {
    // Analytics service
    if (preferences.analytics) {
      this.analyticsService.enableCookieConsent();
    } else {
      this.analyticsService.disableCookieConsent();
    }

    // Event tracking service
    this.eventTrackingService.updateConfig({
      enableAutoTracking: preferences.analytics || preferences.performance
    });

    // Performance monitoring
    this.performanceService.updateConfig({
      enableCoreWebVitals: preferences.performance,
      enableResourceMonitoring: preferences.performance,
      enableMemoryMonitoring: preferences.performance
    });
  }

  /**
   * Disable all services
   */
  private disableAllServices(): void {
    this.analyticsService.disableCookieConsent();
    this.eventTrackingService.updateConfig({
      enableAutoTracking: false
    });
    this.performanceService.stopMonitoring();
  }

  /**
   * Track consent event
   */
  private trackConsentEvent(eventName: string, preferences: ConsentPreferences): void {
    // Only track if analytics consent is given
    if (preferences.analytics) {
      this.eventTrackingService.trackCustomEvent({
        name: eventName,
        category: 'privacy',
        action: 'consent',
        parameters: {
          consent_analytics: preferences.analytics,
          consent_marketing: preferences.marketing,
          consent_personalization: preferences.personalization,
          consent_performance: preferences.performance
        }
      });
    }
  }

  /**
   * Check if specific consent is given
   */
  hasConsent(category: keyof ConsentPreferences): boolean {
    return this.consentPreferences.value[category];
  }

  /**
   * Check if any consent is given
   */
  hasAnyConsent(): boolean {
    const preferences = this.consentPreferences.value;
    return preferences.analytics || preferences.marketing || preferences.personalization || preferences.performance;
  }

  /**
   * Get consent status
   */
  getConsentStatus(): {
    given: boolean;
    timestamp: Date | null;
    preferences: ConsentPreferences;
    expired: boolean;
  } {
    const timestamp = this.consentTimestamp.value;
    const expired = timestamp ? this.isConsentExpired(timestamp) : false;

    return {
      given: this.consentGiven.value,
      timestamp,
      preferences: this.consentPreferences.value,
      expired
    };
  }

  /**
   * Check if consent is expired
   */
  private isConsentExpired(timestamp: Date): boolean {
    const expiryDate = new Date(timestamp.getTime() + this.config.consentExpiryDays * 24 * 60 * 60 * 1000);
    return new Date() > expiryDate;
  }

  /**
   * Submit user data request
   */
  submitDataRequest(request: Omit<UserDataRequest, 'id' | 'status' | 'requestDate'>): string {
    const dataRequest: UserDataRequest = {
      ...request,
      id: this.generateRequestId(),
      status: 'pending',
      requestDate: new Date()
    };

    const currentRequests = this.userDataRequests.value;
    currentRequests.push(dataRequest);
    this.userDataRequests.next(currentRequests);

    // Store in localStorage for persistence
    this.storeDataRequests(currentRequests);

    console.log('🔒 Data request submitted:', dataRequest.type, dataRequest.id);
    return dataRequest.id;
  }

  /**
   * Process data access request
   */
  async processAccessRequest(requestId: string): Promise<any> {
    const request = this.findDataRequest(requestId);
    if (!request || request.type !== 'access') {
      throw new Error('Invalid access request');
    }

    this.updateRequestStatus(requestId, 'processing');

    try {
      // Collect user data from all services
      const userData = {
        analytics: this.analyticsService.exportAnalyticsData(),
        events: this.eventTrackingService.exportTrackingData(),
        performance: this.performanceService.exportPerformanceData(),
        consent: {
          preferences: this.consentPreferences.value,
          timestamp: this.consentTimestamp.value,
          requests: this.userDataRequests.value.filter(r => r.userId === request.userId)
        }
      };

      // Update request with data
      this.updateRequestData(requestId, userData);
      this.updateRequestStatus(requestId, 'completed');

      return userData;
    } catch (error) {
      this.updateRequestStatus(requestId, 'rejected');
      throw error;
    }
  }

  /**
   * Process data deletion request
   */
  async processDeleteRequest(requestId: string): Promise<void> {
    const request = this.findDataRequest(requestId);
    if (!request || request.type !== 'delete') {
      throw new Error('Invalid delete request');
    }

    this.updateRequestStatus(requestId, 'processing');

    try {
      // Clear all user data
      this.analyticsService.clearAnalyticsData();
      this.eventTrackingService.clearTrackingData();
      this.performanceService.clearAlerts();

      // Reset consent
      this.resetConsent();

      // Clear stored data requests for this user
      const currentRequests = this.userDataRequests.value;
      const filteredRequests = currentRequests.filter(r => r.userId !== request.userId);
      this.userDataRequests.next(filteredRequests);
      this.storeDataRequests(filteredRequests);

      this.updateRequestStatus(requestId, 'completed');
      console.log('🔒 User data deleted for request:', requestId);
    } catch (error) {
      this.updateRequestStatus(requestId, 'rejected');
      throw error;
    }
  }

  /**
   * Get cookie information
   */
  getCookieInfo(): CookieInfo[] {
    return this.cookieRegistry;
  }

  /**
   * Get cookies by category
   */
  getCookiesByCategory(category: CookieInfo['category']): CookieInfo[] {
    return this.cookieRegistry.filter(cookie => cookie.category === category);
  }

  /**
   * Add cookie to registry
   */
  registerCookie(cookie: CookieInfo): void {
    const existingIndex = this.cookieRegistry.findIndex(c => c.name === cookie.name);
    if (existingIndex >= 0) {
      this.cookieRegistry[existingIndex] = cookie;
    } else {
      this.cookieRegistry.push(cookie);
    }
  }

  /**
   * Clean up expired data
   */
  private cleanupExpiredData(): void {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - this.config.dataRetentionDays);

    // Clean up old analytics events
    const analyticsEvents = this.analyticsService.getAnalyticsEvents();
    const filteredAnalytics = analyticsEvents.filter(event => event.timestamp >= cutoffDate);
    
    if (filteredAnalytics.length !== analyticsEvents.length) {
      this.analyticsService.clearAnalyticsData();
      console.log(`🔒 Cleaned up ${analyticsEvents.length - filteredAnalytics.length} expired analytics events`);
    }

    // Clean up old custom events
    const customEvents = this.eventTrackingService.getCustomEvents();
    const filteredCustom = customEvents.filter(event => event.timestamp >= cutoffDate);
    
    if (filteredCustom.length !== customEvents.length) {
      this.eventTrackingService.clearTrackingData();
      console.log(`🔒 Cleaned up ${customEvents.length - filteredCustom.length} expired custom events`);
    }

    // Clean up old data requests
    const requests = this.userDataRequests.value;
    const filteredRequests = requests.filter(request => request.requestDate >= cutoffDate);
    
    if (filteredRequests.length !== requests.length) {
      this.userDataRequests.next(filteredRequests);
      this.storeDataRequests(filteredRequests);
      console.log(`🔒 Cleaned up ${requests.length - filteredRequests.length} expired data requests`);
    }
  }

  /**
   * Generate request ID
   */
  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Find data request by ID
   */
  private findDataRequest(requestId: string): UserDataRequest | undefined {
    return this.userDataRequests.value.find(r => r.id === requestId);
  }

  /**
   * Update request status
   */
  private updateRequestStatus(requestId: string, status: UserDataRequest['status']): void {
    const requests = this.userDataRequests.value;
    const request = requests.find(r => r.id === requestId);
    
    if (request) {
      request.status = status;
      if (status === 'completed' || status === 'rejected') {
        request.completionDate = new Date();
      }
      this.userDataRequests.next([...requests]);
      this.storeDataRequests(requests);
    }
  }

  /**
   * Update request data
   */
  private updateRequestData(requestId: string, data: any): void {
    const requests = this.userDataRequests.value;
    const request = requests.find(r => r.id === requestId);
    
    if (request) {
      request.data = data;
      this.userDataRequests.next([...requests]);
      this.storeDataRequests(requests);
    }
  }

  /**
   * Store data requests
   */
  private storeDataRequests(requests: UserDataRequest[]): void {
    try {
      localStorage.setItem('privacy_data_requests', JSON.stringify(requests));
    } catch (error) {
      console.error('Failed to store data requests:', error);
    }
  }

  /**
   * Load stored data requests
   */
  private loadStoredDataRequests(): void {
    try {
      const stored = localStorage.getItem('privacy_data_requests');
      if (stored) {
        const requests = JSON.parse(stored) as UserDataRequest[];
        this.userDataRequests.next(requests);
      }
    } catch (error) {
      console.error('Failed to load stored data requests:', error);
    }
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<PrivacyConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Get current configuration
   */
  getConfig(): PrivacyConfig {
    return { ...this.config };
  }

  /**
   * Get current consent preferences
   */
  getCurrentPreferences(): ConsentPreferences {
    return this.consentPreferences.value;
  }

  /**
   * Get data requests for user
   */
  getUserDataRequests(userId: string): UserDataRequest[] {
    return this.userDataRequests.value.filter(r => r.userId === userId);
  }

  /**
   * Check if service is initialized
   */
  isServiceInitialized(): boolean {
    return this.isInitialized;
  }

  /**
   * Export privacy data
   */
  exportPrivacyData(): string {
    return JSON.stringify({
      config: this.config,
      consentPreferences: this.consentPreferences.value,
      consentGiven: this.consentGiven.value,
      consentTimestamp: this.consentTimestamp.value,
      userDataRequests: this.userDataRequests.value,
      cookieRegistry: this.cookieRegistry,
      timestamp: new Date().toISOString()
    }, null, 2);
  }
}