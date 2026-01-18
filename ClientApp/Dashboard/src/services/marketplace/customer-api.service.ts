/**
 * Customer API Service
 * Enhanced service for Customer operations using BaseApiService
 */

import { BaseApiService } from '../api/base-api.service';
import { cacheService } from '../cache/cache.service';
import { CACHE_CONFIG } from '../cache/cache-config';
import type {
    CustomerDto,
    CustomerFilters,
    CustomerAnalytics,
    PagedResult
} from '../../types/marketplace';

/**
 * Cache invalidation for customers
 */
export const customerCacheInvalidation = {
    onCustomerChange: () => {
        cacheService.invalidatePattern('*customers*');
    }
};

/**
 * Customer API Service
 * Handles all customer-related API operations with caching
 */
export class CustomerApiService extends BaseApiService {
    private readonly endpoint = '/v3/marketplace/customers';

    /**
     * Get paginated list of customers
     */
    async getCustomers(filters?: CustomerFilters): Promise<PagedResult<CustomerDto>> {
        return this.get<PagedResult<CustomerDto>>(this.endpoint, {
            cache: true,
            cacheTTL: CACHE_CONFIG.MEDIUM.TTL,
            params: filters as Record<string, string | number | boolean>
        });
    }

    /**
     * Get a single customer by ID
     */
    async getCustomer(id: string): Promise<CustomerDto> {
        return this.get<CustomerDto>(`${this.endpoint}/${id}`, {
            cache: true,
            cacheTTL: CACHE_CONFIG.LONG.TTL
        });
    }

    /**
     * Create a new customer
     */
    async createCustomer(data: Partial<CustomerDto>): Promise<CustomerDto> {
        const result = await this.post<CustomerDto>(this.endpoint, data);
        customerCacheInvalidation.onCustomerChange();
        return result;
    }

    /**
     * Update an existing customer
     */
    async updateCustomer(id: string, data: Partial<CustomerDto>): Promise<CustomerDto> {
        const result = await this.put<CustomerDto>(`${this.endpoint}/${id}`, data);
        customerCacheInvalidation.onCustomerChange();
        return result;
    }

    /**
     * Delete a customer
     */
    async deleteCustomer(id: string): Promise<void> {
        await this.delete<void>(`${this.endpoint}/${id}`);
        customerCacheInvalidation.onCustomerChange();
    }

    /**
     * Get customer analytics
     */
    async getAnalytics(customerId: string): Promise<CustomerAnalytics> {
        return this.get<CustomerAnalytics>(`${this.endpoint}/${customerId}/analytics`, {
            cache: true,
            cacheTTL: CACHE_CONFIG.MEDIUM.TTL
        });
    }
}

export const customerApiService = new CustomerApiService();
