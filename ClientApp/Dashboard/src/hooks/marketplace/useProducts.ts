/**
 * useProducts Hook
 * React hook for managing product state and operations
 */

import { useState, useCallback, useEffect } from 'react';
import { productApiService } from '../../services/marketplace';
import type { ProductDto, ProductFilters, PagedResult } from '../../types/marketplace';

interface UseProductsOptions {
  /** Initial filters to apply */
  initialFilters?: ProductFilters;
  /** Whether to fetch products on mount */
  autoFetch?: boolean;
}

interface UseProductsReturn {
  /** Paged result of products */
  products: PagedResult<ProductDto> | null;
  /** Loading state */
  loading: boolean;
  /** Error message if any */
  error: string | null;
  /** Fetch products with optional filters */
  fetchProducts: (filters?: ProductFilters) => Promise<void>;
  /** Refetch products with current filters */
  refetch: () => Promise<void>;
  /** Clear error state */
  clearError: () => void;
  /** Current filters */
  currentFilters: ProductFilters | undefined;
}

/**
 * Hook for managing products list with filtering and pagination
 * @param options - Hook configuration options
 * @returns Products state and operations
 */
export function useProducts(options: UseProductsOptions = {}): UseProductsReturn {
  const { initialFilters, autoFetch = true } = options;

  const [products, setProducts] = useState<PagedResult<ProductDto> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentFilters, setCurrentFilters] = useState<ProductFilters | undefined>(initialFilters);

  const fetchProducts = useCallback(async (filters?: ProductFilters) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await productApiService.getProducts(filters);
      setProducts(result);
      setCurrentFilters(filters);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch products';
      setError(errorMessage);
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const refetch = useCallback(async () => {
    await fetchProducts(currentFilters);
  }, [fetchProducts, currentFilters]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Auto-fetch on mount if enabled
  useEffect(() => {
    if (autoFetch) {
      fetchProducts(initialFilters);
    }
  }, []); // Only run on mount

  return {
    products,
    loading,
    error,
    fetchProducts,
    refetch,
    clearError,
    currentFilters
  };
}

/**
 * Hook for managing a single product
 * @param productId - Product ID to fetch
 * @returns Product state and operations
 */
export function useProduct(productId: string | null) {
  const [product, setProduct] = useState<ProductDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProduct = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await productApiService.getProduct(id);
      setProduct(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch product';
      setError(errorMessage);
      console.error('Failed to fetch product:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const refetch = useCallback(async () => {
    if (productId) {
      await fetchProduct(productId);
    }
  }, [fetchProduct, productId]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Auto-fetch when productId changes
  useEffect(() => {
    if (productId) {
      fetchProduct(productId);
    } else {
      setProduct(null);
    }
  }, [productId, fetchProduct]);

  return {
    product,
    loading,
    error,
    refetch,
    clearError
  };
}

/**
 * Hook for product search
 * @returns Search state and operations
 */
export function useProductSearch() {
  const [results, setResults] = useState<ProductDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (searchTerm: string, filters?: Partial<ProductFilters>) => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const result = await productApiService.searchProducts(searchTerm, filters);
      setResults(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Search failed';
      setError(errorMessage);
      console.error('Product search failed:', err);
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
