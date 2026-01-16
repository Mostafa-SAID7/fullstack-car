/**
 * Product Types for Marketplace Integration
 * These types match the backend Product entity and DTOs
 */

/**
 * Product status enum matching backend ProductStatus
 */
export const ProductStatus = {
  Active: 'Active',
  Inactive: 'Inactive',
  OutOfStock: 'OutOfStock',
  Discontinued: 'Discontinued',
  Draft: 'Draft',
  PendingApproval: 'PendingApproval'
} as const;

export type ProductStatus = typeof ProductStatus[keyof typeof ProductStatus];

/**
 * Product category enum matching backend ProductCategory
 */
export const ProductCategory = {
  General: 'General',
  Electronics: 'Electronics',
  Clothing: 'Clothing',
  Books: 'Books',
  Home: 'Home',
  Sports: 'Sports',
  Beauty: 'Beauty',
  Automotive: 'Automotive',
  Food: 'Food',
  Toys: 'Toys',
  Health: 'Health',
  Software: 'Software'
} as const;

export type ProductCategory = typeof ProductCategory[keyof typeof ProductCategory];

/**
 * Product DTO matching backend ProductDto
 */
export interface ProductDto {
  /** Unique identifier */
  id: string;
  /** Product name */
  name: string;
  /** Product description */
  description: string;
  /** Stock Keeping Unit */
  sku: string;
  /** Regular price */
  price: number;
  /** Discounted price (optional) */
  discountPrice?: number;
  /** Current stock quantity */
  stockQuantity: number;
  /** Minimum stock level for alerts */
  minStockLevel: number;
  /** Product status */
  status: ProductStatus;
  /** Product category */
  category: ProductCategory;
  /** Image URL (optional) */
  imageUrl?: string;
  /** Brand name (optional) */
  brand?: string;
  /** Model name (optional) */
  model?: string;
  /** Weight in kg */
  weight: number;
  /** Dimensions string (optional) */
  dimensions?: string;
  /** Whether product is featured */
  isFeatured: boolean;
  /** Whether product is digital */
  isDigital: boolean;
  /** Launch date (optional) */
  launchDate?: string;
  /** Comma-separated tags (optional) */
  tags?: string;
  /** Number of views */
  viewCount: number;
  /** Number of sales */
  salesCount: number;
  /** Average rating */
  rating: number;
  /** Number of reviews */
  reviewCount: number;
  /** Creation timestamp */
  createdAt: string;
  /** Last update timestamp */
  updatedAt: string;
  /** User who created the product */
  createdByUserId?: string;
  /** User who last updated the product */
  updatedByUserId?: string;
}

/**
 * Request DTO for creating a new product
 */
export interface CreateProductRequest {
  /** Product name */
  name: string;
  /** Product description */
  description: string;
  /** Stock Keeping Unit */
  sku: string;
  /** Regular price */
  price: number;
  /** Discounted price (optional) */
  discountPrice?: number;
  /** Initial stock quantity */
  stockQuantity: number;
  /** Minimum stock level for alerts */
  minStockLevel: number;
  /** Product category */
  category: ProductCategory;
  /** Image URL (optional) */
  imageUrl?: string;
  /** Brand name (optional) */
  brand?: string;
  /** Model name (optional) */
  model?: string;
  /** Weight in kg */
  weight: number;
  /** Dimensions string (optional) */
  dimensions?: string;
  /** Whether product is featured (optional, defaults to false) */
  isFeatured?: boolean;
  /** Whether product is digital (optional, defaults to false) */
  isDigital?: boolean;
  /** Launch date (optional) */
  launchDate?: string;
  /** Comma-separated tags (optional) */
  tags?: string;
}

/**
 * Request DTO for updating an existing product
 * All fields are optional except id
 */
export interface UpdateProductRequest extends Partial<CreateProductRequest> {
  /** Product ID */
  id: string;
}

/**
 * Filter parameters for product queries
 */
export interface ProductFilters {
  /** Page number for pagination */
  page?: number;
  /** Page size for pagination */
  pageSize?: number;
  /** Search term for name/description */
  search?: string;
  /** Filter by status */
  status?: ProductStatus;
  /** Filter by category */
  category?: ProductCategory;
  /** Filter by brand */
  brand?: string;
  /** Minimum price filter */
  minPrice?: number;
  /** Maximum price filter */
  maxPrice?: number;
  /** Filter featured products */
  isFeatured?: boolean;
  /** Filter low stock products */
  isLowStock?: boolean;
  /** Sort field */
  sortBy?: string;
  /** Sort direction */
  sortDirection?: 'asc' | 'desc';
}

/**
 * Product statistics DTO
 */
export interface ProductStatistics {
  /** Total number of products */
  totalProducts: number;
  /** Number of active products */
  activeProducts: number;
  /** Number of inactive products */
  inactiveProducts: number;
  /** Number of out of stock products */
  outOfStockProducts: number;
  /** Number of low stock products */
  lowStockProducts: number;
  /** Total revenue from all products */
  totalRevenue: number;
  /** Total sales count */
  totalSales: number;
  /** Average product rating */
  averageRating: number;
  /** Top selling products */
  topSellingProducts?: ProductDto[];
  /** Low stock products */
  lowStockAlerts?: ProductDto[];
}

/**
 * Paged result wrapper for product lists
 */
export interface PagedResult<T> {
  /** Items in current page */
  items: T[];
  /** Total number of items */
  totalCount: number;
  /** Current page number */
  page: number;
  /** Page size */
  pageSize: number;
  /** Total number of pages */
  totalPages: number;
  /** Whether there is a next page */
  hasNextPage: boolean;
  /** Whether there is a previous page */
  hasPreviousPage: boolean;
}
