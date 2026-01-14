// Analytics Service - Content Analytics

import { apiClient } from '../api';
import { API_ENDPOINTS } from '../../config/api';
import type { AnalyticsFilter } from './types';

export class ContentAnalyticsService {
  async getContentMetrics(filters?: AnalyticsFilter): Promise<any> {
    try {
      const params = new URLSearchParams();

      if (filters?.dateRange) {
        params.append('startDate', filters.dateRange.start);
        params.append('endDate', filters.dateRange.end);
      }

      if (filters?.contentTypes) {
        params.append('contentTypes', JSON.stringify(filters.contentTypes));
      }

      const queryString = params.toString();
      const url = queryString ? `${API_ENDPOINTS.ANALYTICS.BASE}/content?${queryString}` : `${API_ENDPOINTS.ANALYTICS.BASE}/content`;

      const response = await apiClient.get(url);
      return response as any;
    } catch (error) {
      console.error('Content metrics error:', error);
      return {
        succeeded: false,
        errors: ['Failed to load content metrics'],
        message: 'An error occurred'
      };
    }
  }

  async getPopularContent(type?: 'blog' | 'page' | 'product' | 'category', limit?: number): Promise<any> {
    try {
      const params = new URLSearchParams();

      if (type) {
        params.append('type', type);
      }

      if (limit) {
        params.append('limit', limit.toString());
      }

      const queryString = params.toString();
      const url = queryString ? `${API_ENDPOINTS.ANALYTICS.BASE}/content/popular?${queryString}` : `${API_ENDPOINTS.ANALYTICS.BASE}/content/popular`;

      const response = await apiClient.get(url);
      return response as any;
    } catch (error) {
      console.error('Popular content error:', error);
      return {
        succeeded: false,
        errors: ['Failed to load popular content'],
        message: 'An error occurred'
      };
    }
  }

  async getCustomReports(): Promise<any> {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.ANALYTICS.BASE}/reports/custom`);
      return response as any;
    } catch (error) {
      console.error('Custom reports error:', error);
      return {
        succeeded: false,
        errors: ['Failed to load custom reports'],
        message: 'An error occurred'
      };
    }
  }

  async getCustomReport(reportId: string): Promise<any> {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.ANALYTICS.BASE}/reports/custom/${reportId}`);
      return response as any;
    } catch (error) {
      console.error('Custom report error:', error);
      return {
        succeeded: false,
        errors: ['Failed to load custom report'],
        message: 'An error occurred'
      };
    }
  }
}






