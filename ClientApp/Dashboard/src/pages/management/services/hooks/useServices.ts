import { useState, useEffect, useCallback } from 'react';
import { servicesService } from '../api/servicesService';
import type { 
  Service, 
  ServiceStatistics, 
  ServicesQueryParams,
  CreateServiceRequest,
  UpdateServiceRequest,
  PaginatedResult,
  ServiceType
} from '../types';

interface UseServicesParams extends ServicesQueryParams {
  tab?: string;
  filters?: {
    type: string;
    status: string;
    provider: string;
    priceRange: [number, number];
    rating: number;
    location: string;
    availability: string;
  };
}

interface UseServicesReturn {
  services: PaginatedResult<Service> | null;
  statistics: ServiceStatistics | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  createService: (data: CreateServiceRequest) => Promise<void>;
  updateService: (id: string, data: UpdateServiceRequest) => Promise<void>;
  deleteService: (id: string) => Promise<void>;
}

export const useServices = (params: UseServicesParams = {}): UseServicesReturn => {
  const [services, setServices] = useState<PaginatedResult<Service> | null>(null);
  const [statistics, setStatistics] = useState<ServiceStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchServices = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Build query parameters
      const queryParams: ServicesQueryParams = {
        page: params.page || 1,
        limit: params.limit || 10,
        search: params.search,
        sortBy: params.sortBy || 'createdAt',
        sortOrder: params.sortOrder || 'desc'
      };

      // Apply filters
      if (params.filters) {
        if (params.filters.type) {
          queryParams.type = parseInt(params.filters.type) as ServiceType;
        }
        if (params.filters.priceRange) {
          queryParams.minPrice = params.filters.priceRange[0];
          queryParams.maxPrice = params.filters.priceRange[1];
        }
        if (params.filters.rating) {
          queryParams.minRating = params.filters.rating;
        }
      }

      const [servicesResult, statisticsResult] = await Promise.all([
        servicesService.getServices(queryParams),
        servicesService.getStatistics()
      ]);

      if (servicesResult.succeeded) {
        setServices(servicesResult.data);
      } else {
        throw new Error('Failed to fetch services');
      }

      if (statisticsResult.succeeded) {
        setStatistics(statisticsResult.data);
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
    params.tab,
    params.sortBy,
    params.sortOrder,
    params.filters
  ]);

  const createService = useCallback(async (data: CreateServiceRequest) => {
    try {
      const result = await servicesService.createService(data);
      if (result.succeeded) {
        await fetchServices(); // Refresh the list
      } else {
        throw new Error('Failed to create service');
      }
    } catch (err) {
      throw err;
    }
  }, [fetchServices]);

  const updateService = useCallback(async (id: string, data: UpdateServiceRequest) => {
    try {
      const result = await servicesService.updateService(id, data);
      if (result.succeeded) {
        await fetchServices(); // Refresh the list
      } else {
        throw new Error('Failed to update service');
      }
    } catch (err) {
      throw err;
    }
  }, [fetchServices]);

  const deleteService = useCallback(async (id: string) => {
    try {
      const result = await servicesService.deleteService(id);
      if (result.succeeded) {
        await fetchServices(); // Refresh the list
      } else {
        throw new Error('Failed to delete service');
      }
    } catch (err) {
      throw err;
    }
  }, [fetchServices]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  return {
    services,
    statistics,
    isLoading,
    error,
    refetch: fetchServices,
    createService,
    updateService,
    deleteService
  };
};