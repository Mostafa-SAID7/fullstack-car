import { apiClient } from './api';

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
}

export interface UserGrowth {
    current: number;
    growth: number;
    change: number;
}

export interface PostActivity {
    current: number;
    activity: number;
    change: number;
}

export interface RecentActivity {
    type: string;
    user: string;
    title: string;
    timestamp: string;
}

export interface AnalyticsData {
    period: string;
    userGrowth: UserGrowth;
    postActivity: PostActivity;
    engagement: { current: number; change: number };
    topCategories: string[];
    recentActivities: RecentActivity[];
}

export interface SystemInfo {
    version: string;
    environment: string;
    serverTime: string;
    databaseStatus: string;
    aiServiceStatus: string;
    cacheStatus: string;
    uptime: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    status: string;
    joined: string;
}

class AdminService {
    private readonly version = 'v3';
    private readonly baseRoute = `/v${this.version}/admin/dashboard`;

    async getDashboardStats(): Promise<DashboardStats> {
        return apiClient.get<DashboardStats>(this.baseRoute);
    }

    async getAnalytics(period: string = 'week'): Promise<AnalyticsData> {
        return apiClient.get<AnalyticsData>(`${this.baseRoute}/analytics?period=${period}`);
    }

    async getSystemInfo(): Promise<SystemInfo> {
        return apiClient.get<SystemInfo>(`${this.baseRoute}/system-info`);
    }

    async getRecentActivity(limit: number = 10): Promise<{ activities: RecentActivity[]; totalCount: number }> {
        return apiClient.get<{ activities: RecentActivity[]; totalCount: number }>(`${this.baseRoute}/recent-activity?limit=${limit}`);
    }

    async getUsers(limit: number = 10, offset: number = 0): Promise<{ users: User[]; totalCount: number }> {
        return apiClient.get<{ users: User[]; totalCount: number }>(`${this.baseRoute}/users?limit=${limit}&offset=${offset}`);
    }
}

export const adminService = new AdminService();
