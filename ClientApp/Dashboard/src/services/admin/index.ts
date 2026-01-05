import type { ApiResult } from '../api';
import { apiClient } from '../api';
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
  CacheMetrics,
  UserAnalytics as _ServiceUserAnalytics,
  ContentAnalytics as _ServiceContentAnalytics,
  SystemAnalytics as _ServiceSystemAnalytics
} from '../../types/dashboard';
import type {
  AdvancedAnalytics,
  UserAnalytics,
  UserActivityData,
  UserDemographics,
  ContentAnalytics,
  CategoryData,
  ContentTrendData,
  EngagementAnalytics,
  PageData,
  EngagementTrendData,
  SystemAnalytics,
  ResourceUsageData,
  ErrorLogData,
  SecurityAnalytics,
  ThreatData,
  SecurityEventData,
  PerformanceAnalytics,
  PerformanceTrendData,
  EndpointData,
  AnalyticsMetadata,
  AdminUser,
  UserFilters,
  PaginatedResult
} from '../../types/admin';

export class AdminService {
  private static instance: AdminService;

  private constructor() { }

  static getInstance(): AdminService {
    if (!AdminService.instance) {
      AdminService.instance = new AdminService();
    }
    return AdminService.instance;
  }

  // Dashboard Analytics
  async getDashboardStats(): Promise<ApiResult<DashboardStats>> {
    try {
      const response = await apiClient.get('/admin/dashboard/stats');
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
      const response = await apiClient.get('/admin/dashboard/quick-stats');
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

  async getSystemInfo(): Promise<ApiResult<SystemInfo>> {
    try {
      const response = await apiClient.get('/admin/system/info');
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
      const response = await apiClient.get('/admin/system/metrics');
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

  async getDatabaseMetrics(): Promise<ApiResult<DatabaseMetrics>> {
    try {
      const response = await apiClient.get('/admin/database/metrics');
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

  async getActivityLogs(limit?: number): Promise<ApiResult<Activity[]>> {
    try {
      const params = limit ? `?limit=${limit}` : '';
      const response = await apiClient.get(`/admin/activity/logs${params}`);
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

  async getSystemAlerts(): Promise<ApiResult<SystemAlert[]>> {
    try {
      const response = await apiClient.get('/admin/system/alerts');
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

  async getPerformanceMetrics(): Promise<ApiResult<SystemPerformanceMetrics>> {
    try {
      const response = await apiClient.get('/admin/performance/metrics');
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

  // Advanced Analytics
  async getAdvancedAnalytics(filters?: { startDate?: string; endDate?: string }): Promise<ApiResult<AdvancedAnalytics>> {
    try {
      const params = new URLSearchParams();
      if (filters?.startDate) params.append('startDate', filters.startDate);
      if (filters?.endDate) params.append('endDate', filters.endDate);

      const queryString = params.toString();
      const url = queryString ? `/admin/analytics/advanced?${queryString}` : '/admin/analytics/advanced';

      const response = await apiClient.get(url);
      return response;
    } catch (error) {
      console.error('Get advanced analytics error:', error);
      return {
        succeeded: false,
        errors: ['Failed to load advanced analytics'],
        message: 'An error occurred'
      };
    }
  }

  async getUserAnalytics(filters?: { startDate?: string; endDate?: string }): Promise<ApiResult<UserAnalytics>> {
    try {
      const params = new URLSearchParams();
      if (filters?.startDate) params.append('startDate', filters.startDate);
      if (filters?.endDate) params.append('endDate', filters.endDate);

      const queryString = params.toString();
      const url = queryString ? `/admin/analytics/users?${queryString}` : '/admin/analytics/users';

      const response = await apiClient.get(url);
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

  async getContentAnalytics(filters?: { startDate?: string; endDate?: string }): Promise<ApiResult<ContentAnalytics>> {
    try {
      const params = new URLSearchParams();
      if (filters?.startDate) params.append('startDate', filters.startDate);
      if (filters?.endDate) params.append('endDate', filters.endDate);

      const queryString = params.toString();
      const url = queryString ? `/admin/analytics/content?${queryString}` : '/admin/analytics/content';

      const response = await apiClient.get(url);
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

  async getSystemAnalytics(filters?: { startDate?: string; endDate?: string }): Promise<ApiResult<SystemAnalytics>> {
    try {
      const params = new URLSearchParams();
      if (filters?.startDate) params.append('startDate', filters.startDate);
      if (filters?.endDate) params.append('endDate', filters.endDate);

      const queryString = params.toString();
      const url = queryString ? `/admin/analytics/system?${queryString}` : '/admin/analytics/system';

      const response = await apiClient.get(url);
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

  async getSecurityAnalytics(filters?: { startDate?: string; endDate?: string }): Promise<ApiResult<SecurityAnalytics>> {
    try {
      const params = new URLSearchParams();
      if (filters?.startDate) params.append('startDate', filters.startDate);
      if (filters?.endDate) params.append('endDate', filters.endDate);

      const queryString = params.toString();
      const url = queryString ? `/admin/analytics/security?${queryString}` : '/admin/analytics/security';

      const response = await apiClient.get(url);
      return response;
    } catch (error) {
      console.error('Get security analytics error:', error);
      return {
        succeeded: false,
        errors: ['Failed to load security analytics'],
        message: 'An error occurred'
      };
    }
  }

  async getPerformanceAnalytics(filters?: { startDate?: string; endDate?: string }): Promise<ApiResult<PerformanceAnalytics>> {
    try {
      const params = new URLSearchParams();
      if (filters?.startDate) params.append('startDate', filters.startDate);
      if (filters?.endDate) params.append('endDate', filters.endDate);

      const queryString = params.toString();
      const url = queryString ? `/admin/analytics/performance?${queryString}` : '/admin/analytics/performance';

      const response = await apiClient.get(url);
      return response;
    } catch (error) {
      console.error('Get performance analytics error:', error);
      return {
        succeeded: false,
        errors: ['Failed to load performance analytics'],
        message: 'An error occurred'
      };
    }
  }

  // User Management
  async getUsers(filters?: UserFilters, page?: number, pageSize?: number): Promise<ApiResult<PaginatedResult<AdminUser>>> {
    try {
      const params = new URLSearchParams();

      if (filters) {
        if (filters.searchTerm) params.append('searchTerm', filters.searchTerm);
        if (filters.role) params.append('role', filters.role);
        if (filters.isActive !== undefined) params.append('isActive', filters.isActive.toString());
        if (filters.dateRange?.start) params.append('startDate', filters.dateRange.start);
        if (filters.dateRange?.end) params.append('endDate', filters.dateRange.end);
      }

      if (page) params.append('page', page.toString());
      if (pageSize) params.append('pageSize', pageSize.toString());

      const queryString = params.toString();
      const url = queryString ? `/admin/users?${queryString}` : '/admin/users';

      const response = await apiClient.get(url);
      return response;
    } catch (error) {
      console.error('Get users error:', error);
      return {
        succeeded: false,
        errors: ['Failed to load users'],
        message: 'An error occurred'
      };
    }
  }

  async getUserById(userId: string): Promise<ApiResult<AdminUser>> {
    try {
      const response = await apiClient.get(`/admin/users/${userId}`);
      return response;
    } catch (error) {
      console.error('Get user by ID error:', error);
      return {
        succeeded: false,
        errors: ['Failed to load user'],
        message: 'An error occurred'
      };
    }
  }

  async updateUser(userId: string, userData: Partial<AdminUser>): Promise<ApiResult<AdminUser>> {
    try {
      const response = await apiClient.put(`/admin/users/${userId}`, userData);
      return response;
    } catch (error) {
      console.error('Update user error:', error);
      return {
        succeeded: false,
        errors: ['Failed to update user'],
        message: 'An error occurred'
      };
    }
  }

  async deleteUser(userId: string): Promise<ApiResult<any>> {
    try {
      const response = await apiClient.delete(`/admin/users/${userId}`);
      return response;
    } catch (error) {
      console.error('Delete user error:', error);
      return {
        succeeded: false,
        errors: ['Failed to delete user'],
        message: 'An error occurred'
      };
    }
  }

  async activateUser(userId: string): Promise<ApiResult<any>> {
    try {
      const response = await apiClient.post(`/admin/users/${userId}/activate`);
      return response;
    } catch (error) {
      console.error('Activate user error:', error);
      return {
        succeeded: false,
        errors: ['Failed to activate user'],
        message: 'An error occurred'
      };
    }
  }

  async deactivateUser(userId: string): Promise<ApiResult<any>> {
    try {
      const response = await apiClient.post(`/admin/users/${userId}/deactivate`);
      return response;
    } catch (error) {
      console.error('Deactivate user error:', error);
      return {
        succeeded: false,
        errors: ['Failed to deactivate user'],
        message: 'An error occurred'
      };
    }
  }

  // System Management
  async restartService(serviceName: string): Promise<ApiResult<any>> {
    try {
      const response = await apiClient.post(`/admin/system/services/${serviceName}/restart`);
      return response;
    } catch (error) {
      console.error('Restart service error:', error);
      return {
        succeeded: false,
        errors: ['Failed to restart service'],
        message: 'An error occurred'
      };
    }
  }

  async stopService(serviceName: string): Promise<ApiResult<any>> {
    try {
      const response = await apiClient.post(`/admin/system/services/${serviceName}/stop`);
      return response;
    } catch (error) {
      console.error('Stop service error:', error);
      return {
        succeeded: false,
        errors: ['Failed to stop service'],
        message: 'An error occurred'
      };
    }
  }

  async startService(serviceName: string): Promise<ApiResult<any>> {
    try {
      const response = await apiClient.post(`/admin/system/services/${serviceName}/start`);
      return response;
    } catch (error) {
      console.error('Start service error:', error);
      return {
        succeeded: false,
        errors: ['Failed to start service'],
        message: 'An error occurred'
      };
    }
  }

  async clearCache(): Promise<ApiResult<any>> {
    try {
      const response = await apiClient.post('/admin/system/cache/clear');
      return response;
    } catch (error) {
      console.error('Clear cache error:', error);
      return {
        succeeded: false,
        errors: ['Failed to clear cache'],
        message: 'An error occurred'
      };
    }
  }

  async backupDatabase(): Promise<ApiResult<any>> {
    try {
      const response = await apiClient.post('/admin/database/backup');
      return response;
    } catch (error) {
      console.error('Backup database error:', error);
      return {
        succeeded: false,
        errors: ['Failed to backup database'],
        message: 'An error occurred'
      };
    }
  }

  async exportData(type: string, filters?: any): Promise<ApiResult<any>> {
    try {
      const response = await apiClient.post('/admin/export', { type, filters });
      return response;
    } catch (error) {
      console.error('Export data error:', error);
      return {
        succeeded: false,
        errors: ['Failed to export data'],
        message: 'An error occurred'
      };
    }
  }
}

// Export singleton instance
export const adminService = AdminService.getInstance();

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
  CacheMetrics,
  AdvancedAnalytics,
  UserAnalytics,
  UserActivityData,
  UserDemographics,
  ContentAnalytics,
  CategoryData,
  ContentTrendData,
  EngagementAnalytics,
  PageData,
  EngagementTrendData,
  SystemAnalytics,
  ResourceUsageData,
  ErrorLogData,
  SecurityAnalytics,
  ThreatData,
  SecurityEventData,
  PerformanceAnalytics,
  PerformanceTrendData,
  EndpointData,
  AnalyticsMetadata,
  AdminUser,
  UserFilters,
  PaginatedResult
};
