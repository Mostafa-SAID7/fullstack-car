// Marketplace Service - Main Export (composed from sub-services)

import { MarketplaceDashboardService } from './dashboard';
import { MarketplaceAnalyticsService } from './analytics';
import { MarketplaceIntegrationService } from './integration';
import { productApiService } from './product-api.service';
import { serviceApiService } from './service-api.service';
import { customerApiService } from './customer-api.service';
import { orderApiService } from './order-api.service';
import { imageUploadService } from './image-upload.service';

export class MarketplaceService {
  private static instance: MarketplaceService;

  // Sub-service instances
  private dashboardService: MarketplaceDashboardService;
  private analyticsService: MarketplaceAnalyticsService;
  private integrationService: MarketplaceIntegrationService;

  private constructor() {
    this.dashboardService = new MarketplaceDashboardService();
    this.analyticsService = new MarketplaceAnalyticsService();
    this.integrationService = new MarketplaceIntegrationService();
  }

  static getInstance(): MarketplaceService {
    if (!MarketplaceService.instance) {
      MarketplaceService.instance = new MarketplaceService();
    }
    return MarketplaceService.instance;
  }

  // Dashboard Methods
  async getDashboard(fromDate?: Date, toDate?: Date) {
    return this.dashboardService.getDashboard(fromDate, toDate);
  }

  async getDashboardMetrics(period: string = '30d') {
    return this.dashboardService.getMetrics(period);
  }

  // Customer Methods (Delegated to CustomerApiService)
  async getCustomers(filters?: any) {
    return customerApiService.getCustomers(filters);
  }

  async getCustomer(id: string) {
    return customerApiService.getCustomer(id);
  }

  async createCustomer(customerData: any) {
    return customerApiService.createCustomer(customerData);
  }

  async updateCustomer(id: string, customerData: any) {
    return customerApiService.updateCustomer(id, customerData);
  }

  async deleteCustomer(id: string) {
    return customerApiService.deleteCustomer(id);
  }

  async getCustomerAnalytics(customerId: string) {
    return customerApiService.getAnalytics(customerId);
  }

  // Product Methods (Delegated to ProductApiService)
  async getProducts(filters?: any) {
    return productApiService.getProducts(filters);
  }

  async getProduct(id: string) {
    return productApiService.getProduct(id);
  }

  async createProduct(productData: any) {
    return productApiService.createProduct(productData);
  }

  async updateProduct(id: string, productData: any) {
    return productApiService.updateProduct(id, productData);
  }

  async deleteProduct(id: string) {
    return productApiService.deleteProduct(id);
  }

  // Service Methods (Delegated to ServiceApiService)
  async getServices(filters?: any) {
    return serviceApiService.getServices(filters);
  }

  async getService(id: string) {
    return serviceApiService.getService(id);
  }

  async createService(serviceData: any) {
    return serviceApiService.createService(serviceData);
  }

  async updateService(id: string, serviceData: any) {
    return serviceApiService.updateService(id, serviceData);
  }

  async deleteService(id: string) {
    return serviceApiService.deleteService(id);
  }

  async searchServicesByLocation(latitude: number, longitude: number, radius: number = 10) {
    return serviceApiService.searchByLocation(latitude, longitude, radius);
  }

  // Analytics Methods
  async getMarketplaceAnalytics(fromDate?: Date, toDate?: Date, segment?: string) {
    return this.analyticsService.getMarketplaceAnalytics(fromDate, toDate, segment);
  }

  async getRevenueAnalytics(period: string = '30d') {
    return this.analyticsService.getRevenueAnalytics(period);
  }

  // Order Methods (Delegated to OrderApiService)
  async getOrders(filters?: any) {
    return orderApiService.getOrders(filters);
  }

  async getOrder(id: string) {
    return orderApiService.getOrder(id);
  }

  async updateOrderStatus(id: string, status: string) {
    return orderApiService.updateStatus(id, status);
  }

  async getTransactions(filters?: any) {
    return orderApiService.getTransactions(filters);
  }

  // Integration Methods
  async syncCustomerData(request: any) {
    return this.integrationService.syncCustomerData(request);
  }

  async getCrossSellRecommendations(customerId: string, limit: number = 10) {
    return this.integrationService.getCrossSellRecommendations(customerId, limit);
  }

  async createPromotion(promotionData: any) {
    return this.integrationService.createPromotion(promotionData);
  }

  async getPromotions(filters?: any) {
    return this.integrationService.getPromotions(filters);
  }

  // Report Methods
  async generateReport(reportType: string, fromDate?: Date, toDate?: Date, format: string = 'json') {
    return this.analyticsService.generateReport(reportType, fromDate, toDate, format);
  }
}

// Export singleton instance
export const marketplaceService = MarketplaceService.getInstance();

// Export individual services for direct access
export { MarketplaceDashboardService } from './dashboard';
export { MarketplaceAnalyticsService } from './analytics';
export { MarketplaceIntegrationService } from './integration';

// Export new enhanced API services
export { ProductApiService, productApiService, productCacheInvalidation } from './product-api.service';
export { ServiceApiService, serviceApiService, serviceCacheInvalidation } from './service-api.service';
export { CustomerApiService, customerApiService, customerCacheInvalidation } from './customer-api.service';
export { OrderApiService, orderApiService, orderCacheInvalidation } from './order-api.service';
export { ProductManagementService, productManagementService } from './product-management.service';
export { ServiceManagementService, serviceManagementService } from './service-management.service';
export { ImageUploadService, imageUploadService } from './image-upload.service';
export {
  ProductPrefetchService,
  ServicePrefetchService,
  productPrefetchService,
  servicePrefetchService,
  createPrefetchHandlers
} from './prefetch.service';
