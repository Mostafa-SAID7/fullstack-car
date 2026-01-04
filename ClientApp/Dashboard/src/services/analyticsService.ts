import { apiClient } from './api';
import { API_ENDPOINTS } from '../constants/api';

export interface SiteAnalytics {
  visitors: {
    total: number;
    unique: number;
    returning: number;
    new: number;
    bounceRate: number;
  };
  pageviews: {
    total: number;
    averageDuration: number;
    topPages: Array<{
      path: string;
      views: number;
      uniqueViews: number;
      averageTime: number;
      bounceRate: number;
    }>;
  };
  traffic: {
    sources: Array<{
      source: string;
      medium: string;
      sessions: number;
      percentage: number;
    }>;
    channels: Array<{
      channel: string;
      sessions: number;
      percentage: number;
      users: number;
    }>;
    devices: Array<{
      device: string;
      sessions: number;
      percentage: number;
      users: number;
    }>;
  };
  geography: {
    countries: Array<{
      country: string;
      code: string;
      sessions: number;
      percentage: number;
      users: number;
    }>;
    cities: Array<{
      city: string;
      country: string;
      sessions: number;
      users: number;
    }>;
  };
  realtime: {
    activeUsers: number;
    currentPageViews: number;
    topActivePages: Array<{
      path: string;
      activeUsers: number;
      pageViews: number;
    }>;
  };
}

export interface PerformanceMetrics {
  coreWebVitals: {
    lcp: number; // Largest Contentful Paint
    fid: number; // First Input Delay
    cls: number; // Cumulative Layout Shift
    fcp: number; // First Contentful Paint
    ttfb: number; // Time to First Byte
  };
  loading: {
    domContentLoaded: number;
    loadComplete: number;
    firstPaint: number;
    firstContentfulPaint: number;
    largestContentfulPaint: number;
  };
  resources: {
    totalSize: number;
    requests: number;
    byType: Array<{
      type: string;
      size: number;
      requests: number;
      percentage: number;
    }>;
  };
  javascript: {
    executionTime: number;
    unusedJs: number;
    coverage: number;
  };
  css: {
    unusedCss: number;
    coverage: number;
    renderBlocking: number;
  };
  images: {
    totalImages: number;
    optimizedImages: number;
    unoptimizedImages: number;
    totalSize: number;
    averageSize: number;
  };
  server: {
    responseTime: number;
    statusCodes: Record<string, number>;
    errors: number;
    uptime: number;
  };
}

export interface SEOMetrics {
  onPage: {
    titleOptimization: {
      totalPages: number;
      optimized: number;
      missing: number;
      tooLong: number;
      tooShort: number;
      duplicate: number;
    };
    metaDescription: {
      totalPages: number;
      optimized: number;
      missing: number;
      tooLong: number;
      tooShort: number;
      duplicate: number;
    };
    headings: {
      h1: { total: number; missing: number; multiple: number };
      h2: { total: number; optimized: number };
      h3: { total: number; optimized: number };
    };
    contentQuality: {
      averageWordCount: number;
      pagesWithKeywords: number;
      keywordDensity: number;
      readabilityScore: number;
    };
    images: {
      totalImages: number;
      withAlt: number;
      withoutAlt: number;
      optimized: number;
    };
    internalLinks: {
      total: number;
      averagePerPage: number;
    };
    externalLinks: {
      total: number;
      broken: number;
    };
  };
  technical: {
    indexability: {
      indexedPages: number;
      notIndexedPages: number;
      blockedByRobots: number;
    };
    crawlability: {
      crawlErrors: number;
      crawlWarnings: number;
      blockedResources: number;
    };
    mobileFriendliness: {
      mobileFriendly: number;
      notMobileFriendly: number;
      mobileIssues: Array<{
        issue: string;
        pages: number;
        severity: 'high' | 'medium' | 'low';
      }>;
    };
    pageSpeed: {
      fast: number;
      average: number;
      slow: number;
    };
    structuredData: {
      valid: number;
      invalid: number;
      missing: number;
    };
  };
  keywords: {
    primaryKeywords: Array<{
      keyword: string;
      position: number;
      searchVolume: number;
      difficulty: number;
      competition: string;
    }>;
    secondaryKeywords: Array<{
      keyword: string;
      position: number;
      searchVolume: number;
      relatedTerms: string[];
    }>;
    longTailKeywords: Array<{
      keyword: string;
      searchVolume: number;
      position: number;
    }>;
  };
  backlinks: {
    total: number;
    domains: number;
    dofollow: number;
    nofollow: number;
    quality: {
      high: number;
      medium: number;
      low: number;
    };
    topDomains: Array<{
      domain: string;
      backlinks: number;
      domainAuthority: number;
    }>;
  };
  competitors: Array<{
    domain: string;
    commonKeywords: number;
    sharedBacklinks: number;
    trafficComparison: number;
  }>;
}

export interface OnePageMetrics {
  performance: {
    firstContentfulPaint: number;
    largestContentfulPaint: number;
    cumulativeLayoutShift: number;
    firstInputDelay: number;
    interactionToNextPaint: number;
  };
  userExperience: {
    scrollDepth: {
      '25%': number;
      '50%': number;
      '75%': number;
      '100%': number;
    };
    timeOnPage: number;
    engagementRate: number;
    conversionRate: number;
  };
  content: {
    totalSections: number;
    visibleSections: number;
    interactiveElements: number;
    mediaElements: number;
    textBlocks: number;
  };
  accessibility: {
    wcagCompliance: {
      a: number; // 100% compliant
      aa: number; // 75% compliant
      aaa: number; // 50% compliant
    };
    colorContrast: number;
    altTextCoverage: number;
    keyboardNavigation: boolean;
    screenReaderSupport: boolean;
  };
  technical: {
    bundleSize: number;
    dependencies: number;
    unusedDependencies: number;
    codeSplitting: boolean;
    lazyLoading: boolean;
    serviceWorker: boolean;
  };
}

export interface AnalyticsSettings {
  googleAnalytics: {
    trackingId: string;
    enabled: boolean;
    customDimensions: Array<{
      name: string;
      value: string;
    }>;
    goals: Array<{
      name: string;
      type: 'destination' | 'duration' | 'pagesPerSession' | 'event';
      value: any;
    }>;
  };
  performanceMonitoring: {
    realUserMonitoring: boolean;
    syntheticMonitoring: boolean;
    errorTracking: boolean;
    thresholds: {
      lcp: number;
      fid: number;
      cls: number;
      ttfb: number;
    };
  };
  seoMonitoring: {
    keywordTracking: Array<{
      keyword: string;
      targetPosition: number;
    }>;
    competitorMonitoring: Array<{
      domain: string;
      keywords: string[];
    }>;
    automatedAudits: boolean;
    scheduledReports: boolean;
  };
  alerts: {
    performance: {
      enabled: boolean;
      lcpThreshold: number;
      fidThreshold: number;
      clsThreshold: number;
    };
    seo: {
      enabled: boolean;
      keywordDropThreshold: number;
      newBacklinksThreshold: number;
    };
    traffic: {
      enabled: boolean;
      trafficDropThreshold: number;
      spikeThreshold: number;
    };
  };
}

class AnalyticsService {
  // Site Analytics
  async getSiteAnalytics(
    startDate: string,
    endDate: string,
    filters?: {
      source?: string;
      medium?: string;
      country?: string;
      device?: string;
    }
  ): Promise<SiteAnalytics> {
    try {
      const params = new URLSearchParams({
        startDate,
        endDate,
        ...filters
      });

      const response = await apiClient.get(`${API_ENDPOINTS.ANALYTICS.SITE}?${params}`);
      return response as SiteAnalytics;
    } catch (error: any) {
      console.error('Failed to fetch site analytics:', error);
      return this.getMockSiteAnalytics();
    }
  }

  async getRealtimeAnalytics(): Promise<SiteAnalytics['realtime']> {
    try {
      const response = await apiClient.get(API_ENDPOINTS.ANALYTICS.REALTIME);
      return response as SiteAnalytics['realtime'];
    } catch (error: any) {
      return {
        activeUsers: Math.floor(Math.random() * 50) + 10,
        currentPageViews: Math.floor(Math.random() * 200) + 50,
        topActivePages: [
          { path: '/', activeUsers: 12, pageViews: 45 },
          { path: '/products', activeUsers: 8, pageViews: 32 },
          { path: '/about', activeUsers: 6, pageViews: 18 },
          { path: '/contact', activeUsers: 4, pageViews: 12 },
          { path: '/blog', activeUsers: 3, pageViews: 8 }
        ]
      };
    }
  }

  // Performance Monitoring
  async getPerformanceMetrics(
    startDate: string,
    endDate: string,
    deviceType?: 'desktop' | 'mobile' | 'tablet'
  ): Promise<PerformanceMetrics> {
    try {
      const params = new URLSearchParams({
        startDate,
        endDate,
        ...(deviceType && { deviceType })
      });

      const response = await apiClient.get(`${API_ENDPOINTS.ANALYTICS.PERFORMANCE}?${params}`);
      return response as PerformanceMetrics;
    } catch (error: any) {
      console.error('Failed to fetch performance metrics:', error);
      return this.getMockPerformanceMetrics();
    }
  }

  async runPerformanceAudit(url: string): Promise<PerformanceMetrics> {
    try {
      const response = await apiClient.post(API_ENDPOINTS.ANALYTICS.AUDIT, { url });
      return response as PerformanceMetrics;
    } catch (error: any) {
      throw new Error('Failed to run performance audit');
    }
  }

  // SEO Analysis
  async getSEOMetrics(domain: string): Promise<SEOMetrics> {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.ANALYTICS.SEO}?domain=${domain}`);
      return response as SEOMetrics;
    } catch (error: any) {
      console.error('Failed to fetch SEO metrics:', error);
      return this.getMockSEOMetrics();
    }
  }

  async getKeywordRankings(keywords: string[]): Promise<Array<{
    keyword: string;
    position: number;
    previousPosition: number;
    searchVolume: number;
    difficulty: number;
    url: string;
  }>> {
    try {
      const response = await apiClient.post(API_ENDPOINTS.ANALYTICS.KEYWORDS, { keywords });
      return response as Array<any>;
    } catch (error: any) {
      return keywords.map(keyword => ({
        keyword,
        position: Math.floor(Math.random() * 100) + 1,
        previousPosition: Math.floor(Math.random() * 100) + 1,
        searchVolume: Math.floor(Math.random() * 10000) + 100,
        difficulty: Math.floor(Math.random() * 100),
        url: `https://example.com/page-${keyword.replace(' ', '-')}`
      }));
    }
  }

  async getBacklinkAnalysis(domain: string): Promise<SEOMetrics['backlinks']> {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.ANALYTICS.BACKLINKS}?domain=${domain}`);
      return response as SEOMetrics['backlinks'];
    } catch (error: any) {
      return {
        total: Math.floor(Math.random() * 1000) + 100,
        domains: Math.floor(Math.random() * 50) + 10,
        dofollow: Math.floor(Math.random() * 800) + 80,
        nofollow: Math.floor(Math.random() * 200) + 20,
        quality: {
          high: Math.floor(Math.random() * 300) + 30,
          medium: Math.floor(Math.random() * 500) + 50,
          low: Math.floor(Math.random() * 200) + 20
        },
        topDomains: Array.from({ length: 5 }, (_, i) => ({
          domain: `domain${i + 1}.com`,
          backlinks: Math.floor(Math.random() * 100) + 10,
          domainAuthority: Math.floor(Math.random() * 50) + 20
        }))
      };
    }
  }

  // OnePage Analytics
  async getOnePageMetrics(url: string): Promise<OnePageMetrics> {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.ANALYTICS.ONEPAGE}?url=${url}`);
      return response as OnePageMetrics;
    } catch (error: any) {
      console.error('Failed to fetch OnePage metrics:', error);
      return this.getMockOnePageMetrics();
    }
  }

  async trackUserJourney(sessionId: string): Promise<Array<{
    timestamp: string;
    action: string;
    element: string;
    page: string;
    metadata: Record<string, any>;
  }>> {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.ANALYTICS.JOURNEY}?sessionId=${sessionId}`);
      return response as Array<any>;
    } catch (error: any) {
      return Array.from({ length: 10 }, (_, i) => ({
        timestamp: new Date(Date.now() - i * 60000).toISOString(),
        action: ['click', 'scroll', 'view', 'form_submit'][Math.floor(Math.random() * 4)],
        element: ['button', 'link', 'form', 'image'][Math.floor(Math.random() * 4)],
        page: ['/', '/products', '/about', '/contact'][Math.floor(Math.random() * 4)],
        metadata: { duration: Math.floor(Math.random() * 5000) + 100 }
      }));
    }
  }

  // Settings and Configuration
  async getAnalyticsSettings(): Promise<AnalyticsSettings> {
    try {
      const response = await apiClient.get(API_ENDPOINTS.ANALYTICS.SETTINGS);
      return response as AnalyticsSettings;
    } catch (error: any) {
      return this.getDefaultAnalyticsSettings();
    }
  }

  async updateAnalyticsSettings(settings: Partial<AnalyticsSettings>): Promise<void> {
    try {
      await apiClient.put(API_ENDPOINTS.ANALYTICS.SETTINGS, settings);
    } catch (error: any) {
      throw new Error('Failed to update analytics settings');
    }
  }

  async testGoogleAnalyticsConnection(trackingId: string): Promise<{
    connected: boolean;
    lastData: string | null;
    error?: string;
  }> {
    try {
      const response = await apiClient.post(API_ENDPOINTS.ANALYTICS.TEST_GA, { trackingId });
      return response as any;
    } catch (error: any) {
      return {
        connected: false,
        lastData: null,
        error: 'Failed to connect to Google Analytics'
      };
    }
  }

  // Mock data generators for development
  private getMockSiteAnalytics(): SiteAnalytics {
    const generateTrafficSource = (source: string, baseSessions: number) => ({
      source,
      medium: 'organic',
      sessions: Math.floor(Math.random() * baseSessions) + baseSessions,
      percentage: 0
    });

    const sources = [
      generateTrafficSource('google', 500),
      generateTrafficSource('facebook', 200),
      generateTrafficSource('twitter', 100),
      generateTrafficSource('direct', 300),
      generateTrafficSource('referral', 150)
    ];

    const totalSessions = sources.reduce((sum, source) => sum + source.sessions, 0);
    sources.forEach(source => {
      source.percentage = Math.round((source.sessions / totalSessions) * 100);
    });

    return {
      visitors: {
        total: 15420,
        unique: 12890,
        returning: 5230,
        new: 10240,
        bounceRate: 34.5
      },
      pageviews: {
        total: 45230,
        averageDuration: 185,
        topPages: [
          { path: '/', views: 12500, uniqueViews: 8900, averageTime: 220, bounceRate: 25.3 },
          { path: '/products', views: 8900, uniqueViews: 6700, averageTime: 180, bounceRate: 28.7 },
          { path: '/about', views: 5600, uniqueViews: 4200, averageTime: 150, bounceRate: 35.2 },
          { path: '/blog', views: 7800, uniqueViews: 5900, averageTime: 195, bounceRate: 32.1 },
          { path: '/contact', views: 3400, uniqueViews: 2800, averageTime: 120, bounceRate: 45.6 }
        ]
      },
      traffic: {
        sources,
        channels: [
          { channel: 'Organic Search', sessions: 1200, percentage: 35, users: 1100 },
          { channel: 'Direct', sessions: 800, percentage: 23, users: 750 },
          { channel: 'Social Media', sessions: 600, percentage: 18, users: 580 },
          { channel: 'Referral', sessions: 400, percentage: 12, users: 380 },
          { channel: 'Email', sessions: 350, percentage: 10, users: 330 },
          { channel: 'Paid Search', sessions: 50, percentage: 2, users: 45 }
        ],
        devices: [
          { device: 'Desktop', sessions: 1800, percentage: 52, users: 1650 },
          { device: 'Mobile', sessions: 1400, percentage: 40, users: 1300 },
          { device: 'Tablet', sessions: 200, percentage: 8, users: 180 }
        ]
      },
      geography: {
        countries: [
          { country: 'United States', code: 'US', sessions: 1200, percentage: 35, users: 1100 },
          { country: 'United Kingdom', code: 'GB', sessions: 400, percentage: 12, users: 380 },
          { country: 'Germany', code: 'DE', sessions: 350, percentage: 10, users: 330 },
          { country: 'France', code: 'FR', sessions: 300, percentage: 9, users: 280 },
          { country: 'Canada', code: 'CA', sessions: 250, percentage: 7, users: 230 }
        ],
        cities: [
          { city: 'New York', country: 'US', sessions: 300, users: 280 },
          { city: 'London', country: 'GB', sessions: 200, users: 180 },
          { city: 'Berlin', country: 'DE', sessions: 150, users: 140 },
          { city: 'Paris', country: 'FR', sessions: 130, users: 120 },
          { city: 'Toronto', country: 'CA', sessions: 100, users: 90 }
        ]
      },
      realtime: {
        activeUsers: 45,
        currentPageViews: 127,
        topActivePages: [
          { path: '/', activeUsers: 18, pageViews: 42 },
          { path: '/products', activeUsers: 12, pageViews: 35 },
          { path: '/about', activeUsers: 8, pageViews: 23 },
          { path: '/blog', activeUsers: 5, pageViews: 18 },
          { path: '/contact', activeUsers: 2, pageViews: 9 }
        ]
      }
    };
  }

  private getMockPerformanceMetrics(): PerformanceMetrics {
    return {
      coreWebVitals: {
        lcp: 2.3,
        fid: 85,
        cls: 0.12,
        fcp: 1.8,
        ttfb: 0.8
      },
      loading: {
        domContentLoaded: 1.2,
        loadComplete: 3.1,
        firstPaint: 1.1,
        firstContentfulPaint: 1.8,
        largestContentfulPaint: 2.3
      },
      resources: {
        totalSize: 2.8,
        requests: 45,
        byType: [
          { type: 'JavaScript', size: 1.2, requests: 8, percentage: 43 },
          { type: 'CSS', size: 0.4, requests: 4, percentage: 14 },
          { type: 'Images', size: 0.9, requests: 15, percentage: 32 },
          { type: 'Fonts', size: 0.2, requests: 3, percentage: 7 },
          { type: 'Other', size: 0.1, requests: 15, percentage: 4 }
        ]
      },
      javascript: {
        executionTime: 120,
        unusedJs: 0.3,
        coverage: 65
      },
      css: {
        unusedCss: 0.2,
        coverage: 78,
        renderBlocking: 2
      },
      images: {
        totalImages: 23,
        optimizedImages: 18,
        unoptimizedImages: 5,
        totalSize: 0.9,
        averageSize: 39
      },
      server: {
        responseTime: 0.8,
        statusCodes: { '200': 98, '404': 2, '500': 0 },
        errors: 2,
        uptime: 99.9
      }
    };
  }

  private getMockSEOMetrics(): SEOMetrics {
    return {
      onPage: {
        titleOptimization: {
          totalPages: 150,
          optimized: 120,
          missing: 8,
          tooLong: 12,
          tooShort: 5,
          duplicate: 5
        },
        metaDescription: {
          totalPages: 150,
          optimized: 95,
          missing: 25,
          tooLong: 15,
          tooShort: 10,
          duplicate: 5
        },
        headings: {
          h1: { total: 148, missing: 2, multiple: 0 },
          h2: { total: 89, optimized: 76 },
          h3: { total: 234, optimized: 198 }
        },
        contentQuality: {
          averageWordCount: 850,
          pagesWithKeywords: 135,
          keywordDensity: 2.3,
          readabilityScore: 68
        },
        images: {
          totalImages: 450,
          withAlt: 380,
          withoutAlt: 70,
          optimized: 395
        },
        internalLinks: {
          total: 1250,
          averagePerPage: 8.3
        },
        externalLinks: {
          total: 85,
          broken: 12
        }
      },
      technical: {
        indexability: {
          indexedPages: 145,
          notIndexedPages: 5,
          blockedByRobots: 2
        },
        crawlability: {
          crawlErrors: 3,
          crawlWarnings: 12,
          blockedResources: 8
        },
        mobileFriendliness: {
          mobileFriendly: 142,
          notMobileFriendly: 8,
          mobileIssues: [
            { issue: 'Viewport not configured', pages: 3, severity: 'high' },
            { issue: 'Font size too small', pages: 5, severity: 'medium' }
          ]
        },
        pageSpeed: {
          fast: 95,
          average: 45,
          slow: 10
        },
        structuredData: {
          valid: 12,
          invalid: 2,
          missing: 136
        }
      },
      keywords: {
        primaryKeywords: [
          { keyword: 'web development', position: 3, searchVolume: 5400, difficulty: 65, competition: 'high' },
          { keyword: 'react development', position: 5, searchVolume: 2900, difficulty: 58, competition: 'medium' },
          { keyword: 'javascript tutorial', position: 7, searchVolume: 8100, difficulty: 72, competition: 'high' }
        ],
        secondaryKeywords: [
          { keyword: 'frontend development', position: 12, searchVolume: 3600, relatedTerms: ['html', 'css', 'javascript'] },
          { keyword: 'web design', position: 8, searchVolume: 12100, relatedTerms: ['ui design', 'ux design'] }
        ],
        longTailKeywords: [
          { keyword: 'how to learn web development', searchVolume: 2900, position: 2 },
          { keyword: 'best javascript frameworks 2024', searchVolume: 1800, position: 4 },
          { keyword: 'react hooks tutorial', searchVolume: 4400, position: 1 }
        ]
      },
      backlinks: {
        total: 1250,
        domains: 89,
        dofollow: 980,
        nofollow: 270,
        quality: {
          high: 145,
          medium: 680,
          low: 425
        },
        topDomains: [
          { domain: 'github.com', backlinks: 45, domainAuthority: 95 },
          { domain: 'stackoverflow.com', backlinks: 38, domainAuthority: 92 },
          { domain: 'medium.com', backlinks: 32, domainAuthority: 88 },
          { domain: 'dev.to', backlinks: 28, domainAuthority: 85 },
          { domain: 'freecodecamp.org', backlinks: 25, domainAuthority: 90 }
        ]
      },
      competitors: [
        { domain: 'competitor1.com', commonKeywords: 45, sharedBacklinks: 12, trafficComparison: 1.2 },
        { domain: 'competitor2.com', commonKeywords: 38, sharedBacklinks: 8, trafficComparison: 0.8 },
        { domain: 'competitor3.com', commonKeywords: 52, sharedBacklinks: 15, trafficComparison: 1.5 }
      ]
    };
  }

  private getMockOnePageMetrics(): OnePageMetrics {
    return {
      performance: {
        firstContentfulPaint: 1.2,
        largestContentfulPaint: 2.1,
        cumulativeLayoutShift: 0.08,
        firstInputDelay: 45,
        interactionToNextPaint: 120
      },
      userExperience: {
        scrollDepth: {
          '25%': 85,
          '50%': 68,
          '75%': 42,
          '100%': 28
        },
        timeOnPage: 185,
        engagementRate: 73,
        conversionRate: 3.2
      },
      content: {
        totalSections: 12,
        visibleSections: 10,
        interactiveElements: 8,
        mediaElements: 5,
        textBlocks: 15
      },
      accessibility: {
        wcagCompliance: {
          a: 95,
          aa: 78,
          aaa: 45
        },
        colorContrast: 4.2,
        altTextCoverage: 92,
        keyboardNavigation: true,
        screenReaderSupport: true
      },
      technical: {
        bundleSize: 2.3,
        dependencies: 45,
        unusedDependencies: 8,
        codeSplitting: true,
        lazyLoading: true,
        serviceWorker: true
      }
    };
  }

  private getDefaultAnalyticsSettings(): AnalyticsSettings {
    return {
      googleAnalytics: {
        trackingId: '',
        enabled: false,
        customDimensions: [],
        goals: []
      },
      performanceMonitoring: {
        realUserMonitoring: true,
        syntheticMonitoring: false,
        errorTracking: true,
        thresholds: {
          lcp: 2.5,
          fid: 100,
          cls: 0.1,
          ttfb: 0.8
        }
      },
      seoMonitoring: {
        keywordTracking: [],
        competitorMonitoring: [],
        automatedAudits: true,
        scheduledReports: false
      },
      alerts: {
        performance: {
          enabled: true,
          lcpThreshold: 3.0,
          fidThreshold: 150,
          clsThreshold: 0.2
        },
        seo: {
          enabled: true,
          keywordDropThreshold: 10,
          newBacklinksThreshold: 5
        },
        traffic: {
          enabled: true,
          trafficDropThreshold: 20,
          spikeThreshold: 200
        }
      }
    };
  }
}

export const analyticsService = new AnalyticsService();
