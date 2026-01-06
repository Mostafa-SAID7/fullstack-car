// Products Types

export interface Product {
  id: string;
  name: string;
  description: string;
  sku: string;
  price: number;
  comparePrice?: number;
  cost?: number;
  category: ProductCategory;
  brand?: string;
  status: ProductStatus;
  visibility: ProductVisibility;
  inventory: ProductInventory;
  images: ProductImage[];
  attributes: ProductAttribute[];
  variants?: ProductVariant[];
  seo?: ProductSEO;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy?: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
  level: number;
  sortOrder: number;
  isActive: boolean;
}

export type ProductStatus = 'draft' | 'active' | 'inactive' | 'archived';
export type ProductVisibility = 'public' | 'private' | 'hidden';

export interface ProductInventory {
  trackQuantity: boolean;
  quantity: number;
  lowStockThreshold?: number;
  allowBackorder: boolean;
  weight?: number;
  dimensions?: ProductDimensions;
  shippingRequired: boolean;
}

export interface ProductDimensions {
  length: number;
  width: number;
  height: number;
  unit: 'cm' | 'in';
}

export interface ProductImage {
  id: string;
  url: string;
  thumbnailUrl: string;
  altText?: string;
  sortOrder: number;
  isPrimary: boolean;
}

export interface ProductAttribute {
  id: string;
  name: string;
  value: string;
  type: AttributeType;
  isRequired: boolean;
  isVariant: boolean;
}

export type AttributeType = 'text' | 'number' | 'boolean' | 'select' | 'multiselect' | 'date';

export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  price?: number;
  comparePrice?: number;
  cost?: number;
  inventory: ProductInventory;
  attributes: Record<string, string>;
  image?: ProductImage;
  isDefault: boolean;
}

export interface ProductSEO {
  title?: string;
  description?: string;
  keywords?: string[];
  slug: string;
}

export interface ProductFilter {
  search?: string;
  category?: string;
  status?: ProductStatus;
  visibility?: ProductVisibility;
  priceMin?: number;
  priceMax?: number;
  brand?: string;
  inStock?: boolean;
  tags?: string[];
}

export interface ProductSort {
  field: 'name' | 'price' | 'createdAt' | 'updatedAt' | 'inventory.quantity';
  direction: 'asc' | 'desc';
}

export interface CreateProductRequest {
  name: string;
  description: string;
  sku?: string;
  price: number;
  comparePrice?: number;
  cost?: number;
  categoryId: string;
  brand?: string;
  status?: ProductStatus;
  visibility?: ProductVisibility;
  inventory: Omit<ProductInventory, 'quantity'> & { quantity?: number };
  attributes?: Omit<ProductAttribute, 'id'>[];
  seo?: ProductSEO;
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {
  id: string;
}

export interface ProductStats {
  total: number;
  active: number;
  inactive: number;
  draft: number;
  lowStock: number;
  outOfStock: number;
  totalValue: number;
  averagePrice: number;
}

export interface ProductAnalytics {
  views: number;
  sales: number;
  revenue: number;
  conversionRate: number;
  averageOrderValue: number;
  topVariants: ProductVariant[];
  performanceMetrics: {
    date: string;
    views: number;
    sales: number;
    revenue: number;
  }[];
}