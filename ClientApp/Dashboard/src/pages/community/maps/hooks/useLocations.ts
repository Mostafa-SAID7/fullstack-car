import { useState, useEffect } from 'react';
import { locationManagementService } from '../services/LocationManagementService';
import { LocationDto } from '@/types/community/location';
import { PagedResult } from '@/types/community/common';

interface UseLocationsParams {
  pageNumber?: number;
  pageSize?: number;
  category?: number;
  city?: string;
  country?: string;
}

export const useLocations = (params: UseLocationsParams) => {
  const [locations, setLocations] = useState<PagedResult<LocationDto> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLocations = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await locationManagementService.getLocations(params);
      setLocations(result);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch locations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, [params.pageNumber, params.pageSize, params.category, params.city, params.country]);

  return { locations, loading, error, refetch: fetchLocations };
};
