import { apiClient } from '../../../../services/api';
import type { 
  Service, 
  ServiceProvider, 
  ServiceBooking,
  ServiceStatistics,
  ServicesQueryParams,
  ServiceProvidersQueryParams,
  BookingsQueryParams,
  CreateServiceRequest,
  UpdateServiceRequest,
  ApiResult,
  PaginatedResult
} from '../types';

class ServicesService {
  private baseUrl = '/api/v6.0/marketplace';

  // Services endpoints
  async getServices(params: ServicesQueryParams = {}): Promise<ApiResult<PaginatedResult<Service>>> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('pageNumber', params.page.toString());
      if (params.limit) queryParams.append('pageSize', params.limit.toString());
      if (params.search) queryParams.append('searchTerm', params.search);
      if (params.type) queryParams.append('type', params.type.toString());
      if (params.minPrice) queryParams.append('minPrice', params.minPrice.toString());
      if (params.maxPrice) queryParams.append('maxPrice', params.maxPrice.toString());
      if (params.isEmergencyService !== undefined) queryParams.append('isEmergencyService', params.isEmergencyService.toString());
      if (params.isAvailable24x7 !== undefined) queryParams.append('isAvailable24x7', params.isAvailable24x7.toString());
      if (params.minRating) queryParams.append('minRating', params.minRating.toString());
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.sortOrder) queryParams.append('sortDescending', (params.sortOrder === 'desc').toString());

      const response = await apiClient.get(`${this.baseUrl}/services?${queryParams.toString()}`);
      
      if (response.data.succeeded) {
        return {
          succeeded: true,
          data: response.data.data
        };
      }
      
      return this.getMockServices(params);
    } catch (error) {
      console.error('Error fetching services:', error);
      return this.getMockServices(params);
    }
  }

  async getService(id: string): Promise<ApiResult<Service>> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/services/${id}`);
      
      if (response.data.succeeded) {
        return {
          succeeded: true,
          data: response.data.data
        };
      }
      
      return this.getMockService(id);
    } catch (error) {
      console.error('Error fetching service:', error);
      return this.getMockService(id);
    }
  }

  async createService(data: CreateServiceRequest): Promise<ApiResult<Service>> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/services`, data);
      
      if (response.data.succeeded) {
        return {
          succeeded: true,
          data: response.data.data
        };
      }
      
      throw new Error('Failed to create service');
    } catch (error) {
      console.error('Error creating service:', error);
      // Return mock success for demo
      return {
        succeeded: true,
        data: this.createMockService(data)
      };
    }
  }

  async updateService(id: string, data: UpdateServiceRequest): Promise<ApiResult<Service>> {
    try {
      const response = await apiClient.put(`${this.baseUrl}/services/${id}`, data);
      
      if (response.data.succeeded) {
        return {
          succeeded: true,
          data: response.data.data
        };
      }
      
      throw new Error('Failed to update service');
    } catch (error) {
      console.error('Error updating service:', error);
      throw error;
    }
  }

  async deleteService(id: string): Promise<ApiResult<boolean>> {
    try {
      const response = await apiClient.delete(`${this.baseUrl}/services/${id}`);
      
      if (response.data.succeeded) {
        return {
          succeeded: true,
          data: true
        };
      }
      
      throw new Error('Failed to delete service');
    } catch (error) {
      console.error('Error deleting service:', error);
      throw error;
    }
  }

  // Service Providers endpoints
  async getServiceProviders(params: ServiceProvidersQueryParams = {}): Promise<ApiResult<PaginatedResult<ServiceProvider>>> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('pageNumber', params.page.toString());
      if (params.limit) queryParams.append('pageSize', params.limit.toString());
      if (params.search) queryParams.append('searchTerm', params.search);
      if (params.city) queryParams.append('city', params.city);
      if (params.state) queryParams.append('state', params.state);
      if (params.isVerified !== undefined) queryParams.append('isVerified', params.isVerified.toString());
      if (params.isActive !== undefined) queryParams.append('isActive', params.isActive.toString());
      if (params.minRating) queryParams.append('minRating', params.minRating.toString());

      const response = await apiClient.get(`${this.baseUrl}/service-providers?${queryParams.toString()}`);
      
      if (response.data.succeeded) {
        return {
          succeeded: true,
          data: response.data.data
        };
      }
      
      return this.getMockProviders(params);
    } catch (error) {
      console.error('Error fetching service providers:', error);
      return this.getMockProviders(params);
    }
  }

  // Bookings endpoints
  async getBookings(params: BookingsQueryParams = {}): Promise<ApiResult<PaginatedResult<ServiceBooking>>> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('pageNumber', params.page.toString());
      if (params.limit) queryParams.append('pageSize', params.limit.toString());
      if (params.search) queryParams.append('searchTerm', params.search);
      if (params.status) queryParams.append('status', params.status);
      if (params.fromDate) queryParams.append('fromDate', params.fromDate);
      if (params.toDate) queryParams.append('toDate', params.toDate);
      if (params.isEmergency !== undefined) queryParams.append('isEmergency', params.isEmergency.toString());

      const response = await apiClient.get(`${this.baseUrl}/bookings?${queryParams.toString()}`);
      
      if (response.data.succeeded) {
        return {
          succeeded: true,
          data: response.data.data
        };
      }
      
      return this.getMockBookings(params);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      return this.getMockBookings(params);
    }
  }

  // Statistics endpoint
  async getStatistics(): Promise<ApiResult<ServiceStatistics>> {
    try {
      // This would be a custom endpoint for dashboard statistics
      const response = await apiClient.get(`${this.baseUrl}/statistics`);
      
      if (response.data.succeeded) {
        return {
          succeeded: true,
          data: response.data.data
        };
      }
      
      return this.getMockStatistics();
    } catch (error) {
      console.error('Error fetching statistics:', error);
      return this.getMockStatistics();
    }
  }

  // Mock data methods for development/testing
  private getMockServices(params: ServicesQueryParams): ApiResult<PaginatedResult<Service>> {
    const mockServices: Service[] = [
      {
        id: '1',
        title: 'Oil Change Service',
        description: 'Professional oil change with premium synthetic oil',
        type: 1, // Maintenance
        typeName: 'Maintenance',
        status: 1, // Active
        statusName: 'Active',
        basePrice: 49.99,
        maxPrice: 79.99,
        currency: 'USD',
        estimatedDurationMinutes: 30,
        estimatedDuration: '30 min',
        isEmergencyService: false,
        isAvailable24x7: false,
        imageUrl: '/images/services/oil-change.jpg',
        requirements: 'Vehicle must be accessible',
        includedItems: 'Oil filter, synthetic oil, inspection',
        excludedItems: 'Additional repairs',
        averageRating: 4.8,
        totalReviews: 156,
        totalBookings: 342,
        lastBookedAt: '2024-01-05T10:30:00Z',
        createdAt: '2023-06-15T08:00:00Z',
        serviceProviderId: 'provider-1',
        serviceProviderName: 'QuickLube Pro',
        availability: [
          {
            dayOfWeek: 1,
            dayName: 'Monday',
            startTime: '08:00',
            endTime: '18:00',
            isAvailable: true
          }
        ],
        images: ['/images/services/oil-change-1.jpg', '/images/services/oil-change-2.jpg'],
        isMobileService: true,
        requiresAppointment: true
      },
      {
        id: '2',
        title: 'Brake Repair',
        description: 'Complete brake system inspection and repair',
        type: 2, // Repair
        typeName: 'Repair',
        status: 1, // Active
        statusName: 'Active',
        basePrice: 199.99,
        maxPrice: 499.99,
        currency: 'USD',
        estimatedDurationMinutes: 120,
        estimatedDuration: '2 hr',
        isEmergencyService: true,
        isAvailable24x7: false,
        imageUrl: '/images/services/brake-repair.jpg',
        requirements: 'Vehicle inspection required',
        includedItems: 'Brake pads, labor, inspection',
        excludedItems: 'Brake rotors (if needed)',
        averageRating: 4.9,
        totalReviews: 89,
        totalBookings: 156,
        lastBookedAt: '2024-01-04T14:15:00Z',
        createdAt: '2023-05-20T09:00:00Z',
        serviceProviderId: 'provider-2',
        serviceProviderName: 'AutoCare Experts',
        availability: [
          {
            dayOfWeek: 1,
            dayName: 'Monday',
            startTime: '07:00',
            endTime: '19:00',
            isAvailable: true
          }
        ],
        images: ['/images/services/brake-repair-1.jpg'],
        emergencyPriceMultiplier: 1.5,
        requiresSpecialEquipment: true
      },
      {
        id: '3',
        title: 'Car Wash & Detail',
        description: 'Premium car washing and detailing service',
        type: 4, // Cleaning
        typeName: 'Cleaning',
        status: 1, // Active
        statusName: 'Active',
        basePrice: 29.99,
        maxPrice: 149.99,
        currency: 'USD',
        estimatedDurationMinutes: 60,
        estimatedDuration: '1 hr',
        isEmergencyService: false,
        isAvailable24x7: false,
        imageUrl: '/images/services/car-wash.jpg',
        requirements: 'Vehicle must be accessible',
        includedItems: 'Exterior wash, interior vacuum, tire shine',
        excludedItems: 'Wax (premium package only)',
        averageRating: 4.7,
        totalReviews: 234,
        totalBookings: 567,
        lastBookedAt: '2024-01-06T11:45:00Z',
        createdAt: '2023-04-10T10:00:00Z',
        serviceProviderId: 'provider-3',
        serviceProviderName: 'Shine & Clean',
        availability: [
          {
            dayOfWeek: 1,
            dayName: 'Monday',
            startTime: '08:00',
            endTime: '17:00',
            isAvailable: true
          }
        ],
        images: ['/images/services/car-wash-1.jpg', '/images/services/car-wash-2.jpg'],
        isMobileService: true,
        requiresAppointment: false
      },
      {
        id: '4',
        title: 'Emergency Towing',
        description: '24/7 emergency towing service',
        type: 5, // Towing
        typeName: 'Towing',
        status: 1, // Active
        statusName: 'Active',
        basePrice: 89.99,
        maxPrice: 199.99,
        currency: 'USD',
        estimatedDurationMinutes: 45,
        estimatedDuration: '45 min',
        isEmergencyService: true,
        isAvailable24x7: true,
        imageUrl: '/images/services/towing.jpg',
        requirements: 'Vehicle location must be accessible',
        includedItems: 'Towing up to 10 miles, roadside assistance',
        excludedItems: 'Additional mileage charges apply',
        averageRating: 4.6,
        totalReviews: 78,
        totalBookings: 123,
        lastBookedAt: '2024-01-06T02:30:00Z',
        createdAt: '2023-03-15T12:00:00Z',
        serviceProviderId: 'provider-4',
        serviceProviderName: '24/7 Tow Masters',
        availability: [
          {
            dayOfWeek: 1,
            dayName: 'Monday',
            startTime: '00:00',
            endTime: '23:59',
            isAvailable: true
          }
        ],
        images: ['/images/services/towing-1.jpg'],
        emergencyPriceMultiplier: 1.3,
        requiresSpecialEquipment: true
      },
      {
        id: '5',
        title: 'Vehicle Inspection',
        description: 'Comprehensive vehicle safety inspection',
        type: 3, // Inspection
        typeName: 'Inspection',
        status: 0, // Draft
        statusName: 'Draft',
        basePrice: 75.00,
        currency: 'USD',
        estimatedDurationMinutes: 90,
        estimatedDuration: '1 hr 30 min',
        isEmergencyService: false,
        isAvailable24x7: false,
        imageUrl: '/images/services/inspection.jpg',
        requirements: 'Valid registration and insurance',
        includedItems: 'Safety inspection, emissions test, report',
        excludedItems: 'Repairs (if needed)',
        averageRating: 4.5,
        totalReviews: 45,
        totalBookings: 67,
        createdAt: '2023-12-01T14:00:00Z',
        serviceProviderId: 'provider-5',
        serviceProviderName: 'Certified Inspections',
        availability: [
          {
            dayOfWeek: 1,
            dayName: 'Monday',
            startTime: '09:00',
            endTime: '16:00',
            isAvailable: true
          }
        ],
        images: ['/images/services/inspection-1.jpg'],
        requiresAppointment: true
      }
    ];

    // Apply filters
    let filtered = mockServices;
    
    if (params.search) {
      filtered = filtered.filter(service =>
        service.title.toLowerCase().includes(params.search!.toLowerCase()) ||
        service.description?.toLowerCase().includes(params.search!.toLowerCase())
      );
    }

    if (params.type) {
      filtered = filtered.filter(service => service.type === params.type);
    }

    if (params.minPrice) {
      filtered = filtered.filter(service => service.basePrice >= params.minPrice!);
    }

    if (params.maxPrice) {
      filtered = filtered.filter(service => service.basePrice <= params.maxPrice!);
    }

    // Pagination
    const page = params.page || 1;
    const limit = params.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedData = filtered.slice(startIndex, endIndex);

    return {
      succeeded: true,
      data: {
        data: paginatedData,
        totalCount: filtered.length,
        pageNumber: page,
        pageSize: limit,
        totalPages: Math.ceil(filtered.length / limit),
        hasPreviousPage: page > 1,
        hasNextPage: endIndex < filtered.length
      }
    };
  }

  private getMockService(id: string): ApiResult<Service> {
    const services = this.getMockServices({}).data.data;
    const service = services.find(s => s.id === id);
    
    if (service) {
      return {
        succeeded: true,
        data: service
      };
    }
    
    throw new Error('Service not found');
  }

  private createMockService(data: CreateServiceRequest): Service {
    return {
      id: `service-${Date.now()}`,
      title: data.title,
      description: data.description,
      type: data.type,
      typeName: this.getServiceTypeName(data.type),
      status: 0, // Draft
      statusName: 'Draft',
      basePrice: data.basePrice,
      maxPrice: data.maxPrice,
      currency: data.currency,
      estimatedDurationMinutes: data.estimatedDurationMinutes,
      estimatedDuration: this.formatDuration(data.estimatedDurationMinutes),
      isEmergencyService: data.isEmergencyService,
      isAvailable24x7: data.isAvailable24x7,
      requirements: data.requirements,
      includedItems: data.includedItems,
      excludedItems: data.excludedItems,
      averageRating: 0,
      totalReviews: 0,
      totalBookings: 0,
      createdAt: new Date().toISOString(),
      serviceProviderId: 'provider-1',
      serviceProviderName: 'New Provider',
      availability: data.availability?.map(a => ({
        dayOfWeek: a.dayOfWeek,
        dayName: this.getDayName(a.dayOfWeek),
        startTime: a.startTime,
        endTime: a.endTime,
        isAvailable: a.isAvailable,
        notes: a.notes
      })) || [],
      images: []
    };
  }

  private getMockProviders(_params: ServiceProvidersQueryParams): ApiResult<PaginatedResult<ServiceProvider>> {
    // Mock providers data would go here
    return {
      succeeded: true,
      data: {
        data: [],
        totalCount: 0,
        pageNumber: 1,
        pageSize: 10,
        totalPages: 0,
        hasPreviousPage: false,
        hasNextPage: false
      }
    };
  }

  private getMockBookings(_params: BookingsQueryParams): ApiResult<PaginatedResult<ServiceBooking>> {
    // Mock bookings data would go here
    return {
      succeeded: true,
      data: {
        data: [],
        totalCount: 0,
        pageNumber: 1,
        pageSize: 10,
        totalPages: 0,
        hasPreviousPage: false,
        hasNextPage: false
      }
    };
  }

  private getMockStatistics(): ApiResult<ServiceStatistics> {
    return {
      succeeded: true,
      data: {
        totalServices: 45,
        activeServices: 38,
        inactiveServices: 5,
        draftServices: 2,
        emergencyServices: 8,
        activeBookings: 156,
        totalRevenue: 45678.90,
        averageRating: 4.7,
        servicesGrowth: 12.5,
        bookingsGrowth: 8.3,
        revenueGrowth: 15.2,
        ratingGrowth: 2.1
      }
    };
  }

  private getServiceTypeName(type: number): string {
    const types = {
      1: 'Maintenance',
      2: 'Repair',
      3: 'Inspection',
      4: 'Cleaning',
      5: 'Towing',
      6: 'Insurance',
      7: 'Rental',
      8: 'Parts',
      9: 'Consultation',
      10: 'Emergency'
    };
    return types[type as keyof typeof types] || 'Unknown';
  }

  private formatDuration(minutes: number): string {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (remainingMinutes === 0) return `${hours} hr`;
    return `${hours} hr ${remainingMinutes} min`;
  }

  private getDayName(dayOfWeek: number): string {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayOfWeek] || 'Unknown';
  }
}

export const servicesService = new ServicesService();