/**
 * Marketplace Validation Schemas
 * Zod validation schemas for marketplace entities (Products, Services)
 * These schemas match backend validation rules for consistency
 */

import { z } from 'zod';
import { ProductCategory, ProductStatus } from '../../types/marketplace/product.types';

/**
 * Product validation schema for creating a new product
 * Matches CreateProductRequest DTO from backend
 */
export const createProductSchema = z.object({
  // Required fields
  name: z
    .string()
    .min(2, 'Product name must be at least 2 characters')
    .max(200, 'Product name must be less than 200 characters')
    .trim(),

  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(2000, 'Description must be less than 2000 characters')
    .trim(),

  sku: z
    .string()
    .min(3, 'SKU must be at least 3 characters')
    .max(50, 'SKU must be less than 50 characters')
    .regex(/^[A-Z0-9-]+$/, 'SKU must contain only uppercase letters, numbers, and hyphens')
    .trim(),

  price: z
    .number()
    .positive('Price must be greater than 0')
    .max(1000000, 'Price must be less than 1,000,000')
    .multipleOf(0.01, 'Price must have at most 2 decimal places'),

  stockQuantity: z
    .number()
    .int('Stock quantity must be a whole number')
    .min(0, 'Stock quantity cannot be negative')
    .max(1000000, 'Stock quantity must be less than 1,000,000'),

  minStockLevel: z
    .number()
    .int('Minimum stock level must be a whole number')
    .min(0, 'Minimum stock level cannot be negative')
    .max(10000, 'Minimum stock level must be less than 10,000'),

  category: z.nativeEnum(ProductCategory, {
    errorMap: () => ({ message: 'Please select a valid category' })
  }),

  weight: z
    .number()
    .positive('Weight must be greater than 0')
    .max(10000, 'Weight must be less than 10,000 kg')
    .multipleOf(0.01, 'Weight must have at most 2 decimal places'),

  // Optional fields
  discountPrice: z
    .number()
    .positive('Discount price must be greater than 0')
    .max(1000000, 'Discount price must be less than 1,000,000')
    .multipleOf(0.01, 'Discount price must have at most 2 decimal places')
    .optional()
    .nullable(),

  imageUrl: z
    .string()
    .url('Please enter a valid image URL')
    .max(500, 'Image URL must be less than 500 characters')
    .optional()
    .nullable(),

  brand: z
    .string()
    .min(2, 'Brand name must be at least 2 characters')
    .max(100, 'Brand name must be less than 100 characters')
    .trim()
    .optional()
    .nullable(),

  model: z
    .string()
    .min(1, 'Model must be at least 1 character')
    .max(100, 'Model must be less than 100 characters')
    .trim()
    .optional()
    .nullable(),

  dimensions: z
    .string()
    .max(100, 'Dimensions must be less than 100 characters')
    .regex(/^\d+(\.\d+)?\s*x\s*\d+(\.\d+)?\s*x\s*\d+(\.\d+)?(\s*(cm|m|in|ft))?$/i, 
      'Dimensions must be in format: LxWxH (e.g., "10x20x30 cm")')
    .trim()
    .optional()
    .nullable(),

  isFeatured: z
    .boolean()
    .optional()
    .default(false),

  isDigital: z
    .boolean()
    .optional()
    .default(false),

  launchDate: z
    .string()
    .datetime('Please enter a valid date')
    .optional()
    .nullable(),

  tags: z
    .string()
    .max(500, 'Tags must be less than 500 characters')
    .regex(/^[a-zA-Z0-9,\s-]*$/, 'Tags can only contain letters, numbers, commas, spaces, and hyphens')
    .trim()
    .optional()
    .nullable()
}).refine(
  (data) => {
    // Validate that discount price is less than regular price
    if (data.discountPrice && data.discountPrice >= data.price) {
      return false;
    }
    return true;
  },
  {
    message: 'Discount price must be less than regular price',
    path: ['discountPrice']
  }
).refine(
  (data) => {
    // Validate that launch date is not in the past (if provided)
    if (data.launchDate) {
      const launchDate = new Date(data.launchDate);
      const now = new Date();
      // Allow dates from yesterday onwards (to account for timezone differences)
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (launchDate < yesterday) {
        return false;
      }
    }
    return true;
  },
  {
    message: 'Launch date cannot be in the past',
    path: ['launchDate']
  }
);

/**
 * Product validation schema for updating an existing product
 * All fields are optional except id
 */
export const updateProductSchema = z.object({
  id: z.string().uuid('Invalid product ID'),
  
  name: z
    .string()
    .min(2, 'Product name must be at least 2 characters')
    .max(200, 'Product name must be less than 200 characters')
    .trim()
    .optional(),

  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(2000, 'Description must be less than 2000 characters')
    .trim()
    .optional(),

  sku: z
    .string()
    .min(3, 'SKU must be at least 3 characters')
    .max(50, 'SKU must be less than 50 characters')
    .regex(/^[A-Z0-9-]+$/, 'SKU must contain only uppercase letters, numbers, and hyphens')
    .trim()
    .optional(),

  price: z
    .number()
    .positive('Price must be greater than 0')
    .max(1000000, 'Price must be less than 1,000,000')
    .multipleOf(0.01, 'Price must have at most 2 decimal places')
    .optional(),

  discountPrice: z
    .number()
    .positive('Discount price must be greater than 0')
    .max(1000000, 'Discount price must be less than 1,000,000')
    .multipleOf(0.01, 'Discount price must have at most 2 decimal places')
    .optional()
    .nullable(),

  stockQuantity: z
    .number()
    .int('Stock quantity must be a whole number')
    .min(0, 'Stock quantity cannot be negative')
    .max(1000000, 'Stock quantity must be less than 1,000,000')
    .optional(),

  minStockLevel: z
    .number()
    .int('Minimum stock level must be a whole number')
    .min(0, 'Minimum stock level cannot be negative')
    .max(10000, 'Minimum stock level must be less than 10,000')
    .optional(),

  status: z.nativeEnum(ProductStatus, {
    errorMap: () => ({ message: 'Please select a valid status' })
  }).optional(),

  category: z.nativeEnum(ProductCategory, {
    errorMap: () => ({ message: 'Please select a valid category' })
  }).optional(),

  imageUrl: z
    .string()
    .url('Please enter a valid image URL')
    .max(500, 'Image URL must be less than 500 characters')
    .optional()
    .nullable(),

  brand: z
    .string()
    .min(2, 'Brand name must be at least 2 characters')
    .max(100, 'Brand name must be less than 100 characters')
    .trim()
    .optional()
    .nullable(),

  model: z
    .string()
    .min(1, 'Model must be at least 1 character')
    .max(100, 'Model must be less than 100 characters')
    .trim()
    .optional()
    .nullable(),

  weight: z
    .number()
    .positive('Weight must be greater than 0')
    .max(10000, 'Weight must be less than 10,000 kg')
    .multipleOf(0.01, 'Weight must have at most 2 decimal places')
    .optional(),

  dimensions: z
    .string()
    .max(100, 'Dimensions must be less than 100 characters')
    .regex(/^\d+(\.\d+)?\s*x\s*\d+(\.\d+)?\s*x\s*\d+(\.\d+)?(\s*(cm|m|in|ft))?$/i, 
      'Dimensions must be in format: LxWxH (e.g., "10x20x30 cm")')
    .trim()
    .optional()
    .nullable(),

  isFeatured: z.boolean().optional(),
  isDigital: z.boolean().optional(),

  launchDate: z
    .string()
    .datetime('Please enter a valid date')
    .optional()
    .nullable(),

  tags: z
    .string()
    .max(500, 'Tags must be less than 500 characters')
    .regex(/^[a-zA-Z0-9,\s-]*$/, 'Tags can only contain letters, numbers, commas, spaces, and hyphens')
    .trim()
    .optional()
    .nullable()
}).refine(
  (data) => {
    // Validate that discount price is less than regular price (if both provided)
    if (data.discountPrice && data.price && data.discountPrice >= data.price) {
      return false;
    }
    return true;
  },
  {
    message: 'Discount price must be less than regular price',
    path: ['discountPrice']
  }
);

/**
 * Product filters validation schema
 */
export const productFiltersSchema = z.object({
  page: z.number().int().positive().optional(),
  pageSize: z.number().int().positive().max(100).optional(),
  search: z.string().max(200).optional(),
  status: z.nativeEnum(ProductStatus).optional(),
  category: z.nativeEnum(ProductCategory).optional(),
  brand: z.string().max(100).optional(),
  minPrice: z.number().positive().optional(),
  maxPrice: z.number().positive().optional(),
  isFeatured: z.boolean().optional(),
  isLowStock: z.boolean().optional(),
  sortBy: z.string().max(50).optional(),
  sortDirection: z.enum(['asc', 'desc']).optional()
}).refine(
  (data) => {
    // Validate that maxPrice is greater than minPrice
    if (data.minPrice && data.maxPrice && data.maxPrice <= data.minPrice) {
      return false;
    }
    return true;
  },
  {
    message: 'Maximum price must be greater than minimum price',
    path: ['maxPrice']
  }
);

/**
 * Bulk product operations validation
 */
export const bulkProductOperationSchema = z.object({
  productIds: z
    .array(z.string().uuid('Invalid product ID'))
    .min(1, 'At least one product must be selected')
    .max(100, 'Cannot perform bulk operation on more than 100 products at once'),
  
  operation: z.enum(['delete', 'updateStatus', 'updateCategory', 'updateFeatured'], {
    errorMap: () => ({ message: 'Invalid bulk operation' })
  }),
  
  // Optional parameters based on operation
  status: z.nativeEnum(ProductStatus).optional(),
  category: z.nativeEnum(ProductCategory).optional(),
  isFeatured: z.boolean().optional()
}).refine(
  (data) => {
    // Validate that required parameters are provided based on operation
    if (data.operation === 'updateStatus' && !data.status) {
      return false;
    }
    if (data.operation === 'updateCategory' && !data.category) {
      return false;
    }
    if (data.operation === 'updateFeatured' && data.isFeatured === undefined) {
      return false;
    }
    return true;
  },
  {
    message: 'Required parameter missing for the selected operation',
    path: ['operation']
  }
);

/**
 * Product image validation
 */
export const productImageSchema = z.object({
  file: z.instanceof(File, { message: 'Please select a file' }),
  type: z.string().refine(
    (type) => ['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(type),
    'Only JPEG, PNG, WebP, and GIF images are allowed'
  ),
  size: z.number().max(5 * 1024 * 1024, 'Image size must be less than 5MB')
});

/**
 * Type exports for TypeScript inference
 */
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ProductFiltersInput = z.infer<typeof productFiltersSchema>;
export type BulkProductOperationInput = z.infer<typeof bulkProductOperationSchema>;
export type ProductImageInput = z.infer<typeof productImageSchema>;

// ============================================================================
// SERVICE VALIDATION SCHEMAS
// ============================================================================

import { ServiceType, ServiceStatus } from '../../types/marketplace/service.types';

/**
 * Service validation schema for creating a new service
 * Matches CreateServiceRequest DTO from backend
 */
export const createServiceSchema = z.object({
  // Required fields
  serviceProviderId: z
    .string()
    .uuid('Please select a valid service provider'),

  name: z
    .string()
    .min(2, 'Service name must be at least 2 characters')
    .max(200, 'Service name must be less than 200 characters')
    .trim(),

  title: z
    .string()
    .min(5, 'Service title must be at least 5 characters')
    .max(250, 'Service title must be less than 250 characters')
    .trim(),

  description: z
    .string()
    .min(20, 'Description must be at least 20 characters')
    .max(5000, 'Description must be less than 5000 characters')
    .trim(),

  shortDescription: z
    .string()
    .min(10, 'Short description must be at least 10 characters')
    .max(500, 'Short description must be less than 500 characters')
    .trim(),

  basePrice: z
    .number()
    .positive('Base price must be greater than 0')
    .max(1000000, 'Base price must be less than 1,000,000')
    .multipleOf(0.01, 'Base price must have at most 2 decimal places'),

  estimatedDuration: z
    .number()
    .int('Estimated duration must be a whole number')
    .positive('Estimated duration must be greater than 0')
    .max(10080, 'Estimated duration must be less than 10,080 minutes (1 week)'),

  serviceType: z.nativeEnum(ServiceType, {
    errorMap: () => ({ message: 'Please select a valid service type' })
  }),

  category: z
    .string()
    .min(2, 'Category must be at least 2 characters')
    .max(100, 'Category must be less than 100 characters')
    .trim(),

  // Optional fields
  maxPrice: z
    .number()
    .positive('Maximum price must be greater than 0')
    .max(1000000, 'Maximum price must be less than 1,000,000')
    .multipleOf(0.01, 'Maximum price must have at most 2 decimal places')
    .optional()
    .nullable(),

  maxDuration: z
    .number()
    .int('Maximum duration must be a whole number')
    .positive('Maximum duration must be greater than 0')
    .max(10080, 'Maximum duration must be less than 10,080 minutes (1 week)')
    .optional()
    .nullable(),

  subCategory: z
    .string()
    .min(2, 'Sub-category must be at least 2 characters')
    .max(100, 'Sub-category must be less than 100 characters')
    .trim()
    .optional()
    .nullable(),

  requirements: z
    .string()
    .max(2000, 'Requirements must be less than 2000 characters')
    .trim()
    .optional()
    .nullable(),

  inclusions: z
    .string()
    .max(2000, 'Inclusions must be less than 2000 characters')
    .trim()
    .optional()
    .nullable(),

  exclusions: z
    .string()
    .max(2000, 'Exclusions must be less than 2000 characters')
    .trim()
    .optional()
    .nullable(),

  tags: z
    .string()
    .max(500, 'Tags must be less than 500 characters')
    .regex(/^[a-zA-Z0-9,\s-]*$/, 'Tags can only contain letters, numbers, commas, spaces, and hyphens')
    .trim()
    .optional()
    .nullable(),

  requiresApproval: z
    .boolean()
    .optional()
    .default(false),

  sortOrder: z
    .number()
    .int('Sort order must be a whole number')
    .min(0, 'Sort order cannot be negative')
    .max(10000, 'Sort order must be less than 10,000')
    .optional()
    .default(0)
}).refine(
  (data) => {
    // Validate that maxPrice is greater than basePrice
    if (data.maxPrice && data.maxPrice <= data.basePrice) {
      return false;
    }
    return true;
  },
  {
    message: 'Maximum price must be greater than base price',
    path: ['maxPrice']
  }
).refine(
  (data) => {
    // Validate that maxDuration is greater than estimatedDuration
    if (data.maxDuration && data.maxDuration <= data.estimatedDuration) {
      return false;
    }
    return true;
  },
  {
    message: 'Maximum duration must be greater than estimated duration',
    path: ['maxDuration']
  }
);

/**
 * Service validation schema for updating an existing service
 * All fields are optional except id
 */
export const updateServiceSchema = z.object({
  id: z.string().uuid('Invalid service ID'),

  serviceProviderId: z
    .string()
    .uuid('Please select a valid service provider')
    .optional(),

  name: z
    .string()
    .min(2, 'Service name must be at least 2 characters')
    .max(200, 'Service name must be less than 200 characters')
    .trim()
    .optional(),

  title: z
    .string()
    .min(5, 'Service title must be at least 5 characters')
    .max(250, 'Service title must be less than 250 characters')
    .trim()
    .optional(),

  description: z
    .string()
    .min(20, 'Description must be at least 20 characters')
    .max(5000, 'Description must be less than 5000 characters')
    .trim()
    .optional(),

  shortDescription: z
    .string()
    .min(10, 'Short description must be at least 10 characters')
    .max(500, 'Short description must be less than 500 characters')
    .trim()
    .optional(),

  basePrice: z
    .number()
    .positive('Base price must be greater than 0')
    .max(1000000, 'Base price must be less than 1,000,000')
    .multipleOf(0.01, 'Base price must have at most 2 decimal places')
    .optional(),

  maxPrice: z
    .number()
    .positive('Maximum price must be greater than 0')
    .max(1000000, 'Maximum price must be less than 1,000,000')
    .multipleOf(0.01, 'Maximum price must have at most 2 decimal places')
    .optional()
    .nullable(),

  estimatedDuration: z
    .number()
    .int('Estimated duration must be a whole number')
    .positive('Estimated duration must be greater than 0')
    .max(10080, 'Estimated duration must be less than 10,080 minutes (1 week)')
    .optional(),

  maxDuration: z
    .number()
    .int('Maximum duration must be a whole number')
    .positive('Maximum duration must be greater than 0')
    .max(10080, 'Maximum duration must be less than 10,080 minutes (1 week)')
    .optional()
    .nullable(),

  serviceType: z.nativeEnum(ServiceType, {
    errorMap: () => ({ message: 'Please select a valid service type' })
  }).optional(),

  category: z
    .string()
    .min(2, 'Category must be at least 2 characters')
    .max(100, 'Category must be less than 100 characters')
    .trim()
    .optional(),

  subCategory: z
    .string()
    .min(2, 'Sub-category must be at least 2 characters')
    .max(100, 'Sub-category must be less than 100 characters')
    .trim()
    .optional()
    .nullable(),

  status: z.nativeEnum(ServiceStatus, {
    errorMap: () => ({ message: 'Please select a valid status' })
  }).optional(),

  isActive: z.boolean().optional(),
  isPopular: z.boolean().optional(),
  requiresApproval: z.boolean().optional(),

  requirements: z
    .string()
    .max(2000, 'Requirements must be less than 2000 characters')
    .trim()
    .optional()
    .nullable(),

  inclusions: z
    .string()
    .max(2000, 'Inclusions must be less than 2000 characters')
    .trim()
    .optional()
    .nullable(),

  exclusions: z
    .string()
    .max(2000, 'Exclusions must be less than 2000 characters')
    .trim()
    .optional()
    .nullable(),

  tags: z
    .string()
    .max(500, 'Tags must be less than 500 characters')
    .regex(/^[a-zA-Z0-9,\s-]*$/, 'Tags can only contain letters, numbers, commas, spaces, and hyphens')
    .trim()
    .optional()
    .nullable(),

  sortOrder: z
    .number()
    .int('Sort order must be a whole number')
    .min(0, 'Sort order cannot be negative')
    .max(10000, 'Sort order must be less than 10,000')
    .optional()
}).refine(
  (data) => {
    // Validate that maxPrice is greater than basePrice (if both provided)
    if (data.maxPrice && data.basePrice && data.maxPrice <= data.basePrice) {
      return false;
    }
    return true;
  },
  {
    message: 'Maximum price must be greater than base price',
    path: ['maxPrice']
  }
).refine(
  (data) => {
    // Validate that maxDuration is greater than estimatedDuration (if both provided)
    if (data.maxDuration && data.estimatedDuration && data.maxDuration <= data.estimatedDuration) {
      return false;
    }
    return true;
  },
  {
    message: 'Maximum duration must be greater than estimated duration',
    path: ['maxDuration']
  }
);

/**
 * Service filters validation schema
 */
export const serviceFiltersSchema = z.object({
  page: z.number().int().positive().optional(),
  pageSize: z.number().int().positive().max(100).optional(),
  searchTerm: z.string().max(200).optional(),
  type: z.nativeEnum(ServiceType).optional(),
  category: z.string().max(100).optional(),
  status: z.nativeEnum(ServiceStatus).optional(),
  serviceProviderId: z.string().uuid().optional(),
  minPrice: z.number().positive().optional(),
  maxPrice: z.number().positive().optional(),
  isEmergencyService: z.boolean().optional(),
  isAvailable24x7: z.boolean().optional(),
  minRating: z.number().min(0).max(5).optional(),
  isActive: z.boolean().optional(),
  isPopular: z.boolean().optional(),
  sortBy: z.string().max(50).optional(),
  sortDescending: z.boolean().optional()
}).refine(
  (data) => {
    // Validate that maxPrice is greater than minPrice
    if (data.minPrice && data.maxPrice && data.maxPrice <= data.minPrice) {
      return false;
    }
    return true;
  },
  {
    message: 'Maximum price must be greater than minimum price',
    path: ['maxPrice']
  }
);

/**
 * Bulk service operations validation
 */
export const bulkServiceOperationSchema = z.object({
  serviceIds: z
    .array(z.string().uuid('Invalid service ID'))
    .min(1, 'At least one service must be selected')
    .max(100, 'Cannot perform bulk operation on more than 100 services at once'),
  
  operation: z.enum(['delete', 'updateStatus', 'updateActive', 'updatePopular'], {
    errorMap: () => ({ message: 'Invalid bulk operation' })
  }),
  
  // Optional parameters based on operation
  status: z.nativeEnum(ServiceStatus).optional(),
  isActive: z.boolean().optional(),
  isPopular: z.boolean().optional()
}).refine(
  (data) => {
    // Validate that required parameters are provided based on operation
    if (data.operation === 'updateStatus' && !data.status) {
      return false;
    }
    if (data.operation === 'updateActive' && data.isActive === undefined) {
      return false;
    }
    if (data.operation === 'updatePopular' && data.isPopular === undefined) {
      return false;
    }
    return true;
  },
  {
    message: 'Required parameter missing for the selected operation',
    path: ['operation']
  }
);

/**
 * Location-based search validation
 */
export const locationSearchSchema = z.object({
  latitude: z
    .number()
    .min(-90, 'Latitude must be between -90 and 90')
    .max(90, 'Latitude must be between -90 and 90'),
  
  longitude: z
    .number()
    .min(-180, 'Longitude must be between -180 and 180')
    .max(180, 'Longitude must be between -180 and 180'),
  
  radiusKm: z
    .number()
    .positive('Radius must be greater than 0')
    .max(500, 'Radius must be less than 500 km')
    .optional()
    .default(10),
  
  filters: serviceFiltersSchema.partial().optional()
});

/**
 * Type exports for TypeScript inference
 */
export type CreateServiceInput = z.infer<typeof createServiceSchema>;
export type UpdateServiceInput = z.infer<typeof updateServiceSchema>;
export type ServiceFiltersInput = z.infer<typeof serviceFiltersSchema>;
export type BulkServiceOperationInput = z.infer<typeof bulkServiceOperationSchema>;
export type LocationSearchInput = z.infer<typeof locationSearchSchema>;
