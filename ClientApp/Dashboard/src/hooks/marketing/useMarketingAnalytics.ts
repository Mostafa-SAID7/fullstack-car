import { useState, useEffect } from 'react';
import { AnalyticsService } from '../../services/marketing/AnalyticsService';
import type { 
  MarketingOverview, 
  PlatformAnalytics, 
  CampaignAnalytics, 
  MarketingPerformance,
  TopPerformingContent,
  AnalyticsQueryParams 
} from '../../services/marketing/types';

interface UseMarketingAnalyticsReturn {
  overview: MarketingOverview | null;
  platformAnalytics: PlatformAnalytics[];
  campaignAnalytics: CampaignAnalytics[];
  performance: MarketingPerformance | null;
  topContent: TopPerformingContent[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export const useMarketingAnalytics = (params?: AnalyticsQueryParams): UseMarketingAnalyticsReturn => {
  const [overview, setOverview] = useState<MarketingOverview | null>(null);
  const [platformAnalytics, setPlatformAnalytics] = useState<PlatformAnalytics[]>([]);
  const [campaignAnalytics, setCampaignAnalytics] = useState<CampaignAnalytics[]>([]);
  const [performance, setPerformance] = useState<MarketingPerformance | null>(null);
  const [topContent, setTopContent] = useState<TopPerformingContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const analyticsService = new AnalyticsService();

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [overviewResult, platformResult, campaignResult, performanceResult, topContentResult] = await Promise.all([
        analyticsService.getMarketingOverview(params),
        analyticsService.getPlatformAnalytics(params),
        analyticsService.getCampaignAnalytics(params),
        analyticsService.getMarketingPerformance(params),
        analyticsService.getTopPerformingContent({ ...params, limit: 10 })
      ]);

      if (overviewResult.succeeded && overviewResult.data) {
        setOverview(overviewResult.data);
      }

      if (platformResult.succeeded && platformResult.data) {
        setPlatformAnalytics(platformResult.data);
      }

      if (campaignResult.succeeded && campaignResult.data) {
        setCampaignAnalytics(campaignResult.data);
      }

      if (performanceResult.succeeded && performanceResult.data) {
        setPerformance(performanceResult.data);
      }

      if (topContentResult.succeeded && topContentResult.data) {
        setTopContent(topContentResult.data);
      }

      // Check if any request failed
      const hasErrors = [overviewResult, platformResult, campaignResult, performanceResult, topContentResult]
        .some(result => !result.succeeded);

      if (hasErrors) {
        const errors = [overviewResult, platformResult, campaignResult, performanceResult, topContentResult]
          .filter(result => !result.succeeded)
          .flatMap(result => result.errors);
        setError(errors.join(', ') || 'Failed to fetch analytics data');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [params?.startDate, params?.endDate, params?.timeRange, params?.platformId, params?.campaignId]);

  return {
    overview,
    platformAnalytics,
    campaignAnalytics,
    performance,
    topContent,
    loading,
    error,
    refresh: fetchAnalytics
  };
};