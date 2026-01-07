import { apiClient } from '../api';
import { API_ENDPOINTS } from '../../config/api';
import type { ApiResult } from '../api';

export interface Product {
  id: string;
  name: string;
  description: string;
  sku: string;
  price: number;
  discountPrice?: number;
  stockQuantity: number;
  minStockLevel: number;
  status: 'Active' | 'Inactive' | 'OutOfStock' | 'Discontinued';
  category: 'General' | 'CarParts' | 'Accessories' | 'Tools' | 'Electronics' | 'Maintenance';
  imageUrl?: string;
  brand?: string;
  model?: string;
  weight: number;
  dimensions?: string;
  isFeatured: boolean;
  isDigital: boolean;
  launchDate?: string;
  tags?: string;
  viewCount: number;
  salesCount: number;
  rating: number;
  reviewCount: number;
  createdByUserId?: string;
  updatedByUserId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFilters {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  isFeatured?: boolean;
  isLowStock?: boolean;
  sortBy?: string;
  sortDirection?: string;
}

export interface ProductAnalytics {
  overview: {
    totalViews: number;
    totalSales: number;
    revenue: number;
    averageRating: number;
    reviewCount: number;
    conversionRate: number;
  };
  salesHistory: any[];
  viewHistory: any[];
  reviews: any[];
  inventory: {
    currentStock: number;
    reservedStock: number;
    availableStock: number;
    reorderLevel: number;
  };
}

export class MarketplaceProductsService {
  async getProducts(filters?: ProductFilters): Promise<ApiResult<{ items: Product[]; totalCount: number }>> {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }

    const url = params.toString() 
      ? `${API_ENDPOINTS.PRODUCTS.BASE}?${params}`
      : API_ENDPOINTS.PRODUCTS.BASE;

    return apiClient.get(url);
  }

  async getProduct(id: string): Promise<ApiResult<Product>> {
    return apiClient.get(`${API_ENDPOINTS.PRODUCTS.BASE}/${id}`);
  }

  async createProduct(productData: Partial<Product>): Promise<ApiResult<Product>> {
    return apiClient.post(API_ENDPOINTS.PRODUCTS.BASE, productData);
  }

  async updateProduct(id: string, productData: Partial<Product>): Promise<ApiResult<Product>> {
    return apiClient.put(`${API_ENDPOINTS.PRODUCTS.BASE}/${id}`, productData);
  }

  async deleteProduct(id: string): Promise<ApiResult<void>> {
    return apiClient.delete(`${API_ENDPOINTS.PRODUCTS.BASE}/${id}`);
  }

  async searchProducts(searchTerm: string, limit: number = 20): Promise<ApiResult<Product[]>> {
    return apiClient.get(`${API_ENDPOINTS.PRODUCTS.SEARCH}?searchTerm=${encodeURIComponent(searchTerm)}&limit=${limit}`);
  }

  async getProductStatistics(fromDate?: Date, toDate?: Date): Promise<ApiResult<any>> {
    const params = new URLSearchParams();
    if (fromDate) params.append('fromDate', fromDate.toISOString());
    if (toDate) params.append('toDate', toDate.toISOString());

    const url = params.toString() 
      ? `${API_ENDPOINTS.PRODUCTS.BASE}/statistics?${params}`
      : `${API_ENDPOINTS.PRODUCTS.BASE}/statistics`;

    return apiClient.get(url);
  }

  async updateProductStatus(id: string, status: string): Promise<ApiResult<void>> {
    return apiClient.patch(`${API_ENDPOINTS.PRODUCTS.BASE}/${id}/status`, status);
  }

  async getProductCategories(): Promise<ApiResult<any[]>> {
    return apiClient.get(API_ENDPOINTS.PRODUCTS.CATEGORIES);
  }

  async createProductCategory(categoryData: any): Promise<ApiResult<any>> {
    return apiClient.post(API_ENDPOINTS.PRODUCTS.CATEGORIES, categoryData);
  }

  async updateProductCategory(id: string, categoryData: any): Promise<ApiResult<any>> {
    return apiClient.put(`${API_ENDPOINTS.PRODUCTS.CATEGORIES}/${id}`, categoryData);
  }

  async deleteProductCategory(id: string): Promise<ApiResult<void>> {
    return apiClient.delete(`${API_ENDPOINTS.PRODUCTS.CATEGORIES}/${id}`);
  }

  async getProductInventory(id: string): Promise<ApiResult<any>> {
    return apiClient.get(`${API_ENDPOINTS.PRODUCTS.INVENTORY}/${id}`);
  }

  async updateProductInventory(id: string, inventoryData: any): Promise<ApiResult<any>> {
    return apiClient.put(`${API_ENDPOINTS.PRODUCTS.INVENTORY}/${id}`, inventoryData);
  }

  async getInventoryAlerts(): Promise<ApiResult<any[]>> {
    return apiClient.get(`${API_ENDPOINTS.PRODUCTS.INVENTORY}/alerts`);
  }

  async getLowStockProducts(threshold?: number): Promise<ApiResult<Product[]>> {
    const url = threshold 
      ? `${API_ENDPOINTS.PRODUCTS.INVENTORY}/low-stock?threshold=${threshold}`
      : `${API_ENDPOINTS.PRODUCTS.INVENTORY}/low-stock`;
    
    return apiClient.get(url);
  }

  async getProductReviews(id: string, page: number = 1, pageSize: number = 10): Promise<ApiResult<any>> {
    return apiClient.get(`${API_ENDPOINTS.PRODUCTS.REVIEWS}/${id}?page=${page}&pageSize=${pageSize}`);
  }

  async getAnalytics(productId: string): Promise<ApiResult<ProductAnalytics>> {
    return apiClient.get(`${API_ENDPOINTS.PRODUCTS.ANALYTICS}/${productId}`);
  }

  async getTopSellingProducts(limit: number = 10, period: string = '30d'): Promise<ApiResult<Product[]>> {
    return apiClient.get(`${API_ENDPOINTS.PRODUCTS.ANALYTICS}/top-selling?limit=${limit}&period=${period}`);
  }

  async getProductPerformance(id: string, period: string = '30d'): Promise<ApiResult<any>> {
    return apiClient.get(`${API_ENDPOINTS.PRODUCTS.ANALYTICS}/${id}/performance?period=${period}`);
  }

  async bulkUpdateProducts(productIds: string[], updates: any): Promise<ApiResult<any>> {
    return apiClient.post(`${API_ENDPOINTS.PRODUCTS.BASE}/bulk-update`, { productIds, updates });
  }

  async bulkUpdateInventory(inventoryUpdates: any[]): Promise<ApiResult<any>> {
    return apiClient.post(`${API_ENDPOINTS.PRODUCTS.INVENTORY}/bulk-update`, { updates: inventoryUpdates });
  }

  async exportProducts(filters?: ProductFilters, format: string = 'csv'): Promise<ApiResult<any>> {
    const params = new URLSearchParams();
    params.append('format', format);
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }

    return apiClient.get(`${API_ENDPOINTS.PRODUCTS.BASE}/export?${params}`);
  }

  async importProducts(file: File): Promise<ApiResult<any>> {
    const formData = new FormData();
    formData.append('file', file);

    return apiClient.post(`${API_ENDPOINTS.PRODUCTS.BASE}/import`, formData);
  }

  async duplicateProduct(id: string, newName?: string): Promise<ApiResult<Product>> {
    return apiClient.post(`${API_ENDPOINTS.PRODUCTS.BASE}/${id}/duplicate`, { newName });
  }

  async getProductVariants(id: string): Promise<ApiResult<any[]>> {
    return apiClient.get(`${API_ENDPOINTS.PRODUCTS.BASE}/${id}/variants`);
  }

  async createProductVariant(productId: string, variantData: any): Promise<ApiResult<any>> {
    return apiClient.post(`${API_ENDPOINTS.PRODUCTS.BASE}/${productId}/variants`, variantData);
  }
}