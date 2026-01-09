// Analytics Service - User Behavior Analytics

import { apiClient } from '../api';
import { API_ENDPOINTS } from '../../config/api';
import type { AnalyticsFilter } from './types';

export class BehaviorAnalyticsService {
  async getUserBehaviorMetrics(filters?: AnalyticsFilter): Promise<any> {
    try {
      const params = new URLSearchParams();

      if (filters?.dateRange) {
        params.append('startDate', filters.dateRange.start);
        params.append('endDate', filters.dateRange.end);
      }

      if (filters?.userSegments) {
        params.append('userSegments', JSON.stringify(filters.userSegments));
      }

      const queryString = params.toString();
      const url = queryString ? `${API_ENDPOINTS.ANALYTICS.BASE}/behavior?${queryString}` : `${API_ENDPOINTS.ANALYTICS.BASE}/behavior`;

      const response = await apiClient.get(url);
      return response as any;
    } catch (error) {
      console.error('User behavior metrics error:', error);
      return {
        succeeded: false,
        errors: ['Failed to load user behavior metrics'],
        message: 'An error occurred'
      };
    }
  }

  async getHeatmapData(pageUrl: string, type: 'click' | 'scroll' | 'attention'): Promise<any> {
    try {
      const params = new URLSearchParams();
      params.append('pageUrl', pageUrl);
      params.append('type', type);

      const response = await apiClient.get(`${API_ENDPOINTS.ANALYTICS.BASE}/behavior/heatmap?${params}`);
      return response as any;
    } catch (error) {
      console.error('Heatmap data error:', error);
      return {
        succeeded: false,
        errors: ['Failed to load heatmap data'],
        message: 'An error occurred'
      };
    }
  }

  async getSessionRecordings(filters?: AnalyticsFilter): Promise<any> {
    try {
      const params = new URLSearchParams();

      if (filters?.dateRange) {
        params.append('startDate', filters.dateRange.start);
        params.append('endDate', filters.dateRange.end);
      }

      if (filters?.sessionIds) {
        params.append('sessionIds', JSON.stringify(filters.sessionIds));
      }

      const queryString = params.toString();
      const url = queryString ? `${API_ENDPOINTS.ANALYTICS.BASE}/behavior/recordings?${queryString}` : `${API_ENDPOINTS.ANALYTICS.BASE}/behavior/recordings`;

      const response = await apiClient.get(url);
      return response as any;
    } catch (error) {
      console.error('Session recordings error:', error);
      return {
        succeeded: false,
        errors: ['Failed to load session recordings'],
        message: 'An error occurred'
      };
    }
  }
}
