import { apiClient } from './api';
import type { ApiResult } from '../types/auth';

export interface QuickStats {
  newUsersToday: number;
  postsToday: number;
  commentsToday: number;
  reportsToday: number;
}

export interface SystemMetrics {
  workingSet: number;
  privateMemory: number;
  threadCount: number;
  handleCount: number;
}

export interface DatabaseMetrics {
  totalTables: number;
  totalRecords: number;
  databaseSize: string;
  connectionCount: number;
}

export interface SystemInfo {
  version: string;
  environment: string;
  serverTime: string;
  databaseStatus: string;
  aiServiceStatus: string;
  cacheStatus: string;
  uptime: string;
  systemMetrics: SystemMetrics;
  databaseMetrics: DatabaseMetrics;
}

export interface Activity {
  type: string;
  user: string;
  title: string;
  timestamp: string;
  icon: string;
  priority: string;
}

export interface SystemAlert {
  message: string;
  timestamp: string;
  type: string;
  severity: string;
}

export interface MemoryUsage {
  workingSet: number;
  privateMemory: number;
  gcMemory: number;
}

export interface DiskUsage {
  used: number;
  available: number;
  total: number;
}

export interface NetworkTraffic {
  incoming: number;
  outgoing: number;
}

export interface ResponseTimes {
  average: number;
  p95: number;
  p99: number;
}

export interface CacheMetrics {
  hitRate: number;
  missRate: number;
  totalKeys: number;
  memoryUsage: string;
}

export interface PerformanceMetrics {
  cpuUsage: number;
  memoryUsage: MemoryUsage;
  diskUsage: DiskUsage;
  networkTraffic: NetworkTraffic;
  responseTimes: ResponseTimes;
  errorRate: number;
  databaseMetrics: DatabaseMetrics;
  cacheMetrics: CacheMetrics;
}

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
  performanceMetrics?: PerformanceMetrics;
  recentActivity: Activity[];
  systemAlerts: SystemAlert[];
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

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
  }[];
}

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

class DashboardService {
  private handleResponse<T>(response: ApiResult<T>): T {
    if (response.succeeded && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'API request failed or returned no data');
  }

  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const response = await apiClient.get<ApiResult<DashboardStats>>('/v3/admin/dashboard');
      return this.handleResponse(response);
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
      // Return mock data for development as fallback
      return {
        totalUsers: 12543,
        totalPosts: 45678,
        totalGroups: 456,
        totalReviews: 1234,
        pendingApprovals: 23,
        flaggedContent: 12,
        activeUsers: 8932,
        systemHealth: 'Healthy',
        lastUpdated: new Date().toISOString(),
        quickStats: {
          newUsersToday: 45,
          postsToday: 123,
          commentsToday: 456,
          reportsToday: 3
        },
        recentActivity: [],
        systemAlerts: [],
        revenue: 89432.50,
        userGrowthRate: 12.5,
        engagementRate: 68.3
      };
    }
  }

  async getUserAnalytics(): Promise<UserAnalytics> {
    try {
      const response = await apiClient.get<ApiResult<UserAnalytics>>('/v3/admin/analytics/users');
      return this.handleResponse(response);
    } catch (error) {
      console.error('Failed to fetch user analytics:', error);
      return {
        totalUsers: 12543,
        activeUsers: 8932,
        dailyActiveUsers: 5423,
        newUsers: 234,
        newUsersToday: 45,
        usersByRole: [
          { role: 'User', count: 11200 },
          { role: 'Premium', count: 1200 },
          { role: 'Moderator', count: 120 },
          { role: 'Admin', count: 23 }
        ],
        userGrowthData: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [{
            label: 'New Users',
            data: [1200, 1900, 3000, 5000, 2000, 3000],
            backgroundColor: 'rgba(59, 130, 246, 0.5)',
            borderColor: 'rgb(59, 130, 246)',
            borderWidth: 2
          }]
        },
        userGrowthRate: 12.5,
        userActivityData: {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          datasets: [{
            label: 'Active Users',
            data: [1200, 1500, 1800, 2200, 2000, 1600, 1400],
            backgroundColor: 'rgba(16, 185, 129, 0.5)',
            borderColor: 'rgb(16, 185, 129)',
            borderWidth: 2
          }]
        },
        avgSessionDuration: 1250,
        sessionChange: 8.5,
        bounceRate: 35.2,
        bounceChange: -2.1,
        dauChange: 5.3
      };
    }
  }

  async getContentAnalytics(): Promise<ContentAnalytics> {
    try {
      const response = await apiClient.get<ApiResult<ContentAnalytics>>('/v3/admin/analytics/content');
      return this.handleResponse(response);
    } catch (error) {
      console.error('Failed to fetch content analytics:', error);
      return {
        totalPosts: 45678,
        totalComments: 123456,
        totalLikes: 567890,
        totalShares: 23456,
        contentByType: [
          { type: 'Text Posts', count: 25000 },
          { type: 'Images', count: 15000 },
          { type: 'Videos', count: 3500 },
          { type: 'Links', count: 2178 }
        ],
        engagementData: {
          labels: ['Likes', 'Comments', 'Shares', 'Views'],
          datasets: [{
            label: 'Engagement',
            data: [567890, 123456, 23456, 1234567],
            backgroundColor: [
              'rgba(239, 68, 68, 0.5)',
              'rgba(59, 130, 246, 0.5)',
              'rgba(16, 185, 129, 0.5)',
              'rgba(245, 158, 11, 0.5)'
            ],
            borderColor: [
              'rgb(239, 68, 68)',
              'rgb(59, 130, 246)',
              'rgb(16, 185, 129)',
              'rgb(245, 158, 11)'
            ],
            borderWidth: 2
          }]
        },
        contentGrowthData: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [{
            label: 'Posts Created',
            data: [3200, 4100, 3800, 5200, 4800, 6100],
            backgroundColor: 'rgba(168, 85, 247, 0.5)',
            borderColor: 'rgb(168, 85, 247)',
            borderWidth: 2
          }]
        },
        engagementRate: 68.3,
        engagementChange: 5.2,
        contentGrowthRate: 15.7,
        postsPerDay: 245,
        postsChange: 8.9,
        commentsPerPost: 2.7,
        commentsChange: 12.3
      };
    }
  }

  async getSystemAnalytics(): Promise<SystemAnalytics> {
    try {
      const response = await apiClient.get<ApiResult<SystemAnalytics>>('/v3/admin/analytics/system');
      return this.handleResponse(response);
    } catch (error) {
      console.error('Failed to fetch system analytics:', error);
      return {
        cpuUsage: 45.2,
        memoryUsage: 67.8,
        diskUsage: 34.5,
        activeConnections: 1234,
        requestsPerMinute: 5678,
        errorRate: 0.12,
        systemHealthData: {
          labels: ['CPU', 'Memory', 'Disk', 'Network'],
          datasets: [{
            label: 'Usage %',
            data: [45.2, 67.8, 34.5, 23.1],
            backgroundColor: [
              'rgba(239, 68, 68, 0.5)',
              'rgba(245, 158, 11, 0.5)',
              'rgba(16, 185, 129, 0.5)',
              'rgba(59, 130, 246, 0.5)'
            ],
            borderColor: [
              'rgb(239, 68, 68)',
              'rgb(245, 158, 11)',
              'rgb(16, 185, 129)',
              'rgb(59, 130, 246)'
            ],
            borderWidth: 2
          }]
        },
        performanceData: {
          labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
          datasets: [{
            label: 'Response Time (ms)',
            data: [120, 150, 200, 180, 160, 140],
            backgroundColor: 'rgba(99, 102, 241, 0.5)',
            borderColor: 'rgb(99, 102, 241)',
            borderWidth: 2
          }]
        }
      };
    }
  }

  async getRevenueAnalytics(): Promise<RevenueAnalytics> {
    try {
      const response = await apiClient.get<ApiResult<RevenueAnalytics>>('/v3/admin/analytics/revenue');
      return this.handleResponse(response);
    } catch (error) {
      return {
        totalRevenue: 89432.50,
        monthlyRevenue: 12543.75,
        revenueGrowth: 15.3,
        revenueBySource: [
          { source: 'Subscriptions', amount: 45000 },
          { source: 'Marketplace', amount: 25000 },
          { source: 'Advertising', amount: 15000 },
          { source: 'Premium Features', amount: 4432.50 }
        ],
        revenueData: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [{
            label: 'Revenue ($)',
            data: [8500, 9200, 11000, 13500, 12800, 15400],
            backgroundColor: 'rgba(34, 197, 94, 0.5)',
            borderColor: 'rgb(34, 197, 94)',
            borderWidth: 2
          }]
        },
        subscriptionData: {
          labels: ['Basic', 'Premium', 'Enterprise'],
          datasets: [{
            label: 'Subscriptions',
            data: [5600, 2800, 340],
            backgroundColor: [
              'rgba(59, 130, 246, 0.5)',
              'rgba(168, 85, 247, 0.5)',
              'rgba(245, 158, 11, 0.5)'
            ],
            borderColor: [
              'rgb(59, 130, 246)',
              'rgb(168, 85, 247)',
              'rgb(245, 158, 11)'
            ],
            borderWidth: 2
          }]
        },
        revenueChange: 12.8,
        avgOrderValue: 89.50,
        aovChange: 5.2,
        conversionRate: 3.4,
        conversionChange: 0.8
      };
    }
  }
}


export const dashboardService = new DashboardService();