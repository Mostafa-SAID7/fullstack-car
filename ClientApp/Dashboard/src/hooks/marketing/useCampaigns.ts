import { useState, useEffect, useCallback } from 'react';
import { MarketingService } from '../../services/marketing/MarketingService';
import type { Campaign, CampaignQueryParams, CreateCampaignRequest, UpdateCampaignRequest } from '../../services/marketing/types';

interface UseCampaignsReturn {
  campaigns: Campaign[];
  totalCount: number;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  createCampaign: (request: CreateCampaignRequest) => Promise<boolean>;
  updateCampaign: (id: string, request: UpdateCampaignRequest) => Promise<boolean>;
  deleteCampaign: (id: string) => Promise<boolean>;
  pagination: {
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export const useCampaigns = (params?: CampaignQueryParams): UseCampaignsReturn => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    pageNumber: 1,
    pageSize: 10,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false
  });

  const marketingService = new MarketingService();

  const fetchCampaigns = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await marketingService.getCampaigns(params);
      
      if (result.succeeded && result.data) {
        setCampaigns(result.data.items);
        setTotalCount(result.data.totalCount);
        setPagination({
          pageNumber: result.data.pageNumber,
          pageSize: result.data.pageSize,
          totalPages: result.data.totalPages,
          hasNextPage: result.data.hasNextPage,
          hasPreviousPage: result.data.hasPreviousPage
        });
      } else {
        setError(result.errors?.join(', ') || 'Failed to fetch campaigns');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }, [params]);

  const createCampaign = async (request: CreateCampaignRequest): Promise<boolean> => {
    try {
      const result = await marketingService.createCampaign(request);
      
      if (result.succeeded) {
        await fetchCampaigns(); // Refresh the list
        return true;
      } else {
        setError(result.errors?.join(', ') || 'Failed to create campaign');
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      return false;
    }
  };

  const updateCampaign = async (id: string, request: UpdateCampaignRequest): Promise<boolean> => {
    try {
      const result = await marketingService.updateCampaign(id, request);
      
      if (result.succeeded) {
        await fetchCampaigns(); // Refresh the list
        return true;
      } else {
        setError(result.errors?.join(', ') || 'Failed to update campaign');
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      return false;
    }
  };

  const deleteCampaign = async (id: string): Promise<boolean> => {
    try {
      const result = await marketingService.deleteCampaign(id);
      
      if (result.succeeded) {
        await fetchCampaigns(); // Refresh the list
        return true;
      } else {
        setError(result.errors?.join(', ') || 'Failed to delete campaign');
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      return false;
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  return {
    campaigns,
    totalCount,
    loading,
    error,
    refresh: fetchCampaigns,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    pagination
  };
};