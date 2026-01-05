// Analytics Service - Main Export (composed from sub-services)

import { SiteAnalyticsService } from './site';
import { PerformanceAnalyticsService } from './performance';
import { SEOAnalyticsService } from './seo';
import { ConversionAnalyticsService } from './conversion';
import { BehaviorAnalyticsService } from './behavior';
import { ContentAnalyticsService } from './content';
import { AnalyticsSettingsService } from './settings';
import { AnalyticsExportService } from './export';
import type { AnalyticsFilter, SiteAnalytics } from './types';

// Re-export types for backward compatibility
export type {
  SiteAnalytics,
  WebPerformanceMetrics,
  SEOMetrics,
  ConversionMetrics,
  UserBehaviorMetrics,
  ContentMetrics,
  CustomReport,
  AnalyticsFilter,
  AnalyticsExport,
  AnalyticsSettings,
  OnePageMetrics
} from './types';

export class AnalyticsService {
  private static instance: AnalyticsService;

  // Sub-service instances
  private siteService: SiteAnalyticsService;
  private performanceService: PerformanceAnalyticsService;
  private seoService: SEOAnalyticsService;
  private conversionService: ConversionAnalyticsService;
  private behaviorService: BehaviorAnalyticsService;
  private contentService: ContentAnalyticsService;
  private settingsService: AnalyticsSettingsService;
  private exportService: AnalyticsExportService;

  private constructor() {
    this.siteService = new SiteAnalyticsService();
    this.performanceService = new PerformanceAnalyticsService();
    this.seoService = new SEOAnalyticsService();
    this.conversionService = new ConversionAnalyticsService();
    this.behaviorService = new BehaviorAnalyticsService();
    this.contentService = new ContentAnalyticsService();
    this.settingsService = new AnalyticsSettingsService();
    this.exportService = new AnalyticsExportService();
  }

  static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  // Site Analytics
  async getSiteAnalytics(filters?: AnalyticsFilter): Promise<any> {
    return this.siteService.getSiteAnalytics(filters);
  }

  async getRealtimeAnalytics(): Promise<any> {
    return this.siteService.getRealtimeAnalytics();
  }

  // Performance Analytics
  async getPerformanceMetrics(filters?: AnalyticsFilter): Promise<any> {
    return this.performanceService.getPerformanceMetrics(filters);
  }

  async getCoreWebVitals(): Promise<any> {
    return this.performanceService.getCoreWebVitals();
  }

  // SEO Analytics
  async getSEOMetrics(domain?: string): Promise<any> {
    return this.seoService.getSEOMetrics(domain);
  }

  async getKeywordRankings(keywords?: string[]): Promise<any> {
    return this.seoService.getKeywordRankings(keywords);
  }

  async getBacklinkAnalysis(): Promise<any> {
    return this.seoService.getBacklinkAnalysis();
  }
  // Conversion Analytics
  async getConversionMetrics(filters?: AnalyticsFilter): Promise<any> {
    return this.conversionService.getConversionMetrics(filters);
  }

  async getEcommerceMetrics(filters?: AnalyticsFilter): Promise<any> {
    return this.conversionService.getEcommerceMetrics(filters);
  }

  // User Behavior Analytics
  async getUserBehaviorMetrics(filters?: AnalyticsFilter): Promise<any> {
    return this.behaviorService.getUserBehaviorMetrics(filters);
  }

  async getHeatmapData(pageUrl: string, type: 'click' | 'scroll' | 'attention'): Promise<any> {
    return this.behaviorService.getHeatmapData(pageUrl, type);
  }

  async getSessionRecordings(filters?: AnalyticsFilter): Promise<any> {
    return this.behaviorService.getSessionRecordings(filters);
  }

  // Content Analytics
  async getContentMetrics(filters?: AnalyticsFilter): Promise<any> {
    return this.contentService.getContentMetrics(filters);
  }

  async getPopularContent(type?: 'blog' | 'page' | 'product' | 'category', limit?: number): Promise<any> {
    return this.contentService.getPopularContent(type, limit);
  }

  async getOnePageMetrics(_url?: string): Promise<any> {
    return {
      performance: {
        firstContentfulPaint: 1.2,
        largestContentfulPaint: 2.4,
        cumulativeLayoutShift: 0.05,
        interactionToNextPaint: 120
      },
      userExperience: {
        engagementRate: 65.5,
        timeOnPage: 145.2,
        scrollDepth: { '25%': 95, '50%': 75, '75%': 45, '100%': 20 },
        conversionRate: 3.2
      },
      content: {
        totalSections: 8,
        visibleSections: 6,
        interactiveElements: 24,
        mediaElements: 12,
        textBlocks: 18
      },
      accessibility: {
        wcagCompliance: { aaa: 85, aa: 95, a: 100 },
        altTextCoverage: 92,
        keyboardNavigation: true
      },
      technical: {
        bundleSize: 1.4,
        dependencies: 32,
        unusedDependencies: 4,
        codeSplitting: true,
        lazyLoading: true,
        serviceWorker: true
      }
    };
  }

  async trackUserJourney(_sessionId: string): Promise<any[]> {
    return [
      { action: 'view', page: '/home', element: 'Page Body', timestamp: new Date().toISOString() },
      { action: 'scroll', page: '/home', element: 'Main Section', timestamp: new Date().toISOString(), metadata: { duration: 2500 } },
      { action: 'click', page: '/home', element: 'Start Training Button', timestamp: new Date().toISOString() }
    ];
  }

  async getCustomReports(): Promise<any> {
    return this.contentService.getCustomReports();
  }

  async getCustomReport(reportId: string): Promise<any> {
    return this.contentService.getCustomReport(reportId);
  }

  // Settings Management
  async getAnalyticsSettings(): Promise<any> {
    return this.settingsService.getAnalyticsSettings();
  }

  async updateAnalyticsSettings(settings: any): Promise<any> {
    return this.settingsService.updateAnalyticsSettings(settings);
  }

  async testGoogleAnalyticsConnection(trackingId: string): Promise<any> {
    return this.settingsService.testGoogleAnalyticsConnection(trackingId);
  }

  // Export Functionality
  async exportAnalytics(exportConfig: any): Promise<any> {
    return this.exportService.exportAnalytics(exportConfig);
  }

  // Utility Methods
  generateMockAnalytics(): SiteAnalytics {
    return {
      visitors: {
        total: Math.floor(Math.random() * 100000) + 50000,
        unique: Math.floor(Math.random() * 80000) + 40000,
        returning: Math.floor(Math.random() * 30000) + 15000,
        new: Math.floor(Math.random() * 50000) + 25000,
        bounceRate: Math.random() * 0.5 + 0.2
      },
      pageviews: {
        total: Math.floor(Math.random() * 300000) + 150000,
        averageDuration: Math.floor(Math.random() * 180) + 60,
        topPages: [
          { path: '/', views: Math.floor(Math.random() * 50000) + 25000, uniqueViews: Math.floor(Math.random() * 40000) + 20000, averageTime: 120, bounceRate: 0.3 },
          { path: '/products', views: Math.floor(Math.random() * 30000) + 15000, uniqueViews: Math.floor(Math.random() * 25000) + 12500, averageTime: 180, bounceRate: 0.25 },
          { path: '/about', views: Math.floor(Math.random() * 20000) + 10000, uniqueViews: Math.floor(Math.random() * 18000) + 9000, averageTime: 90, bounceRate: 0.4 }
        ]
      },
      traffic: {
        sources: [
          { source: 'google', medium: 'organic', sessions: Math.floor(Math.random() * 30000) + 15000, percentage: 45 },
          { source: 'facebook', medium: 'social', sessions: Math.floor(Math.random() * 20000) + 10000, percentage: 25 },
          { source: 'direct', medium: '(none)', sessions: Math.floor(Math.random() * 15000) + 7500, percentage: 20 }
        ],
        channels: [
          { channel: 'Organic Search', sessions: Math.floor(Math.random() * 30000) + 15000, percentage: 45, users: Math.floor(Math.random() * 25000) + 12500 },
          { channel: 'Social', sessions: Math.floor(Math.random() * 20000) + 10000, percentage: 25, users: Math.floor(Math.random() * 18000) + 9000 },
          { channel: 'Direct', sessions: Math.floor(Math.random() * 15000) + 7500, percentage: 20, users: Math.floor(Math.random() * 12000) + 6000 }
        ],
        devices: [
          { device: 'Desktop', sessions: Math.floor(Math.random() * 40000) + 20000, percentage: 60, users: Math.floor(Math.random() * 35000) + 17500 },
          { device: 'Mobile', sessions: Math.floor(Math.random() * 30000) + 15000, percentage: 35, users: Math.floor(Math.random() * 25000) + 12500 },
          { device: 'Tablet', sessions: Math.floor(Math.random() * 5000) + 2500, percentage: 5, users: Math.floor(Math.random() * 4000) + 2000 }
        ]
      },
      geography: {
        countries: [
          { country: 'United States', code: 'US', sessions: Math.floor(Math.random() * 30000) + 15000, percentage: 35, users: Math.floor(Math.random() * 25000) + 12500 },
          { country: 'United Kingdom', code: 'GB', sessions: Math.floor(Math.random() * 15000) + 7500, percentage: 18, users: Math.floor(Math.random() * 12000) + 6000 },
          { country: 'Germany', code: 'DE', sessions: Math.floor(Math.random() * 12000) + 6000, percentage: 14, users: Math.floor(Math.random() * 10000) + 5000 }
        ],
        cities: [
          { city: 'New York', country: 'United States', sessions: Math.floor(Math.random() * 8000) + 4000, percentage: 12, users: Math.floor(Math.random() * 6500) + 3250 },
          { city: 'London', country: 'United Kingdom', sessions: Math.floor(Math.random() * 6000) + 3000, percentage: 9, users: Math.floor(Math.random() * 5000) + 2500 },
          { city: 'Berlin', country: 'Germany', sessions: Math.floor(Math.random() * 4000) + 2000, percentage: 6, users: Math.floor(Math.random() * 3200) + 1600 }
        ]
      },
      realtime: {
        activeUsers: Math.floor(Math.random() * 500) + 100,
        pageViews: Math.floor(Math.random() * 2000) + 500,
        topPages: [
          { path: '/', views: Math.floor(Math.random() * 100) + 50 },
          { path: '/products', views: Math.floor(Math.random() * 80) + 40 },
          { path: '/about', views: Math.floor(Math.random() * 60) + 30 }
        ],
        trafficSources: [
          { source: 'google', users: Math.floor(Math.random() * 80) + 40 },
          { source: 'facebook', users: Math.floor(Math.random() * 50) + 25 },
          { source: 'direct', users: Math.floor(Math.random() * 40) + 20 }
        ]
      }
    };
  }
}


// Export singleton instance
export const analyticsService = AnalyticsService.getInstance();
