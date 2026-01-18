/**
 * Order API Service
 * Enhanced service for Order operations using BaseApiService
 */

import { BaseApiService } from '../api/base-api.service';
import { cacheService } from '../cache/cache.service';
import { CACHE_CONFIG } from '../cache/cache-config';
import type {
    OrderDto,
    OrderFilters,
    TransactionDto,
    PagedResult
} from '../../types/marketplace';

/**
 * Cache invalidation for orders
 */
export const orderCacheInvalidation = {
    onOrderChange: () => {
        cacheService.invalidatePattern('*orders*');
    }
};

/**
 * Order API Service
 * Handles all order-related API operations with caching
 */
export class OrderApiService extends BaseApiService {
    private readonly endpoint = '/v3/marketplace/orders';

    /**
     * Get paginated list of orders
     */
    async getOrders(filters?: OrderFilters): Promise<PagedResult<OrderDto>> {
        return this.get<PagedResult<OrderDto>>(this.endpoint, {
            cache: true,
            cacheTTL: CACHE_CONFIG.MEDIUM.TTL,
            params: filters as Record<string, string | number | boolean>
        });
    }

    /**
     * Get a single order by ID
     */
    async getOrder(id: string): Promise<OrderDto> {
        return this.get<OrderDto>(`${this.endpoint}/${id}`, {
            cache: true,
            cacheTTL: CACHE_CONFIG.LONG.TTL
        });
    }

    /**
     * Update order status
     */
    async updateStatus(id: string, status: string): Promise<OrderDto> {
        const result = await this.patch<OrderDto>(`${this.endpoint}/${id}/status`, { status });
        orderCacheInvalidation.onOrderChange();
        return result;
    }

    /**
     * Get transactions
     */
    async getTransactions(filters?: any): Promise<PagedResult<TransactionDto>> {
        return this.get<PagedResult<TransactionDto>>(`${this.endpoint}/transactions`, {
            cache: true,
            cacheTTL: CACHE_CONFIG.MEDIUM.TTL,
            params: filters
        });
    }
}

export const orderApiService = new OrderApiService();
