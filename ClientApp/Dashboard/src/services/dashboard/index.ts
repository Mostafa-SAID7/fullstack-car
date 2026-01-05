import { apiClient } from '../api';
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
      const response = await apiClient.get('/dashboard/stats');
      return response;
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
      return response;
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
      return response;
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
      return response;
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
      return response;
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
      return response;
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
      return response;
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
      return response;
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
      return response;
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
      return response;
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
      return response;
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
      return response;
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
      return response;
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
      return response;
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
      return response;
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
      const response = await apiClient.get('/dashboard/user-analytics');
      return response;
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
      const response = await apiClient.get('/dashboard/content-analytics');
      return response;
    } catch (error) {
      console.error('Get content analytics error:', error);
      return {
        succeeded: false,
        errors: ['Failed to load content analytics'],
        message: 'An error occurred'
      };
    }
  }

  async getSystemAnalytics(): Promise<ApiResult<any>> {
    try {
      const response = await apiClient.get('/dashboard/system-analytics');
      return response;
    } catch (error) {
      console.error('Get system analytics error:', error);
      return {
        succeeded: false,
        errors: ['Failed to load system analytics'],
        message: 'An error occurred'
      };
    }
  }

  async getRevenueAnalytics(): Promise<ApiResult<any>> {
    try {
      const response = await apiClient.get('/dashboard/revenue-analytics');
      return response;
    } catch (error) {
      console.error('Get revenue analytics error:', error);
      return {
        succeeded: false,
        errors: ['Failed to load revenue analytics'],
        message: 'An error occurred'
      };
    }
  }

  // Real-time Updates
  async subscribeToUpdates(callback: (data: any) => void): Promise<() => void> {
    // This would typically connect to WebSocket or Server-Sent Events
    // For now, we'll simulate with polling
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

  // Utility Methods
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
      totalContent: Math.floor(Math.random() * 5000) + 2000,
      publishedContent: Math.floor(Math.random() * 4000) + 1500,
      totalRevenue: Math.floor(Math.random() * 50000) + 25000,
      monthlyRevenue: Math.floor(Math.random() * 10000) + 5000,
      serverUptime: Math.floor(Math.random() * 100) + 95,
      responseTime: Math.floor(Math.random() * 500) + 100,
      errorRate: Math.random() * 0.01,
      lastUpdated: new Date().toISOString(),
      quickStats: {
        newUsersToday: 15,
        postsToday: 45,
        commentsToday: 120,
        reportsToday: 2
      },
      recentActivity: [],
      systemAlerts: []
    };
  }
}

// Export singleton instance
export const dashboardService = DashboardService.getInstance();
