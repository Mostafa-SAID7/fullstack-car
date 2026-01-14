// Admin Analytics Metadata Types

export interface AnalyticsMetadata {
  generatedAt: string;
  period: {
    start: string;
    end: string;
  };
  dataPoints: number;
  processingTime: number;
}

export interface AdvancedAnalytics {
  users: import('../dashboard/analytics').UserAnalytics;
  content: import('../dashboard/analytics').ContentAnalytics;
  engagement: import('./engagement-analytics').EngagementAnalytics;
  system: import('../dashboard/analytics').SystemAnalytics;
  security: import('./security-analytics').SecurityAnalytics;
  performance: import('./performance-analytics').PerformanceAnalytics;
  metadata: AnalyticsMetadata;
}





