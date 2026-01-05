// Analytics Service - Site Analytics

import { apiClient } from '../api';
import { API_ENDPOINTS } from '../../config/api';
import type { AnalyticsFilter } from './types';

export class SiteAnalyticsService {
  async getSiteAnalytics(filters?: AnalyticsFilter): Promise<any> {
    try {
      const params = new URLSearchParams();

      if (filters?.dateRange) {
        params.append('startDate', filters.dateRange.start);
        params.append('endDate', filters.dateRange.end);
      }

      if (filters?.segments) {
        params.append('segments', JSON.stringify(filters.segments));
      }

      if (filters?.dimensions) {
        params.append('dimensions', JSON.stringify(filters.dimensions));
      }

      const queryString = params.toString();
      const url = queryString ? `${API_ENDPOINTS.ANALYTICS.BASE}/site?${queryString}` : `${API_ENDPOINTS.ANALYTICS.BASE}/site`;

      const response = await apiClient.get(url);
      return response;
    } catch (error) {
      console.error('Site analytics error:', error);
      return {
        succeeded: false,
        errors: ['Failed to load site analytics'],
        message: 'An error occurred'
      };
    }
  }

  async getRealtimeAnalytics(): Promise<any> {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.ANALYTICS.BASE}/realtime`);
      return response;
    } catch (error) {
      console.error('Realtime analytics error:', error);
      return {
        succeeded: false,
        errors: ['Failed to load realtime analytics'],
        message: 'An error occurred'
      };
    }
  }
}
