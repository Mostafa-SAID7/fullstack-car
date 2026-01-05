// Analytics Service - SEO Analytics

import { apiClient } from '../api';
import { API_ENDPOINTS } from '../../config/api';

export class SEOAnalyticsService {
  async getSEOMetrics(domain?: string): Promise<any> {
    try {
      const params = new URLSearchParams();
      if (domain) {
        params.append('domain', domain);
      }

      const queryString = params.toString();
      const url = queryString ? `${API_ENDPOINTS.ANALYTICS.BASE}/seo/metrics?${queryString}` : `${API_ENDPOINTS.ANALYTICS.BASE}/seo/metrics`;

      const response = await apiClient.get(url);
      return response;
    } catch (error) {
      console.error('SEO metrics error:', error);
      return {
        succeeded: false,
        errors: ['Failed to load SEO metrics'],
        message: 'An error occurred'
      };
    }
  }

  async getKeywordRankings(keywords?: string[]): Promise<any> {
    try {
      const params = new URLSearchParams();
      if (keywords && keywords.length > 0) {
        params.append('keywords', JSON.stringify(keywords));
      }

      const queryString = params.toString();
      const url = queryString ? `${API_ENDPOINTS.ANALYTICS.BASE}/seo/keywords?${queryString}` : `${API_ENDPOINTS.ANALYTICS.BASE}/seo/keywords`;

      const response = await apiClient.get(url);
      return response;
    } catch (error) {
      console.error('Keyword rankings error:', error);
      return {
        succeeded: false,
        errors: ['Failed to load keyword rankings'],
        message: 'An error occurred'
      };
    }
  }

  async getBacklinkAnalysis(): Promise<any> {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.ANALYTICS.BASE}/seo/backlinks`);
      return response;
    } catch (error) {
      console.error('Backlink analysis error:', error);
      return {
        succeeded: false,
        errors: ['Failed to load backlink analysis'],
        message: 'An error occurred'
      };
    }
  }
}



