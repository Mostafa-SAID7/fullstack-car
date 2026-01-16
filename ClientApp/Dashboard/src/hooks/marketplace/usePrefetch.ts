/**
 * usePrefetch Hooks
 * React hooks for data prefetching functionality
 */

import { useEffect, useCallback, useRef } from 'react';
import { productPrefetchService, servicePrefetchService } from '../../services/marketplace/prefetch.service';
import type { ProductFilters, ServiceFilters } from '../../types/marketplace';

/**
 * Hook for product prefetching
 * @param currentPage - Current page number
 * @param filters - Current filters
 * @param enabled - Whether prefetching is enabled
 */
export function useProductPrefetch(
  currentPage: number,
  filters?: ProductFilters,
  enabled: boolean = true
) {
  const prefetchedNextPage = useRef<number | null>(null);

  /**
   * Prefetch next page when scroll threshold is reached
   */
  const prefetchNextPage = useCallback(() => {
    if (!enabled) return;
    
    // Only prefetch if we haven't already prefetched this page
    if (prefetchedNextPage.current === currentPage + 1) {
      return;
    }

    productPrefetchService.prefetchNextPage(currentPage, filters);
    prefetchedNextPage.current = currentPage + 1;
  }, [currentPage, filters, enabled]);

  /**
   * Handle scroll event to trigger prefetch
   */
  const handleScroll = useCallback((event: React.UIEvent<HTMLElement>) => {
    if (!enabled) return;

    const target = event.currentTarget;
    const { scrollTop, scrollHeight, clientHeight } = target;

    if (productPrefetchService.shouldPrefetchNextPage(scrollTop, scrollHeight, clientHeight)) {
      prefetchNextPage();
    }
  }, [prefetchNextPage, enabled]);

  /**
   * Create hover handlers for a product item
   */
  const createHoverHandlers = useCallback((productId: string) => {
    if (!enabled) {
      return {};
    }

    return {
      onMouseEnter: () => productPrefetchService.prefetchOnHover(productId),
      onMouseLeave: () => productPrefetchService.cancelPrefetch(productId)
    };
  }, [enabled]);

  // Reset prefetched page when filters change
  useEffect(() => {
    prefetchedNextPage.current = null;
  }, [filters]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      productPrefetchService.clearCache();
    };
  }, []);

  return {
    handleScroll,
    createHoverHandlers,
    prefetchNextPage
  };
}

/**
 * Hook for service prefetching
 * @param currentPage - Current page number
 * @param filters - Current filters
 * @param enabled - Whether prefetching is enabled
 */
export function useServicePrefetch(
  currentPage: number,
  filters?: ServiceFilters,
  enabled: boolean = true
) {
  const prefetchedNextPage = useRef<number | null>(null);

  /**
   * Prefetch next page when scroll threshold is reached
   */
  const prefetchNextPage = useCallback(() => {
    if (!enabled) return;
    
    // Only prefetch if we haven't already prefetched this page
    if (prefetchedNextPage.current === currentPage + 1) {
      return;
    }

    servicePrefetchService.prefetchNextPage(currentPage, filters);
    prefetchedNextPage.current = currentPage + 1;
  }, [currentPage, filters, enabled]);

  /**
   * Handle scroll event to trigger prefetch
   */
  const handleScroll = useCallback((event: React.UIEvent<HTMLElement>) => {
    if (!enabled) return;

    const target = event.currentTarget;
    const { scrollTop, scrollHeight, clientHeight } = target;

    if (servicePrefetchService.shouldPrefetchNextPage(scrollTop, scrollHeight, clientHeight)) {
      prefetchNextPage();
    }
  }, [prefetchNextPage, enabled]);

  /**
   * Create hover handlers for a service item
   */
  const createHoverHandlers = useCallback((serviceId: string) => {
    if (!enabled) {
      return {};
    }

    return {
      onMouseEnter: () => servicePrefetchService.prefetchOnHover(serviceId),
      onMouseLeave: () => servicePrefetchService.cancelPrefetch(serviceId)
    };
  }, [enabled]);

  // Reset prefetched page when filters change
  useEffect(() => {
    prefetchedNextPage.current = null;
  }, [filters]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      servicePrefetchService.clearCache();
    };
  }, []);

  return {
    handleScroll,
    createHoverHandlers,
    prefetchNextPage
  };
}

/**
 * Hook for automatic next page prefetching based on scroll position
 * Works with any scrollable container
 * @param enabled - Whether prefetching is enabled
 */
export function useScrollPrefetch(
  onPrefetch: () => void,
  enabled: boolean = true
) {
  const prefetchTriggered = useRef(false);

  const handleScroll = useCallback((event: React.UIEvent<HTMLElement>) => {
    if (!enabled || prefetchTriggered.current) return;

    const target = event.currentTarget;
    const { scrollTop, scrollHeight, clientHeight } = target;
    const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;

    if (scrollPercentage >= 0.8) {
      prefetchTriggered.current = true;
      onPrefetch();
    }
  }, [onPrefetch, enabled]);

  // Reset trigger when enabled changes
  useEffect(() => {
    prefetchTriggered.current = false;
  }, [enabled]);

  return { handleScroll };
}
