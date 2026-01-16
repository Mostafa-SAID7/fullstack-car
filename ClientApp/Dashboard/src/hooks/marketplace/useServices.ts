/**
 * useServices Hook
 * React hook for managing service state and operations
 */

import { useState, useCallback, useEffect } from 'react';
import { serviceApiService } from '../../services/marketplace';
import type { ServiceDto, ServiceFilters, PagedResult, LocationSearchParams } from '../../types/marketplace';

interface UseServicesOptions {
  /** Initial filters to apply */
  initialFilters?: ServiceFilters;
  /** Whether to fetch services on mount */
  autoFetch?: boolean;
}

interface UseServicesReturn {
  /** Paged result of services */
  services: PagedResult<ServiceDto> | null;
  /** Loading state */
  loading: boolean;
  /** Error message if any */
  error: string | null;
  /** Fetch services with optional filters */
  fetchServices: (filters?: ServiceFilters) => Promise<void>;
  /** Refetch services with current filters */
  refetch: () => Promise<void>;
  /** Clear error state */
  clearError: () => void;
  /** Current filters */
  currentFilters: ServiceFilters | undefined;
}

/**
 * Hook for managing services list with filtering and pagination
 * @param options - Hook configuration options
 * @returns Services state and operations
 */
export function useServices(options: UseServicesOptions = {}): UseServicesReturn {
  const { initialFilters, autoFetch = true } = options;

  const [services, setServices] = useState<PagedResult<ServiceDto> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentFilters, setCurrentFilters] = useState<ServiceFilters | undefined>(initialFilters);

  const fetchServices = useCallback(async (filters?: ServiceFilters) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await serviceApiService.getServices(filters);
      setServices(result);
      setCurrentFilters(filters);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch services';
      setError(errorMessage);
      console.error('Failed to fetch services:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const refetch = useCallback(async () => {
    await fetchServices(currentFilters);
  }, [fetchServices, currentFilters]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Auto-fetch on mount if enabled
  useEffect(() => {
    if (autoFetch) {
      fetchServices(initialFilters);
    }
  }, []); // Only run on mount

  return {
    services,
    loading,
    error,
    fetchServices,
    refetch,
    clearError,
    currentFilters
  };
}

/**
 * Hook for managing a single service
 * @param serviceId - Service ID to fetch
 * @returns Service state and operations
 */
export function useService(serviceId: string | null) {
  const [service, setService] = useState<ServiceDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchService = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await serviceApiService.getService(id);
      setService(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch service';
      setError(errorMessage);
      console.error('Failed to fetch service:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const refetch = useCallback(async () => {
    if (serviceId) {
      await fetchService(serviceId);
    }
  }, [fetchService, serviceId]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Auto-fetch when serviceId changes
  useEffect(() => {
    if (serviceId) {
      fetchService(serviceId);
    } else {
      setService(null);
    }
  }, [serviceId, fetchService]);

  return {
    service,
    loading,
    error,
    refetch,
    clearError
  };
}

/**
 * Hook for service search
 * @returns Search state and operations
 */
export function useServiceSearch() {
  const [results, setResults] = useState<ServiceDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (searchTerm: string, filters?: Partial<ServiceFilters>) => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const result = await serviceApiService.searchServices(searchTerm, filters);
      setResults(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Search failed';
      setError(errorMessage);
      console.error('Service search failed:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setResults([]);
    setError(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    results,
    loading,
    error,
    search,
    clearResults,
    clearError
  };
}

/**
 * Hook for location-based service search
 * @returns Location search state and operations
 */
export function useServiceLocationSearch() {
  const [results, setResults] = useState<PagedResult<ServiceDto> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchByLocation = useCallback(async (
    latitude: number,
    longitude: number,
    radiusKm: number = 10,
    filters?: Partial<ServiceFilters>
  ) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await serviceApiService.searchByLocation(latitude, longitude, radiusKm, filters);
      setResults(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Location search failed';
      setError(errorMessage);
      console.error('Service location search failed:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setResults(null);
    setError(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    results,
    loading,
    error,
    searchByLocation,
    clearResults,
    clearError
  };
}

/**
 * Hook for fetching popular services
 * @returns Popular services state and operations
 */
export function usePopularServices(limit: number = 10, period: string = '30d') {
  const [services, setServices] = useState<ServiceDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPopularServices = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await serviceApiService.getPopularServices(limit, period);
      setServices(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch popular services';
      setError(errorMessage);
      console.error('Failed to fetch popular services:', err);
    } finally {
      setLoading(false);
    }
  }, [limit, period]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Auto-fetch on mount
  useEffect(() => {
    fetchPopularServices();
  }, [fetchPopularServices]);

  return {
    services,
    loading,
    error,
    refetch: fetchPopularServices,
    clearError
  };
}
