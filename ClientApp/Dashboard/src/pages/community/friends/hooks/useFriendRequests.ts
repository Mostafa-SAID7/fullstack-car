import { useState, useEffect } from 'react';
import { friendManagementService } from '../services';
import { FriendRequestDto } from '@/types/community/friend';
import { PagedResult } from '@/types/community/common';

export const useFriendRequests = (pageNumber: number = 1) => {
  const [requests, setRequests] = useState<PagedResult<FriendRequestDto> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await friendManagementService.getFriendRequests(pageNumber);
        setRequests(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch friend requests');
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [pageNumber]);

  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await friendManagementService.getFriendRequests(pageNumber);
      setRequests(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch friend requests');
    } finally {
      setLoading(false);
    }
  };

  return { requests, loading, error, refetch };
};
