// Products Page Component Types

import type { Product } from '../../products';

export interface ProductsGridProps {
  products: Product[];
  loading?: boolean;
  error?: string;
  onProductClick?: (product: Product) => void;
  onProductEdit?: (product: Product) => void;
  onProductDelete?: (productId: string) => void;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}
