/**
 * Service API Service
 * Enhanced service for Service operations using BaseApiService
 */

import { BaseApiService } from '../api/base-api.service';
import { cacheService } from '../cache/cache.service';
import { CACHE_CONFIG } from '../cache/cache-config';
import type {
  ServiceDto,
  CreateServiceRequest,
  UpdateServiceRequest,
  ServiceFilters,
  ServiceStatistics,
  PagedResult,
  LocationSearchParams
} from '../../types/marketplace';

/**
 * Cache invalidation service for services
 */
export const serviceCacheInvalidation = {
  onServiceCreate: () => {
    cacheService.invalidatePattern('*services*');
    cacheService.invalidatePattern('*service-statistics*');
  },
  
  onServiceUpdate: () => {
    cacheService.invalidatePattern('*services*');
    cacheService.invalidatePattern('*service-statistics*');
  },
  
  onServiceDelete: () => {
    cacheService.invalidatePattern('*services*');
    cacheService.invalidatePattern('*service-statistics*');
  }
};

/**
 * Service API Service
 * Handles all service-related API operations with caching
 */
export class ServiceApiService extends BaseApiService {
  private readonly endpoint = '/v6/marketplace/services';

  /**
   * Get paginated list of services with optional filters
   * @param filters - Optional filter parameters
   * @returns Paged result of services
   */
  async getServices(filters?: ServiceFilters): Promise<PagedResult<ServiceDto>> {
    return this.get<PagedResult<ServiceDto>>(this.endpoint, {
      cache: true,
      cacheTTL: CACHE_CONFIG.MEDIUM.TTL,
      params: filters as Record<string, string | number | boolean>
    });
  }

  /**
   * Get a single service by ID
   * @param id - Service ID
   * @returns Service details
   */
  async getService(id: string): Promise<ServiceDto> {
    return this.get<ServiceDto>(`${this.endpoint}/${id}`, {
      cache: true,
      cacheTTL: CACHE_CONFIG.LONG.TTL
    });
  }

  /**
   * Create a new service
   * @param request - Service creation data
   * @returns Created service
   */
  async createService(request: CreateServiceRequest): Promise<ServiceDto> {
    const result = await this.post<ServiceDto>(this.endpoint, request);
    serviceCacheInvalidation.onServiceCreate();
    return result;
  }

  /**
   * Update an existing service
   * @param id - Service ID
   * @param request - Service update data
   * @returns Updated service
   */
  async updateService(id: string, request: UpdateServiceRequest): Promise<ServiceDto> {
    const result = await this.put<ServiceDto>(`${this.endpoint}/${id}`, request);
    serviceCacheInvalidation.onServiceUpdate();
    return result;
  }

  /**
   * Delete a service
   * @param id - Service ID
   */
  async deleteService(id: string): Promise<void> {
    await this.delete<void>(`${this.endpoint}/${id}`);
    serviceCacheInvalidation.onServiceDelete();
  }

  /**
   * Search services by location
   * @param latitude - Latitude coordinate
   * @param longitude - Longitude coordinate
   * @param radiusKm - Search radius in kilometers (default: 10)
   * @param filters - Optional additional filters
   * @returns Paged result of services near the location
   */
  async searchByLocation(
    latitude: number,
    longitude: number,
    radiusKm: number = 10,
    filters?: Partial<ServiceFilters>
  ): Promise<PagedResult<ServiceDto>> {
    const params = {
      latitude,
      longitude,
      radiusKm,
      ...filters
    };

    return this.get<PagedResult<ServiceDto>>(`${this.endpoint}/search/location`, {
      cache: true,
      cacheTTL: CACHE_CONFIG.SHORT.TTL,
      params: params as Record<string, string | number | boolean>
    });
  }

  /**
   * Search services by term
   * @param searchTerm - Search query
   * @param filters - Optional additional filters
   * @returns Array of matching services
   */
  async searchServices(searchTerm: string, filters?: Partial<ServiceFilters>): Promise<ServiceDto[]> {
    return this.get<ServiceDto[]>(`${this.endpoint}/search`, {
      cache: true,
      cacheTTL: CACHE_CONFIG.SHORT.TTL,
      params: { searchTerm, ...filters } as Record<string, string | number | boolean>
    });
  }

  /**
   * Get service statistics
   * @param fromDate - Optional start date
   * @param toDate - Optional end date
   * @returns Service statistics
   */
  async getStatistics(fromDate?: Date, toDate?: Date): Promise<ServiceStatistics> {
    const params: Record<string, string> = {};
    if (fromDate) params.fromDate = fromDate.toISOString();
    if (toDate) params.toDate = toDate.toISOString();

    return this.get<ServiceStatistics>(`${this.endpoint}/statistics`, {
      cache: true,
      cacheTTL: CACHE_CONFIG.MEDIUM.TTL,
      params
    });
  }

  /**
   * Update service status
   * @param id - Service ID
   * @param status - New status
   * @returns Updated service
   */
  async updateServiceStatus(id: string, status: string): Promise<ServiceDto> {
    const result = await this.patch<ServiceDto>(`${this.endpoint}/${id}/status`, { status });
    serviceCacheInvalidation.onServiceUpdate();
    return result;
  }

  /**
   * Get popular services
   * @param limit - Number of services to return
   * @param period - Time period (e.g., '30d', '7d')
   * @returns Array of popular services
   */
  async getPopularServices(limit: number = 10, period: string = '30d'): Promise<ServiceDto[]> {
    return this.get<ServiceDto[]>(`${this.endpoint}/popular`, {
      cache: true,
      cacheTTL: CACHE_CONFIG.MEDIUM.TTL,
      params: { limit, period }
    });
  }

  /**
   * Get services by provider
   * @param providerId - Service provider ID
   * @param filters - Optional filters
   * @returns Paged result of services
   */
  async getServicesByProvider(providerId: string, filters?: Partial<ServiceFilters>): Promise<PagedResult<ServiceDto>> {
    return this.get<PagedResult<ServiceDto>>(`${this.endpoint}/provider/${providerId}`, {
      cache: true,
      cacheTTL: CACHE_CONFIG.MEDIUM.TTL,
      params: filters as Record<string, string | number | boolean>
    });
  }

  /**
   * Get emergency services
   * @param latitude - Optional latitude for location-based search
   * @param longitude - Optional longitude for location-based search
   * @returns Array of emergency services
   */
  async getEmergencyServices(latitude?: number, longitude?: number): Promise<ServiceDto[]> {
    const params: Record<string, number> = {};
    if (latitude !== undefined) params.latitude = latitude;
    if (longitude !== undefined) params.longitude = longitude;

    return this.get<ServiceDto[]>(`${this.endpoint}/emergency`, {
      cache: true,
      cacheTTL: CACHE_CONFIG.SHORT.TTL,
      params
    });
  }

  /**
   * Bulk update services
   * @param serviceIds - Array of service IDs
   * @param updates - Update data
   */
  async bulkUpdate(serviceIds: string[], updates: Partial<UpdateServiceRequest>): Promise<void> {
    await this.post<void>(`${this.endpoint}/bulk-update`, { serviceIds, updates });
    serviceCacheInvalidation.onServiceUpdate();
  }

  /**
   * Bulk delete services
   * @param serviceIds - Array of service IDs
   */
  async bulkDelete(serviceIds: string[]): Promise<void> {
    await this.post<void>(`${this.endpoint}/bulk-delete`, { serviceIds });
    serviceCacheInvalidation.onServiceDelete();
  }

  /**
   * Export services to CSV
   * @param filters - Optional filters
   * @returns Blob containing CSV data
   */
  async exportServices(filters?: ServiceFilters): Promise<Blob> {
    const params = filters ? { ...filters, format: 'csv' } : { format: 'csv' };
    const response = await this.get<Blob>(`${this.endpoint}/export`, {
      params: params as Record<string, string | number | boolean>
    });
    return response;
  }

  /**
   * Get service availability
   * @param serviceId - Service ID
   * @param fromDate - Start date
   * @param toDate - End date
   * @returns Service availability data
   */
  async getServiceAvailability(serviceId: string, fromDate: Date, toDate: Date): Promise<any> {
    return this.get<any>(`${this.endpoint}/${serviceId}/availability`, {
      cache: true,
      cacheTTL: CACHE_CONFIG.SHORT.TTL,
      params: {
        fromDate: fromDate.toISOString(),
        toDate: toDate.toISOString()
      }
    });
  }

  /**
   * Get service bookings
   * @param serviceId - Service ID
   * @param filters - Optional filters
   * @returns Paged result of bookings
   */
  async getServiceBookings(serviceId: string, filters?: any): Promise<PagedResult<any>> {
    return this.get<PagedResult<any>>(`${this.endpoint}/${serviceId}/bookings`, {
      cache: true,
      cacheTTL: CACHE_CONFIG.SHORT.TTL,
      params: filters as Record<string, string | number | boolean>
    });
  }
}

// Export singleton instance
export const serviceApiService = new ServiceApiService();
