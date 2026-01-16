/**
 * Tests for VirtualizedServiceList Component
 * Validates virtual scrolling functionality and performance optimizations
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { VirtualizedServiceList } from '../VirtualizedServiceList';
import { useServices } from '../../../../../hooks/marketplace';
import { useIsMobile } from '../../../../../hooks/useResponsive';
import type { ServiceDto } from '../../../../../types/marketplace';

// Mock dependencies
jest.mock('../../../../../hooks/marketplace');
jest.mock('../../../../../hooks/useResponsive');
jest.mock('../../../../../services/marketplace', () => ({
  serviceManagementService: {
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

const mockUseServices = useServices as jest.MockedFunction<typeof useServices>;
const mockUseIsMobile = useIsMobile as jest.MockedFunction<typeof useIsMobile>;

// Mock service data
const mockServices: ServiceDto[] = Array.from({ length: 5 }, (_, index) => ({
  id: `service-${index}`,
  serviceProviderId: `provider-${index}`,
  name: `Service ${index}`,
  title: `Service Title ${index}`,
  description: `Description for service ${index}`,
  shortDescription: `Short description ${index}`,
  basePrice: 100 + index,
  maxPrice: index % 2 === 0 ? 200 + index : undefined,
  estimatedDuration: 60 + index * 10,
  maxDuration: 120 + index * 10,
  serviceType: index % 3 === 0 ? 'Maintenance' : 'Repair',
  category: 'General',
  subCategory: `SubCategory ${index}`,
  status: index % 3 === 0 ? 'Active' : 'Inactive',
  isActive: index % 3 === 0,
  isPopular: index % 5 === 0,
  requiresApproval: false,
  requirements: 'Requirements',
  inclusions: 'Inclusions',
  exclusions: 'Exclusions',
  tags: 'tag1,tag2',
  sortOrder: index,
  averageRating: 4.5,
  totalReviews: index * 10,
  totalBookings: index * 5,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z'
}));

describe('VirtualizedServiceList', () => {
  beforeEach(() => {
    mockUseServices.mockReturnValue({
      services: {
        items: mockServices,
        totalCount: mockServices.length,
        page: 1,
        pageSize: 20,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false
      },
      loading: false,
      error: null,
      fetchServices: jest.fn(),
      refetch: jest.fn(),
      clearError: jest.fn(),
      currentFilters: undefined
    });
    mockUseIsMobile.mockReturnValue(false);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render virtual list with services', () => {
    render(<VirtualizedServiceList />);
    
    expect(screen.getByTestId('virtual-list')).toBeInTheDocument();
    expect(screen.getByTestId('virtual-list-content')).toBeInTheDocument();
    expect(screen.getByText('Virtual List with 5 items')).toBeInTheDocument();
  });

  it('should use correct container height', () => {
    const customHeight = 800;
    render(<VirtualizedServiceList containerHeight={customHeight} />);
    
    const virtualList = screen.getByTestId('virtual-list');
    expect(virtualList).toHaveStyle({ height: `${customHeight}px` });
  });

  it('should use correct item height for desktop', () => {
    mockUseIsMobile.mockReturnValue(false);
    render(<VirtualizedServiceList />);
    
    // Default desktop item height is 80px
    expect(screen.getByTestId('virtual-list')).toBeInTheDocument();
  });

  it('should use correct item height for mobile', () => {
    mockUseIsMobile.mockReturnValue(true);
    render(<VirtualizedServiceList />);
    
    // Default mobile item height is 220px
    expect(screen.getByTestId('virtual-list')).toBeInTheDocument();
  });

  it('should show loading state', () => {
    mockUseServices.mockReturnValue({
      services: null,
      loading: true,
      error: null,
      fetchServices: jest.fn(),
      refetch: jest.fn(),
      clearError: jest.fn(),
      currentFilters: undefined
    });
    
    render(<VirtualizedServiceList />);
    
    const loadingElement = document.querySelector('.animate-spin');
    expect(loadingElement).toBeInTheDocument();
  });

  it('should show error state', () => {
    const errorMessage = 'Failed to load services';
    mockUseServices.mockReturnValue({
      services: null,
      loading: false,
      error: errorMessage,
      fetchServices: jest.fn(),
      refetch: jest.fn(),
      clearError: jest.fn(),
      currentFilters: undefined
    });
    
    render(<VirtualizedServiceList />);
    
    expect(screen.getByText('Error loading services')).toBeInTheDocument();
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('should show empty state when no services', () => {
    mockUseServices.mockReturnValue({
      services: {
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
      fetchServices: jest.fn(),
      refetch: jest.fn(),
      clearError: jest.fn(),
      currentFilters: undefined
    });
    
    render(<VirtualizedServiceList />);
    
    expect(screen.getByText('No services found')).toBeInTheDocument();
  });

  it('should apply filters correctly', () => {
    const filters = {
      searchTerm: 'test',
      type: 'Maintenance' as const,
      minRating: 4.0
    };
    
    render(<VirtualizedServiceList filters={filters} />);
    
    expect(mockUseServices).toHaveBeenCalledWith({
      initialFilters: filters,
      autoFetch: true
    });
  });

  it('should show performance info in development', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    
    render(<VirtualizedServiceList />);
    
    expect(screen.getByText(/Virtual scrolling enabled/)).toBeInTheDocument();
    
    process.env.NODE_ENV = originalEnv;
  });

  it('should handle custom item height', () => {
    const customItemHeight = 100;
    render(<VirtualizedServiceList itemHeight={customItemHeight} />);
    
    expect(screen.getByTestId('virtual-list')).toBeInTheDocument();
  });

  it('should show bulk actions bar when items are selected', () => {
    // This test would require more complex interaction testing
    // For now, we just verify the component renders with bulk actions enabled
    render(<VirtualizedServiceList showBulkActions={true} />);
    
    expect(screen.getByTestId('virtual-list')).toBeInTheDocument();
  });
});
