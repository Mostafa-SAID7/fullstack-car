// Marketing Types
export interface Campaign {
  id: string;
  name: string;
  description?: string;
  type: CampaignType;
  typeName: string;
  status: CampaignStatus;
  statusName: string;
  startDate: string;
  endDate?: string;
  budget: number;
  spentAmount: number;
  targetAudience?: string;
  tags: string[];
  
  // Analytics
  impressions: number;
  reach: number;
  engagement: number;
  clicks: number;
  engagementRate: number;
  clickThroughRate: number;
  
  // Related Data
  contents: CampaignContent[];
  platforms: CampaignPlatform[];
  
  createdAt: string;
  updatedAt?: string;
}

export interface CampaignContent {
  id: string;
  campaignId: string;
  title: string;
  content?: string;
  type: ContentType;
  typeName: string;
  mediaUrl?: string;
  thumbnailUrl?: string;
  scheduledDate?: string;
  publishedDate?: string;
  status: ContentStatus;
  statusName: string;
  author?: string;
  tags: string[];
  
  // Analytics
  views: number;
  likes: number;
  shares: number;
  comments: number;
  clicks: number;
  
  platforms: ContentPlatform[];
  createdAt: string;
}

export interface CampaignPlatform {
  id: string;
  campaignId: string;
  platformId: string;
  platformName: string;
  isActive: boolean;
  budget: number;
  spentAmount: number;
  impressions: number;
  reach: number;
  engagement: number;
  clicks: number;
}

export interface ContentPlatform {
  id: string;
  contentId: string;
  platformId: string;
  platformName: string;
  platformPostId?: string;
  platformUrl?: string;
  publishedAt?: string;
  status: ContentStatus;
  statusName: string;
  views: number;
  likes: number;
  shares: number;
  comments: number;
  clicks: number;
}

export interface SocialPlatform {
  id: string;
  name: string;
  displayName?: string;
  iconUrl?: string;
  isActive: boolean;
  totalFollowers: number;
  totalPosts: number;
  averageEngagementRate: number;
}

// Analytics Types
export interface MarketingOverview {
  date: string;
  totalImpressions: number;
  totalReach: number;
  totalEngagement: number;
  totalClicks: number;
  totalFollowers: number;
  newFollowers: number;
  activeCampaigns: number;
  scheduledCampaigns: number;
  completedCampaigns: number;
  publishedContent: number;
  scheduledContent: number;
  draftContent: number;
  totalBudget: number;
  totalSpent: number;
  averageCostPerClick: number;
  averageEngagementRate: number;
  budgetUtilization: number;
  clickThroughRate: number;
  engagementRate: number;
}

export interface PlatformAnalytics {
  platformId: string;
  platformName: string;
  iconUrl?: string;
  date: string;
  followers: number;
  newFollowers: number;
  unfollowersCount: number;
  postsCount: number;
  totalImpressions: number;
  totalReach: number;
  totalEngagement: number;
  totalClicks: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  engagementRate: number;
  reachRate: number;
  growthRate: number;
}

export interface CampaignAnalytics {
  campaignId: string;
  campaignName: string;
  date: string;
  impressions: number;
  reach: number;
  engagement: number;
  clicks: number;
  conversions: number;
  engagementRate: number;
  clickThroughRate: number;
  conversionRate: number;
  costPerClick: number;
  costPerConversion: number;
  amountSpent: number;
}

export interface MarketingPerformance {
  startDate: string;
  endDate: string;
  overview: MarketingOverview;
  platformPerformance: PlatformAnalytics[];
  campaignPerformance: CampaignAnalytics[];
  topContent: TopPerformingContent[];
  trends: MarketingTrend[];
}

export interface TopPerformingContent {
  id: string;
  title: string;
  content?: string;
  contentType: string;
  platform: string;
  publishedDate: string;
  views: number;
  likes: number;
  shares: number;
  comments: number;
  clicks: number;
  engagementRate: number;
}

export interface MarketingTrend {
  date: string;
  impressions: number;
  reach: number;
  engagement: number;
  clicks: number;
  engagementRate: number;
}

// Request Types
export interface CreateCampaignRequest {
  name: string;
  description?: string;
  type: CampaignType;
  startDate: string;
  endDate?: string;
  budget: number;
  targetAudience?: string;
  tags: string[];
  platformIds: string[];
}

export interface UpdateCampaignRequest {
  name: string;
  description?: string;
  type: CampaignType;
  status: CampaignStatus;
  startDate: string;
  endDate?: string;
  budget: number;
  targetAudience?: string;
  tags: string[];
  platformIds: string[];
}

export interface CreateCampaignContentRequest {
  campaignId: string;
  title: string;
  content?: string;
  type: ContentType;
  mediaUrl?: string;
  thumbnailUrl?: string;
  scheduledDate?: string;
  author?: string;
  tags: string[];
  platformIds: string[];
}

export interface UpdateCampaignContentRequest {
  title: string;
  content?: string;
  type: ContentType;
  status: ContentStatus;
  mediaUrl?: string;
  thumbnailUrl?: string;
  scheduledDate?: string;
  author?: string;
  tags: string[];
  platformIds: string[];
}

// Query Parameters
export interface CampaignQueryParams {
  pageNumber?: number;
  pageSize?: number;
  searchTerm?: string;
  status?: string;
  type?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortDirection?: string;
  [key: string]: unknown;
}

export interface AnalyticsQueryParams {
  startDate?: string;
  endDate?: string;
  platformId?: string;
  campaignId?: string;
  timeRange?: 'day' | 'week' | 'month' | 'quarter' | 'year';
  [key: string]: unknown;
}

// Enums
export const CampaignType = {
  Social: 1,
  Email: 2,
  Display: 3,
  Search: 4,
  Video: 5,
  Influencer: 6,
  Content: 7
} as const;

export type CampaignType = typeof CampaignType[keyof typeof CampaignType];

export const CampaignStatus = {
  Draft: 1,
  Scheduled: 2,
  Active: 3,
  Paused: 4,
  Completed: 5,
  Cancelled: 6
} as const;

export type CampaignStatus = typeof CampaignStatus[keyof typeof CampaignStatus];

export const ContentType = {
  Text: 1,
  Image: 2,
  Video: 3,
  Blog: 4,
  Story: 5,
  Infographic: 6,
  Carousel: 7
} as const;

export type ContentType = typeof ContentType[keyof typeof ContentType];

export const ContentStatus = {
  Draft: 1,
  InReview: 2,
  Approved: 3,
  Scheduled: 4,
  Published: 5,
  Archived: 6
} as const;

export type ContentStatus = typeof ContentStatus[keyof typeof ContentStatus];