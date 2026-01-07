import { apiClient } from '../api';
import { API_ENDPOINTS } from '../../config/api';
import type { ApiResult } from '../api';

export interface MarketplaceDashboardData {
  overview: {
    totalRevenue: number;
    totalOrders: number;
    totalCustomers: number;
    totalProducts: number;
    totalServices: number;
    averageOrderValue: number;
    conversionRate: number;
    customerSatisfaction: number;
  };
  recentActivity: {
    recentOrders: any[];
    recentCustomers: any[];
    recentReviews: any[];
    recentBookings: any[];
  };
  analytics: {
    revenueChart: any[];
    orderChart: any[];
    customerChart: any[];
    topProducts: any[];
    topServices: any[];
    topCustomers: any[];
  };
  alerts: {
    lowStock: any[];
    pendingOrders: any[];
    customerIssues: any[];
    serviceIssues: any[];
  };
}

export interface MarketplaceMetrics {
  revenue: {
    total: number;
    growth: number;
    trend: 'up' | 'down' | 'stable';
  };
  orders: {
    total: number;
    growth: number;
    trend: 'up' | 'down' | 'stable';
  };
  customers: {
    total: number;
    active: number;
    new: number;
    growth: number;
    trend: 'up' | 'down' | 'stable';
  };
  products: {
    total: number;
    active: number;
    lowStock: number;
    outOfStock: number;
  };
  services: {
    total: number;
    active: number;
    booked: number;
    completed: number;
  };
}

export class MarketplaceDashboardService {
  async getDashboard(fromDate?: Date, toDate?: Date): Promise<ApiResult<MarketplaceDashboardData>> {
    const params = new URLSearchParams();
    if (fromDate) params.append('fromDate', fromDate.toISOString());
    if (toDate) params.append('toDate', toDate.toISOString());

    const url = params.toString() 
      ? `${API_ENDPOINTS.MARKETPLACE.DASHBOARD}?${params}`
      : API_ENDPOINTS.MARKETPLACE.DASHBOARD;

    return apiClient.get<MarketplaceDashboardData>(url);
  }

  async getMetrics(period: string = '30d'): Promise<ApiResult<MarketplaceMetrics>> {
    return apiClient.get<MarketplaceMetrics>(`${API_ENDPOINTS.MARKETPLACE.DASHBOARD}/metrics?period=${period}`);
  }

  async getRecentActivity(limit: number = 10): Promise<ApiResult<any>> {
    return apiClient.get(`${API_ENDPOINTS.MARKETPLACE.DASHBOARD}/activity?limit=${limit}`);
  }

  async getAlerts(): Promise<ApiResult<any>> {
    return apiClient.get(`${API_ENDPOINTS.MARKETPLACE.DASHBOARD}/alerts`);
  }

  async getTopPerformers(type: 'products' | 'services' | 'customers', limit: number = 10): Promise<ApiResult<any>> {
    return apiClient.get(`${API_ENDPOINTS.MARKETPLACE.DASHBOARD}/top-performers?type=${type}&limit=${limit}`);
  }

  async getRevenueBreakdown(period: string = '30d'): Promise<ApiResult<any>> {
    return apiClient.get(`${API_ENDPOINTS.MARKETPLACE.DASHBOARD}/revenue-breakdown?period=${period}`);
  }

  async getCustomerSegments(): Promise<ApiResult<any>> {
    return apiClient.get(`${API_ENDPOINTS.MARKETPLACE.DASHBOARD}/customer-segments`);
  }

  async getInventoryStatus(): Promise<ApiResult<any>> {
    return apiClient.get(`${API_ENDPOINTS.MARKETPLACE.DASHBOARD}/inventory-status`);
  }

  async getServiceBookingStatus(): Promise<ApiResult<any>> {
    return apiClient.get(`${API_ENDPOINTS.MARKETPLACE.DASHBOARD}/service-booking-status`);
  }
}