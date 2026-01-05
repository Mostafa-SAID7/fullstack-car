// Admin Engagement Analytics Types

export interface EngagementAnalytics {
  averageSessionDuration: number;
  bounceRate: number;
  pageViews: number;
  engagementRate: number;
  topPages: PageData[];
  engagementTrends: EngagementTrendData[];
}

export interface PageData {
  page: string;
  views: number;
}

export interface EngagementTrendData {
  date: string;
  sessions: number;
  pageViews: number;
  bounceRate: number;
}



