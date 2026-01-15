import { useState, useEffect } from 'react';
import { groupManagementService } from '../services';
import { GroupDto } from '@/types/community/group';
import { PagedResult } from '@/types/community/common';

export const useGroups = (params: {
  pageNumber?: number;
  pageSize?: number;
  type?: number;
  privacy?: number;
}) => {
  const [groups, setGroups] = useState<PagedResult<GroupDto> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await groupManagementService.getGroups(params);
        setGroups(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch groups');
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, [params.pageNumber, params.pageSize, params.type, params.privacy]);

  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await groupManagementService.getGroups(params);
      setGroups(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch groups');
    } finally {
      setLoading(false);
    }
  };

  return { groups, loading, error, refetch };
};
