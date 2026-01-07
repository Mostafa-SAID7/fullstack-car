import { apiClient } from '../api';
import { API_ENDPOINTS } from '../../config/api';
import type { ApiResult } from '../api';

export class MarketplaceOrdersService {
  async getOrders(filters?: any): Promise<ApiResult<any>> {
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
      ? `${API_ENDPOINTS.MARKETPLACE.ORDERS}?${params}`
      : API_ENDPOINTS.MARKETPLACE.ORDERS;

    return apiClient.get(url);
  }

  async getOrder(id: string): Promise<ApiResult<any>> {
    return apiClient.get(`${API_ENDPOINTS.MARKETPLACE.ORDERS}/${id}`);
  }

  async updateStatus(id: string, status: string): Promise<ApiResult<any>> {
    return apiClient.patch(`${API_ENDPOINTS.MARKETPLACE.ORDERS}/${id}/status`, { status });
  }

  async getTransactions(filters?: any): Promise<ApiResult<any>> {
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
      ? `${API_ENDPOINTS.MARKETPLACE.TRANSACTIONS}?${params}`
      : API_ENDPOINTS.MARKETPLACE.TRANSACTIONS;

    return apiClient.get(url);
  }
}