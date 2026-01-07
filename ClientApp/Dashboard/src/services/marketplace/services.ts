import { apiClient } from '../api';
import { API_ENDPOINTS } from '../../config/api';
import type { ApiResult } from '../api';

export interface MarketplaceService {
  id: string;
  serviceProviderId: string;
  name: string;
  title: string;
  description: string;
  shortDescription: string;
  basePrice: number;
  maxPrice?: number;
  estimatedDuration: number;
  maxDuration?: number;
  serviceType: 'Maintenance' | 'Repair' | 'Installation' | 'Inspection' | 'Emergency' | 'Consultation';
  category: string;
  subCategory?: string;
  status: 'Active' | 'Inactive' | 'Suspended' | 'UnderReview';
  isActive: boolean;
  isPopular: boolean;
  requiresApproval: boolean;
  requirements?: string;
  inclusions?: string;
  exclusions?: string;
  tags?: string;
  sortOrder: number;
  averageRating: number;
  totalReviews: number;
  totalBookings: number;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceFilters {
  page?: number;
  pageSize?: number;
  searchTerm?: string;
  type?: string;
  minPrice?: number;
  maxPrice?: number;
  isEmergencyService?: boolean;
  isAvailable24x7?: boolean;
  minRating?: number;
  sortBy?: string;
  sortDescending?: boolean;
}

export interface ServiceProvider {
  id: string;
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  isVerified: boolean;
  isActive: boolean;
  rating: number;
  totalReviews: number;
  totalServices: number;
  joinedDate: string;
}

export interface ServiceBooking {
  id: string;
  bookingNumber: string;
  serviceId: string;
  customerId: string;
  serviceProviderId: string;
  scheduledDate: string;
  scheduledTime: string;
  status: 'Pending' | 'Confirmed' | 'InProgress' | 'Completed' | 'Cancelled' | 'Rescheduled';
  totalAmount: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export class MarketplaceServicesService {
  async getServices(filters?: ServiceFilters): Promise<ApiResult<{ items: MarketplaceService[]; totalCount: number }>> {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }

    const url = params.toString() 
      ? `${API_ENDPOINTS.SERVICES.BASE}?${params}`
      : API_ENDPOINTS.SERVICES.BASE;

    return apiClient.get(url);
  }

  async getService(id: string): Promise<ApiResult<MarketplaceService>> {
    return apiClient.get(`${API_ENDPOINTS.SERVICES.BASE}/${id}`);
  }

  async createService(serviceData: Partial<MarketplaceService>, serviceProviderId: string): Promise<ApiResult<MarketplaceService>> {
    return apiClient.post(`${API_ENDPOINTS.SERVICES.BASE}?serviceProviderId=${serviceProviderId}`, serviceData);
  }

  async updateService(id: string, serviceData: Partial<MarketplaceService>): Promise<ApiResult<MarketplaceService>> {
    return apiClient.put(`${API_ENDPOINTS.SERVICES.BASE}/${id}`, serviceData);
  }

  async deleteService(id: string): Promise<ApiResult<void>> {
    return apiClient.delete(`${API_ENDPOINTS.SERVICES.BASE}/${id}`);
  }

  async searchByLocation(latitude: number, longitude: number, radiusKm: number = 10, pageNumber: number = 1, pageSize: number = 10): Promise<ApiResult<any>> {
    return apiClient.get(`${API_ENDPOINTS.SERVICES.LOCATION}?latitude=${latitude}&longitude=${longitude}&radiusKm=${radiusKm}&pageNumber=${pageNumber}&pageSize=${pageSize}`);
  }

  async getServicesByProvider(providerId: string, pageNumber: number = 1, pageSize: number = 10): Promise<ApiResult<any>> {
    return apiClient.get(`${API_ENDPOINTS.SERVICES.BASE}/provider/${providerId}?pageNumber=${pageNumber}&pageSize=${pageSize}`);
  }

  async getServiceProviders(filters?: any): Promise<ApiResult<{ items: ServiceProvider[]; totalCount: number }>> {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }

    const url = params.toString() 
      ? `${API_ENDPOINTS.SERVICES.PROVIDERS}?${params}`
      : API_ENDPOINTS.SERVICES.PROVIDERS;

    return apiClient.get(url);
  }

  async getServiceProvider(id: string): Promise<ApiResult<ServiceProvider>> {
    return apiClient.get(`${API_ENDPOINTS.SERVICES.PROVIDERS}/${id}`);
  }

  async createServiceProvider(providerData: Partial<ServiceProvider>): Promise<ApiResult<ServiceProvider>> {
    return apiClient.post(API_ENDPOINTS.SERVICES.PROVIDERS, providerData);
  }

  async updateServiceProvider(id: string, providerData: Partial<ServiceProvider>): Promise<ApiResult<ServiceProvider>> {
    return apiClient.put(`${API_ENDPOINTS.SERVICES.PROVIDERS}/${id}`, providerData);
  }

  async deleteServiceProvider(id: string): Promise<ApiResult<void>> {
    return apiClient.delete(`${API_ENDPOINTS.SERVICES.PROVIDERS}/${id}`);
  }

  async getServiceBookings(filters?: any): Promise<ApiResult<{ items: ServiceBooking[]; totalCount: number }>> {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (value instanceof Date) {
            params.append(key, value.toISOString());
          } else {
            params.append(key, value.toString());
          }
        }
      });
    }

    const url = params.toString() 
      ? `${API_ENDPOINTS.SERVICES.BOOKINGS}?${params}`
      : API_ENDPOINTS.SERVICES.BOOKINGS;

    return apiClient.get(url);
  }

  async getServiceBooking(id: string): Promise<ApiResult<ServiceBooking>> {
    return apiClient.get(`${API_ENDPOINTS.SERVICES.BOOKINGS}/${id}`);
  }

  async createServiceBooking(bookingData: Partial<ServiceBooking>): Promise<ApiResult<ServiceBooking>> {
    return apiClient.post(API_ENDPOINTS.SERVICES.BOOKINGS, bookingData);
  }

  async updateServiceBooking(id: string, bookingData: Partial<ServiceBooking>): Promise<ApiResult<ServiceBooking>> {
    return apiClient.put(`${API_ENDPOINTS.SERVICES.BOOKINGS}/${id}`, bookingData);
  }

  async updateBookingStatus(id: string, status: string): Promise<ApiResult<void>> {
    return apiClient.patch(`${API_ENDPOINTS.SERVICES.BOOKINGS}/${id}/status`, { status });
  }

  async cancelServiceBooking(id: string, reason?: string): Promise<ApiResult<void>> {
    return apiClient.post(`${API_ENDPOINTS.SERVICES.BOOKINGS}/${id}/cancel`, { reason });
  }

  async getServiceCategories(): Promise<ApiResult<any[]>> {
    return apiClient.get(API_ENDPOINTS.SERVICES.CATEGORIES);
  }

  async createServiceCategory(categoryData: any): Promise<ApiResult<any>> {
    return apiClient.post(API_ENDPOINTS.SERVICES.CATEGORIES, categoryData);
  }

  async updateServiceCategory(id: string, categoryData: any): Promise<ApiResult<any>> {
    return apiClient.put(`${API_ENDPOINTS.SERVICES.CATEGORIES}/${id}`, categoryData);
  }

  async deleteServiceCategory(id: string): Promise<ApiResult<void>> {
    return apiClient.delete(`${API_ENDPOINTS.SERVICES.CATEGORIES}/${id}`);
  }

  async getServiceReviews(serviceId: string, page: number = 1, pageSize: number = 10): Promise<ApiResult<any>> {
    return apiClient.get(`${API_ENDPOINTS.SERVICES.REVIEWS}/${serviceId}?page=${page}&pageSize=${pageSize}`);
  }

  async createServiceReview(reviewData: any): Promise<ApiResult<any>> {
    return apiClient.post(API_ENDPOINTS.SERVICES.REVIEWS, reviewData);
  }

  async updateServiceReview(id: string, reviewData: any): Promise<ApiResult<any>> {
    return apiClient.put(`${API_ENDPOINTS.SERVICES.REVIEWS}/${id}`, reviewData);
  }

  async deleteServiceReview(id: string): Promise<ApiResult<void>> {
    return apiClient.delete(`${API_ENDPOINTS.SERVICES.REVIEWS}/${id}`);
  }

  async getPopularServices(limit: number = 10): Promise<ApiResult<MarketplaceService[]>> {
    return apiClient.get(`${API_ENDPOINTS.SERVICES.BASE}/popular?limit=${limit}`);
  }

  async getFeaturedServices(limit: number = 10): Promise<ApiResult<MarketplaceService[]>> {
    return apiClient.get(`${API_ENDPOINTS.SERVICES.BASE}/featured?limit=${limit}`);
  }

  async getServiceAvailability(serviceId: string, date?: string): Promise<ApiResult<any>> {
    const url = date 
      ? `${API_ENDPOINTS.SERVICES.BASE}/${serviceId}/availability?date=${date}`
      : `${API_ENDPOINTS.SERVICES.BASE}/${serviceId}/availability`;
    
    return apiClient.get(url);
  }

  async updateServiceAvailability(serviceId: string, availabilityData: any): Promise<ApiResult<any>> {
    return apiClient.put(`${API_ENDPOINTS.SERVICES.BASE}/${serviceId}/availability`, availabilityData);
  }

  async searchServices(query: string, filters?: any): Promise<ApiResult<MarketplaceService[]>> {
    const params = new URLSearchParams();
    params.append('q', query);
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }

    return apiClient.get(`${API_ENDPOINTS.SERVICES.SEARCH}?${params}`);
  }

  async getServiceAnalytics(serviceId: string, period: string = '30d'): Promise<ApiResult<any>> {
    return apiClient.get(`${API_ENDPOINTS.SERVICES.BASE}/${serviceId}/analytics?period=${period}`);
  }

  async getProviderAnalytics(providerId: string, period: string = '30d'): Promise<ApiResult<any>> {
    return apiClient.get(`${API_ENDPOINTS.SERVICES.PROVIDERS}/${providerId}/analytics?period=${period}`);
  }
}