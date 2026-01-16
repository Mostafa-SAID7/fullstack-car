/**
 * ProductList Component
 * Displays products in a responsive table with filtering, sorting, and bulk operations
 */

import React, { useState, useMemo, useCallback } from 'react';
import { Package, Edit, Trash2, Eye, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { ResponsiveTable } from '../../../../components/shared/ResponsiveTable';
import { LazyImage } from '../../../../components/shared/LazyImage';
import { useProducts } from '../../../../hooks/marketplace';
import { productManagementService } from '../../../../services/marketplace';
import type { ProductDto, ProductFilters, ProductStatus } from '../../../../types/marketplace';

interface ProductListProps {
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
 * ProductList Component
 */
export function ProductList({
  filters,
  onProductClick,
  onEditProduct,
  onDeleteProduct,
  showBulkActions = false,
  className = ''
}: ProductListProps) {
  const { products, loading, error, refetch } = useProducts({ 
    initialFilters: filters,
    autoFetch: true 
  });

  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<string>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

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

  // Define table columns
  const columns = useMemo(() => [
    ...(showBulkActions ? [{
      key: 'select',
      header: (
        <input
          type="checkbox"
          checked={products ? selectedProducts.size === products.items.length : false}
          onChange={handleSelectAll}
          className="rounded border-gray-300"
        />
      ),
      render: (product: ProductDto) => (
        <input
          type="checkbox"
          checked={selectedProducts.has(product.id)}
          onChange={() => handleSelectProduct(product.id)}
          className="rounded border-gray-300"
        />
      ),
      className: 'w-12'
    }] : []),
    {
      key: 'image',
      header: 'Image',
      render: (product: ProductDto) => (
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
      ),
      hideOnMobile: true,
      className: 'w-20'
    },
    {
      key: 'name',
      header: 'Product Name',
      render: (product: ProductDto) => (
        <div>
          <div className="font-medium text-foreground">{product.name}</div>
          <div className="text-xs text-muted-foreground">SKU: {product.sku}</div>
        </div>
      ),
      mobileRender: (product: ProductDto) => (
        <div className="flex items-start gap-3">
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
          <div>
            <div className="font-medium text-foreground">{product.name}</div>
            <div className="text-xs text-muted-foreground">SKU: {product.sku}</div>
          </div>
        </div>
      )
    },
    {
      key: 'category',
      header: 'Category',
      render: (product: ProductDto) => (
        <span className="text-sm text-foreground">{product.category}</span>
      )
    },
    {
      key: 'price',
      header: 'Price',
      render: (product: ProductDto) => (
        <div>
          <div className="font-medium text-foreground">
            {formatCurrency(product.price)}
          </div>
          {product.discountPrice && (
            <div className="text-xs text-muted-foreground line-through">
              {formatCurrency(product.discountPrice)}
            </div>
          )}
        </div>
      )
    },
    {
      key: 'stock',
      header: 'Stock',
      render: (product: ProductDto) => (
        <div>
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
      )
    },
    {
      key: 'status',
      header: 'Status',
      render: (product: ProductDto) => (
        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
          {getStatusIcon(product.status)}
          {product.status}
        </span>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (product: ProductDto) => (
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
      ),
      hideOnMobile: true,
      className: 'w-32'
    }
  ], [showBulkActions, selectedProducts, products, handleSelectAll, handleSelectProduct, onProductClick, onEditProduct, onDeleteProduct]);

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

      {/* Products Table */}
      <ResponsiveTable
        data={sortedProducts}
        columns={columns}
        keyExtractor={(product) => product.id}
        onRowClick={onProductClick}
        loading={loading}
        emptyMessage="No products found"
        className={className}
      />
    </div>
  );
}
