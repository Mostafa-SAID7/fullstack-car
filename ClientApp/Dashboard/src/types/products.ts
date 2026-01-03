export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image?: string;
  category: string;
  status: 'active' | 'inactive' | 'out_of_stock';
  stock: number;
  rating?: number;
  reviews?: number;
  sku?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  description?: string;
  image?: string;
  productCount: number;
}

export interface ProductFilter {
  category?: string;
  status?: string;
  priceRange?: [number, number];
  search?: string;
  tags?: string[];
}

export interface ProductStats {
  totalProducts: number;
  activeProducts: number;
  inactiveProducts: number;
  outOfStockProducts: number;
  totalRevenue: number;
  averagePrice: number;
}