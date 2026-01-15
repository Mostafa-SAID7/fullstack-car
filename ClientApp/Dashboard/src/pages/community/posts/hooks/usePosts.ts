import { useState, useEffect } from 'react';
import { postManagementService } from '../services';
import { PostDto } from '@/types/community/post';
import { PagedResult } from '@/types/community/common';

export const usePosts = (params: {
  pageNumber?: number;
  pageSize?: number;
  groupId?: string;
  userId?: string;
}) => {
  const [posts, setPosts] = useState<PagedResult<PostDto> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await postManagementService.getPosts(params);
        setPosts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [params.pageNumber, params.pageSize, params.groupId, params.userId]);

  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await postManagementService.getPosts(params);
      setPosts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  return { posts, loading, error, refetch };
};
