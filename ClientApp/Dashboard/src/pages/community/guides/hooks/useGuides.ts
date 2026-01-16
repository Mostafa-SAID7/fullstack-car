import { useState, useEffect } from 'react';
import { guideManagementService } from '../services/GuideManagementService';
import { GuideDto } from '@/types/community/guide';
import { PagedResult } from '@/types/community/common';

interface UseGuidesParams {
  pageNumber?: number;
  pageSize?: number;
  category?: number;
  difficulty?: number;
}

export const useGuides = (params: UseGuidesParams) => {
  const [guides, setGuides] = useState<PagedResult<GuideDto> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGuides = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await guideManagementService.getGuides(params);
      setGuides(result);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch guides');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuides();
  }, [params.pageNumber, params.pageSize, params.category, params.difficulty]);

  return { guides, loading, error, refetch: fetchGuides };
};
