import { ApiService } from '../api/ApiService';
import type { ApiResult } from '../api';
import type {
  MarketingOverview,
  PlatformAnalytics,
  CampaignAnalytics,
  MarketingPerformance,
  TopPerformingContent,
  AnalyticsQueryParams
} from './types';

export class AnalyticsService extends ApiService {
  private readonly baseUrl = '/marketing/analytics';

  async getMarketingOverview(params?: AnalyticsQueryParams): Promise<ApiResult<MarketingOverview>> {
    return this.get<MarketingOverview>(`${this.baseUrl}/overview`, { params });
  }

  async getPlatformAnalytics(params?: AnalyticsQueryParams): Promise<ApiResult<PlatformAnalytics[]>> {
    return this.get<PlatformAnalytics[]>(`${this.baseUrl}/platforms`, { params });
  }

  async getCampaignAnalytics(params?: AnalyticsQueryParams): Promise<ApiResult<CampaignAnalytics[]>> {
    return this.get<CampaignAnalytics[]>(`${this.baseUrl}/campaigns`, { params });
  }

  async getMarketingPerformance(params?: AnalyticsQueryParams): Promise<ApiResult<MarketingPerformance>> {
    return this.get<MarketingPerformance>(`${this.baseUrl}/performance`, { params });
  }

  async getTopPerformingContent(params?: AnalyticsQueryParams & { limit?: number }): Promise<ApiResult<TopPerformingContent[]>> {
    return this.get<TopPerformingContent[]>(`${this.baseUrl}/top-content`, { params });
  }
}