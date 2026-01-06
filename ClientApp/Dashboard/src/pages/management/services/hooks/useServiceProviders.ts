import { useState, useEffect, useCallback } from 'react';
import { servicesService } from '../api/servicesService';
import type { 
  ServiceProvider, 
  ServiceProvidersQueryParams,
  CreateServiceProviderRequest,
  UpdateServiceProviderRequest,
  PaginatedResult
} from '../types';

interface UseServiceProvidersParams extends ServiceProvidersQueryParams {}

interface UseServiceProvidersReturn {
  providers: PaginatedResult<ServiceProvider> | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  createProvider: (data: CreateServiceProviderRequest) => Promise<void>;
  updateProvider: (id: string, data: UpdateServiceProviderRequest) => Promise<void>;
  deleteProvider: (id: string) => Promise<void>;
}

export const useServiceProviders = (params: UseServiceProvidersParams = {}): UseServiceProvidersReturn => {
  const [providers, setProviders] = useState<PaginatedResult<ServiceProvider> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProviders = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await servicesService.getServiceProviders(params);

      if (result.succeeded) {
        setProviders(result.data);
      } else {
        throw new Error('Failed to fetch service providers');
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [
    params.page,
    params.limit,
    params.search,
    params.city,
    params.state,
    params.isVerified,
    params.isActive,
    params.minRating,
    params.sortBy,
    params.sortOrder
  ]);

  const createProvider = useCallback(async (data: CreateServiceProviderRequest) => {
    try {
      // This would call the service provider creation endpoint
      console.log('Creating provider:', data);
      await fetchProviders(); // Refresh the list
    } catch (err) {
      throw err;
    }
  }, [fetchProviders]);

  const updateProvider = useCallback(async (id: string, data: UpdateServiceProviderRequest) => {
    try {
      // This would call the service provider update endpoint
      console.log('Updating provider:', id, data);
      await fetchProviders(); // Refresh the list
    } catch (err) {
      throw err;
    }
  }, [fetchProviders]);

  const deleteProvider = useCallback(async (id: string) => {
    try {
      // This would call the service provider delete endpoint
      console.log('Deleting provider:', id);
      await fetchProviders(); // Refresh the list
    } catch (err) {
      throw err;
    }
  }, [fetchProviders]);

  useEffect(() => {
    fetchProviders();
  }, [fetchProviders]);

  return {
    providers,
    isLoading,
    error,
    refetch: fetchProviders,
    createProvider,
    updateProvider,
    deleteProvider
  };
};