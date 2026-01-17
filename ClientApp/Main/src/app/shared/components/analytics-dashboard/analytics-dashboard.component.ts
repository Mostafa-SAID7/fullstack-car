import {
  Component,
  Input,
  Output,
  EventEmitter,
  signal,
  computed,
  inject,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsService, AnalyticsEvent, UserProperties } from '../../../core/services/analytics.service';
import { EventTrackingService, CustomEvent } from '../../../core/services/event-tracking.service';
import { PerformanceMonitoringService, PerformanceMetrics, PerformanceAlert } from '../../../core/services/performance-monitoring.service';
import { Subscription, combineLatest } from 'rxjs';

export interface AnalyticsDashboardConfig {
  showRealTimeMetrics: boolean;
  showPerformanceAlerts: boolean;
  showUserEvents: boolean;
  showWebVitals: boolean;
  refreshInterval: number;
  maxEventsToShow: number;
}

export interface DashboardMetrics {
  totalEvents: number;
  uniqueUsers: number;
  pageViews: number;
  sessionDuration: number;
  bounceRate: number;
  performanceScore: number;
  errorRate: number;
  conversionRate: number;
}

export interface RealTimeData {
  activeUsers: number;
  currentPageViews: number;
  recentEvents: CustomEvent[];
  performanceAlerts: PerformanceAlert[];
  webVitals: {
    cls: number | null;
    fid: number | null;
    lcp: number | null;
  };
}

/**
 * Analytics Dashboard Component
 * 
 * Comprehensive analytics dashboard displaying:
 * - Real-time user activity and metrics
 * - Performance monitoring and Core Web Vitals
 * - Event tracking and user behavior
 * - Alerts and recommendations
 * - Historical data and trends
 */
@Component({
  selector: 'app-analytics-dashboard',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './analytics-dashboard.component.html',
  styleUrls: ['./analytics-dashboard.component.scss']
})
export class AnalyticsDashboardComponent implements OnInit, OnDestroy {
  @Input() config = signal<AnalyticsDashboardConfig>({
    showRealTimeMetrics: true,
    showPerformanceAlerts: true,
    showUserEvents: true,
    showWebVitals: true,
    refreshInterval: 30000, // 30 seconds
    maxEventsToShow: 10
  });

  @Output() dataExported = new EventEmitter<string>();
  @Output() alertClicked = new EventEmitter<PerformanceAlert>();

  private analyticsService = inject(AnalyticsService);
  private eventTrackingService = inject(EventTrackingService);
  private performanceService = inject(PerformanceMonitoringService);

  // Signals for reactive state
  protected isLoading = signal(false);
  protected lastUpdated = signal(new Date());
  protected dashboardMetrics = signal<DashboardMetrics>({
    totalEvents: 0,
    uniqueUsers: 0,
    pageViews: 0,
    sessionDuration: 0,
    bounceRate: 0,
    performanceScore: 0,
    errorRate: 0,
    conversionRate: 0
  });

  protected realTimeData = signal<RealTimeData>({
    activeUsers: 0,
    currentPageViews: 0,
    recentEvents: [],
    performanceAlerts: [],
    webVitals: {
      cls: null,
      fid: null,
      lcp: null
    }
  });

  private userProperties = signal<UserProperties>({});
  private subscriptions = new Subscription();
  private refreshTimer?: number;

  // Computed values
  protected readonly getUserPropertiesArray = computed(() => {
    const props = this.userProperties();
    return Object.entries(props).map(([key, value]) => ({
      key: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
      value: String(value)
    }));
  });

  ngOnInit(): void {
    this.initializeDashboard();
    this.setupDataSubscriptions();
    this.startAutoRefresh();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
    }
  }

  /**
   * Initialize dashboard data
   */
  private initializeDashboard(): void {
    this.refreshData();
  }

  /**
   * Setup data subscriptions
   */
  private setupDataSubscriptions(): void {
    // Subscribe to analytics events
    this.subscriptions.add(
      this.analyticsService.analyticsEvents$.subscribe(events => {
        this.updateDashboardMetrics(events);
      })
    );

    // Subscribe to custom events
    this.subscriptions.add(
      this.eventTrackingService.customEvents$.subscribe(events => {
        this.updateRealTimeEvents(events);
      })
    );

    // Subscribe to performance metrics
    this.subscriptions.add(
      this.performanceService.performanceMetrics$.subscribe(metrics => {
        this.updatePerformanceData(metrics);
      })
    );

    // Subscribe to performance alerts
    this.subscriptions.add(
      this.performanceService.performanceAlerts$.subscribe(alerts => {
        this.updatePerformanceAlerts(alerts);
      })
    );

    // Subscribe to user properties
    this.subscriptions.add(
      this.analyticsService.userProperties$.subscribe(properties => {
        this.userProperties.set(properties);
      })
    );
  }

  /**
   * Start auto refresh timer
   */
  private startAutoRefresh(): void {
    if (this.config().refreshInterval > 0) {
      this.refreshTimer = window.setInterval(() => {
        this.refreshData();
      }, this.config().refreshInterval);
    }
  }

  /**
   * Refresh all dashboard data
   */
  refreshData(): void {
    this.isLoading.set(true);

    try {
      // Update metrics
      const events = this.analyticsService.getAnalyticsEvents();
      this.updateDashboardMetrics(events);

      // Update real-time data
      const customEvents = this.eventTrackingService.getCustomEvents();
      this.updateRealTimeEvents(customEvents);

      // Update performance data
      const performanceMetrics = this.performanceService.getCurrentMetrics();
      this.updatePerformanceData(performanceMetrics);

      // Update alerts
      const alerts = this.performanceService.getCurrentAlerts();
      this.updatePerformanceAlerts(alerts);

      this.lastUpdated.set(new Date());
    } catch (error) {
      console.error('Failed to refresh dashboard data:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  /**
   * Update dashboard metrics
   */
  private updateDashboardMetrics(events: AnalyticsEvent[]): void {
    const now = new Date();
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const recentEvents = events.filter(e => e.timestamp >= last24Hours);
    const pageViewEvents = recentEvents.filter(e => e.eventName === 'page_view');
    const errorEvents = recentEvents.filter(e => e.eventName.includes('error'));

    // Calculate session data
    const sessionStats = this.eventTrackingService.getSessionStats();
    const performanceScore = this.performanceService.getPerformanceScore();

    this.dashboardMetrics.set({
      totalEvents: events.length,
      uniqueUsers: this.calculateUniqueUsers(recentEvents),
      pageViews: pageViewEvents.length,
      sessionDuration: sessionStats.sessionDuration / 1000 / 60, // Convert to minutes
      bounceRate: this.calculateBounceRate(pageViewEvents),
      performanceScore,
      errorRate: recentEvents.length > 0 ? (errorEvents.length / recentEvents.length) * 100 : 0,
      conversionRate: this.calculateConversionRate(recentEvents)
    });
  }

  /**
   * Update real-time events
   */
  private updateRealTimeEvents(events: CustomEvent[]): void {
    const currentData = this.realTimeData();
    const recentEvents = events.slice(-this.config().maxEventsToShow);

    this.realTimeData.set({
      ...currentData,
      activeUsers: this.calculateActiveUsers(events),
      currentPageViews: this.calculateCurrentPageViews(events),
      recentEvents
    });
  }

  /**
   * Update performance data
   */
  private updatePerformanceData(metrics: PerformanceMetrics | null): void {
    if (!metrics) return;

    const currentData = this.realTimeData();
    this.realTimeData.set({
      ...currentData,
      webVitals: {
        cls: metrics.cls,
        fid: metrics.fid,
        lcp: metrics.lcp
      }
    });
  }

  /**
   * Update performance alerts
   */
  private updatePerformanceAlerts(alerts: PerformanceAlert[]): void {
    const currentData = this.realTimeData();
    const unresolved = alerts.filter(a => !a.resolved);

    this.realTimeData.set({
      ...currentData,
      performanceAlerts: unresolved
    });
  }

  /**
   * Calculate unique users
   */
  private calculateUniqueUsers(events: AnalyticsEvent[]): number {
    const userIds = new Set(events.map(e => e.parameters?.user_id).filter(Boolean));
    return userIds.size;
  }

  /**
   * Calculate bounce rate
   */
  private calculateBounceRate(pageViews: AnalyticsEvent[]): number {
    if (pageViews.length === 0) return 0;

    const sessions = new Map<string, number>();
    pageViews.forEach(event => {
      const sessionId = event.parameters?.session_id;
      if (sessionId) {
        sessions.set(sessionId, (sessions.get(sessionId) || 0) + 1);
      }
    });

    const singlePageSessions = Array.from(sessions.values()).filter(count => count === 1).length;
    return (singlePageSessions / sessions.size) * 100;
  }

  /**
   * Calculate conversion rate
   */
  private calculateConversionRate(events: AnalyticsEvent[]): number {
    const conversions = events.filter(e =>
      e.eventName === 'purchase' ||
      e.eventName === 'sign_up' ||
      e.eventName === 'conversion'
    ).length;

    return events.length > 0 ? (conversions / events.length) * 100 : 0;
  }

  /**
   * Calculate active users
   */
  private calculateActiveUsers(events: CustomEvent[]): number {
    const now = new Date();
    const last5Minutes = new Date(now.getTime() - 5 * 60 * 1000);

    const recentEvents = events.filter(e => e.timestamp >= last5Minutes);
    const activeUsers = new Set(recentEvents.map(e => e.userId).filter(Boolean));

    return activeUsers.size;
  }

  /**
   * Calculate current page views
   */
  private calculateCurrentPageViews(events: CustomEvent[]): number {
    const now = new Date();
    const lastMinute = new Date(now.getTime() - 60 * 1000);

    return events.filter(e =>
      e.timestamp >= lastMinute &&
      e.name === 'page_view'
    ).length;
  }

  /**
   * Get event growth percentage
   */
  getEventGrowth(): number {
    // This would typically compare with previous period data
    // For now, return a mock value
    return Math.floor(Math.random() * 20) + 5;
  }

  /**
   * Get average session duration formatted
   */
  getAverageSessionDuration(): string {
    const duration = this.dashboardMetrics().sessionDuration;
    if (duration < 1) return `${Math.round(duration * 60)}s`;
    return `${Math.round(duration)}m`;
  }

  /**
   * Get performance status
   */
  getPerformanceStatus(): string {
    const score = this.dashboardMetrics().performanceScore;
    if (score >= 90) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 50) return 'Needs Improvement';
    return 'Poor';
  }

  /**
   * Get error trend
   */
  getErrorTrend(): string {
    // Mock trend calculation
    const change = Math.floor(Math.random() * 10) - 5;
    return change >= 0 ? `+${change}%` : `${change}%`;
  }

  /**
   * Get vital status
   */
  getVitalStatus(vital: 'cls' | 'fid' | 'lcp'): string {
    const value = this.realTimeData().webVitals[vital];
    if (value === null) return 'N/A';

    switch (vital) {
      case 'cls':
        return value <= 0.1 ? 'Good' : value <= 0.25 ? 'Needs Improvement' : 'Poor';
      case 'fid':
        return value <= 100 ? 'Good' : value <= 300 ? 'Needs Improvement' : 'Poor';
      case 'lcp':
        return value <= 2500 ? 'Good' : value <= 4000 ? 'Needs Improvement' : 'Poor';
      default:
        return 'Unknown';
    }
  }

  /**
   * Get vital status CSS class
   */
  getVitalStatusClass(vital: 'cls' | 'fid' | 'lcp'): string {
    const status = this.getVitalStatus(vital);
    switch (status) {
      case 'Good':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Needs Improvement':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Poor':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  }

  /**
   * Get alert CSS class
   */
  getAlertClass(type: 'warning' | 'error' | 'info'): string {
    switch (type) {
      case 'error':
        return 'alert-error';
      case 'warning':
        return 'alert-warning';
      case 'info':
        return 'alert-info';
      default:
        return 'alert-info';
    }
  }

  /**
   * Export dashboard data
   */
  exportData(): void {
    const exportData = {
      timestamp: new Date().toISOString(),
      metrics: this.dashboardMetrics(),
      realTimeData: this.realTimeData(),
      userProperties: this.userProperties(),
      config: this.config(),
      analyticsEvents: this.analyticsService.getAnalyticsEvents(),
      customEvents: this.eventTrackingService.getCustomEvents(),
      performanceData: this.performanceService.exportPerformanceData()
    };

    const dataString = JSON.stringify(exportData, null, 2);
    this.dataExported.emit(dataString);

    // Also trigger download
    const blob = new Blob([dataString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `analytics-dashboard-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  /**
   * Handle alert click
   */
  onAlertClick(alert: PerformanceAlert): void {
    this.alertClicked.emit(alert);
  }
}