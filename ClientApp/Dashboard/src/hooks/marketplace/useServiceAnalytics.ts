/**
 * useServiceAnalytics Hook
 * React hook for managing service analytics and statistics
 */

import { useState, useCallback, useEffect } from 'react';
import { serviceApiService } from '../../services/marketplace';
import type { ServiceDto, ServiceStatistics } from '../../types/marketplace';

interface UseServiceAnalyticsOptions {
  /** Start date for analytics period */
  fromDate?: Date;
  /** End date for analytics period */
  toDate?: Date;
  /** Whether to fetch analytics on mount */
  autoFetch?: boolean;
}

interface UseServiceAnalyticsReturn {
  /** Service statistics */
  statistics: ServiceStatistics | null;
  /** Loading state */
  loading: boolean;
  /** Error message if any */
  error: string | null;
  /** Fetch statistics with optional date range */
  fetchStatistics: (fromDate?: Date, toDate?: Date) => Promise<void>;
  /** Refetch statistics with current date range */
  refetch: () => Promise<void>;
  /** Clear error state */
  clearError: () => void;
}

/**
 * Hook for managing service analytics and statistics
 * @param options - Hook configuration options
 * @returns Analytics state and operations
 */
export function useServiceAnalytics(options: UseServiceAnalyticsOptions = {}): UseServiceAnalyticsReturn {
  const { fromDate: initialFromDate, toDate: initialToDate, autoFetch = true } = options;

  const [statistics, setStatistics] = useState<ServiceStatistics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<{ fromDate?: Date; toDate?: Date }>({
    fromDate: initialFromDate,
    toDate: initialToDate
  });

  const fetchStatistics = useCallback(async (fromDate?: Date, toDate?: Date) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await serviceApiService.getStatistics(fromDate, toDate);
      setStatistics(result);
      setDateRange({ fromDate, toDate });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch service statistics';
      setError(errorMessage);
      console.error('Failed to fetch service statistics:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const refetch = useCallback(async () => {
    await fetchStatistics(dateRange.fromDate, dateRange.toDate);
  }, [fetchStatistics, dateRange]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Auto-fetch on mount if enabled
  useEffect(() => {
    if (autoFetch) {
      fetchStatistics(initialFromDate, initialToDate);
    }
  }, []); // Only run on mount

  return {
    statistics,
    loading,
    error,
    fetchStatistics,
    refetch,
    clearError
  };
}

/**
 * Hook for fetching popular services
 * @param limit - Number of services to fetch
 * @param period - Time period (e.g., '30d', '7d')
 * @returns Popular services state and operations
 */
export function usePopularServicesAnalytics(limit: number = 10, period: string = '30d') {
  const [services, setServices] = useState<ServiceDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPopular = useCallback(async () => {
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
    fetchPopular();
  }, [fetchPopular]);

  return {
    services,
    loading,
    error,
    refetch: fetchPopular,
    clearError
  };
}

/**
 * Hook for fetching emergency services
 * @param latitude - Optional latitude for location-based search
 * @param longitude - Optional longitude for location-based search
 * @returns Emergency services state and operations
 */
export function useEmergencyServices(latitude?: number, longitude?: number) {
  const [services, setServices] = useState<ServiceDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEmergency = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await serviceApiService.getEmergencyServices(latitude, longitude);
      setServices(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch emergency services';
      setError(errorMessage);
      console.error('Failed to fetch emergency services:', err);
    } finally {
      setLoading(false);
    }
  }, [latitude, longitude]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Auto-fetch on mount
  useEffect(() => {
    fetchEmergency();
  }, [fetchEmergency]);

  return {
    services,
    loading,
    error,
    refetch: fetchEmergency,
    clearError
  };
}

/**
 * Hook for fetching services by provider with analytics
 * @param providerId - Service provider ID
 * @returns Provider services state and operations
 */
export function useProviderServices(providerId: string | null) {
  const [services, setServices] = useState<ServiceDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProviderServices = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await serviceApiService.getServicesByProvider(id);
      setServices(result.items);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch provider services';
      setError(errorMessage);
      console.error('Failed to fetch provider services:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const refetch = useCallback(async () => {
    if (providerId) {
      await fetchProviderServices(providerId);
    }
  }, [fetchProviderServices, providerId]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Auto-fetch when providerId changes
  useEffect(() => {
    if (providerId) {
      fetchProviderServices(providerId);
    } else {
      setServices([]);
    }
  }, [providerId, fetchProviderServices]);

  return {
    services,
    loading,
    error,
    refetch,
    clearError
  };
}

/**
 * Hook for comprehensive service dashboard metrics
 * @returns Dashboard metrics state and operations
 */
export function useServiceDashboard() {
  const [metrics, setMetrics] = useState<{
    statistics: ServiceStatistics | null;
    popular: ServiceDto[];
    emergency: ServiceDto[];
  }>({
    statistics: null,
    popular: [],
    emergency: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [statistics, popular, emergency] = await Promise.all([
        serviceApiService.getStatistics(),
        serviceApiService.getPopularServices(10, '30d'),
        serviceApiService.getEmergencyServices()
      ]);

      setMetrics({
        statistics,
        popular,
        emergency
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch dashboard metrics';
      setError(errorMessage);
      console.error('Failed to fetch dashboard metrics:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Auto-fetch on mount
  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return {
    metrics,
    loading,
    error,
    refetch: fetchDashboard,
    clearError
  };
}
