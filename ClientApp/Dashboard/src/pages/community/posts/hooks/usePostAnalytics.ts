import { useState, useEffect } from 'react';
import { postManagementService } from '../services';
import { PostAnalytics } from '@/types/community/post';

export const usePostAnalytics = () => {
  const [analytics, setAnalytics] = useState<PostAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await postManagementService.getAnalytics();
        setAnalytics(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch analytics');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await postManagementService.getAnalytics();
      setAnalytics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  };

  return { analytics, loading, error, refetch };
};
