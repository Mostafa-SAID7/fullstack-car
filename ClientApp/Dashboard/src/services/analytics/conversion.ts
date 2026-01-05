// Analytics Service - Conversion Analytics

import { apiClient } from '../api';
import { API_ENDPOINTS } from '../../config/api';
import type { AnalyticsFilter } from './types';

export class ConversionAnalyticsService {
  async getConversionMetrics(filters?: AnalyticsFilter): Promise<any> {
    try {
      const params = new URLSearchParams();

      if (filters?.dateRange) {
        params.append('startDate', filters.dateRange.start);
        params.append('endDate', filters.dateRange.end);
      }

      if (filters?.goals) {
        params.append('goals', JSON.stringify(filters.goals));
      }

      const queryString = params.toString();
      const url = queryString ? `${API_ENDPOINTS.ANALYTICS.BASE}/conversion?${queryString}` : `${API_ENDPOINTS.ANALYTICS.BASE}/conversion`;

      const response = await apiClient.get(url);
      return response;
    } catch (error) {
      console.error('Conversion metrics error:', error);
      return {
        succeeded: false,
        errors: ['Failed to load conversion metrics'],
        message: 'An error occurred'
      };
    }
  }

  async getEcommerceMetrics(filters?: AnalyticsFilter): Promise<any> {
    try {
      const params = new URLSearchParams();

      if (filters?.dateRange) {
        params.append('startDate', filters.dateRange.start);
        params.append('endDate', filters.dateRange.end);
      }

      if (filters?.currency) {
        params.append('currency', filters.currency);
      }

      const queryString = params.toString();
      const url = queryString ? `${API_ENDPOINTS.ANALYTICS.BASE}/conversion/ecommerce?${queryString}` : `${API_ENDPOINTS.ANALYTICS.BASE}/conversion/ecommerce`;

      const response = await apiClient.get(url);
      return response;
    } catch (error) {
      console.error('Ecommerce metrics error:', error);
      return {
        succeeded: false,
        errors: ['Failed to load ecommerce metrics'],
        message: 'An error occurred'
      };
    }
  }
}



