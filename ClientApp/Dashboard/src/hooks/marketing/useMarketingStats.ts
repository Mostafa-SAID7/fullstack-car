import { useState, useEffect } from 'react';
import { MarketingService } from '../../services/marketing/MarketingService';

interface MarketingStats {
  totalReach: {
    value: string;
    change: string;
    changeType: 'positive' | 'negative';
  };
  engagementRate: {
    value: string;
    change: string;
    changeType: 'positive' | 'negative';
  };
  activeCampaigns: {
    value: string;
    change: string;
    changeType: 'positive' | 'negative';
  };
  newFollowers: {
    value: string;
    change: string;
    changeType: 'positive' | 'negative';
  };
}

interface UseMarketingStatsReturn {
  stats: MarketingStats | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export const useMarketingStats = (timeRange: string = '30d'): UseMarketingStatsReturn => {
  const [stats, setStats] = useState<MarketingStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const marketingService = new MarketingService();

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await marketingService.getMarketingStats(timeRange);
      
      if (result.succeeded && result.data) {
        // Format the stats for display
        const formattedStats: MarketingStats = {
          totalReach: {
            value: formatNumber(result.data.totalReach),
            change: '+12.5%', // This would come from comparing with previous period
            changeType: 'positive'
          },
          engagementRate: {
            value: `${result.data.engagementRate.toFixed(1)}%`,
            change: '+0.8%',
            changeType: 'positive'
          },
          activeCampaigns: {
            value: result.data.activeCampaigns.toString(),
            change: '+2',
            changeType: 'positive'
          },
          newFollowers: {
            value: formatNumber(result.data.newFollowers),
            change: '+18.2%',
            changeType: 'positive'
          }
        };
        
        setStats(formattedStats);
      } else {
        setError(result.errors?.join(', ') || 'Failed to fetch marketing stats');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  useEffect(() => {
    fetchStats();
  }, [timeRange]);

  return {
    stats,
    loading,
    error,
    refresh: fetchStats
  };
};