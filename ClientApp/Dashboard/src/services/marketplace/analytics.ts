import { apiClient } from '../api';
import { API_ENDPOINTS } from '../../config/api';
import type { ApiResult } from '../api';

export class MarketplaceAnalyticsService {
  async getMarketplaceAnalytics(fromDate?: Date, toDate?: Date, segment?: string): Promise<ApiResult<any>> {
    const params = new URLSearchParams();
    if (fromDate) params.append('fromDate', fromDate.toISOString());
    if (toDate) params.append('toDate', toDate.toISOString());
    if (segment) params.append('segment', segment);

    const url = params.toString() 
      ? `${API_ENDPOINTS.MARKETPLACE.ANALYTICS}?${params}`
      : API_ENDPOINTS.MARKETPLACE.ANALYTICS;

    return apiClient.get(url);
  }

  async getRevenueAnalytics(period: string = '30d'): Promise<ApiResult<any>> {
    return apiClient.get(`${API_ENDPOINTS.MARKETPLACE.ANALYTICS}/revenue?period=${period}`);
  }

  async getCustomerAnalytics(period: string = '30d'): Promise<ApiResult<any>> {
    return apiClient.get(`${API_ENDPOINTS.MARKETPLACE.ANALYTICS}/customers?period=${period}`);
  }

  async getProductAnalytics(period: string = '30d'): Promise<ApiResult<any>> {
    return apiClient.get(`${API_ENDPOINTS.MARKETPLACE.ANALYTICS}/products?period=${period}`);
  }

  async getServiceAnalytics(period: string = '30d'): Promise<ApiResult<any>> {
    return apiClient.get(`${API_ENDPOINTS.MARKETPLACE.ANALYTICS}/services?period=${period}`);
  }

  async generateReport(reportType: string, fromDate?: Date, toDate?: Date, format: string = 'json'): Promise<ApiResult<any>> {
    const params = new URLSearchParams();
    params.append('reportType', reportType);
    params.append('format', format);
    if (fromDate) params.append('fromDate', fromDate.toISOString());
    if (toDate) params.append('toDate', toDate.toISOString());

    return apiClient.get(`${API_ENDPOINTS.MARKETPLACE.REPORTS}?${params}`);
  }
}