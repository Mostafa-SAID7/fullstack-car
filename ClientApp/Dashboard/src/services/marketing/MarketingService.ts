import { ApiService } from '../api/ApiService';
import type { PaginatedResult } from '../../types/api';
import type { ApiResult } from '../api';
import type {
  Campaign,
  CampaignContent,
  SocialPlatform,
  MarketingOverview,
  PlatformAnalytics,
  CampaignAnalytics,
  MarketingPerformance,
  TopPerformingContent,
  CreateCampaignRequest,
  UpdateCampaignRequest,
  CreateCampaignContentRequest,
  UpdateCampaignContentRequest,
  CampaignQueryParams,
  AnalyticsQueryParams
} from './types';

export class MarketingService extends ApiService {
  private readonly baseUrl = '/marketing';

  // Campaigns
  async getCampaigns(params?: CampaignQueryParams): Promise<ApiResult<PaginatedResult<Campaign>>> {
    return this.get<PaginatedResult<Campaign>>(`${this.baseUrl}/campaigns`, { params });
  }

  async getCampaign(id: string): Promise<ApiResult<Campaign>> {
    return this.get<Campaign>(`${this.baseUrl}/campaigns/${id}`);
  }

  async createCampaign(request: CreateCampaignRequest): Promise<ApiResult<Campaign>> {
    return this.post<Campaign>(`${this.baseUrl}/campaigns`, request);
  }

  async updateCampaign(id: string, request: UpdateCampaignRequest): Promise<ApiResult<Campaign>> {
    return this.put<Campaign>(`${this.baseUrl}/campaigns/${id}`, request);
  }

  async deleteCampaign(id: string): Promise<ApiResult<boolean>> {
    return this.delete<boolean>(`${this.baseUrl}/campaigns/${id}`);
  }

  // Campaign Content
  async getCampaignContents(campaignId: string, params?: { pageNumber?: number; pageSize?: number; status?: string; type?: string }): Promise<ApiResult<PaginatedResult<CampaignContent>>> {
    return this.get<PaginatedResult<CampaignContent>>(`${this.baseUrl}/campaigns/${campaignId}/contents`, { params });
  }

  async createCampaignContent(request: CreateCampaignContentRequest): Promise<ApiResult<CampaignContent>> {
    return this.post<CampaignContent>(`${this.baseUrl}/campaigns/contents`, request);
  }

  async updateCampaignContent(id: string, request: UpdateCampaignContentRequest): Promise<ApiResult<CampaignContent>> {
    return this.put<CampaignContent>(`${this.baseUrl}/campaigns/contents/${id}`, request);
  }

  async deleteCampaignContent(id: string): Promise<ApiResult<boolean>> {
    return this.delete<boolean>(`${this.baseUrl}/campaigns/contents/${id}`);
  }

  // Analytics
  async getMarketingOverview(params?: AnalyticsQueryParams): Promise<ApiResult<MarketingOverview>> {
    return this.get<MarketingOverview>(`${this.baseUrl}/analytics/overview`, { params });
  }

  async getPlatformAnalytics(params?: AnalyticsQueryParams): Promise<ApiResult<PlatformAnalytics[]>> {
    return this.get<PlatformAnalytics[]>(`${this.baseUrl}/analytics/platforms`, { params });
  }

  async getCampaignAnalytics(params?: AnalyticsQueryParams): Promise<ApiResult<CampaignAnalytics[]>> {
    return this.get<CampaignAnalytics[]>(`${this.baseUrl}/analytics/campaigns`, { params });
  }

  async getMarketingPerformance(params?: AnalyticsQueryParams): Promise<ApiResult<MarketingPerformance>> {
    return this.get<MarketingPerformance>(`${this.baseUrl}/analytics/performance`, { params });
  }

  async getTopPerformingContent(params?: AnalyticsQueryParams & { limit?: number }): Promise<ApiResult<TopPerformingContent[]>> {
    return this.get<TopPerformingContent[]>(`${this.baseUrl}/analytics/top-content`, { params });
  }

  // Social Platforms
  async getSocialPlatforms(): Promise<ApiResult<SocialPlatform[]>> {
    return this.get<SocialPlatform[]>(`${this.baseUrl}/platforms`);
  }

  // Utility Methods
  async getMarketingStats(timeRange: string = '30d'): Promise<ApiResult<{
    totalReach: number;
    engagementRate: number;
    activeCampaigns: number;
    newFollowers: number;
  }>> {
    const overview = await this.getMarketingOverview({ timeRange: timeRange as any });
    
    if (!overview.succeeded || !overview.data) {
      return { succeeded: false, errors: ['Failed to fetch marketing stats'] };
    }

    const stats = {
      totalReach: overview.data.totalReach,
      engagementRate: overview.data.averageEngagementRate,
      activeCampaigns: overview.data.activeCampaigns,
      newFollowers: overview.data.newFollowers
    };

    return { succeeded: true, data: stats };
  }

  async getRecentCampaigns(limit: number = 5): Promise<ApiResult<Campaign[]>> {
    const result = await this.getCampaigns({
      pageSize: limit,
      sortBy: 'createdAt',
      sortDirection: 'desc'
    });

    if (!result.succeeded || !result.data) {
      return { succeeded: false, errors: ['Failed to fetch recent campaigns'] };
    }

    return { succeeded: true, data: result.data.items };
  }

  async getSocialMediaPerformance(): Promise<ApiResult<{
    platform: string;
    followers: string;
    engagement: string;
    color: string;
  }[]>> {
    const platformsResult = await this.getPlatformAnalytics();
    
    if (!platformsResult.succeeded || !platformsResult.data) {
      return { succeeded: false, errors: ['Failed to fetch social media performance'] };
    }

    const colorMap: Record<string, string> = {
      'Facebook': 'blue',
      'Instagram': 'pink',
      'Twitter': 'sky',
      'LinkedIn': 'indigo',
      'YouTube': 'red',
      'TikTok': 'purple'
    };

    const performance = platformsResult.data.map(platform => ({
      platform: platform.platformName,
      followers: this.formatNumber(platform.followers),
      engagement: `${platform.engagementRate.toFixed(1)}%`,
      color: colorMap[platform.platformName] || 'gray'
    }));

    return { succeeded: true, data: performance };
  }

  private formatNumber(num: number): string {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  }
}