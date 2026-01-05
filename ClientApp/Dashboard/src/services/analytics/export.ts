// Analytics Service - Export Functionality

import { apiClient } from '../api';
import { API_ENDPOINTS } from '../../config/api';
import type { AnalyticsExport } from './types';

export class AnalyticsExportService {
  async exportAnalytics(exportConfig: AnalyticsExport): Promise<any> {
    try {
      const response = await apiClient.post(`${API_ENDPOINTS.ANALYTICS.BASE}/export`, exportConfig);
      return response;
    } catch (error) {
      console.error('Export analytics error:', error);
      return {
        succeeded: false,
        errors: ['Failed to export analytics data'],
        message: 'An error occurred'
      };
    }
  }
}



