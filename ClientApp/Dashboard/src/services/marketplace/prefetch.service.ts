/**
 * Prefetch Service
 * Handles data prefetching for marketplace features to improve performance
 */

import { productApiService } from './product-api.service';
import { serviceApiService } from './service-api.service';
import type { ProductFilters, ServiceFilters } from '../../types/marketplace';

/**
 * Prefetch configuration
 */
const PREFETCH_CONFIG = {
  /** Delay before prefetching on hover (ms) */
  HOVER_DELAY: 150,
  /** Scroll threshold for next page prefetch (percentage) */
  SCROLL_THRESHOLD: 0.8,
  /** Maximum concurrent prefetch requests */
  MAX_CONCURRENT: 3
};

/**
 * Prefetch queue to manage concurrent requests
 */
class PrefetchQueue {
  private queue: Array<() => Promise<void>> = [];
  private activeCount = 0;

  async add(task: () => Promise<void>): Promise<void> {
    this.queue.push(task);
    await this.process();
  }

  private async process(): Promise<void> {
    if (this.activeCount >= PREFETCH_CONFIG.MAX_CONCURRENT || this.queue.length === 0) {
      return;
    }

    const task = this.queue.shift();
    if (!task) return;

    this.activeCount++;
    try {
      await task();
    } catch (error) {
      // Silently fail prefetch errors
      console.debug('Prefetch failed:', error);
    } finally {
      this.activeCount--;
      await this.process();
    }
  }
}

const prefetchQueue = new PrefetchQueue();

/**
 * Product Prefetch Service
 */
export class ProductPrefetchService {
  private hoverTimeouts = new Map<string, NodeJS.Timeout>();
  private prefetchedIds = new Set<string>();

  /**
   * Prefetch product details on hover
   * @param productId - Product ID to prefetch
   */
  prefetchOnHover(productId: string): void {
    // Clear any existing timeout for this product
    const existingTimeout = this.hoverTimeouts.get(productId);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
    }

    // Skip if already prefetched
    if (this.prefetchedIds.has(productId)) {
      return;
    }

    // Set new timeout
    const timeout = setTimeout(() => {
      prefetchQueue.add(async () => {
        await productApiService.getProduct(productId);
        this.prefetchedIds.add(productId);
      });
      this.hoverTimeouts.delete(productId);
    }, PREFETCH_CONFIG.HOVER_DELAY);

    this.hoverTimeouts.set(productId, timeout);
  }

  /**
   * Cancel prefetch on hover leave
   * @param productId - Product ID
   */
  cancelPrefetch(productId: string): void {
    const timeout = this.hoverTimeouts.get(productId);
    if (timeout) {
      clearTimeout(timeout);
      this.hoverTimeouts.delete(productId);
    }
  }

  /**
   * Prefetch next page of products
   * @param currentPage - Current page number
   * @param filters - Current filters
   */
  prefetchNextPage(currentPage: number, filters?: ProductFilters): void {
    const nextPage = currentPage + 1;
    const nextFilters = { ...filters, page: nextPage };

    prefetchQueue.add(async () => {
      await productApiService.getProducts(nextFilters);
    });
  }

  /**
   * Clear prefetch cache
   */
  clearCache(): void {
    this.prefetchedIds.clear();
    this.hoverTimeouts.forEach(timeout => clearTimeout(timeout));
    this.hoverTimeouts.clear();
  }

  /**
   * Check if scroll position should trigger next page prefetch
   * @param scrollTop - Current scroll position
   * @param scrollHeight - Total scrollable height
   * @param clientHeight - Visible height
   * @returns True if should prefetch
   */
  shouldPrefetchNextPage(scrollTop: number, scrollHeight: number, clientHeight: number): boolean {
    const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;
    return scrollPercentage >= PREFETCH_CONFIG.SCROLL_THRESHOLD;
  }
}

/**
 * Service Prefetch Service
 */
export class ServicePrefetchService {
  private hoverTimeouts = new Map<string, NodeJS.Timeout>();
  private prefetchedIds = new Set<string>();

  /**
   * Prefetch service details on hover
   * @param serviceId - Service ID to prefetch
   */
  prefetchOnHover(serviceId: string): void {
    // Clear any existing timeout for this service
    const existingTimeout = this.hoverTimeouts.get(serviceId);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
    }

    // Skip if already prefetched
    if (this.prefetchedIds.has(serviceId)) {
      return;
    }

    // Set new timeout
    const timeout = setTimeout(() => {
      prefetchQueue.add(async () => {
        await serviceApiService.getService(serviceId);
        this.prefetchedIds.add(serviceId);
      });
      this.hoverTimeouts.delete(serviceId);
    }, PREFETCH_CONFIG.HOVER_DELAY);

    this.hoverTimeouts.set(serviceId, timeout);
  }

  /**
   * Cancel prefetch on hover leave
   * @param serviceId - Service ID
   */
  cancelPrefetch(serviceId: string): void {
    const timeout = this.hoverTimeouts.get(serviceId);
    if (timeout) {
      clearTimeout(timeout);
      this.hoverTimeouts.delete(serviceId);
    }
  }

  /**
   * Prefetch next page of services
   * @param currentPage - Current page number
   * @param filters - Current filters
   */
  prefetchNextPage(currentPage: number, filters?: ServiceFilters): void {
    const nextPage = currentPage + 1;
    const nextFilters = { ...filters, page: nextPage };

    prefetchQueue.add(async () => {
      await serviceApiService.getServices(nextFilters);
    });
  }

  /**
   * Clear prefetch cache
   */
  clearCache(): void {
    this.prefetchedIds.clear();
    this.hoverTimeouts.forEach(timeout => clearTimeout(timeout));
    this.hoverTimeouts.clear();
  }

  /**
   * Check if scroll position should trigger next page prefetch
   * @param scrollTop - Current scroll position
   * @param scrollHeight - Total scrollable height
   * @param clientHeight - Visible height
   * @returns True if should prefetch
   */
  shouldPrefetchNextPage(scrollTop: number, scrollHeight: number, clientHeight: number): boolean {
    const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;
    return scrollPercentage >= PREFETCH_CONFIG.SCROLL_THRESHOLD;
  }
}

// Export singleton instances
export const productPrefetchService = new ProductPrefetchService();
export const servicePrefetchService = new ServicePrefetchService();

/**
 * Utility function to create prefetch handlers for components
 */
export const createPrefetchHandlers = {
  /**
   * Create product prefetch handlers
   * @param productId - Product ID
   * @returns Hover event handlers
   */
  forProduct: (productId: string) => ({
    onMouseEnter: () => productPrefetchService.prefetchOnHover(productId),
    onMouseLeave: () => productPrefetchService.cancelPrefetch(productId)
  }),

  /**
   * Create service prefetch handlers
   * @param serviceId - Service ID
   * @returns Hover event handlers
   */
  forService: (serviceId: string) => ({
    onMouseEnter: () => servicePrefetchService.prefetchOnHover(serviceId),
    onMouseLeave: () => servicePrefetchService.cancelPrefetch(serviceId)
  })
};
