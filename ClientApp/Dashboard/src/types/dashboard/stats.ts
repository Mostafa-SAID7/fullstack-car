// Dashboard Stats Types

import type { QuickStats } from './quick-stats';
import type { SystemInfo } from './system';
import type { SystemPerformanceMetrics } from './metrics';
import type { Activity, SystemAlert } from './system';

export interface DashboardStats {
  totalUsers: number;
  totalPosts: number;
  totalGroups: number;
  totalReviews: number;
  pendingApprovals: number;
  flaggedContent: number;
  activeUsers: number;
  systemHealth: string;
  lastUpdated: string;
  quickStats: QuickStats;
  systemInfo?: SystemInfo;
  performanceMetrics?: SystemPerformanceMetrics;
  recentActivity: Activity[];
  systemAlerts: SystemAlert[];
  // Mock and backwards compatibility fields
  totalContent: number;
  publishedContent: number;
  monthlyRevenue: number;
  serverUptime: number;
  responseTime: number;
  errorRate: number;
  // Analytics and growth fields
  userGrowth?: number;
  activeListings?: number;
  listingGrowth?: number;
  postGrowth?: number;
  totalRevenue?: number;
  revenueGrowth?: number;
  activeSessions?: number;
  sessionGrowth?: number;
  verifiedUsers?: number;
  verificationGrowth?: number;
  pendingReviews?: number;
  reviewGrowth?: number;
  overallGrowth?: number;
  growthTrend?: number;
  // Kept for backward compatibility or future use
  revenue?: number;
  userGrowthRate?: number;
  engagementRate?: number;
}

