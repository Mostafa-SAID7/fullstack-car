import { apiClient } from '../../../../services/api';
import type { UserReport } from '../types/report';

export class ReportsService {
  private readonly baseUrl = '/api/v3.0/admin/users';

  async getUserReports(userId: string, params?: {
    page?: number;
    pageSize?: number;
    isResolved?: boolean;
    category?: string;
  }): Promise<UserReport[]> {
    const searchParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, value.toString());
        }
      });
    }

    const response = await apiClient.get(`${this.baseUrl}/${userId}/reports?${searchParams.toString()}`);
    return response.data;
  }

  async resolveReport(reportId: string, resolution: string) {
    const response = await apiClient.put(`${this.baseUrl}/reports/${reportId}/resolve`, {
      resolution
    });
    return response.data;
  }
}

export const reportsService = new ReportsService();