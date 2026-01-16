import { useState, useEffect } from 'react';
import { articleManagementService } from '../services/ArticleManagementService';
import { ArticleDto } from '@/types/community/article';
import { PagedResult } from '@/types/community/common';

interface UseArticlesParams {
  pageNumber?: number;
  pageSize?: number;
  category?: number;
  status?: number;
  tag?: string;
}

export const useArticles = (params: UseArticlesParams) => {
  const [articles, setArticles] = useState<PagedResult<ArticleDto> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchArticles = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await articleManagementService.getArticles(params);
      setArticles(result);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch articles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [params.pageNumber, params.pageSize, params.category, params.status, params.tag]);

  return { articles, loading, error, refetch: fetchArticles };
};
