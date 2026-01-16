// Marketplace Service - Main Export (composed from sub-services)

import { MarketplaceDashboardService } from './dashboard';
import { MarketplaceCustomersService } from './customers';
import { MarketplaceProductsService } from './products';
import { MarketplaceServicesService } from './services';
import { MarketplaceAnalyticsService } from './analytics';
import { MarketplaceOrdersService } from './orders';
import { MarketplaceIntegrationService } from './integration';

export class MarketplaceService {
  private static instance: MarketplaceService;

  // Sub-service instances
  private dashboardService: MarketplaceDashboardService;
  private customersService: MarketplaceCustomersService;
  private productsService: MarketplaceProductsService;
  private servicesService: MarketplaceServicesService;
  private analyticsService: MarketplaceAnalyticsService;
  private ordersService: MarketplaceOrdersService;
  private integrationService: MarketplaceIntegrationService;

  private constructor() {
    this.dashboardService = new MarketplaceDashboardService();
    this.customersService = new MarketplaceCustomersService();
    this.productsService = new MarketplaceProductsService();
    this.servicesService = new MarketplaceServicesService();
    this.analyticsService = new MarketplaceAnalyticsService();
    this.ordersService = new MarketplaceOrdersService();
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

  // Customer Methods
  async getCustomers(filters?: any) {
    return this.customersService.getCustomers(filters);
  }

  async getCustomer(id: string) {
    return this.customersService.getCustomer(id);
  }

  async createCustomer(customerData: any) {
    return this.customersService.createCustomer(customerData);
  }

  async updateCustomer(id: string, customerData: any) {
    return this.customersService.updateCustomer(id, customerData);
  }

  async deleteCustomer(id: string) {
    return this.customersService.deleteCustomer(id);
  }

  async getCustomerAnalytics(customerId: string) {
    return this.customersService.getAnalytics(customerId);
  }

  // Product Methods
  async getProducts(filters?: any) {
    return this.productsService.getProducts(filters);
  }

  async getProduct(id: string) {
    return this.productsService.getProduct(id);
  }

  async createProduct(productData: any) {
    return this.productsService.createProduct(productData);
  }

  async updateProduct(id: string, productData: any) {
    return this.productsService.updateProduct(id, productData);
  }

  async deleteProduct(id: string) {
    return this.productsService.deleteProduct(id);
  }

  // Service Methods
  async getServices(filters?: any) {
    return this.servicesService.getServices(filters);
  }

  async getService(id: string) {
    return this.servicesService.getService(id);
  }

  async createService(serviceData: any) {
    return this.servicesService.createService(serviceData, serviceData.serviceProviderId || '');
  }

  async updateService(id: string, serviceData: any) {
    return this.servicesService.updateService(id, serviceData);
  }

  async deleteService(id: string) {
    return this.servicesService.deleteService(id);
  }

  async searchServicesByLocation(latitude: number, longitude: number, radius: number = 10) {
    return this.servicesService.searchByLocation(latitude, longitude, radius);
  }

  // Analytics Methods
  async getMarketplaceAnalytics(fromDate?: Date, toDate?: Date, segment?: string) {
    return this.analyticsService.getMarketplaceAnalytics(fromDate, toDate, segment);
  }

  async getRevenueAnalytics(period: string = '30d') {
    return this.analyticsService.getRevenueAnalytics(period);
  }

  // Order Methods
  async getOrders(filters?: any) {
    return this.ordersService.getOrders(filters);
  }

  async getOrder(id: string) {
    return this.ordersService.getOrder(id);
  }

  async updateOrderStatus(id: string, status: string) {
    return this.ordersService.updateStatus(id, status);
  }

  async getTransactions(filters?: any) {
    return this.ordersService.getTransactions(filters);
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
export {
  MarketplaceDashboardService,
  MarketplaceCustomersService,
  MarketplaceProductsService,
  MarketplaceServicesService,
  MarketplaceAnalyticsService,
  MarketplaceOrdersService,
  MarketplaceIntegrationService
};

// Export new enhanced API services
export { ProductApiService, productApiService, productCacheInvalidation } from './product-api.service';
export { ServiceApiService, serviceApiService, serviceCacheInvalidation } from './service-api.service';
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
