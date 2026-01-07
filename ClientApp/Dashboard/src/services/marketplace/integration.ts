import { apiClient } from '../api';
import { API_ENDPOINTS } from '../../config/api';
import type { ApiResult } from '../api';

export class MarketplaceIntegrationService {
  async syncCustomerData(request: any): Promise<ApiResult<any>> {
    return apiClient.post(`${API_ENDPOINTS.MARKETPLACE.INTEGRATION}/sync-customers`, request);
  }

  async getCrossSellRecommendations(customerId: string, limit: number = 10): Promise<ApiResult<any>> {
    return apiClient.get(`${API_ENDPOINTS.MARKETPLACE.BASE}/recommendations/cross-sell/${customerId}?limit=${limit}`);
  }

  async createPromotion(promotionData: any): Promise<ApiResult<any>> {
    return apiClient.post(`${API_ENDPOINTS.MARKETPLACE.BASE}/promotions`, promotionData);
  }

  async getPromotions(filters?: any): Promise<ApiResult<any>> {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }

    const url = params.toString() 
      ? `${API_ENDPOINTS.MARKETPLACE.BASE}/promotions?${params}`
      : `${API_ENDPOINTS.MARKETPLACE.BASE}/promotions`;

    return apiClient.get(url);
  }

  async getPromotion(id: string): Promise<ApiResult<any>> {
    return apiClient.get(`${API_ENDPOINTS.MARKETPLACE.BASE}/promotions/${id}`);
  }

  async updatePromotion(id: string, promotionData: any): Promise<ApiResult<any>> {
    return apiClient.put(`${API_ENDPOINTS.MARKETPLACE.BASE}/promotions/${id}`, promotionData);
  }

  async deletePromotion(id: string): Promise<ApiResult<void>> {
    return apiClient.delete(`${API_ENDPOINTS.MARKETPLACE.BASE}/promotions/${id}`);
  }
}