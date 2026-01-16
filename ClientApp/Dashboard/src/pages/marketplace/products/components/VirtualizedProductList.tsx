/**
 * VirtualizedProductList Component
 * High-performance product list using virtual scrolling for large datasets
 */

import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { Package, Edit, Trash2, Eye, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { VirtualList } from '../../../../components/shared/VirtualList';
import { LazyImage } from '../../../../components/shared/LazyImage';
import { useProducts } from '../../../../hooks/marketplace';
import { productManagementService } from '../../../../services/marketplace';
import { useIsMobile } from '../../../../hooks/useResponsive';
import type { ProductDto, ProductFilters, ProductStatus } from '../../../../types/marketplace';

interface VirtualizedProductListProps {
  /** Optional filters to apply */
  filters?: ProductFilters;
  /** Callback when a product is clicked */
  onProductClick?: (product: ProductDto) => void;
  /** Callback when edit is clicked */
  onEditProduct?: (product: ProductDto) => void;
  /** Callback when delete is clicked */
  onDeleteProduct?: (product: ProductDto) => void;
  /** Whether to show bulk actions */
  showBulkActions?: boolean;
  /** Custom class name */
  className?: string;
  /** Container height for virtual scrolling */
  containerHeight?: number;
  /** Item height for virtual scrolling */
  itemHeight?: number;
}

/**
 * Format currency value
 */
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value);
};

/**
 * Get status badge color
 */
const getStatusColor = (status: ProductStatus): string => {
  const colors: Record<string, string> = {
    Active: 'bg-green-100 text-green-800',
    Inactive: 'bg-gray-100 text-gray-800',
    OutOfStock: 'bg-red-100 text-red-800',
    Discontinued: 'bg-orange-100 text-orange-800',
    Draft: 'bg-blue-100 text-blue-800',
    PendingApproval: 'bg-yellow-100 text-yellow-800'
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

/**
 * Get status icon
 */
const getStatusIcon = (status: ProductStatus) => {
  const icons: Record<string, React.ReactNode> = {
    Active: <CheckCircle className="w-4 h-4" />,
    Inactive: <XCircle className="w-4 h-4" />,
    OutOfStock: <AlertTriangle className="w-4 h-4" />,
    Discontinued: <XCircle className="w-4 h-4" />,
    Draft: <Edit className="w-4 h-4" />,
    PendingApproval: <AlertTriangle className="w-4 h-4" />
  };
  return icons[status] || null;
};

/**
 * Product Row Component for Desktop Table View
 */
interface ProductRowProps {
  product: ProductDto;
  isSelected: boolean;
  showBulkActions: boolean;
  onSelect: (productId: string) => void;
  onProductClick?: (product: ProductDto) => void;
  onEditProduct?: (product: ProductDto) => void;
  onDeleteProduct?: (product: ProductDto) => void;
}

const ProductRow: React.FC<ProductRowProps> = ({
  product,
  isSelected,
  showBulkActions,
  onSelect,
  onProductClick,
  onEditProduct,
  onDeleteProduct
}) => (
  <div
    className={`flex items-center border-b border-border hover:bg-muted/50 ${
      onProductClick ? 'cursor-pointer' : ''
    }`}
    onClick={() => onProductClick?.(product)}
  >
    {/* Selection Checkbox */}
    {showBulkActions && (
      <div className="w-12 px-4 py-3">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => {
            e.stopPropagation();
            onSelect(product.id);
          }}
          className="rounded border-gray-300"
        />
      </div>
    )}

    {/* Product Image */}
    <div className="w-20 px-4 py-3">
      <div className="w-12 h-12 rounded overflow-hidden bg-gray-100">
        {product.imageUrl ? (
          <LazyImage
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-6 h-6 text-gray-400" />
          </div>
        )}
      </div>
    </div>

    {/* Product Name & SKU */}
    <div className="flex-1 px-4 py-3">
      <div className="font-medium text-foreground">{product.name}</div>
      <div className="text-xs text-muted-foreground">SKU: {product.sku}</div>
    </div>

    {/* Category */}
    <div className="w-32 px-4 py-3">
      <span className="text-sm text-foreground">{product.category}</span>
    </div>

    {/* Price */}
    <div className="w-32 px-4 py-3">
      <div className="font-medium text-foreground">
        {formatCurrency(product.price)}
      </div>
      {product.discountPrice && (
        <div className="text-xs text-muted-foreground line-through">
          {formatCurrency(product.discountPrice)}
        </div>
      )}
    </div>

    {/* Stock */}
    <div className="w-24 px-4 py-3">
      <div className={`font-medium ${
        product.stockQuantity <= product.minStockLevel 
          ? 'text-red-600' 
          : 'text-foreground'
      }`}>
        {product.stockQuantity}
      </div>
      {product.stockQuantity <= product.minStockLevel && (
        <div className="text-xs text-red-600 flex items-center gap-1">
          <AlertTriangle className="w-3 h-3" />
          Low Stock
        </div>
      )}
    </div>

    {/* Status */}
    <div className="w-32 px-4 py-3">
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
        {getStatusIcon(product.status)}
        {product.status}
      </span>
    </div>

    {/* Actions */}
    <div className="w-32 px-4 py-3">
      <div className="flex items-center gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onProductClick?.(product);
          }}
          className="p-1 hover:bg-gray-100 rounded"
          title="View"
        >
          <Eye className="w-4 h-4 text-gray-600" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEditProduct?.(product);
          }}
          className="p-1 hover:bg-gray-100 rounded"
          title="Edit"
        >
          <Edit className="w-4 h-4 text-blue-600" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDeleteProduct?.(product);
          }}
          className="p-1 hover:bg-gray-100 rounded"
          title="Delete"
        >
          <Trash2 className="w-4 h-4 text-red-600" />
        </button>
      </div>
    </div>
  </div>
);

/**
 * Product Card Component for Mobile View
 */
interface ProductCardProps {
  product: ProductDto;
  isSelected: boolean;
  showBulkActions: boolean;
  onSelect: (productId: string) => void;
  onProductClick?: (product: ProductDto) => void;
  onEditProduct?: (product: ProductDto) => void;
  onDeleteProduct?: (product: ProductDto) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isSelected,
  showBulkActions,
  onSelect,
  onProductClick,
  onEditProduct,
  onDeleteProduct
}) => (
  <div
    className={`card ${onProductClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
    onClick={() => onProductClick?.(product)}
  >
    <div className="card-body space-y-3">
      {/* Header with image and selection */}
      <div className="flex items-start gap-3">
        {showBulkActions && (
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => {
              e.stopPropagation();
              onSelect(product.id);
            }}
            className="rounded border-gray-300 mt-1"
          />
        )}
        <div className="w-16 h-16 rounded overflow-hidden bg-gray-100 flex-shrink-0">
          {product.imageUrl ? (
            <LazyImage
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package className="w-8 h-8 text-gray-400" />
            </div>
          )}
        </div>
        <div className="flex-1">
          <div className="font-medium text-foreground">{product.name}</div>
          <div className="text-xs text-muted-foreground">SKU: {product.sku}</div>
        </div>
      </div>

      {/* Product Details */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <span className="text-xs font-medium text-muted-foreground">Category</span>
          <div className="text-foreground">{product.category}</div>
        </div>
        <div>
          <span className="text-xs font-medium text-muted-foreground">Price</span>
          <div className="text-foreground font-medium">
            {formatCurrency(product.price)}
            {product.discountPrice && (
              <span className="text-xs text-muted-foreground line-through ml-2">
                {formatCurrency(product.discountPrice)}
              </span>
            )}
          </div>
        </div>
        <div>
          <span className="text-xs font-medium text-muted-foreground">Stock</span>
          <div className={`font-medium ${
            product.stockQuantity <= product.minStockLevel 
              ? 'text-red-600' 
              : 'text-foreground'
          }`}>
            {product.stockQuantity}
            {product.stockQuantity <= product.minStockLevel && (
              <span className="text-xs text-red-600 ml-1">Low Stock</span>
            )}
          </div>
        </div>
        <div>
          <span className="text-xs font-medium text-muted-foreground">Status</span>
          <div>
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
              {getStatusIcon(product.status)}
              {product.status}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-2 border-t border-border">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onProductClick?.(product);
          }}
          className="flex-1 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded flex items-center justify-center gap-2"
        >
          <Eye className="w-4 h-4" />
          View
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEditProduct?.(product);
          }}
          className="flex-1 px-3 py-2 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded flex items-center justify-center gap-2"
        >
          <Edit className="w-4 h-4" />
          Edit
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDeleteProduct?.(product);
          }}
          className="flex-1 px-3 py-2 text-sm bg-red-100 hover:bg-red-200 text-red-700 rounded flex items-center justify-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          Delete
        </button>
      </div>
    </div>
  </div>
);

/**
 * VirtualizedProductList Component
 */
export function VirtualizedProductList({
  filters,
  onProductClick,
  onEditProduct,
  onDeleteProduct,
  showBulkActions = false,
  className = '',
  containerHeight = 600,
  itemHeight
}: VirtualizedProductListProps) {
  const isMobile = useIsMobile();
  const { products, loading, error, refetch } = useProducts({ 
    initialFilters: filters,
    autoFetch: true 
  });

  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<string>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Calculate item height based on device type
  const calculatedItemHeight = itemHeight || (isMobile ? 200 : 80);

  // Handle product selection
  const handleSelectProduct = useCallback((productId: string) => {
    setSelectedProducts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  }, []);

  // Handle select all
  const handleSelectAll = useCallback(() => {
    if (products && selectedProducts.size === products.items.length) {
      setSelectedProducts(new Set());
    } else if (products) {
      setSelectedProducts(new Set(products.items.map(p => p.id)));
    }
  }, [products, selectedProducts]);

  // Handle bulk delete
  const handleBulkDelete = useCallback(async () => {
    if (selectedProducts.size === 0) return;
    
    if (!confirm(`Are you sure you want to delete ${selectedProducts.size} product(s)?`)) {
      return;
    }

    try {
      await productManagementService.bulkDelete(Array.from(selectedProducts));
      setSelectedProducts(new Set());
      await refetch();
    } catch (error) {
      console.error('Bulk delete failed:', error);
      alert('Failed to delete products. Please try again.');
    }
  }, [selectedProducts, refetch]);

  // Handle bulk status update
  const handleBulkStatusUpdate = useCallback(async (status: ProductStatus) => {
    if (selectedProducts.size === 0) return;

    try {
      await productManagementService.bulkUpdateStatus(Array.from(selectedProducts), status);
      setSelectedProducts(new Set());
      await refetch();
    } catch (error) {
      console.error('Bulk status update failed:', error);
      alert('Failed to update product status. Please try again.');
    }
  }, [selectedProducts, refetch]);

  // Sort products
  const sortedProducts = useMemo(() => {
    if (!products) return [];

    const sorted = [...products.items].sort((a, b) => {
      let aValue: any = a[sortBy as keyof ProductDto];
      let bValue: any = b[sortBy as keyof ProductDto];

      // Handle string comparison
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      // Handle number comparison
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });

    return sorted;
  }, [products, sortBy, sortDirection]);

  // Render item function for VirtualList
  const renderItem = useCallback((product: ProductDto, index: number) => {
    const isSelected = selectedProducts.has(product.id);

    if (isMobile) {
      return (
        <ProductCard
          key={product.id}
          product={product}
          isSelected={isSelected}
          showBulkActions={showBulkActions}
          onSelect={handleSelectProduct}
          onProductClick={onProductClick}
          onEditProduct={onEditProduct}
          onDeleteProduct={onDeleteProduct}
        />
      );
    }

    return (
      <ProductRow
        key={product.id}
        product={product}
        isSelected={isSelected}
        showBulkActions={showBulkActions}
        onSelect={handleSelectProduct}
        onProductClick={onProductClick}
        onEditProduct={onEditProduct}
        onDeleteProduct={onDeleteProduct}
      />
    );
  }, [
    selectedProducts,
    isMobile,
    showBulkActions,
    handleSelectProduct,
    onProductClick,
    onEditProduct,
    onDeleteProduct
  ]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-2">Error loading products</p>
          <p className="text-sm text-muted-foreground">{error}</p>
          <button
            onClick={() => refetch()}
            className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!products || products.items.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">No products found</p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Bulk Actions Bar */}
      {showBulkActions && selectedProducts.size > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
          <span className="text-sm font-medium text-blue-900">
            {selectedProducts.size} product(s) selected
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleBulkStatusUpdate('Active' as ProductStatus)}
              className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
            >
              Activate
            </button>
            <button
              onClick={() => handleBulkStatusUpdate('Inactive' as ProductStatus)}
              className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Deactivate
            </button>
            <button
              onClick={handleBulkDelete}
              className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      )}

      {/* Table Header (Desktop only) */}
      {!isMobile && (
        <div className="bg-muted/30 border-b border-border">
          <div className="flex items-center">
            {showBulkActions && (
              <div className="w-12 px-4 py-3">
                <input
                  type="checkbox"
                  checked={selectedProducts.size === sortedProducts.length}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300"
                />
              </div>
            )}
            <div className="w-20 px-4 py-3 text-sm font-medium text-muted-foreground">Image</div>
            <div className="flex-1 px-4 py-3 text-sm font-medium text-muted-foreground">Product Name</div>
            <div className="w-32 px-4 py-3 text-sm font-medium text-muted-foreground">Category</div>
            <div className="w-32 px-4 py-3 text-sm font-medium text-muted-foreground">Price</div>
            <div className="w-24 px-4 py-3 text-sm font-medium text-muted-foreground">Stock</div>
            <div className="w-32 px-4 py-3 text-sm font-medium text-muted-foreground">Status</div>
            <div className="w-32 px-4 py-3 text-sm font-medium text-muted-foreground">Actions</div>
          </div>
        </div>
      )}

      {/* Virtualized List */}
      <VirtualList
        items={sortedProducts}
        itemHeight={calculatedItemHeight}
        containerHeight={containerHeight}
        renderItem={renderItem}
        overscan={5}
        className="border border-border rounded-lg overflow-hidden"
      />

      {/* Performance Info (Development only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="text-xs text-muted-foreground mt-2">
          Virtual scrolling enabled: {sortedProducts.length} items, {calculatedItemHeight}px per item
        </div>
      )}
    </div>
  );
}