/**
 * ServiceProviderService (Angular)
 * Service for managing service provider API calls in the Main App
 */

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ServiceProviderDto, PagedResult } from '../models';
import { environment } from '../../../../environments/environment';

/**
 * Filter parameters for service provider queries
 */
export interface ServiceProviderFilters {
  /** Page number for pagination */
  page?: number;
  /** Page size for pagination */
  pageSize?: number;
  /** Search term for name/description */
  searchTerm?: string;
  /** Filter by location/city */
  city?: string;
  /** Filter by location/address */
  location?: string;
  /** Minimum rating filter */
  minRating?: number;
  /** Filter verified providers */
  isVerified?: boolean;
  /** Filter active providers */
  isActive?: boolean;
  /** Filter by services offered (comma-separated service IDs) */
  servicesOffered?: string;
  /** Sort field */
  sortBy?: string;
  /** Sort descending */
  sortDescending?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ServiceProviderService {
  private readonly apiUrl = `${environment.apiUrl}/api/service-providers`;

  constructor(private http: HttpClient) {}

  /**
   * Get service providers with optional filtering and pagination
   * @param filters - Filter parameters
   * @returns Observable of paged service provider results
   */
  getServiceProviders(filters?: ServiceProviderFilters): Observable<PagedResult<ServiceProviderDto>> {
    const params = this.buildParams(filters);
    
    return this.http.get<PagedResult<ServiceProviderDto>>(this.apiUrl, { params }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Get a single service provider by ID
   * @param id - Service provider ID
   * @returns Observable of service provider
   */
  getServiceProvider(id: string): Observable<ServiceProviderDto> {
    return this.http.get<ServiceProviderDto>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Search service providers by location
   * @param latitude - Latitude coordinate
   * @param longitude - Longitude coordinate
   * @param radiusKm - Search radius in kilometers
   * @param filters - Additional filters
   * @returns Observable of paged service provider results
   */
  searchByLocation(
    latitude: number,
    longitude: number,
    radiusKm: number = 10,
    filters?: Partial<ServiceProviderFilters>
  ): Observable<PagedResult<ServiceProviderDto>> {
    let params = new HttpParams()
      .set('latitude', latitude.toString())
      .set('longitude', longitude.toString())
      .set('radiusKm', radiusKm.toString());

    if (filters) {
      params = this.addFiltersToParams(params, filters);
    }

    return this.http.get<PagedResult<ServiceProviderDto>>(`${this.apiUrl}/search/location`, { params }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Get verified service providers
   * @param limit - Maximum number of providers to return
   * @returns Observable of service provider array
   */
  getVerifiedProviders(limit: number = 10): Observable<ServiceProviderDto[]> {
    const filters: ServiceProviderFilters = {
      isVerified: true,
      isActive: true,
      pageSize: limit,
      page: 1,
      sortBy: 'rating',
      sortDescending: true
    };
    
    return this.getServiceProviders(filters).pipe(
      map(result => result.items)
    );
  }

  /**
   * Get top-rated service providers
   * @param limit - Maximum number of providers to return
   * @returns Observable of service provider array
   */
  getTopRatedProviders(limit: number = 10): Observable<ServiceProviderDto[]> {
    const filters: ServiceProviderFilters = {
      isActive: true,
      minRating: 4.0,
      pageSize: limit,
      page: 1,
      sortBy: 'rating',
      sortDescending: true
    };
    
    return this.getServiceProviders(filters).pipe(
      map(result => result.items)
    );
  }

  /**
   * Get service providers by city
   * @param city - City name
   * @param filters - Additional filters
   * @returns Observable of paged service provider results
   */
  getProvidersByCity(city: string, filters?: ServiceProviderFilters): Observable<PagedResult<ServiceProviderDto>> {
    const cityFilters: ServiceProviderFilters = {
      ...filters,
      city
    };
    
    return this.getServiceProviders(cityFilters);
  }

  /**
   * Build HTTP params from filters
   * @param filters - Filter parameters
   * @returns HttpParams object
   */
  private buildParams(filters?: ServiceProviderFilters): HttpParams {
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
  private addFiltersToParams(params: HttpParams, filters: Partial<ServiceProviderFilters>): HttpParams {
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

    // Location
    if (filters.city) {
      params = params.set('city', filters.city);
    }
    if (filters.location) {
      params = params.set('location', filters.location);
    }

    // Rating
    if (filters.minRating !== undefined) {
      params = params.set('minRating', filters.minRating.toString());
    }

    // Boolean filters
    if (filters.isVerified !== undefined) {
      params = params.set('isVerified', filters.isVerified.toString());
    }
    if (filters.isActive !== undefined) {
      params = params.set('isActive', filters.isActive.toString());
    }

    // Services offered
    if (filters.servicesOffered) {
      params = params.set('servicesOffered', filters.servicesOffered);
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
    let errorMessage = 'An error occurred while fetching service providers';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }

    console.error('ServiceProviderService Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
