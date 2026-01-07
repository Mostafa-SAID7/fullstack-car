// Marketing Services - Main Export
export { MarketingService } from './MarketingService';
export { CampaignService } from './CampaignService';
export { AnalyticsService } from './AnalyticsService';
export { ContentService } from './ContentService';
export { SocialPlatformService } from './SocialPlatformService';

// Types - Explicit exports for verbatimModuleSyntax compatibility
export type {
  Campaign,
  CampaignContent,
  CampaignPlatform,
  ContentPlatform,
  SocialPlatform,
  MarketingOverview,
  PlatformAnalytics,
  CampaignAnalytics,
  MarketingPerformance,
  TopPerformingContent,
  MarketingTrend,
  CreateCampaignRequest,
  UpdateCampaignRequest,
  CreateCampaignContentRequest,
  UpdateCampaignContentRequest,
  CampaignQueryParams,
  AnalyticsQueryParams,
  CampaignType,
  CampaignStatus,
  ContentType,
  ContentStatus
} from './types';