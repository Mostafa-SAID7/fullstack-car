/**
 * Service Management Service
 * Handles bulk operations and management tasks for services
 */

import { serviceApiService } from './service-api.service';
import type {
  ServiceDto,
  ServiceFilters,
  ServiceStatus,
  UpdateServiceRequest
} from '../../types/marketplace';

/**
 * Service Management Service
 * Provides high-level management operations for services
 */
export class ServiceManagementService {
  /**
   * Bulk delete multiple services
   * @param serviceIds - Array of service IDs to delete
   * @throws Error if any deletion fails
   */
  async bulkDelete(serviceIds: string[]): Promise<void> {
    if (!serviceIds || serviceIds.length === 0) {
      throw new Error('No service IDs provided for bulk delete');
    }

    try {
      await Promise.all(serviceIds.map(id => serviceApiService.deleteService(id)));
    } catch (error) {
      console.error('Bulk delete failed:', error);
      throw new Error(`Failed to delete services: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Bulk update status for multiple services
   * @param serviceIds - Array of service IDs to update
   * @param status - New status to apply
   * @throws Error if any update fails
   */
  async bulkUpdateStatus(serviceIds: string[], status: ServiceStatus): Promise<void> {
    if (!serviceIds || serviceIds.length === 0) {
      throw new Error('No service IDs provided for bulk status update');
    }

    if (!status) {
      throw new Error('Status is required for bulk update');
    }

    try {
      await Promise.all(
        serviceIds.map(id => 
          serviceApiService.updateService(id, { id, status } as UpdateServiceRequest)
        )
      );
    } catch (error) {
      console.error('Bulk status update failed:', error);
      throw new Error(`Failed to update service status: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Bulk update multiple fields for services
   * @param serviceIds - Array of service IDs to update
   * @param updates - Fields to update
   * @throws Error if any update fails
   */
  async bulkUpdateFields(serviceIds: string[], updates: Partial<UpdateServiceRequest>): Promise<void> {
    if (!serviceIds || serviceIds.length === 0) {
      throw new Error('No service IDs provided for bulk update');
    }

    if (!updates || Object.keys(updates).length === 0) {
      throw new Error('No updates provided for bulk update');
    }

    try {
      await Promise.all(
        serviceIds.map(id => 
          serviceApiService.updateService(id, { id, ...updates } as UpdateServiceRequest)
        )
      );
    } catch (error) {
      console.error('Bulk field update failed:', error);
      throw new Error(`Failed to update services: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Export services to CSV format
   * @param filters - Optional filters to apply before export
   * @returns Blob containing CSV data
   */
  async exportServices(filters?: ServiceFilters): Promise<Blob> {
    try {
      const blob = await serviceApiService.exportServices(filters);
      return blob;
    } catch (error) {
      console.error('Export services failed:', error);
      throw new Error(`Failed to export services: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Download exported services as a file
   * @param filters - Optional filters to apply before export
   * @param filename - Optional filename (default: 'services-export.csv')
   */
  async downloadServicesExport(filters?: ServiceFilters, filename: string = 'services-export.csv'): Promise<void> {
    try {
      const blob = await this.exportServices(filters);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download export failed:', error);
      throw new Error(`Failed to download export: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get services that need attention (suspended, low rating, etc.)
   * @returns Object containing services needing attention
   */
  async getServicesNeedingAttention(): Promise<{
    suspended: ServiceDto[];
    lowRating: ServiceDto[];
    inactive: ServiceDto[];
  }> {
    try {
      const allServices = await serviceApiService.getServices({ 
        pageSize: 100 
      });

      const suspended = allServices.items.filter(s => s.status === ServiceStatus.Suspended);
      const lowRating = allServices.items.filter(s => s.averageRating < 3.0 && s.totalReviews > 5);
      const inactive = allServices.items.filter(s => s.status === ServiceStatus.Inactive);

      return {
        suspended,
        lowRating,
        inactive
      };
    } catch (error) {
      console.error('Failed to get services needing attention:', error);
      throw new Error(`Failed to get services needing attention: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Duplicate a service
   * @param serviceId - ID of service to duplicate
   * @param newName - Optional new name for the duplicated service
   * @returns Created service
   */
  async duplicateService(serviceId: string, newName?: string): Promise<ServiceDto> {
    try {
      const original = await serviceApiService.getService(serviceId);
      
      const duplicateData = {
        serviceProviderId: original.serviceProviderId,
        name: newName || `${original.name} (Copy)`,
        title: `${original.title} (Copy)`,
        description: original.description,
        shortDescription: original.shortDescription,
        basePrice: original.basePrice,
        maxPrice: original.maxPrice,
        estimatedDuration: original.estimatedDuration,
        maxDuration: original.maxDuration,
        serviceType: original.serviceType,
        category: original.category,
        subCategory: original.subCategory,
        requirements: original.requirements,
        inclusions: original.inclusions,
        exclusions: original.exclusions,
        tags: original.tags,
        requiresApproval: original.requiresApproval,
        sortOrder: original.sortOrder
      };

      return await serviceApiService.createService(duplicateData);
    } catch (error) {
      console.error('Duplicate service failed:', error);
      throw new Error(`Failed to duplicate service: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Archive multiple services (set status to Archived)
   * @param serviceIds - Array of service IDs to archive
   */
  async archiveServices(serviceIds: string[]): Promise<void> {
    return this.bulkUpdateStatus(serviceIds, ServiceStatus.Archived);
  }

  /**
   * Activate multiple services (set status to Active)
   * @param serviceIds - Array of service IDs to activate
   */
  async activateServices(serviceIds: string[]): Promise<void> {
    return this.bulkUpdateStatus(serviceIds, ServiceStatus.Active);
  }

  /**
   * Deactivate multiple services (set status to Inactive)
   * @param serviceIds - Array of service IDs to deactivate
   */
  async deactivateServices(serviceIds: string[]): Promise<void> {
    return this.bulkUpdateStatus(serviceIds, ServiceStatus.Inactive);
  }

  /**
   * Suspend multiple services (set status to Suspended)
   * @param serviceIds - Array of service IDs to suspend
   */
  async suspendServices(serviceIds: string[]): Promise<void> {
    return this.bulkUpdateStatus(serviceIds, ServiceStatus.Suspended);
  }

  /**
   * Update prices for multiple services
   * @param updates - Array of {serviceId, basePrice, maxPrice?} objects
   */
  async bulkUpdatePrices(updates: Array<{ 
    serviceId: string; 
    basePrice: number; 
    maxPrice?: number 
  }>): Promise<void> {
    if (!updates || updates.length === 0) {
      throw new Error('No price updates provided');
    }

    try {
      await Promise.all(
        updates.map(({ serviceId, basePrice, maxPrice }) => 
          serviceApiService.updateService(serviceId, { 
            id: serviceId, 
            basePrice,
            maxPrice
          } as UpdateServiceRequest)
        )
      );
    } catch (error) {
      console.error('Bulk price update failed:', error);
      throw new Error(`Failed to update prices: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Update duration for multiple services
   * @param updates - Array of {serviceId, estimatedDuration, maxDuration?} objects
   */
  async bulkUpdateDuration(updates: Array<{ 
    serviceId: string; 
    estimatedDuration: number; 
    maxDuration?: number 
  }>): Promise<void> {
    if (!updates || updates.length === 0) {
      throw new Error('No duration updates provided');
    }

    try {
      await Promise.all(
        updates.map(({ serviceId, estimatedDuration, maxDuration }) => 
          serviceApiService.updateService(serviceId, { 
            id: serviceId, 
            estimatedDuration,
            maxDuration
          } as UpdateServiceRequest)
        )
      );
    } catch (error) {
      console.error('Bulk duration update failed:', error);
      throw new Error(`Failed to update duration: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Toggle popular flag for multiple services
   * @param serviceIds - Array of service IDs
   * @param isPopular - Whether to mark as popular
   */
  async bulkTogglePopular(serviceIds: string[], isPopular: boolean): Promise<void> {
    if (!serviceIds || serviceIds.length === 0) {
      throw new Error('No service IDs provided');
    }

    try {
      await Promise.all(
        serviceIds.map(id => 
          serviceApiService.updateService(id, { 
            id, 
            isPopular 
          } as UpdateServiceRequest)
        )
      );
    } catch (error) {
      console.error('Bulk toggle popular failed:', error);
      throw new Error(`Failed to toggle popular: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get services by provider with management info
   * @param providerId - Service provider ID
   * @returns Services with additional management data
   */
  async getProviderServicesWithStats(providerId: string): Promise<{
    services: ServiceDto[];
    totalBookings: number;
    totalRevenue: number;
    averageRating: number;
  }> {
    try {
      const result = await serviceApiService.getServicesByProvider(providerId);
      const services = result.items;

      const totalBookings = services.reduce((sum, s) => sum + s.totalBookings, 0);
      const totalRevenue = services.reduce((sum, s) => sum + (s.basePrice * s.totalBookings), 0);
      const averageRating = services.length > 0
        ? services.reduce((sum, s) => sum + s.averageRating, 0) / services.length
        : 0;

      return {
        services,
        totalBookings,
        totalRevenue,
        averageRating
      };
    } catch (error) {
      console.error('Failed to get provider services with stats:', error);
      throw new Error(`Failed to get provider services: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

// Export singleton instance
export const serviceManagementService = new ServiceManagementService();
