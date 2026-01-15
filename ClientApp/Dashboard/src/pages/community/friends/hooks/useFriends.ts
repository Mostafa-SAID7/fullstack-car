import { useState, useEffect } from 'react';
import { friendManagementService } from '../services';
import { FriendDto } from '@/types/community/friend';
import { PagedResult } from '@/types/community/common';

export const useFriends = (params: {
  pageNumber?: number;
  pageSize?: number;
  userId?: string;
}) => {
  const [friends, setFriends] = useState<PagedResult<FriendDto> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await friendManagementService.getFriends(params);
        setFriends(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch friends');
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, [params.pageNumber, params.pageSize, params.userId]);

  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await friendManagementService.getFriends(params);
      setFriends(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch friends');
    } finally {
      setLoading(false);
    }
  };

  return { friends, loading, error, refetch };
};
