// Product Filter Types

export interface ProductFilter {
  category?: string;
  status?: string;
  priceRange?: [number, number];
  search?: string;
  tags?: string[];
}

