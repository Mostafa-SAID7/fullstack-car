import { useState, useEffect } from 'react';
import { MarketingService } from '../../services/marketing/MarketingService';
import type { MarketingOverview, AnalyticsQueryParams } from '../../services/marketing/types';

interface UseMarketingOverviewReturn {
  overview: MarketingOverview | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export const useMarketingOverview = (params?: AnalyticsQueryParams): UseMarketingOverviewReturn => {
  const [overview, setOverview] = useState<MarketingOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const marketingService = new MarketingService();

  const fetchOverview = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await marketingService.getMarketingOverview(params);
      
      if (result.succeeded && result.data) {
        setOverview(result.data);
      } else {
        setError(result.errors?.join(', ') || 'Failed to fetch marketing overview');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, [params?.startDate, params?.endDate, params?.timeRange]);

  return {
    overview,
    loading,
    error,
    refresh: fetchOverview
  };
};