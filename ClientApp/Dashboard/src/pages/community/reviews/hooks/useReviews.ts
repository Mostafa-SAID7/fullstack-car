import { useState, useEffect } from 'react';
import { reviewManagementService } from '../services';
import { ReviewDto } from '@/types/community/review';
import { PagedResult } from '@/types/community/common';

export const useReviews = (params: {
  pageNumber?: number;
  pageSize?: number;
  type?: number;
  rating?: number;
}) => {
  const [reviews, setReviews] = useState<PagedResult<ReviewDto> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await reviewManagementService.getReviews(params);
        setReviews(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch reviews');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [params.pageNumber, params.pageSize, params.type, params.rating]);

  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await reviewManagementService.getReviews(params);
      setReviews(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  };

  return { reviews, loading, error, refetch };
};
