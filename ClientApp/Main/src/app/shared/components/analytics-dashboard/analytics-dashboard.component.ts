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
  template: `
    <div class="analytics-dashboard p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
      <!-- Dashboard Header -->
      <div class="dashboard-header mb-6">
        <div class="flex items-center justify-between">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
            Analytics Dashboard
          </h2>
          <div class="flex items-center space-x-4">
            <button 
              (click)="refreshData()"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              [disabled]="isLoading()"
            >
              {{ isLoading() ? 'Refreshing...' : 'Refresh' }}
            </button>
            <button 
              (click)="exportData()"
              class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Export Data
            </button>
          </div>
        </div>
        
        <!-- Real-time Status -->
        <div class="mt-4 flex items-center space-x-4">
          <div class="flex items-center space-x-2">
            <div class="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span class="text-sm text-gray-600 dark:text-gray-400">
              Live Data ({{ lastUpdated() | date:'short' }})
            </span>
          </div>
          <div class="text-sm text-gray-600 dark:text-gray-400">
            Active Users: {{ realTimeData().activeUsers }}
          </div>
        </div>
      </div>

      <!-- Key Metrics Grid -->
      <div class="metrics-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <!-- Total Events -->
        <div class="metric-card bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg text-white">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-blue-100 text-sm">Total Events</p>
              <p class="text-3xl font-bold">{{ dashboardMetrics().totalEvents | number }}</p>
            </div>
            <div class="text-blue-200">
              <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
          <div class="mt-4 text-blue-100 text-sm">
            +{{ getEventGrowth() }}% from last period
          </div>
        </div>

        <!-- Page Views -->
        <div class="metric-card bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-lg text-white">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-green-100 text-sm">Page Views</p>
              <p class="text-3xl font-bold">{{ dashboardMetrics().pageViews | number }}</p>
            </div>
            <div class="text-green-200">
              <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"></path>
              </svg>
            </div>
          </div>
          <div class="mt-4 text-green-100 text-sm">
            {{ getAverageSessionDuration() }} avg session
          </div>
        </div>

        <!-- Performance Score -->
        <div class="metric-card bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-lg text-white">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-purple-100 text-sm">Performance Score</p>
              <p class="text-3xl font-bold">{{ dashboardMetrics().performanceScore }}</p>
            </div>
            <div class="text-purple-200">
              <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clip-rule="evenodd"></path>
              </svg>
            </div>
          </div>
          <div class="mt-4 text-purple-100 text-sm">
            {{ getPerformanceStatus() }}
          </div>
        </div>

        <!-- Error Rate -->
        <div class="metric-card bg-gradient-to-r from-red-500 to-red-600 p-6 rounded-lg text-white">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-red-100 text-sm">Error Rate</p>
              <p class="text-3xl font-bold">{{ dashboardMetrics().errorRate.toFixed(2) }}%</p>
            </div>
            <div class="text-red-200">
              <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
              </svg>
            </div>
          </div>
          <div class="mt-4 text-red-100 text-sm">
            {{ getErrorTrend() }} from yesterday
          </div>
        </div>
      </div>

      <!-- Core Web Vitals -->
      <div class="web-vitals mb-8">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Core Web Vitals
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- CLS -->
          <div class="vitals-card p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-medium text-gray-600 dark:text-gray-400">
                Cumulative Layout Shift
              </span>
              <span class="text-xs px-2 py-1 rounded-full" 
                    [class]="getVitalStatusClass('cls')">
                {{ getVitalStatus('cls') }}
              </span>
            </div>
            <div class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ realTimeData().webVitals.cls?.toFixed(3) || 'N/A' }}
            </div>
            <div class="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Target: ≤ 0.1
            </div>
          </div>

          <!-- FID -->
          <div class="vitals-card p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-medium text-gray-600 dark:text-gray-400">
                First Input Delay
              </span>
              <span class="text-xs px-2 py-1 rounded-full" 
                    [class]="getVitalStatusClass('fid')">
                {{ getVitalStatus('fid') }}
              </span>
            </div>
            <div class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ realTimeData().webVitals.fid?.toFixed(0) || 'N/A' }}ms
            </div>
            <div class="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Target: ≤ 100ms
            </div>
          </div>

          <!-- LCP -->
          <div class="vitals-card p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-medium text-gray-600 dark:text-gray-400">
                Largest Contentful Paint
              </span>
              <span class="text-xs px-2 py-1 rounded-full" 
                    [class]="getVitalStatusClass('lcp')">
                {{ getVitalStatus('lcp') }}
              </span>
            </div>
            <div class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ realTimeData().webVitals.lcp?.toFixed(0) || 'N/A' }}ms
            </div>
            <div class="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Target: ≤ 2500ms
            </div>
          </div>
        </div>
      </div>

      <!-- Performance Alerts -->
      <div class="performance-alerts mb-8" *ngIf="realTimeData().performanceAlerts.length > 0">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Performance Alerts
        </h3>
        <div class="space-y-3">
          <div *ngFor="let alert of realTimeData().performanceAlerts.slice(0, 5)" 
               class="alert-item p-4 border-l-4 rounded-lg"
               [class]="getAlertClass(alert.type)">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div class="alert-icon">
                  <svg *ngIf="alert.type === 'error'" class="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                  </svg>
                  <svg *ngIf="alert.type === 'warning'" class="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                  </svg>
                </div>
                <div>
                  <p class="font-medium text-gray-900 dark:text-white">
                    {{ alert.metric.toUpperCase() }} Alert
                  </p>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    {{ alert.message }}
                  </p>
                </div>
              </div>
              <div class="text-xs text-gray-500 dark:text-gray-400">
                {{ alert.timestamp | date:'short' }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Events -->
      <div class="recent-events mb-8">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Recent User Events
        </h3>
        <div class="events-list space-y-2 max-h-64 overflow-y-auto">
          <div *ngFor="let event of realTimeData().recentEvents.slice(0, config().maxEventsToShow)" 
               class="event-item p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div class="event-icon w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <span class="text-xs font-medium text-blue-600 dark:text-blue-400">
                    {{ event.category.charAt(0).toUpperCase() }}
                  </span>
                </div>
                <div>
                  <p class="font-medium text-gray-900 dark:text-white">
                    {{ event.name }}
                  </p>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    {{ event.category }} • {{ event.action }}
                  </p>
                </div>
              </div>
              <div class="text-xs text-gray-500 dark:text-gray-400">
                {{ event.timestamp | date:'short' }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- User Properties -->
      <div class="user-properties">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Current User Properties
        </h3>
        <div class="properties-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div *ngFor="let property of getUserPropertiesArray()" 
               class="property-item p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div class="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              {{ property.key }}
            </div>
            <div class="text-gray-900 dark:text-white">
              {{ property.value }}
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .analytics-dashboard {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    .metric-card {
      transition: transform 0.2s ease-in-out;
    }

    .metric-card:hover {
      transform: translateY(-2px);
    }

    .vitals-card {
      transition: border-color 0.2s ease-in-out;
    }

    .vitals-card:hover {
      border-color: #3b82f6;
    }

    .alert-item {
      transition: all 0.2s ease-in-out;
    }

    .alert-error {
      @apply border-red-500 bg-red-50 dark:bg-red-900/20;
    }

    .alert-warning {
      @apply border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20;
    }

    .alert-info {
      @apply border-blue-500 bg-blue-50 dark:bg-blue-900/20;
    }

    .events-list::-webkit-scrollbar {
      width: 6px;
    }

    .events-list::-webkit-scrollbar-track {
      @apply bg-gray-100 dark:bg-gray-800;
    }

    .events-list::-webkit-scrollbar-thumb {
      @apply bg-gray-300 dark:bg-gray-600 rounded-full;
    }

    .events-list::-webkit-scrollbar-thumb:hover {
      @apply bg-gray-400 dark:bg-gray-500;
    }
  `]
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
  private isLoading = signal(false);
  private lastUpdated = signal(new Date());
  private dashboardMetrics = signal<DashboardMetrics>({
    totalEvents: 0,
    uniqueUsers: 0,
    pageViews: 0,
    sessionDuration: 0,
    bounceRate: 0,
    performanceScore: 0,
    errorRate: 0,
    conversionRate: 0
  });

  private realTimeData = signal<RealTimeData>({
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