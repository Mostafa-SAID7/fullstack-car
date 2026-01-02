import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { PaginatedResult } from '../../../core/models/pagination.model';
import {
  ServiceProvider,
  CarService,
  ServiceBooking,
  CreateServiceProviderRequest,
  UpdateServiceProviderRequest,
  CreateCarServiceRequest,
  CreateBookingRequest,
  MarketplaceFilters,
  BookingFilters
} from '../models/marketplace.model';

@Injectable({
  providedIn: 'root'
})
export class MarketplaceService {
  private readonly apiUrl = `${environment.apiUrl}/v6/marketplace`;

  constructor(private http: HttpClient) {}

  // Service Provider APIs
  getServiceProviders(filters?: MarketplaceFilters, pageNumber = 1, pageSize = 10): Observable<{ success: boolean; data: PaginatedResult<ServiceProvider>; message: string }> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    if (filters) {
      if (filters.searchTerm) params = params.set('searchTerm', filters.searchTerm);
      if (filters.serviceType) params = params.set('serviceType', filters.serviceType);
      if (filters.minRating) params = params.set('minRating', filters.minRating.toString());
      if (filters.latitude) params = params.set('latitude', filters.latitude.toString());
      if (filters.longitude) params = params.set('longitude', filters.longitude.toString());
      if (filters.radiusKm) params = params.set('radiusKm', filters.radiusKm.toString());
      if (filters.sortBy) params = params.set('sortBy', filters.sortBy);
      if (filters.sortDescending !== undefined) params = params.set('sortDescending', filters.sortDescending.toString());
    }

    return this.http.get<{ success: boolean; data: PaginatedResult<ServiceProvider>; message: string }>(`${this.apiUrl}/service-providers`, { params });
  }

  getServiceProvider(id: string): Observable<{ success: boolean; data: ServiceProvider; message: string }> {
    return this.http.get<{ success: boolean; data: ServiceProvider; message: string }>(`${this.apiUrl}/service-providers/${id}`);
  }

  createServiceProvider(request: CreateServiceProviderRequest): Observable<{ success: boolean; data: ServiceProvider; message: string }> {
    return this.http.post<{ success: boolean; data: ServiceProvider; message: string }>(`${this.apiUrl}/service-providers`, request);
  }

  updateServiceProvider(id: string, request: UpdateServiceProviderRequest): Observable<{ success: boolean; data: ServiceProvider; message: string }> {
    return this.http.put<{ success: boolean; data: ServiceProvider; message: string }>(`${this.apiUrl}/service-providers/${id}`, request);
  }

  deleteServiceProvider(id: string): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.apiUrl}/service-providers/${id}`);
  }

  getMyServiceProviders(pageNumber = 1, pageSize = 10): Observable<{ success: boolean; data: PaginatedResult<ServiceProvider>; message: string }> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<{ success: boolean; data: PaginatedResult<ServiceProvider>; message: string }>(`${this.apiUrl}/service-providers/my-providers`, { params });
  }

  // Car Service APIs
  getServices(filters?: MarketplaceFilters, pageNumber = 1, pageSize = 10): Observable<{ success: boolean; data: PaginatedResult<CarService>; message: string }> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    if (filters) {
      if (filters.searchTerm) params = params.set('searchTerm', filters.searchTerm);
      if (filters.serviceType) params = params.set('type', filters.serviceType);
      if (filters.minPrice) params = params.set('minPrice', filters.minPrice.toString());
      if (filters.maxPrice) params = params.set('maxPrice', filters.maxPrice.toString());
      if (filters.isEmergencyService !== undefined) params = params.set('isEmergencyService', filters.isEmergencyService.toString());
      if (filters.isAvailable24x7 !== undefined) params = params.set('isAvailable24x7', filters.isAvailable24x7.toString());
      if (filters.minRating) params = params.set('minRating', filters.minRating.toString());
      if (filters.sortBy) params = params.set('sortBy', filters.sortBy);
      if (filters.sortDescending !== undefined) params = params.set('sortDescending', filters.sortDescending.toString());
    }

    return this.http.get<{ success: boolean; data: PaginatedResult<CarService>; message: string }>(`${this.apiUrl}/services`, { params });
  }

  getService(id: string): Observable<{ success: boolean; data: CarService; message: string }> {
    return this.http.get<{ success: boolean; data: CarService; message: string }>(`${this.apiUrl}/services/${id}`);
  }

  createService(serviceProviderId: string, request: CreateCarServiceRequest): Observable<{ success: boolean; data: CarService; message: string }> {
    const params = new HttpParams().set('serviceProviderId', serviceProviderId);
    return this.http.post<{ success: boolean; data: CarService; message: string }>(`${this.apiUrl}/services`, request, { params });
  }

  updateService(id: string, request: CreateCarServiceRequest): Observable<{ success: boolean; data: CarService; message: string }> {
    return this.http.put<{ success: boolean; data: CarService; message: string }>(`${this.apiUrl}/services/${id}`, request);
  }

  deleteService(id: string): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.apiUrl}/services/${id}`);
  }

  getServicesByProvider(providerId: string, pageNumber = 1, pageSize = 10): Observable<{ success: boolean; data: PaginatedResult<CarService>; message: string }> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<{ success: boolean; data: PaginatedResult<CarService>; message: string }>(`${this.apiUrl}/services/provider/${providerId}`, { params });
  }

  searchServicesByLocation(latitude: number, longitude: number, radiusKm = 10, pageNumber = 1, pageSize = 10): Observable<{ success: boolean; data: PaginatedResult<CarService>; message: string }> {
    const params = new HttpParams()
      .set('latitude', latitude.toString())
      .set('longitude', longitude.toString())
      .set('radiusKm', radiusKm.toString())
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<{ success: boolean; data: PaginatedResult<CarService>; message: string }>(`${this.apiUrl}/services/search/location`, { params });
  }

  // Booking APIs
  getMyBookings(filters?: BookingFilters, pageNumber = 1, pageSize = 10): Observable<{ success: boolean; data: PaginatedResult<ServiceBooking>; message: string }> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    if (filters) {
      if (filters.status) params = params.set('status', filters.status);
      if (filters.fromDate) params = params.set('fromDate', filters.fromDate);
      if (filters.toDate) params = params.set('toDate', filters.toDate);
    }

    return this.http.get<{ success: boolean; data: PaginatedResult<ServiceBooking>; message: string }>(`${this.apiUrl}/bookings`, { params });
  }

  getBooking(id: string): Observable<{ success: boolean; data: ServiceBooking; message: string }> {
    return this.http.get<{ success: boolean; data: ServiceBooking; message: string }>(`${this.apiUrl}/bookings/${id}`);
  }

  createBooking(request: CreateBookingRequest): Observable<{ success: boolean; data: ServiceBooking; message: string }> {
    return this.http.post<{ success: boolean; data: ServiceBooking; message: string }>(`${this.apiUrl}/bookings`, request);
  }

  cancelBooking(id: string, reason?: string): Observable<{ success: boolean; data: ServiceBooking; message: string }> {
    const body = { cancellationReason: reason };
    return this.http.post<{ success: boolean; data: ServiceBooking; message: string }>(`${this.apiUrl}/bookings/${id}/cancel`, body);
  }

  confirmBooking(id: string, notes?: string): Observable<{ success: boolean; data: ServiceBooking; message: string }> {
    const body = { providerNotes: notes };
    return this.http.post<{ success: boolean; data: ServiceBooking; message: string }>(`${this.apiUrl}/bookings/${id}/confirm`, body);
  }

  completeBooking(id: string, notes?: string): Observable<{ success: boolean; data: ServiceBooking; message: string }> {
    const body = { completionNotes: notes };
    return this.http.post<{ success: boolean; data: ServiceBooking; message: string }>(`${this.apiUrl}/bookings/${id}/complete`, body);
  }

  getProviderBookings(providerId: string, filters?: BookingFilters, pageNumber = 1, pageSize = 10): Observable<{ success: boolean; data: PaginatedResult<ServiceBooking>; message: string }> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    if (filters) {
      if (filters.status) params = params.set('status', filters.status);
      if (filters.fromDate) params = params.set('fromDate', filters.fromDate);
      if (filters.toDate) params = params.set('toDate', filters.toDate);
    }

    return this.http.get<{ success: boolean; data: PaginatedResult<ServiceBooking>; message: string }>(`${this.apiUrl}/bookings/provider/${providerId}`, { params });
  }
}