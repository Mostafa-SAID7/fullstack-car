// Product Types

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

