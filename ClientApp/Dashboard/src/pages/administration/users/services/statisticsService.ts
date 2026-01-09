import { apiClient } from '../../../../services/api';
import type { UserStatistics, UserDashboardStats } from '../types/statistics';

export class StatisticsService {
  private readonly baseUrl = '/api/v3.0/admin/users';

  async getUserStatistics(params?: {
    dateFrom?: string;
    dateTo?: string;
    groupBy?: string;
  }): Promise<UserStatistics> {
    const searchParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, value.toString());
        }
      });
    }

    const response = await apiClient.get(`${this.baseUrl}/statistics?${searchParams.toString()}`);
    return (response as any).data;
  }

  async getDashboardStats(): Promise<UserDashboardStats> {
    const response = await apiClient.get(`${this.baseUrl}/dashboard-stats`);
    return (response as any).data;
  }

  async exportUserStatistics(format: 'csv' | 'excel' | 'pdf' = 'csv') {
    const response = await apiClient.get(`${this.baseUrl}/statistics/export?format=${format}`);
    return (response as any).data;
  }
}

export const statisticsService = new StatisticsService();