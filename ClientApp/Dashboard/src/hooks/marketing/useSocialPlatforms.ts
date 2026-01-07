import { useState, useEffect } from 'react';
import { SocialPlatformService } from '../../services/marketing/SocialPlatformService';
import type { SocialPlatform } from '../../services/marketing/types';

interface UseSocialPlatformsReturn {
  platforms: SocialPlatform[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export const useSocialPlatforms = (isActive?: boolean): UseSocialPlatformsReturn => {
  const [platforms, setPlatforms] = useState<SocialPlatform[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const platformService = new SocialPlatformService();

  const fetchPlatforms = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await platformService.getPlatforms();
      
      if (result.succeeded && result.data) {
        setPlatforms(result.data);
      } else {
        setError(result.errors.join(', ') || 'Failed to fetch social platforms');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlatforms();
  }, [isActive]);

  return {
    platforms,
    loading,
    error,
    refresh: fetchPlatforms
  };
};