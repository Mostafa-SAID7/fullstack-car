// Dashboard Analytics Types

import type { ChartData } from './chart';

export interface UserAnalytics {
  totalUsers: number;
  activeUsers: number;
  dailyActiveUsers: number;
  newUsers: number;
  newUsersToday: number;
  usersByRole: { role: string; count: number }[];
  userGrowthData: ChartData;
  userGrowthRate: number;
  userActivityData: ChartData;
  avgSessionDuration: number;
  sessionChange: number;
  bounceRate: number;
  bounceChange: number;
  dauChange: number;
}

export interface ContentAnalytics {
  totalPosts: number;
  totalComments: number;
  totalLikes: number;
  totalShares: number;
  contentByType: { type: string; count: number }[];
  engagementData: ChartData;
  engagementRate: number;
  engagementChange: number;
  contentGrowthData: ChartData;
  contentGrowthRate: number;
  postsPerDay: number;
  postsChange: number;
  commentsPerPost: number;
  commentsChange: number;
}

export interface SystemAnalytics {
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  activeConnections: number;
  requestsPerMinute: number;
  errorRate: number;
  systemHealthData: ChartData;
  performanceData: ChartData;
}

export interface RevenueAnalytics {
  totalRevenue: number;
  monthlyRevenue: number;
  revenueGrowth: number;
  revenueChange: number;
  revenueBySource: { source: string; amount: number }[];
  revenueData: ChartData;
  subscriptionData: ChartData;
  avgOrderValue: number;
  aovChange: number;
  conversionRate: number;
  conversionChange: number;
}

