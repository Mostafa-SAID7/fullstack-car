/**
 * Service Validation Tests
 * Tests for service form validation schemas
 */

import {
  createServiceSchema,
  updateServiceSchema,
  serviceFiltersSchema,
  bulkServiceOperationSchema,
  locationSearchSchema
} from '../../lib/validation/marketplace.validation';
import { ServiceType, ServiceStatus } from '../../types/marketplace/service.types';

describe('Service Validation', () => {
  describe('createServiceSchema', () => {
    it('should validate a valid service creation request', () => {
      const validData = {
        serviceProviderId: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Oil Change',
        title: 'Professional Oil Change Service',
        description: 'Complete oil change service including filter replacement and fluid check',
        shortDescription: 'Quick oil change service',
        basePrice: 49.99,
        estimatedDuration: 30,
        serviceType: ServiceType.Maintenance,
        category: 'Maintenance'
      };

      const result = createServiceSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject service with invalid serviceProviderId', () => {
      const invalidData = {
        serviceProviderId: 'invalid-uuid',
        name: 'Oil Change',
        title: 'Professional Oil Change Service',
        description: 'Complete oil change service including filter replacement and fluid check',
        shortDescription: 'Quick oil change service',
        basePrice: 49.99,
        estimatedDuration: 30,
        serviceType: ServiceType.Maintenance,
        category: 'Maintenance'
      };

      const result = createServiceSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject service with name too short', () => {
      const invalidData = {
        serviceProviderId: '123e4567-e89b-12d3-a456-426614174000',
        name: 'O',
        title: 'Professional Oil Change Service',
        description: 'Complete oil change service including filter replacement and fluid check',
        shortDescription: 'Quick oil change service',
        basePrice: 49.99,
        estimatedDuration: 30,
        serviceType: ServiceType.Maintenance,
        category: 'Maintenance'
      };

      const result = createServiceSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toContain('at least 2 characters');
      }
    });

    it('should reject service with negative price', () => {
      const invalidData = {
        serviceProviderId: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Oil Change',
        title: 'Professional Oil Change Service',
        description: 'Complete oil change service including filter replacement and fluid check',
        shortDescription: 'Quick oil change service',
        basePrice: -10,
        estimatedDuration: 30,
        serviceType: ServiceType.Maintenance,
        category: 'Maintenance'
      };

      const result = createServiceSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject service when maxPrice is less than basePrice', () => {
      const invalidData = {
        serviceProviderId: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Oil Change',
        title: 'Professional Oil Change Service',
        description: 'Complete oil change service including filter replacement and fluid check',
        shortDescription: 'Quick oil change service',
        basePrice: 100,
        maxPrice: 50,
        estimatedDuration: 30,
        serviceType: ServiceType.Maintenance,
        category: 'Maintenance'
      };

      const result = createServiceSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toContain('Maximum price must be greater than base price');
      }
    });

    it('should reject service when maxDuration is less than estimatedDuration', () => {
      const invalidData = {
        serviceProviderId: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Oil Change',
        title: 'Professional Oil Change Service',
        description: 'Complete oil change service including filter replacement and fluid check',
        shortDescription: 'Quick oil change service',
        basePrice: 49.99,
        estimatedDuration: 60,
        maxDuration: 30,
        serviceType: ServiceType.Maintenance,
        category: 'Maintenance'
      };

      const result = createServiceSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toContain('Maximum duration must be greater than estimated duration');
      }
    });

    it('should accept service with valid optional fields', () => {
      const validData = {
        serviceProviderId: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Oil Change',
        title: 'Professional Oil Change Service',
        description: 'Complete oil change service including filter replacement and fluid check',
        shortDescription: 'Quick oil change service',
        basePrice: 49.99,
        maxPrice: 79.99,
        estimatedDuration: 30,
        maxDuration: 60,
        serviceType: ServiceType.Maintenance,
        category: 'Maintenance',
        subCategory: 'Engine',
        requirements: 'Vehicle must be accessible',
        inclusions: 'Oil filter, synthetic oil',
        exclusions: 'Disposal fees',
        tags: 'oil, maintenance, quick',
        requiresApproval: false,
        sortOrder: 1
      };

      const result = createServiceSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  describe('updateServiceSchema', () => {
    it('should validate a valid service update request', () => {
      const validData = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Updated Oil Change',
        basePrice: 59.99
      };

      const result = updateServiceSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject update without id', () => {
      const invalidData = {
        name: 'Updated Oil Change',
        basePrice: 59.99
      };

      const result = updateServiceSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should accept update with status change', () => {
      const validData = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        status: ServiceStatus.Active
      };

      const result = updateServiceSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  describe('serviceFiltersSchema', () => {
    it('should validate valid service filters', () => {
      const validFilters = {
        page: 1,
        pageSize: 20,
        searchTerm: 'oil change',
        type: ServiceType.Maintenance,
        minPrice: 10,
        maxPrice: 100,
        minRating: 4
      };

      const result = serviceFiltersSchema.safeParse(validFilters);
      expect(result.success).toBe(true);
    });

    it('should reject filters when maxPrice is less than minPrice', () => {
      const invalidFilters = {
        minPrice: 100,
        maxPrice: 50
      };

      const result = serviceFiltersSchema.safeParse(invalidFilters);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toContain('Maximum price must be greater than minimum price');
      }
    });

    it('should accept empty filters', () => {
      const result = serviceFiltersSchema.safeParse({});
      expect(result.success).toBe(true);
    });
  });

  describe('bulkServiceOperationSchema', () => {
    it('should validate bulk delete operation', () => {
      const validOperation = {
        serviceIds: [
          '123e4567-e89b-12d3-a456-426614174000',
          '223e4567-e89b-12d3-a456-426614174001'
        ],
        operation: 'delete' as const
      };

      const result = bulkServiceOperationSchema.safeParse(validOperation);
      expect(result.success).toBe(true);
    });

    it('should validate bulk status update operation', () => {
      const validOperation = {
        serviceIds: ['123e4567-e89b-12d3-a456-426614174000'],
        operation: 'updateStatus' as const,
        status: ServiceStatus.Active
      };

      const result = bulkServiceOperationSchema.safeParse(validOperation);
      expect(result.success).toBe(true);
    });

    it('should reject status update without status parameter', () => {
      const invalidOperation = {
        serviceIds: ['123e4567-e89b-12d3-a456-426614174000'],
        operation: 'updateStatus' as const
      };

      const result = bulkServiceOperationSchema.safeParse(invalidOperation);
      expect(result.success).toBe(false);
    });

    it('should reject operation with empty service IDs', () => {
      const invalidOperation = {
        serviceIds: [],
        operation: 'delete' as const
      };

      const result = bulkServiceOperationSchema.safeParse(invalidOperation);
      expect(result.success).toBe(false);
    });
  });

  describe('locationSearchSchema', () => {
    it('should validate valid location search', () => {
      const validSearch = {
        latitude: 40.7128,
        longitude: -74.0060,
        radiusKm: 10
      };

      const result = locationSearchSchema.safeParse(validSearch);
      expect(result.success).toBe(true);
    });

    it('should reject invalid latitude', () => {
      const invalidSearch = {
        latitude: 100,
        longitude: -74.0060,
        radiusKm: 10
      };

      const result = locationSearchSchema.safeParse(invalidSearch);
      expect(result.success).toBe(false);
    });

    it('should reject invalid longitude', () => {
      const invalidSearch = {
        latitude: 40.7128,
        longitude: 200,
        radiusKm: 10
      };

      const result = locationSearchSchema.safeParse(invalidSearch);
      expect(result.success).toBe(false);
    });

    it('should use default radius when not provided', () => {
      const searchData = {
        latitude: 40.7128,
        longitude: -74.0060
      };

      const result = locationSearchSchema.safeParse(searchData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.radiusKm).toBe(10);
      }
    });

    it('should accept location search with filters', () => {
      const validSearch = {
        latitude: 40.7128,
        longitude: -74.0060,
        radiusKm: 20,
        filters: {
          type: ServiceType.Emergency,
          minRating: 4
        }
      };

      const result = locationSearchSchema.safeParse(validSearch);
      expect(result.success).toBe(true);
    });
  });
});
