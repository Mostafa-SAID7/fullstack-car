// Analytics Service Types

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
      percentage: number;
      users: number;
    }>;
  };
  realtime: {
    activeUsers: number;
    pageViews: number;
    topPages: Array<{
      path: string;
      views: number;
    }>;
    trafficSources: Array<{
      source: string;
      users: number;
    }>;
  };
}

export interface WebPerformanceMetrics {
  coreWebVitals: {
    lcp: number;
    fid: number;
    cls: number;
    fcp: number;
    ttfb: number;
  };
  server: {
    responseTime: number;
    uptime: number;
    errors: number;
    statusCodes: Record<string, number>;
  };
  loading: {
    domContentLoaded: number;
    loadComplete: number;
    firstPaint: number;
    firstContentfulPaint: number;
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
  images: {
    totalImages: number;
    unoptimizedImages: number;
    totalSize: number;
    potentialSavings: number;
  };
  pages?: Array<{
    path: string;
    loadTime: number;
    fcp: number;
    lcp: number;
    cls: number;
  }>;
}

export interface OnePageMetrics {
  performance: {
    firstContentfulPaint: number;
    largestContentfulPaint: number;
    cumulativeLayoutShift: number;
    interactionToNextPaint: number;
  };
  userExperience: {
    engagementRate: number;
    timeOnPage: number;
    scrollDepth: { [key: string]: number };
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
    wcagCompliance: { aaa: number; aa: number; a: number };
    altTextCoverage: number;
    keyboardNavigation: boolean;
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

export interface SEOMetrics {
  overallScore: number;
  onPage: {
    titleOptimization: {
      optimized: number;
      totalPages: number;
      missing: number;
      tooLong: number;
      duplicate: number;
    };
    metaDescription: {
      optimized: number;
      totalPages: number;
      missing: number;
      tooLong: number;
      duplicate: number;
    };
    images: {
      withAlt: number;
      totalImages: number;
    };
    contentQuality: {
      readabilityScore: number;
    };
    headings: {
      h1: {
        total: number;
        missing: number;
      };
    };
  };
  technical: {
    indexability: {
      indexedPages: number;
      notIndexedPages: number;
    };
    mobileFriendliness: {
      mobileFriendly: number;
      notMobileFriendly: number;
      mobileIssues: Array<{
        issue: string;
        pages: number;
        severity: string;
      }>;
    };
    structuredData: {
      valid: number;
      invalid: number;
    };
    crawlability: {
      crawlErrors: number;
    };
  };
  backlinks: {
    total: number;
    domains: number;
    dofollow: number;
    topDomains: Array<{
      domain: string;
      backlinks: number;
      domainAuthority: number;
    }>;
  };
  issues: Array<{
    severity: 'critical' | 'warning' | 'info';
    category: string;
    message: string;
    impact: number;
    url?: string;
  }>;
  recommendations: Array<{
    priority: 'high' | 'medium' | 'low';
    category: string;
    title: string;
    description: string;
    impact: number;
  }>;
  scores: {
    technical: number;
    content: number;
    mobile: number;
    performance: number;
    backlinks: number;
  };
  keywords: Array<{
    keyword: string;
    position: number;
    volume: number;
    difficulty: number;
    trend: 'up' | 'down' | 'stable';
    url?: string;
  }>;
}

export interface ConversionMetrics {
  goals: Array<{
    id: string;
    name: string;
    completions: number;
    value: number;
    conversionRate: number;
    funnel: Array<{
      step: string;
      users: number;
      conversionRate: number;
    }>;
  }>;
  ecommerce: {
    transactions: number;
    revenue: number;
    averageOrderValue: number;
    conversionRate: number;
    products: Array<{
      name: string;
      sku: string;
      quantity: number;
      revenue: number;
      views: number;
    }>;
  };
  events: Array<{
    category: string;
    action: string;
    label?: string;
    value?: number;
    count: number;
  }>;
}

export interface UserBehaviorMetrics {
  userFlow: Array<{
    step: string;
    users: number;
    percentage: number;
    dropoff: number;
  }>;
  heatmaps: {
    click: Array<{
      x: number;
      y: number;
      clicks: number;
      path: string;
    }>;
    scroll: Array<{
      depth: number;
      users: number;
      path: string;
    }>;
    attention: Array<{
      x: number;
      y: number;
      duration: number;
      path: string;
    }>;
  };
  recordings: Array<{
    id: string;
    userId?: string;
    sessionId: string;
    duration: number;
    path: string;
    events: number;
    timestamp: string;
  }>;
}

export interface ContentMetrics {
  pages: Array<{
    path: string;
    title: string;
    views: number;
    uniqueViews: number;
    averageTime: number;
    bounceRate: number;
    exitRate: number;
    conversions: number;
    revenue: number;
  }>;
  contentGroups: Array<{
    group: string;
    pages: number;
    views: number;
    uniqueViews: number;
    averageTime: number;
    bounceRate: number;
  }>;
  popularContent: Array<{
    type: 'blog' | 'page' | 'product' | 'category';
    id: string;
    title: string;
    path: string;
    views: number;
    engagement: number;
    conversions: number;
  }>;
}

export interface CustomReport {
  id: string;
  name: string;
  description: string;
  type: 'site' | 'performance' | 'seo' | 'conversion' | 'behavior' | 'content';
  config: {
    dateRange: {
      start: string;
      end: string;
    };
    dimensions: string[];
    metrics: string[];
    filters?: Array<{
      dimension: string;
      operator: 'equals' | 'contains' | 'greater_than' | 'less_than';
      value: any;
    }>;
    segments?: string[];
  };
  schedule?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    recipients: string[];
    format: 'pdf' | 'excel' | 'email';
  };
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface AnalyticsFilter {
  dateRange: {
    start: string;
    end: string;
  };
  segments?: string[];
  dimensions?: string[];
  contentTypes?: string[];
  goals?: string[];
  currency?: string;
  device?: string;
  userSegments?: string[];
  sessionIds?: string[];
  filters?: Array<{
    dimension: string;
    operator: 'equals' | 'contains' | 'greater_than' | 'less_than';
    value: any;
  }>;
}

export interface AnalyticsExport {
  format: 'csv' | 'json' | 'pdf' | 'excel';
  type: 'site' | 'performance' | 'seo' | 'conversion' | 'behavior' | 'content';
  data: any;
  filename: string;
  filters?: AnalyticsFilter;
}

export interface AnalyticsSettings {
  googleAnalytics: {
    trackingId: string;
    enabled: boolean;
    anonymizeIp: boolean;
    trackEvents: boolean;
    trackPageViews: boolean;
    trackEcommerce: boolean;
    goals: Array<{
      id: string;
      name: string;
      type: 'destination' | 'duration' | 'pagesPerSession' | 'event';
      value: string | number;
    }>;
  };
  performanceMonitoring: {
    enabled: boolean;
    sampleRate: number;
    trackCoreWebVitals: boolean;
    trackCustomMetrics: boolean;
    realUserMonitoring: boolean;
    syntheticMonitoring: boolean;
    errorTracking: boolean;
    thresholds: {
      lcp: number;
      fid: number;
      cls: number;
      ttfb: number;
    };
    alertThresholds: {
      lcp: number;
      fid: number;
      cls: number;
    };
  };
  seoMonitoring: {
    enabled: boolean;
    keywords: string[];
    competitors: string[];
    frequency: 'daily' | 'weekly' | 'monthly';
    automatedAudits: boolean;
    scheduledReports: boolean;
    keywordTracking: Array<{
      keyword: string;
      targetPosition: number;
    }>;
  };
  alerts: {
    enabled: boolean;
    emailNotifications: boolean;
    slackIntegration: boolean;
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
  };
}
