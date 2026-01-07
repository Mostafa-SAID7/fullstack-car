import { apiClient } from '../api';
import { API_ENDPOINTS } from '../../config/api';
import type { ApiResult } from '../api';

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  status: 'Active' | 'Inactive' | 'Suspended' | 'Pending';
  type: 'Regular' | 'Premium' | 'VIP' | 'Corporate';
  company?: string;
  jobTitle?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  totalSpent: number;
  orderCount: number;
  lastOrderDate?: string;
  lastLoginDate?: string;
  preferredLanguage?: string;
  preferredCurrency?: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  marketingOptIn: boolean;
  notes?: string;
  tags?: string;
  assignedSalesRepId?: string;
  lifetimeValue: number;
  loyaltyPoints: number;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerFilters {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
  type?: string;
  country?: string;
  city?: string;
  minSpent?: number;
  maxSpent?: number;
  registeredAfter?: Date;
  registeredBefore?: Date;
  hasOrders?: boolean;
  sortBy?: string;
  sortDirection?: string;
}

export interface CustomerAnalytics {
  overview: {
    totalOrders: number;
    totalSpent: number;
    averageOrderValue: number;
    lifetimeValue: number;
    loyaltyPoints: number;
    lastActivity: string;
  };
  orderHistory: any[];
  purchasePatterns: any[];
  preferences: any[];
  interactions: any[];
}

export class MarketplaceCustomersService {
  async getCustomers(filters?: CustomerFilters): Promise<ApiResult<{ items: Customer[]; totalCount: number }>> {
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
      ? `${API_ENDPOINTS.CUSTOMERS.BASE}?${params}`
      : API_ENDPOINTS.CUSTOMERS.BASE;

    return apiClient.get(url);
  }

  async getCustomer(id: string): Promise<ApiResult<Customer>> {
    return apiClient.get(`${API_ENDPOINTS.CUSTOMERS.BASE}/${id}`);
  }

  async createCustomer(customerData: Partial<Customer>): Promise<ApiResult<Customer>> {
    return apiClient.post(API_ENDPOINTS.CUSTOMERS.BASE, customerData);
  }

  async updateCustomer(id: string, customerData: Partial<Customer>): Promise<ApiResult<Customer>> {
    return apiClient.put(`${API_ENDPOINTS.CUSTOMERS.BASE}/${id}`, customerData);
  }

  async deleteCustomer(id: string): Promise<ApiResult<void>> {
    return apiClient.delete(`${API_ENDPOINTS.CUSTOMERS.BASE}/${id}`);
  }

  async searchCustomers(searchTerm: string, limit: number = 20): Promise<ApiResult<Customer[]>> {
    return apiClient.get(`${API_ENDPOINTS.CUSTOMERS.BASE}/search?searchTerm=${encodeURIComponent(searchTerm)}&limit=${limit}`);
  }

  async getCustomerStatistics(fromDate?: Date, toDate?: Date): Promise<ApiResult<any>> {
    const params = new URLSearchParams();
    if (fromDate) params.append('fromDate', fromDate.toISOString());
    if (toDate) params.append('toDate', toDate.toISOString());

    const url = params.toString() 
      ? `${API_ENDPOINTS.CUSTOMERS.BASE}/statistics?${params}`
      : `${API_ENDPOINTS.CUSTOMERS.BASE}/statistics`;

    return apiClient.get(url);
  }

  async updateCustomerStatus(id: string, status: string): Promise<ApiResult<void>> {
    return apiClient.patch(`${API_ENDPOINTS.CUSTOMERS.BASE}/${id}/status`, status);
  }

  async updateCustomerType(id: string, type: string): Promise<ApiResult<void>> {
    return apiClient.patch(`${API_ENDPOINTS.CUSTOMERS.BASE}/${id}/type`, type);
  }

  async addLoyaltyPoints(id: string, points: number, reason: string): Promise<ApiResult<any>> {
    return apiClient.post(`${API_ENDPOINTS.CUSTOMERS.BASE}/${id}/loyalty-points`, { points, reason });
  }

  async getCustomerOrders(id: string, page: number = 1, pageSize: number = 10): Promise<ApiResult<any>> {
    return apiClient.get(`${API_ENDPOINTS.CUSTOMERS.ORDERS}/${id}?page=${page}&pageSize=${pageSize}`);
  }

  async getCustomerPreferences(id: string): Promise<ApiResult<any>> {
    return apiClient.get(`${API_ENDPOINTS.CUSTOMERS.PREFERENCES}/${id}`);
  }

  async updateCustomerPreferences(id: string, preferences: any): Promise<ApiResult<any>> {
    return apiClient.put(`${API_ENDPOINTS.CUSTOMERS.PREFERENCES}/${id}`, preferences);
  }

  async getAnalytics(customerId: string): Promise<ApiResult<CustomerAnalytics>> {
    return apiClient.get(`${API_ENDPOINTS.CUSTOMERS.ANALYTICS}/${customerId}`);
  }

  async getCustomerSegments(): Promise<ApiResult<any>> {
    return apiClient.get(API_ENDPOINTS.CUSTOMERS.SEGMENTS);
  }

  async assignCustomerToSegment(customerId: string, segmentId: string): Promise<ApiResult<void>> {
    return apiClient.post(`${API_ENDPOINTS.CUSTOMERS.SEGMENTS}/${segmentId}/customers`, { customerId });
  }

  async bulkUpdateCustomers(customerIds: string[], updates: any): Promise<ApiResult<any>> {
    return apiClient.post(`${API_ENDPOINTS.CUSTOMERS.BASE}/bulk-update`, { customerIds, updates });
  }

  async exportCustomers(filters?: CustomerFilters, format: string = 'csv'): Promise<ApiResult<any>> {
    const params = new URLSearchParams();
    params.append('format', format);
    
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

    return apiClient.get(`${API_ENDPOINTS.CUSTOMERS.BASE}/export?${params}`);
  }
}