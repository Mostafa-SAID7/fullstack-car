/**
 * Product API Service
 * Enhanced service for Product operations using BaseApiService
 */

import { BaseApiService } from '../api/base-api.service';
import { cacheService } from '../cache/cache.service';
import { CACHE_CONFIG } from '../cache/cache-config';
import type {
  ProductDto,
  CreateProductRequest,
  UpdateProductRequest,
  ProductFilters,
  ProductStatistics,
  PagedResult
} from '../../types/marketplace';

/**
 * Cache invalidation service for products
 */
export const productCacheInvalidation = {
  onProductCreate: () => {
    cacheService.invalidatePattern('*products*');
    cacheService.invalidatePattern('*product-statistics*');
  },
  
  onProductUpdate: () => {
    cacheService.invalidatePattern('*products*');
    cacheService.invalidatePattern('*product-statistics*');
  },
  
  onProductDelete: () => {
    cacheService.invalidatePattern('*products*');
    cacheService.invalidatePattern('*product-statistics*');
  }
};

/**
 * Product API Service
 * Handles all product-related API operations with caching
 */
export class ProductApiService extends BaseApiService {
  private readonly endpoint = '/v3/marketplace/products';

  /**
   * Get paginated list of products with optional filters
   * @param filters - Optional filter parameters
   * @returns Paged result of products
   */
  async getProducts(filters?: ProductFilters): Promise<PagedResult<ProductDto>> {
    return this.get<PagedResult<ProductDto>>(this.endpoint, {
      cache: true,
      cacheTTL: CACHE_CONFIG.MEDIUM.TTL,
      params: filters as Record<string, string | number | boolean>
    });
  }

  /**
   * Get a single product by ID
   * @param id - Product ID
   * @returns Product details
   */
  async getProduct(id: string): Promise<ProductDto> {
    return this.get<ProductDto>(`${this.endpoint}/${id}`, {
      cache: true,
      cacheTTL: CACHE_CONFIG.LONG.TTL
    });
  }

  /**
   * Create a new product
   * @param request - Product creation data
   * @returns Created product
   */
  async createProduct(request: CreateProductRequest): Promise<ProductDto> {
    const result = await this.post<ProductDto>(this.endpoint, request);
    productCacheInvalidation.onProductCreate();
    return result;
  }

  /**
   * Update an existing product
   * @param id - Product ID
   * @param request - Product update data
   * @returns Updated product
   */
  async updateProduct(id: string, request: UpdateProductRequest): Promise<ProductDto> {
    const result = await this.put<ProductDto>(`${this.endpoint}/${id}`, request);
    productCacheInvalidation.onProductUpdate();
    return result;
  }

  /**
   * Delete a product
   * @param id - Product ID
   */
  async deleteProduct(id: string): Promise<void> {
    await this.delete<void>(`${this.endpoint}/${id}`);
    productCacheInvalidation.onProductDelete();
  }

  /**
   * Search products by term
   * @param searchTerm - Search query
   * @param filters - Optional additional filters
   * @returns Array of matching products
   */
  async searchProducts(searchTerm: string, filters?: Partial<ProductFilters>): Promise<ProductDto[]> {
    return this.get<ProductDto[]>(`${this.endpoint}/search`, {
      cache: true,
      cacheTTL: CACHE_CONFIG.SHORT.TTL,
      params: { searchTerm, ...filters } as Record<string, string | number | boolean>
    });
  }

  /**
   * Get product statistics
   * @param fromDate - Optional start date
   * @param toDate - Optional end date
   * @returns Product statistics
   */
  async getStatistics(fromDate?: Date, toDate?: Date): Promise<ProductStatistics> {
    const params: Record<string, string> = {};
    if (fromDate) params.fromDate = fromDate.toISOString();
    if (toDate) params.toDate = toDate.toISOString();

    return this.get<ProductStatistics>(`${this.endpoint}/statistics`, {
      cache: true,
      cacheTTL: CACHE_CONFIG.MEDIUM.TTL,
      params
    });
  }

  /**
   * Update product status
   * @param id - Product ID
   * @param status - New status
   * @returns Updated product
   */
  async updateProductStatus(id: string, status: string): Promise<ProductDto> {
    const result = await this.patch<ProductDto>(`${this.endpoint}/${id}/status`, { status });
    productCacheInvalidation.onProductUpdate();
    return result;
  }

  /**
   * Get low stock products
   * @param threshold - Optional stock threshold
   * @returns Array of low stock products
   */
  async getLowStockProducts(threshold?: number): Promise<ProductDto[]> {
    const params = threshold ? { threshold } : undefined;
    return this.get<ProductDto[]>(`${this.endpoint}/low-stock`, {
      cache: true,
      cacheTTL: CACHE_CONFIG.SHORT.TTL,
      params: params as Record<string, number>
    });
  }

  /**
   * Get top selling products
   * @param limit - Number of products to return
   * @param period - Time period (e.g., '30d', '7d')
   * @returns Array of top selling products
   */
  async getTopSellingProducts(limit: number = 10, period: string = '30d'): Promise<ProductDto[]> {
    return this.get<ProductDto[]>(`${this.endpoint}/top-selling`, {
      cache: true,
      cacheTTL: CACHE_CONFIG.MEDIUM.TTL,
      params: { limit, period }
    });
  }

  /**
   * Bulk update products
   * @param productIds - Array of product IDs
   * @param updates - Update data
   */
  async bulkUpdate(productIds: string[], updates: Partial<UpdateProductRequest>): Promise<void> {
    await this.post<void>(`${this.endpoint}/bulk-update`, { productIds, updates });
    productCacheInvalidation.onProductUpdate();
  }

  /**
   * Bulk delete products
   * @param productIds - Array of product IDs
   */
  async bulkDelete(productIds: string[]): Promise<void> {
    await this.post<void>(`${this.endpoint}/bulk-delete`, { productIds });
    productCacheInvalidation.onProductDelete();
  }

  /**
   * Export products to CSV
   * @param filters - Optional filters
   * @returns Blob containing CSV data
   */
  async exportProducts(filters?: ProductFilters): Promise<Blob> {
    const params = filters ? { ...filters, format: 'csv' } : { format: 'csv' };
    const response = await this.get<Blob>(`${this.endpoint}/export`, {
      params: params as Record<string, string | number | boolean>
    });
    return response;
  }
}

// Export singleton instance
export const productApiService = new ProductApiService();
