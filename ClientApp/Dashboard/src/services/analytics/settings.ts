// Analytics Service - Settings Management

import { apiClient } from '../api';
import { API_ENDPOINTS } from '../../config/api';
import type { AnalyticsSettings } from './types';

export class AnalyticsSettingsService {
  async getAnalyticsSettings(): Promise<any> {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.ANALYTICS.BASE}/settings`);
      return response as any;
    } catch (error) {
      console.error('Get analytics settings error:', error);
      return {
        succeeded: false,
        errors: ['Failed to load analytics settings'],
        message: 'An error occurred'
      };
    }
  }

  async updateAnalyticsSettings(settings: AnalyticsSettings): Promise<any> {
    try {
      const response = await apiClient.put(`${API_ENDPOINTS.ANALYTICS.BASE}/settings`, settings);
      return response as any;
    } catch (error) {
      console.error('Update analytics settings error:', error);
      return {
        succeeded: false,
        errors: ['Failed to update analytics settings'],
        message: 'An error occurred'
      };
    }
  }

  async testGoogleAnalyticsConnection(trackingId: string): Promise<any> {
    try {
      const response = await apiClient.post(`${API_ENDPOINTS.ANALYTICS.BASE}/test-connection`, { trackingId });
      return response as any;
    } catch (error) {
      console.error('Test Google Analytics connection error:', error);
      return {
        succeeded: false,
        errors: ['Failed to test connection'],
        message: 'An error occurred'
      };
    }
  }
}






