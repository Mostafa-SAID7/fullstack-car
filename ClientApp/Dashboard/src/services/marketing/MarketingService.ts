import { ApiService } from '../api/ApiService';
import { CampaignService } from './CampaignService';
import { AnalyticsService } from './AnalyticsService';
import { ContentService } from './ContentService';
import { SocialPlatformService } from './SocialPlatformService';
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
  private readonly campaignService: CampaignService;
  private readonly analyticsService: AnalyticsService;
  private readonly contentService: ContentService;
  private readonly socialPlatformService: SocialPlatformService;

  constructor() {
    super();
    this.campaignService = new CampaignService();
    this.analyticsService = new AnalyticsService();
    this.contentService = new ContentService();
    this.socialPlatformService = new SocialPlatformService();
  }

  // Campaigns
  async getCampaigns(params?: CampaignQueryParams): Promise<ApiResult<PaginatedResult<Campaign>>> {
    return this.campaignService.getCampaigns(params);
  }

  async getCampaign(id: string): Promise<ApiResult<Campaign>> {
    return this.campaignService.getCampaign(id);
  }

  async createCampaign(request: CreateCampaignRequest): Promise<ApiResult<Campaign>> {
    return this.campaignService.createCampaign(request);
  }

  async updateCampaign(id: string, request: UpdateCampaignRequest): Promise<ApiResult<Campaign>> {
    return this.campaignService.updateCampaign(id, request);
  }

  async deleteCampaign(id: string): Promise<ApiResult<boolean>> {
    return this.campaignService.deleteCampaign(id);
  }

  // Campaign Content
  async getCampaignContents(campaignId: string, params?: { pageNumber?: number; pageSize?: number; status?: string; type?: string }): Promise<ApiResult<PaginatedResult<CampaignContent>>> {
    return this.contentService.getContents({ ...params, campaignId });
  }

  async createCampaignContent(request: CreateCampaignContentRequest): Promise<ApiResult<CampaignContent>> {
    return this.contentService.createContent(request);
  }

  async updateCampaignContent(id: string, request: UpdateCampaignContentRequest): Promise<ApiResult<CampaignContent>> {
    return this.contentService.updateContent(id, request);
  }

  async deleteCampaignContent(id: string): Promise<ApiResult<boolean>> {
    return this.contentService.deleteContent(id);
  }

  // Analytics
  async getMarketingOverview(params?: AnalyticsQueryParams): Promise<ApiResult<MarketingOverview>> {
    return this.analyticsService.getMarketingOverview(params);
  }

  async getPlatformAnalytics(params?: AnalyticsQueryParams): Promise<ApiResult<PlatformAnalytics[]>> {
    return this.analyticsService.getPlatformAnalytics(params);
  }

  async getCampaignAnalytics(params?: AnalyticsQueryParams): Promise<ApiResult<CampaignAnalytics[]>> {
    return this.analyticsService.getCampaignAnalytics(params);
  }

  async getMarketingPerformance(params?: AnalyticsQueryParams): Promise<ApiResult<MarketingPerformance>> {
    return this.analyticsService.getMarketingPerformance(params);
  }

  async getTopPerformingContent(params?: AnalyticsQueryParams & { limit?: number }): Promise<ApiResult<TopPerformingContent[]>> {
    return this.analyticsService.getTopPerformingContent(params);
  }

  // Social Platforms
  async getSocialPlatforms(): Promise<ApiResult<SocialPlatform[]>> {
    return this.socialPlatformService.getPlatforms();
  }

  // Aggregate/Utility Methods
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
