import { useState, useEffect } from 'react';
import { pageManagementService } from '../services/PageManagementService';
import { PageDto } from '@/types/community/page';
import { PagedResult } from '@/types/community/common';

interface UsePagesParams {
  pageNumber?: number;
  pageSize?: number;
  type?: number;
  status?: number;
}

export const usePages = (params: UsePagesParams) => {
  const [pages, setPages] = useState<PagedResult<PageDto> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPages = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await pageManagementService.getPages(params);
      setPages(result);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch pages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, [params.pageNumber, params.pageSize, params.type, params.status]);

  return { pages, loading, error, refetch: fetchPages };
};
