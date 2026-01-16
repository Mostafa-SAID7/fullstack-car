/**
 * Tests for VirtualizedProductList Component
 * Validates virtual scrolling functionality and performance optimizations
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { VirtualizedProductList } from '../VirtualizedProductList';
import { useProducts } from '../../../../../hooks/marketplace';
import { useIsMobile } from '../../../../../hooks/useResponsive';
import type { ProductDto } from '../../../../../types/marketplace';

// Mock dependencies
jest.mock('../../../../../hooks/marketplace');
jest.mock('../../../../../hooks/useResponsive');
jest.mock('../../../../../services/marketplace', () => ({
  productManagementService: {
    bulkDelete: jest.fn(),
    bulkUpdateStatus: jest.fn()
  }
}));
jest.mock('../../../../../components/shared/VirtualList', () => ({
  VirtualList: ({ items, renderItem, containerHeight }: any) => (
    <div data-testid="virtual-list" style={{ height: containerHeight }}>
      <div data-testid="virtual-list-content">
        Virtual List with {items.length} items
      </div>
    </div>
  )
}));
jest.mock('../../../../../components/shared/LazyImage', () => ({
  LazyImage: ({ alt }: any) => <img alt={alt} data-testid="lazy-image" />
}));

const mockUseProducts = useProducts as jest.MockedFunction<typeof useProducts>;
const mockUseIsMobile = useIsMobile as jest.MockedFunction<typeof useIsMobile>;

// Mock product data
const mockProducts: ProductDto[] = Array.from({ length: 5 }, (_, index) => ({
  id: `product-${index}`,
  name: `Product ${index}`,
  description: `Description for product ${index}`,
  sku: `SKU-${index}`,
  price: 100 + index,
  discountPrice: index % 2 === 0 ? 90 + index : undefined,
  stockQuantity: 50 - index,
  minStockLevel: 10,
  status: index % 3 === 0 ? 'Active' : 'Inactive',
  category: 'General',
  imageUrl: `https://example.com/image-${index}.jpg`,
  brand: `Brand ${index % 5}`,
  model: `Model ${index}`,
  weight: 1.5,
  dimensions: '10x10x10',
  isFeatured: index % 5 === 0,
  isDigital: false,
  launchDate: '2024-01-01',
  tags: 'tag1,tag2',
  viewCount: index * 10,
  salesCount: index * 2,
  rating: 4.5,
  reviewCount: index,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z'
}));

describe('VirtualizedProductList', () => {
  beforeEach(() => {
    mockUseProducts.mockReturnValue({
      products: {
        items: mockProducts,
        totalCount: mockProducts.length,
        page: 1,
        pageSize: 20,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false
      },
      loading: false,
      error: null,
      fetchProducts: jest.fn(),
      refetch: jest.fn(),
      clearError: jest.fn(),
      currentFilters: undefined
    });
    mockUseIsMobile.mockReturnValue(false);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render virtual list with products', () => {
    render(<VirtualizedProductList />);
    
    expect(screen.getByTestId('virtual-list')).toBeInTheDocument();
    expect(screen.getByTestId('virtual-list-content')).toBeInTheDocument();
    expect(screen.getByText('Virtual List with 5 items')).toBeInTheDocument();
  });

  it('should use correct container height', () => {
    const customHeight = 800;
    render(<VirtualizedProductList containerHeight={customHeight} />);
    
    const virtualList = screen.getByTestId('virtual-list');
    expect(virtualList).toHaveStyle({ height: `${customHeight}px` });
  });

  it('should show loading state', () => {
    mockUseProducts.mockReturnValue({
      products: null,
      loading: true,
      error: null,
      fetchProducts: jest.fn(),
      refetch: jest.fn(),
      clearError: jest.fn(),
      currentFilters: undefined
    });
    
    render(<VirtualizedProductList />);
    
    const loadingElement = document.querySelector('.animate-spin');
    expect(loadingElement).toBeInTheDocument();
  });

  it('should show error state', () => {
    const errorMessage = 'Failed to load products';
    mockUseProducts.mockReturnValue({
      products: null,
      loading: false,
      error: errorMessage,
      fetchProducts: jest.fn(),
      refetch: jest.fn(),
      clearError: jest.fn(),
      currentFilters: undefined
    });
    
    render(<VirtualizedProductList />);
    
    expect(screen.getByText('Error loading products')).toBeInTheDocument();
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('should show empty state when no products', () => {
    mockUseProducts.mockReturnValue({
      products: {
        items: [],
        totalCount: 0,
        page: 1,
        pageSize: 20,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false
      },
      loading: false,
      error: null,
      fetchProducts: jest.fn(),
      refetch: jest.fn(),
      clearError: jest.fn(),
      currentFilters: undefined
    });
    
    render(<VirtualizedProductList />);
    
    expect(screen.getByText('No products found')).toBeInTheDocument();
  });

  it('should apply filters correctly', () => {
    const filters = {
      search: 'test',
      status: 'Active' as const,
      category: 'General' as const
    };
    
    render(<VirtualizedProductList filters={filters} />);
    
    expect(mockUseProducts).toHaveBeenCalledWith({
      initialFilters: filters,
      autoFetch: true
    });
  });

  it('should show performance info in development', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    
    render(<VirtualizedProductList />);
    
    expect(screen.getByText(/Virtual scrolling enabled/)).toBeInTheDocument();
    
    process.env.NODE_ENV = originalEnv;
  });
});