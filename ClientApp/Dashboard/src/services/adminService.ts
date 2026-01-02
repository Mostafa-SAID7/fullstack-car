import { apiClient } from './api';

// Dashboard Models
export interface DashboardStats {
  quickStats: QuickStats;
  systemInfo: SystemInfo;
  recentActivity: Activity[];
  systemAlerts: SystemAlert[];
  performanceMetrics: PerformanceMetrics;
}

export interface QuickStats {
  newUsersToday: number;
  postsToday: number;
  commentsToday: number;
  reportsToday: number;
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

// Analytics Models
export interface AdvancedAnalytics {
  users: UserAnalytics;
  content: ContentAnalytics;
  engagement: EngagementAnalytics;
  system: SystemAnalytics;
  security: SecurityAnalytics;
  performance: PerformanceAnalytics;
  metadata: AnalyticsMetadata;
}

export interface UserAnalytics {
  totalUsers: number;
  activeUsers: number;
  newUsersToday: number;
  userGrowthRate: number;
  usersByRole: Record<string, number>;
  userActivity: UserActivityData[];
  demographics: UserDemographics;
}

export interface UserActivityData {
  date: string;
  activeUsers: number;
  newUsers: number;
  returningUsers: number;
}

export interface UserDemographics {
  ageGroups: Record<string, number>;
  locations: Record<string, number>;
  devices: Record<string, number>;
}

export interface ContentAnalytics {
  totalPosts: number;
  totalComments: number;
  totalLikes: number;
  contentGrowthRate: number;
  topCategories: CategoryData[];
  contentTrends: ContentTrendData[];
}

export interface CategoryData {
  category: string;
  count: number;
  percentage: number;
}

export interface ContentTrendData {
  date: string;
  posts: number;
  comments: number;
  likes: number;
}

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
  uniqueViews: number;
  averageTime: number;
}

export interface EngagementTrendData {
  date: string;
  sessions: number;
  pageViews: number;
  avgSessionDuration: number;
}

export interface SystemAnalytics {
  serverUptime: number;
  averageResponseTime: number;
  errorRate: number;
  throughput: number;
  resourceUsage: ResourceUsageData[];
  errorLogs: ErrorLogData[];
}

export interface ResourceUsageData {
  timestamp: string;
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
}

export interface ErrorLogData {
  timestamp: string;
  level: string;
  message: string;
  count: number;
}

export interface SecurityAnalytics {
  failedLoginAttempts: number;
  suspiciousActivities: number;
  blockedIPs: number;
  securityScore: number;
  threatDetections: ThreatData[];
  securityEvents: SecurityEventData[];
}

export interface ThreatData {
  type: string;
  count: number;
  severity: string;
  lastDetected: string;
}

export interface SecurityEventData {
  timestamp: string;
  eventType: string;
  severity: string;
  description: string;
}

export interface PerformanceAnalytics {
  averageLoadTime: number;
  throughputPerSecond: number;
  errorRate: number;
  availability: number;
  performanceTrends: PerformanceTrendData[];
  slowestEndpoints: EndpointData[];
}

export interface PerformanceTrendData {
  timestamp: string;
  responseTime: number;
  throughput: number;
  errorRate: number;
}

export interface EndpointData {
  endpoint: string;
  averageResponseTime: number;
  requestCount: number;
  errorRate: number;
}

export interface AnalyticsMetadata {
  generatedAt: string;
  dataRange: {
    from: string;
    to: string;
  };
  totalDataPoints: number;
  refreshRate: string;
}

// User Management Models
export interface AdminUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: string[];
  isActive: boolean;
  isEmailConfirmed: boolean;
  lastLoginAt?: string;
  createdAt: string;
  profileImageUrl?: string;
}

export interface UserFilters {
  searchTerm?: string;
  role?: string;
  isActive?: boolean;
  isEmailConfirmed?: boolean;
  fromDate?: string;
  toDate?: string;
}

export interface PaginatedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface ApiResult<T = any> {
  succeeded: boolean;
  data?: T;
  errors?: string[];
  message?: string;
}

export class AdminService {
  private static instance: AdminService;
  private readonly baseUrl = '/v3/admin';

  private constructor() {}

  static getInstance(): AdminService {
    if (!AdminService.instance) {
      AdminService.instance = new AdminService();
    }
    return AdminService.instance;
  }

  // Dashboard APIs
  async getDashboardStats(fromDate?: string, toDate?: string): Promise<ApiResult<DashboardStats>> {
    const params = new URLSearchParams();
    if (fromDate) params.append('fromDate', fromDate);
    if (toDate) params.append('toDate', toDate);
    
    const queryString = params.toString();
    const url = `${this.baseUrl}/dashboard${queryString ? `?${queryString}` : ''}`;
    
    return apiClient.get<ApiResult<DashboardStats>>(url);
  }

  async getSystemInfo(): Promise<ApiResult<SystemInfo>> {
    return apiClient.get<ApiResult<SystemInfo>>(`${this.baseUrl}/dashboard/system-info`);
  }

  async getRecentActivity(limit = 10, activityType?: string, fromDate?: string): Promise<ApiResult<{ activities: Activity[]; totalCount: number }>> {
    const params = new URLSearchParams();
    params.append('limit', limit.toString());
    if (activityType) params.append('activityType', activityType);
    if (fromDate) params.append('fromDate', fromDate);
    
    return apiClient.get<ApiResult<{ activities: Activity[]; totalCount: number }>>(`${this.baseUrl}/dashboard/recent-activity?${params.toString()}`);
  }

  async getSystemAlerts(severity?: string, includeAcknowledged = false): Promise<ApiResult<SystemAlert[]>> {
    const params = new URLSearchParams();
    if (severity) params.append('severity', severity);
    params.append('includeAcknowledged', includeAcknowledged.toString());
    
    return apiClient.get<ApiResult<SystemAlert[]>>(`${this.baseUrl}/dashboard/alerts?${params.toString()}`);
  }

  async getPerformanceMetrics(fromDate?: string, toDate?: string, granularity = 'hour'): Promise<ApiResult<PerformanceMetrics>> {
    const params = new URLSearchParams();
    if (fromDate) params.append('fromDate', fromDate);
    if (toDate) params.append('toDate', toDate);
    params.append('granularity', granularity);
    
    return apiClient.get<ApiResult<PerformanceMetrics>>(`${this.baseUrl}/dashboard/performance?${params.toString()}`);
  }

  // Analytics APIs
  async getAdvancedAnalytics(fromDate?: string, toDate?: string): Promise<ApiResult<AdvancedAnalytics>> {
    const params = new URLSearchParams();
    if (fromDate) params.append('fromDate', fromDate);
    if (toDate) params.append('toDate', toDate);
    
    return apiClient.get<ApiResult<AdvancedAnalytics>>(`${this.baseUrl}/analytics/advanced?${params.toString()}`);
  }

  async getUserAnalytics(fromDate?: string, toDate?: string): Promise<ApiResult<UserAnalytics>> {
    const params = new URLSearchParams();
    if (fromDate) params.append('fromDate', fromDate);
    if (toDate) params.append('toDate', toDate);
    
    return apiClient.get<ApiResult<UserAnalytics>>(`${this.baseUrl}/analytics/users?${params.toString()}`);
  }

  async getContentAnalytics(fromDate?: string, toDate?: string): Promise<ApiResult<ContentAnalytics>> {
    const params = new URLSearchParams();
    if (fromDate) params.append('fromDate', fromDate);
    if (toDate) params.append('toDate', toDate);
    
    return apiClient.get<ApiResult<ContentAnalytics>>(`${this.baseUrl}/analytics/content?${params.toString()}`);
  }

  async getEngagementAnalytics(fromDate?: string, toDate?: string): Promise<ApiResult<EngagementAnalytics>> {
    const params = new URLSearchParams();
    if (fromDate) params.append('fromDate', fromDate);
    if (toDate) params.append('toDate', toDate);
    
    return apiClient.get<ApiResult<EngagementAnalytics>>(`${this.baseUrl}/analytics/engagement?${params.toString()}`);
  }

  async getSystemAnalytics(fromDate?: string, toDate?: string): Promise<ApiResult<SystemAnalytics>> {
    const params = new URLSearchParams();
    if (fromDate) params.append('fromDate', fromDate);
    if (toDate) params.append('toDate', toDate);
    
    return apiClient.get<ApiResult<SystemAnalytics>>(`${this.baseUrl}/analytics/system?${params.toString()}`);
  }

  async getSecurityAnalytics(fromDate?: string, toDate?: string): Promise<ApiResult<SecurityAnalytics>> {
    const params = new URLSearchParams();
    if (fromDate) params.append('fromDate', fromDate);
    if (toDate) params.append('toDate', toDate);
    
    return apiClient.get<ApiResult<SecurityAnalytics>>(`${this.baseUrl}/analytics/security?${params.toString()}`);
  }

  async getPerformanceAnalytics(fromDate?: string, toDate?: string): Promise<ApiResult<PerformanceAnalytics>> {
    const params = new URLSearchParams();
    if (fromDate) params.append('fromDate', fromDate);
    if (toDate) params.append('toDate', toDate);
    
    return apiClient.get<ApiResult<PerformanceAnalytics>>(`${this.baseUrl}/analytics/performance?${params.toString()}`);
  }

  // User Management APIs
  async getUsers(filters?: UserFilters, pageNumber = 1, pageSize = 10): Promise<ApiResult<PaginatedResult<AdminUser>>> {
    const params = new URLSearchParams();
    params.append('pageNumber', pageNumber.toString());
    params.append('pageSize', pageSize.toString());
    
    if (filters) {
      if (filters.searchTerm) params.append('searchTerm', filters.searchTerm);
      if (filters.role) params.append('role', filters.role);
      if (filters.isActive !== undefined) params.append('isActive', filters.isActive.toString());
      if (filters.isEmailConfirmed !== undefined) params.append('isEmailConfirmed', filters.isEmailConfirmed.toString());
      if (filters.fromDate) params.append('fromDate', filters.fromDate);
      if (filters.toDate) params.append('toDate', filters.toDate);
    }
    
    return apiClient.get<ApiResult<PaginatedResult<AdminUser>>>(`${this.baseUrl}/management/users?${params.toString()}`);
  }

  async getUser(id: string): Promise<ApiResult<AdminUser>> {
    return apiClient.get<ApiResult<AdminUser>>(`${this.baseUrl}/management/users/${id}`);
  }

  async suspendUser(id: string, reason: string, duration?: number): Promise<ApiResult<void>> {
    return apiClient.post<ApiResult<void>>(`${this.baseUrl}/management/users/${id}/suspend`, {
      reason,
      duration
    });
  }

  async unsuspendUser(id: string): Promise<ApiResult<void>> {
    return apiClient.post<ApiResult<void>>(`${this.baseUrl}/management/users/${id}/unsuspend`);
  }

  async banUser(id: string, reason: string): Promise<ApiResult<void>> {
    return apiClient.post<ApiResult<void>>(`${this.baseUrl}/management/users/${id}/ban`, {
      reason
    });
  }

  async unbanUser(id: string): Promise<ApiResult<void>> {
    return apiClient.post<ApiResult<void>>(`${this.baseUrl}/management/users/${id}/unban`);
  }

  async impersonateUser(id: string): Promise<ApiResult<{ token: string; expiresAt: string }>> {
    return apiClient.post<ApiResult<{ token: string; expiresAt: string }>>(`${this.baseUrl}/management/users/${id}/impersonate`);
  }

  async getRoles(): Promise<ApiResult<string[]>> {
    return apiClient.get<ApiResult<string[]>>(`${this.baseUrl}/management/roles`);
  }

  async assignRole(userId: string, role: string): Promise<ApiResult<void>> {
    return apiClient.post<ApiResult<void>>(`${this.baseUrl}/management/users/${userId}/roles`, {
      role
    });
  }

  async removeRole(userId: string, role: string): Promise<ApiResult<void>> {
    return apiClient.delete<ApiResult<void>>(`${this.baseUrl}/management/users/${userId}/roles/${role}`);
  }
}

export const adminService = AdminService.getInstance();