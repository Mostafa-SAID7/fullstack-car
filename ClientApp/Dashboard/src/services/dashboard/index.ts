import { apiClient } from '../api';
import { API_ENDPOINTS } from '../../config/api/endpoints';
import type { ApiResult } from '../api';
import type {
  DashboardStats,
  QuickStats,
  SystemInfo,
  SystemMetrics,
  DatabaseMetrics,
  Activity,
  SystemAlert,
  SystemPerformanceMetrics,
  MemoryUsage,
  DiskUsage,
  NetworkTraffic,
  ResponseTimes,
  CacheMetrics
} from '../../types/dashboard';

// Re-export types for backward compatibility
export type {
  DashboardStats,
  QuickStats,
  SystemInfo,
  SystemMetrics,
  DatabaseMetrics,
  Activity,
  SystemAlert,
  SystemPerformanceMetrics,
  MemoryUsage,
  DiskUsage,
  NetworkTraffic,
  ResponseTimes,
  CacheMetrics
};

export class DashboardService {
  private static instance: DashboardService;

  private constructor() { }

  static getInstance(): DashboardService {
    if (!DashboardService.instance) {
      DashboardService.instance = new DashboardService();
    }
    return DashboardService.instance;
  }

  // Dashboard Stats
  async getDashboardStats(): Promise<ApiResult<DashboardStats>> {
    try {
      const response = await apiClient.get(API_ENDPOINTS.DASHBOARD.STATS);
      return response as any;
    } catch (error) {
      console.error('Get dashboard stats error:', error);
      return {
        succeeded: false,
        errors: ['Failed to load dashboard stats'],
        message: 'An error occurred'
      };
    }
  }

  async getQuickStats(): Promise<ApiResult<QuickStats>> {
    try {
      const response = await apiClient.get('/dashboard/quick-stats');
      return response as any;
    } catch (error) {
      console.error('Get quick stats error:', error);
      return {
        succeeded: false,
        errors: ['Failed to load quick stats'],
        message: 'An error occurred'
      };
    }
  }

  // System Information
  async getSystemInfo(): Promise<ApiResult<SystemInfo>> {
    try {
      const response = await apiClient.get('/dashboard/system-info');
      return response as any;
    } catch (error) {
      console.error('Get system info error:', error);
      return {
        succeeded: false,
        errors: ['Failed to load system info'],
        message: 'An error occurred'
      };
    }
  }

  async getSystemMetrics(): Promise<ApiResult<SystemMetrics>> {
    try {
      const response = await apiClient.get('/dashboard/system-metrics');
      return response as any;
    } catch (error) {
      console.error('Get system metrics error:', error);
      return {
        succeeded: false,
        errors: ['Failed to load system metrics'],
        message: 'An error occurred'
      };
    }
  }

  // Database Metrics
  async getDatabaseMetrics(): Promise<ApiResult<DatabaseMetrics>> {
    try {
      const response = await apiClient.get('/dashboard/database-metrics');
      return response as any;
    } catch (error) {
      console.error('Get database metrics error:', error);
      return {
        succeeded: false,
        errors: ['Failed to load database metrics'],
        message: 'An error occurred'
      };
    }
  }

  // Activity Logs
  async getActivityLogs(limit?: number): Promise<ApiResult<Activity[]>> {
    try {
      const params = limit ? `?limit=${limit}` : '';
      const response = await apiClient.get(`/dashboard/activity${params}`);
      return response as any;
    } catch (error) {
      console.error('Get activity logs error:', error);
      return {
        succeeded: false,
        errors: ['Failed to load activity logs'],
        message: 'An error occurred'
      };
    }
  }

  // System Alerts
  async getSystemAlerts(): Promise<ApiResult<SystemAlert[]>> {
    try {
      const response = await apiClient.get('/dashboard/alerts');
      return response as any;
    } catch (error) {
      console.error('Get system alerts error:', error);
      return {
        succeeded: false,
        errors: ['Failed to load system alerts'],
        message: 'An error occurred'
      };
    }
  }

  // Performance Metrics
  async getPerformanceMetrics(): Promise<ApiResult<SystemPerformanceMetrics>> {
    try {
      const response = await apiClient.get('/dashboard/performance');
      return response as any;
    } catch (error) {
      console.error('Get performance metrics error:', error);
      return {
        succeeded: false,
        errors: ['Failed to load performance metrics'],
        message: 'An error occurred'
      };
    }
  }

  // Resource Usage
  async getMemoryUsage(): Promise<ApiResult<MemoryUsage>> {
    try {
      const response = await apiClient.get('/dashboard/memory');
      return response as any;
    } catch (error) {
      console.error('Get memory usage error:', error);
      return {
        succeeded: false,
        errors: ['Failed to load memory usage'],
        message: 'An error occurred'
      };
    }
  }

  async getDiskUsage(): Promise<ApiResult<DiskUsage>> {
    try {
      const response = await apiClient.get('/dashboard/disk');
      return response as any;
    } catch (error) {
      console.error('Get disk usage error:', error);
      return {
        succeeded: false,
        errors: ['Failed to load disk usage'],
        message: 'An error occurred'
      };
    }
  }

  async getNetworkTraffic(): Promise<ApiResult<NetworkTraffic>> {
    try {
      const response = await apiClient.get('/dashboard/network');
      return response as any;
    } catch (error) {
      console.error('Get network traffic error:', error);
      return {
        succeeded: false,
        errors: ['Failed to load network traffic'],
        message: 'An error occurred'
      };
    }
  }

  async getResponseTimes(): Promise<ApiResult<ResponseTimes>> {
    try {
      const response = await apiClient.get('/dashboard/response-times');
      return response as any;
    } catch (error) {
      console.error('Get response times error:', error);
      return {
        succeeded: false,
        errors: ['Failed to load response times'],
        message: 'An error occurred'
      };
    }
  }

  async getCacheMetrics(): Promise<ApiResult<CacheMetrics>> {
    try {
      const response = await apiClient.get('/dashboard/cache');
      return response as any;
    } catch (error) {
      console.error('Get cache metrics error:', error);
      return {
        succeeded: false,
        errors: ['Failed to load cache metrics'],
        message: 'An error occurred'
      };
    }
  }

  // Dashboard Widgets
  async getDashboardWidgets(): Promise<ApiResult<any[]>> {
    try {
      const response = await apiClient.get('/dashboard/widgets');
      return response as any;
    } catch (error) {
      console.error('Get dashboard widgets error:', error);
      return {
        succeeded: false,
        errors: ['Failed to load dashboard widgets'],
        message: 'An error occurred'
      };
    }
  }

  async updateDashboardLayout(widgets: any[]): Promise<ApiResult<any>> {
    try {
      const response = await apiClient.put('/dashboard/widgets/layout', { widgets });
      return response as any;
    } catch (error) {
      console.error('Update dashboard layout error:', error);
      return {
        succeeded: false,
        errors: ['Failed to update dashboard layout'],
        message: 'An error occurred'
      };
    }
  }

  // Analytics Methods
  async getUserAnalytics(): Promise<ApiResult<any>> {
    try {
      // Return mock data for now as backend endpoint is not ready
      return {
        succeeded: true,
        data: this.generateMockUserAnalytics()
      };
    } catch (error) {
      console.error('Get user analytics error:', error);
      return {
        succeeded: false,
        errors: ['Failed to load user analytics'],
        message: 'An error occurred'
      };
    }
  }

  async getContentAnalytics(): Promise<ApiResult<any>> {
    try {
      return {
        succeeded: true,
        data: this.generateMockContentAnalytics()
      };
    } catch (error) {
      console.error('Get content analytics error:', error);
      return { succeeded: false, errors: ['Failed'], message: 'Error' };
    }
  }

  async getSystemAnalytics(): Promise<ApiResult<any>> {
    try {
      return {
        succeeded: true,
        data: this.generateMockSystemAnalytics()
      };
    } catch (error) {
      console.error('Get system analytics error:', error);
      return { succeeded: false, errors: ['Failed'], message: 'Error' };
    }
  }

  async getRevenueAnalytics(): Promise<ApiResult<any>> {
    try {
      return {
        succeeded: true,
        data: this.generateMockRevenueAnalytics()
      };
    } catch (error) {
      console.error('Get revenue analytics error:', error);
      return { succeeded: false, errors: ['Failed'], message: 'Error' };
    }
  }

  // Real-time Updates
  async subscribeToUpdates(callback: (data: any) => void): Promise<() => void> {
    const intervalId = setInterval(async () => {
      try {
        const stats = await this.getDashboardStats();
        if (stats.succeeded && stats.data) {
          callback(stats.data);
        }
      } catch (error) {
        console.error('Real-time update error:', error);
      }
    }, 30000); // Update every 30 seconds

    return () => clearInterval(intervalId);
  }

  // Utility Methods - MOCK DATA GENERATORS
  generateMockData(): DashboardStats {
    return {
      totalUsers: Math.floor(Math.random() * 10000) + 5000,
      totalPosts: Math.floor(Math.random() * 1000) + 500,
      totalGroups: Math.floor(Math.random() * 100) + 50,
      totalReviews: Math.floor(Math.random() * 500) + 200,
      pendingApprovals: Math.floor(Math.random() * 50) + 10,
      flaggedContent: Math.floor(Math.random() * 20) + 5,
      activeUsers: Math.floor(Math.random() * 2000) + 1000,
      systemHealth: 'Healthy',
      lastUpdated: new Date().toISOString(),
      quickStats: {
        newUsersToday: 15,
        postsToday: 45,
        commentsToday: 120,
        reportsToday: 2
      },
      recentActivity: [],
      systemAlerts: [],
      totalContent: 5000,
      publishedContent: 4500,
      monthlyRevenue: 25000,
      serverUptime: 99.9,
      responseTime: 45,
      errorRate: 0.01
    };
  }

  generateMockUserAnalytics() {
    return {
      totalUsers: 12500,
      activeUsers: 8400,
      dailyActiveUsers: 3200,
      newUsers: 450,
      newUsersToday: 23,
      userGrowthRate: 12.5,
      avgSessionDuration: 14.5,
      sessionChange: 5.2,
      bounceRate: 24.5,
      bounceChange: -1.2,
      dauChange: 8.4,
      usersByRole: [
        { role: 'User', count: 11000 },
        { role: 'Premium', count: 1000 },
        { role: 'Admin', count: 5 }
      ],
      userGrowthData: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'New Users',
          data: [150, 230, 320, 450, 600, 800],
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)'
        }]
      },
      userActivityData: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
          label: 'Active Users',
          data: [2800, 3100, 3400, 3200, 3800, 4100, 3900],
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)'
        }]
      }
    };
  }

  generateMockRevenueAnalytics() {
    return {
      totalRevenue: 154000,
      monthlyRevenue: 28500,
      revenueGrowth: 15.4,
      revenueChange: 1250,
      avgOrderValue: 45.50,
      aovChange: 2.1,
      conversionRate: 3.2,
      conversionChange: 0.5,
      revenueBySource: [
        { source: 'Subscriptions', amount: 85000 },
        { source: 'Ads', amount: 45000 },
        { source: 'Affiliate', amount: 24000 }
      ],
      revenueData: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'Revenue',
          data: [12000, 15000, 18000, 22000, 25000, 28500],
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)'
        }]
      },
      subscriptionData: {
        labels: ['Basic', 'Pro', 'Enterprise'],
        datasets: [{
          data: [60, 30, 10],
          backgroundColor: ['#3b82f6', '#8b5cf6', '#f59e0b']
        }]
      }
    };
  }

  generateMockContentAnalytics() {
    return {
      totalPosts: 45000,
      totalComments: 120000,
      totalLikes: 850000,
      totalShares: 45000,
      engagementRate: 5.8,
      engagementChange: 0.4,
      contentGrowthRate: 8.5,
      postsPerDay: 150,
      postsChange: 12,
      commentsPerPost: 4.5,
      commentsChange: 0.2,
      contentByType: [
        { type: 'Images', count: 15000 },
        { type: 'Videos', count: 8000 },
        { type: 'Text', count: 22000 }
      ],
      contentGrowthData: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'New Content',
          data: [1200, 1400, 1800, 2100, 2400, 2800],
          borderColor: '#8b5cf6',
          backgroundColor: 'rgba(139, 92, 246, 0.1)'
        }]
      },
      engagementData: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
          label: 'Engagement',
          data: [15000, 18000, 16000, 19000, 22000, 25000, 24000],
          borderColor: '#f43f5e',
          backgroundColor: 'rgba(244, 63, 94, 0.1)'
        }]
      }
    };
  }

  generateMockSystemAnalytics() {
    return {
      cpuUsage: 45,
      memoryUsage: 62,
      diskUsage: 38,
      activeConnections: 1250,
      requestsPerMinute: 4500,
      errorRate: 0.05,
      systemHealthData: {
        labels: ['10:00', '10:05', '10:10', '10:15', '10:20', '10:25'],
        datasets: [{
          label: 'CPU Usage',
          data: [35, 42, 38, 45, 40, 45],
          borderColor: '#f59e0b',
          backgroundColor: 'rgba(245, 158, 11, 0.1)'
        }]
      },
      performanceData: {
        labels: ['10:00', '10:05', '10:10', '10:15', '10:20', '10:25'],
        datasets: [{
          label: 'Response Time (ms)',
          data: [120, 115, 125, 118, 122, 119],
          borderColor: '#06b6d4',
          backgroundColor: 'rgba(6, 182, 212, 0.1)'
        }]
      }
    };
  }
}

// Export singleton instance
export const dashboardService = DashboardService.getInstance();
