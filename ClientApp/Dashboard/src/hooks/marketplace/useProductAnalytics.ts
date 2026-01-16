/**
 * useProductAnalytics Hook
 * React hook for managing product analytics and statistics
 */

import { useState, useCallback, useEffect } from 'react';
import { productApiService } from '../../services/marketplace';
import type { ProductDto, ProductStatistics } from '../../types/marketplace';

interface UseProductAnalyticsOptions {
  /** Start date for analytics period */
  fromDate?: Date;
  /** End date for analytics period */
  toDate?: Date;
  /** Whether to fetch analytics on mount */
  autoFetch?: boolean;
}

interface UseProductAnalyticsReturn {
  /** Product statistics */
  statistics: ProductStatistics | null;
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
 * Hook for managing product analytics and statistics
 * @param options - Hook configuration options
 * @returns Analytics state and operations
 */
export function useProductAnalytics(options: UseProductAnalyticsOptions = {}): UseProductAnalyticsReturn {
  const { fromDate: initialFromDate, toDate: initialToDate, autoFetch = true } = options;

  const [statistics, setStatistics] = useState<ProductStatistics | null>(null);
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
      const result = await productApiService.getStatistics(fromDate, toDate);
      setStatistics(result);
      setDateRange({ fromDate, toDate });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch product statistics';
      setError(errorMessage);
      console.error('Failed to fetch product statistics:', err);
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
 * Hook for fetching top selling products
 * @param limit - Number of products to fetch
 * @param period - Time period (e.g., '30d', '7d')
 * @returns Top selling products state and operations
 */
export function useTopSellingProducts(limit: number = 10, period: string = '30d') {
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTopSelling = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await productApiService.getTopSellingProducts(limit, period);
      setProducts(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch top selling products';
      setError(errorMessage);
      console.error('Failed to fetch top selling products:', err);
    } finally {
      setLoading(false);
    }
  }, [limit, period]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Auto-fetch on mount
  useEffect(() => {
    fetchTopSelling();
  }, [fetchTopSelling]);

  return {
    products,
    loading,
    error,
    refetch: fetchTopSelling,
    clearError
  };
}

/**
 * Hook for fetching low stock products
 * @param threshold - Optional stock threshold
 * @returns Low stock products state and operations
 */
export function useLowStockProducts(threshold?: number) {
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLowStock = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await productApiService.getLowStockProducts(threshold);
      setProducts(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch low stock products';
      setError(errorMessage);
      console.error('Failed to fetch low stock products:', err);
    } finally {
      setLoading(false);
    }
  }, [threshold]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Auto-fetch on mount
  useEffect(() => {
    fetchLowStock();
  }, [fetchLowStock]);

  return {
    products,
    loading,
    error,
    refetch: fetchLowStock,
    clearError
  };
}

/**
 * Hook for comprehensive product dashboard metrics
 * @returns Dashboard metrics state and operations
 */
export function useProductDashboard() {
  const [metrics, setMetrics] = useState<{
    statistics: ProductStatistics | null;
    topSelling: ProductDto[];
    lowStock: ProductDto[];
  }>({
    statistics: null,
    topSelling: [],
    lowStock: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [statistics, topSelling, lowStock] = await Promise.all([
        productApiService.getStatistics(),
        productApiService.getTopSellingProducts(10, '30d'),
        productApiService.getLowStockProducts()
      ]);

      setMetrics({
        statistics,
        topSelling,
        lowStock
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
