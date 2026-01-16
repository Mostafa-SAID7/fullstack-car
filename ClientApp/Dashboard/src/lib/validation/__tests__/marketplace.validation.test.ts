/**
 * Marketplace Validation Tests
 * Unit tests for product validation schemas
 */

import {
  createProductSchema,
  updateProductSchema,
  productFiltersSchema,
  bulkProductOperationSchema
} from '../marketplace.validation';
import { ProductCategory, ProductStatus } from '../../../types/marketplace/product.types';

describe('Product Validation', () => {
  describe('createProductSchema', () => {
    it('should validate valid product data', () => {
      const validData = {
        name: 'Test Product',
        description: 'This is a test product with a detailed description',
        sku: 'TEST-001',
        price: 99.99,
        stockQuantity: 100,
        minStockLevel: 10,
        category: ProductCategory.Electronics,
        weight: 1.5
      };

      const result = createProductSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject product with short name', () => {
      const invalidData = {
        name: 'A', // Too short
        description: 'This is a test product description',
        sku: 'TEST-001',
        price: 99.99,
        stockQuantity: 100,
        minStockLevel: 10,
        category: ProductCategory.Electronics,
        weight: 1.5
      };

      const result = createProductSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('at least 2 characters');
      }
    });

    it('should reject product with negative price', () => {
      const invalidData = {
        name: 'Test Product',
        description: 'This is a test product description',
        sku: 'TEST-001',
        price: -10, // Invalid
        stockQuantity: 100,
        minStockLevel: 10,
        category: ProductCategory.Electronics,
        weight: 1.5
      };

      const result = createProductSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('greater than 0');
      }
    });

    it('should reject product with invalid SKU format', () => {
      const invalidData = {
        name: 'Test Product',
        description: 'This is a test product description',
        sku: 'test-001', // Invalid: lowercase
        price: 99.99,
        stockQuantity: 100,
        minStockLevel: 10,
        category: ProductCategory.Electronics,
        weight: 1.5
      };

      const result = createProductSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('uppercase');
      }
    });

    it('should reject discount price >= regular price', () => {
      const invalidData = {
        name: 'Test Product',
        description: 'This is a test product description',
        sku: 'TEST-001',
        price: 100,
        discountPrice: 100, // Invalid: must be less than price
        stockQuantity: 100,
        minStockLevel: 10,
        category: ProductCategory.Electronics,
        weight: 1.5
      };

      const result = createProductSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('less than regular price');
      }
    });

    it('should accept valid discount price', () => {
      const validData = {
        name: 'Test Product',
        description: 'This is a test product description',
        sku: 'TEST-001',
        price: 100,
        discountPrice: 80, // Valid
        stockQuantity: 100,
        minStockLevel: 10,
        category: ProductCategory.Electronics,
        weight: 1.5
      };

      const result = createProductSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should validate dimensions format', () => {
      const validData = {
        name: 'Test Product',
        description: 'This is a test product description',
        sku: 'TEST-001',
        price: 99.99,
        stockQuantity: 100,
        minStockLevel: 10,
        category: ProductCategory.Electronics,
        weight: 1.5,
        dimensions: '10x20x30 cm' // Valid format
      };

      const result = createProductSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid dimensions format', () => {
      const invalidData = {
        name: 'Test Product',
        description: 'This is a test product description',
        sku: 'TEST-001',
        price: 99.99,
        stockQuantity: 100,
        minStockLevel: 10,
        category: ProductCategory.Electronics,
        weight: 1.5,
        dimensions: 'invalid' // Invalid format
      };

      const result = createProductSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('LxWxH');
      }
    });

    it('should accept optional fields as null', () => {
      const validData = {
        name: 'Test Product',
        description: 'This is a test product description',
        sku: 'TEST-001',
        price: 99.99,
        stockQuantity: 100,
        minStockLevel: 10,
        category: ProductCategory.Electronics,
        weight: 1.5,
        brand: null,
        model: null,
        imageUrl: null
      };

      const result = createProductSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  describe('updateProductSchema', () => {
    it('should validate update with only id', () => {
      const validData = {
        id: '123e4567-e89b-12d3-a456-426614174000'
      };

      const result = updateProductSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should validate partial update', () => {
      const validData = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Updated Product Name',
        price: 149.99
      };

      const result = updateProductSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid UUID', () => {
      const invalidData = {
        id: 'not-a-uuid',
        name: 'Updated Product'
      };

      const result = updateProductSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('Invalid product ID');
      }
    });
  });

  describe('productFiltersSchema', () => {
    it('should validate empty filters', () => {
      const validData = {};

      const result = productFiltersSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should validate filters with all fields', () => {
      const validData = {
        page: 1,
        pageSize: 20,
        search: 'test',
        status: ProductStatus.Active,
        category: ProductCategory.Electronics,
        minPrice: 10,
        maxPrice: 100,
        sortBy: 'name',
        sortDirection: 'asc' as const
      };

      const result = productFiltersSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject maxPrice <= minPrice', () => {
      const invalidData = {
        minPrice: 100,
        maxPrice: 50 // Invalid
      };

      const result = productFiltersSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('greater than minimum');
      }
    });

    it('should reject invalid sort direction', () => {
      const invalidData = {
        sortDirection: 'invalid' as any
      };

      const result = productFiltersSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('bulkProductOperationSchema', () => {
    it('should validate delete operation', () => {
      const validData = {
        productIds: [
          '123e4567-e89b-12d3-a456-426614174000',
          '123e4567-e89b-12d3-a456-426614174001'
        ],
        operation: 'delete' as const
      };

      const result = bulkProductOperationSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should validate updateStatus operation with status', () => {
      const validData = {
        productIds: ['123e4567-e89b-12d3-a456-426614174000'],
        operation: 'updateStatus' as const,
        status: ProductStatus.Active
      };

      const result = bulkProductOperationSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject updateStatus without status parameter', () => {
      const invalidData = {
        productIds: ['123e4567-e89b-12d3-a456-426614174000'],
        operation: 'updateStatus' as const
        // Missing status
      };

      const result = bulkProductOperationSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('Required parameter');
      }
    });

    it('should reject empty product IDs array', () => {
      const invalidData = {
        productIds: [],
        operation: 'delete' as const
      };

      const result = bulkProductOperationSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('At least one product');
      }
    });

    it('should reject too many product IDs', () => {
      const invalidData = {
        productIds: Array(101).fill('123e4567-e89b-12d3-a456-426614174000'),
        operation: 'delete' as const
      };

      const result = bulkProductOperationSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('more than 100');
      }
    });
  });
});
