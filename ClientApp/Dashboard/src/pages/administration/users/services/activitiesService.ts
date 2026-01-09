import { apiClient } from '../../../../services/api';
import type { UserActivity, SecurityLog } from '../types/activity';

export class ActivitiesService {
  private readonly baseUrl = '/api/v3.0/admin/users';

  async getUserActivities(userId: string, params?: {
    page?: number;
    pageSize?: number;
    activityType?: string;
    dateFrom?: string;
    dateTo?: string;
  }): Promise<UserActivity[]> {
    const searchParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, value.toString());
        }
      });
    }

    const response = await apiClient.get(`${this.baseUrl}/${userId}/activities?${searchParams.toString()}`);
    return (response as any).data;
  }

  async getUserSecurityLogs(userId: string, params?: {
    page?: number;
    pageSize?: number;
    action?: string;
    dateFrom?: string;
    dateTo?: string;
  }): Promise<SecurityLog[]> {
    const searchParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, value.toString());
        }
      });
    }

    const response = await apiClient.get(`${this.baseUrl}/${userId}/security-logs?${searchParams.toString()}`);
    return (response as any).data;
  }
}

export const activitiesService = new ActivitiesService();