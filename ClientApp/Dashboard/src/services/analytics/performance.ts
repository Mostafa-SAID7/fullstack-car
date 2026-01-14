// Analytics Service - Performance Analytics

import { apiClient } from '../api';
import { API_ENDPOINTS } from '../../config/api';
import type { AnalyticsFilter } from './types';

export class PerformanceAnalyticsService {
  async getPerformanceMetrics(filters?: AnalyticsFilter): Promise<any> {
    try {
      const params = new URLSearchParams();

      if (filters?.dateRange) {
        params.append('startDate', filters.dateRange.start);
        params.append('endDate', filters.dateRange.end);
      }

      if (filters?.device) {
        params.append('device', filters.device);
      }

      const queryString = params.toString();
      const url = queryString ? `${API_ENDPOINTS.ANALYTICS.BASE}/performance?${queryString}` : `${API_ENDPOINTS.ANALYTICS.BASE}/performance`;

      const response = await apiClient.get(url);
      return response as any;
    } catch (error) {
      console.error('Performance metrics error:', error);
      return {
        succeeded: false,
        errors: ['Failed to load performance metrics'],
        message: 'An error occurred'
      };
    }
  }

  async getCoreWebVitals(): Promise<any> {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.ANALYTICS.BASE}/performance/core-web-vitals`);
      return response as any;
    } catch (error) {
      console.error('Core web vitals error:', error);
      return {
        succeeded: false,
        errors: ['Failed to load core web vitals'],
        message: 'An error occurred'
      };
    }
  }
}







