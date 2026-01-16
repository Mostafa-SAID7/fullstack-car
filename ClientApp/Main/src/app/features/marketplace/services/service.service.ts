/**
 * ServiceService (Angular)
 * Service for managing service API calls in the Main App
 */

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ServiceDto, ServiceFilters, LocationSearchParams, PagedResult } from '../models';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  private readonly apiUrl = `${environment.apiUrl}/api/services`;

  constructor(private http: HttpClient) {}

  /**
   * Get services with optional filtering and pagination
   * @param filters - Filter parameters
   * @returns Observable of paged service results
   */
  getServices(filters?: ServiceFilters): Observable<PagedResult<ServiceDto>> {
    const params = this.buildParams(filters);
    
    return this.http.get<PagedResult<ServiceDto>>(this.apiUrl, { params }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Get a single service by ID
   * @param id - Service ID
   * @returns Observable of service
   */
  getService(id: string): Observable<ServiceDto> {
    return this.http.get<ServiceDto>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Search services by location
   * @param params - Location search parameters
   * @returns Observable of paged service results
   */
  searchByLocation(params: LocationSearchParams): Observable<PagedResult<ServiceDto>> {
    let httpParams = new HttpParams()
      .set('latitude', params.latitude.toString())
      .set('longitude', params.longitude.toString());

    if (params.radiusKm !== undefined) {
      httpParams = httpParams.set('radiusKm', params.radiusKm.toString());
    }

    // Add additional filters if provided
    if (params.filters) {
      httpParams = this.addFiltersToParams(httpParams, params.filters);
    }

    return this.http.get<PagedResult<ServiceDto>>(`${this.apiUrl}/search/location`, { params: httpParams }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Get popular services
   * @param limit - Maximum number of services to return
   * @returns Observable of service array
   */
  getPopularServices(limit: number = 10): Observable<ServiceDto[]> {
    const filters: ServiceFilters = {
      isPopular: true,
      pageSize: limit,
      page: 1
    };
    
    return this.getServices(filters).pipe(
      map(result => result.items)
    );
  }

  /**
   * Get emergency services
   * @param latitude - Optional latitude for location-based search
   * @param longitude - Optional longitude for location-based search
   * @returns Observable of service array
   */
  getEmergencyServices(latitude?: number, longitude?: number): Observable<ServiceDto[]> {
    if (latitude !== undefined && longitude !== undefined) {
      return this.searchByLocation({
        latitude,
        longitude,
        radiusKm: 50,
        filters: { isEmergencyService: true }
      }).pipe(
        map(result => result.items)
      );
    }

    const filters: ServiceFilters = {
      isEmergencyService: true,
      pageSize: 20,
      page: 1
    };
    
    return this.getServices(filters).pipe(
      map(result => result.items)
    );
  }

  /**
   * Get services by type
   * @param type - Service type
   * @param filters - Additional filters
   * @returns Observable of paged service results
   */
  getServicesByType(type: string, filters?: ServiceFilters): Observable<PagedResult<ServiceDto>> {
    const typeFilters: ServiceFilters = {
      ...filters,
      type: type as any
    };
    
    return this.getServices(typeFilters);
  }

  /**
   * Get services by provider
   * @param providerId - Service provider ID
   * @param filters - Additional filters
   * @returns Observable of paged service results
   */
  getServicesByProvider(providerId: string, filters?: ServiceFilters): Observable<PagedResult<ServiceDto>> {
    const providerFilters: ServiceFilters = {
      ...filters,
      serviceProviderId: providerId
    };
    
    return this.getServices(providerFilters);
  }

  /**
   * Build HTTP params from filters
   * @param filters - Filter parameters
   * @returns HttpParams object
   */
  private buildParams(filters?: ServiceFilters): HttpParams {
    let params = new HttpParams();

    if (!filters) {
      return params;
    }

    return this.addFiltersToParams(params, filters);
  }

  /**
   * Add filters to existing HttpParams
   * @param params - Existing HttpParams
   * @param filters - Filter parameters
   * @returns Updated HttpParams
   */
  private addFiltersToParams(params: HttpParams, filters: Partial<ServiceFilters>): HttpParams {
    // Pagination
    if (filters.page !== undefined) {
      params = params.set('page', filters.page.toString());
    }
    if (filters.pageSize !== undefined) {
      params = params.set('pageSize', filters.pageSize.toString());
    }

    // Search
    if (filters.searchTerm) {
      params = params.set('searchTerm', filters.searchTerm);
    }

    // Type, category, and status
    if (filters.type) {
      params = params.set('type', filters.type);
    }
    if (filters.category) {
      params = params.set('category', filters.category);
    }
    if (filters.status) {
      params = params.set('status', filters.status);
    }

    // Provider
    if (filters.serviceProviderId) {
      params = params.set('serviceProviderId', filters.serviceProviderId);
    }

    // Price range
    if (filters.minPrice !== undefined) {
      params = params.set('minPrice', filters.minPrice.toString());
    }
    if (filters.maxPrice !== undefined) {
      params = params.set('maxPrice', filters.maxPrice.toString());
    }

    // Rating
    if (filters.minRating !== undefined) {
      params = params.set('minRating', filters.minRating.toString());
    }

    // Boolean filters
    if (filters.isEmergencyService !== undefined) {
      params = params.set('isEmergencyService', filters.isEmergencyService.toString());
    }
    if (filters.isAvailable24x7 !== undefined) {
      params = params.set('isAvailable24x7', filters.isAvailable24x7.toString());
    }
    if (filters.isActive !== undefined) {
      params = params.set('isActive', filters.isActive.toString());
    }
    if (filters.isPopular !== undefined) {
      params = params.set('isPopular', filters.isPopular.toString());
    }

    // Sorting
    if (filters.sortBy) {
      params = params.set('sortBy', filters.sortBy);
    }
    if (filters.sortDescending !== undefined) {
      params = params.set('sortDescending', filters.sortDescending.toString());
    }

    return params;
  }

  /**
   * Handle HTTP errors
   * @param error - Error object
   * @returns Observable error
   */
  private handleError(error: any): Observable<never> {
    let errorMessage = 'An error occurred while fetching services';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }

    console.error('ServiceService Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
