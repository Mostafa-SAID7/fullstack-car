/**
 * ProductsManagement Page
 * Main page for managing products with tabs, real-time updates, and comprehensive features
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Package, BarChart3, List, Plus, RefreshCw, Zap } from 'lucide-react';
import { ResponsiveTabs } from '../../../components/shared/ResponsiveTabs';
import { ProductList } from './components/ProductList';
import { VirtualizedProductList } from './components/VirtualizedProductList';
import { ProductAnalytics } from './components/ProductAnalytics';
import { useProducts } from '../../../hooks/marketplace';
import { useSignalR } from '../../../hooks/useSignalR';
import { productCacheInvalidation } from '../../../services/marketplace';
import type { ProductDto, ProductFilters } from '../../../types/marketplace';

/**
 * ProductsManagement Page Component
 */
export function ProductsManagement() {
  const [activeTab, setActiveTab] = useState('overview');
  const [filters, setFilters] = useState<ProductFilters>({
    page: 1,
    pageSize: 20
  });
  const [selectedProduct, setSelectedProduct] = useState<ProductDto | null>(null);
  const [useVirtualScrolling, setUseVirtualScrolling] = useState(false);

  const { products, loading, error, refetch } = useProducts({
    initialFilters: filters,
    autoFetch: true
  });

  // Automatically enable virtual scrolling for large datasets
  useEffect(() => {
    if (products && products.totalCount > 100) {
      setUseVirtualScrolling(true);
    }
  }, [products]);

  // SignalR connection for real-time updates
  const { connection, connectionState } = useSignalR();

  // Handle real-time product events
  useEffect(() => {
    if (!connection || connectionState !== 'Connected') return;

    const handleProductCreated = (product: ProductDto) => {
      console.log('Product created:', product);
      productCacheInvalidation.onProductCreate();
      refetch();
    };

    const handleProductUpdated = (product: ProductDto) => {
      console.log('Product updated:', product);
      productCacheInvalidation.onProductUpdate();
      refetch();
    };

    const handleProductDeleted = (productId: string) => {
      console.log('Product deleted:', productId);
      productCacheInvalidation.onProductDelete();
      refetch();
    };

    // Subscribe to SignalR events
    connection.on('ProductCreated', handleProductCreated);
    connection.on('ProductUpdated', handleProductUpdated);
    connection.on('ProductDeleted', handleProductDeleted);

    // Cleanup
    return () => {
      connection.off('ProductCreated', handleProductCreated);
      connection.off('ProductUpdated', handleProductUpdated);
      connection.off('ProductDeleted', handleProductDeleted);
    };
  }, [connection, connectionState, refetch]);

  // Handle product click
  const handleProductClick = useCallback((product: ProductDto) => {
    setSelectedProduct(product);
    console.log('Product clicked:', product);
    // TODO: Open product detail modal or navigate to detail page
  }, []);

  // Handle edit product
  const handleEditProduct = useCallback((product: ProductDto) => {
    console.log('Edit product:', product);
    // TODO: Open edit modal
  }, []);

  // Handle delete product
  const handleDeleteProduct = useCallback(async (product: ProductDto) => {
    if (!confirm(`Are you sure you want to delete "${product.name}"?`)) {
      return;
    }

    try {
      // TODO: Call delete API
      console.log('Delete product:', product);
      await refetch();
    } catch (error) {
      console.error('Failed to delete product:', error);
      alert('Failed to delete product. Please try again.');
    }
  }, [refetch]);

  // Handle toggle virtual scrolling
  const handleToggleVirtualScrolling = useCallback(() => {
    setUseVirtualScrolling(prev => !prev);
  }, []);

  // Handle create product
  const handleCreateProduct = useCallback(() => {
    console.log('Create new product');
    // TODO: Open create modal
  }, []);

  // Handle refresh
  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  // Define tabs
  const tabs = [
    {
      id: 'overview',
      label: 'Overview',
      icon: <BarChart3 className="w-4 h-4" />
    },
    {
      id: 'all-products',
      label: 'All Products',
      icon: <List className="w-4 h-4" />,
      badge: products?.totalCount
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: <BarChart3 className="w-4 h-4" />
    }
  ];

  // Render tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Products</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {products?.totalCount || 0}
                    </p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Package className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Current Page</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {products?.page || 1} / {products?.totalPages || 1}
                    </p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-lg">
                    <List className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Connection</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {connectionState}
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg ${
                    connectionState === 'Connected' ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    <div className={`w-3 h-3 rounded-full ${
                      connectionState === 'Connected' ? 'bg-green-600' : 'bg-gray-400'
                    }`} />
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Products */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Products</h3>
              <ProductList
                filters={{ ...filters, pageSize: 10 }}
                onProductClick={handleProductClick}
                onEditProduct={handleEditProduct}
                onDeleteProduct={handleDeleteProduct}
                showBulkActions={false}
              />
            </div>
          </div>
        );

      case 'all-products':
        return (
          <div className="space-y-4">
            {/* Performance Controls */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm font-medium text-gray-700">Performance Mode</span>
                  </div>
                  <button
                    onClick={handleToggleVirtualScrolling}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      useVirtualScrolling ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        useVirtualScrolling ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                  <span className="text-sm text-gray-600">
                    {useVirtualScrolling ? 'Virtual Scrolling ON' : 'Standard View'}
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  {products && products.totalCount > 100 && (
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                      Large dataset detected ({products.totalCount} items)
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Product List */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              {useVirtualScrolling ? (
                <VirtualizedProductList
                  filters={filters}
                  onProductClick={handleProductClick}
                  onEditProduct={handleEditProduct}
                  onDeleteProduct={handleDeleteProduct}
                  showBulkActions={true}
                  containerHeight={600}
                />
              ) : (
                <ProductList
                  filters={filters}
                  onProductClick={handleProductClick}
                  onEditProduct={handleEditProduct}
                  onDeleteProduct={handleDeleteProduct}
                  showBulkActions={true}
                />
              )}
            </div>
          </div>
        );

      case 'analytics':
        return <ProductAnalytics />;

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products Management</h1>
          <p className="text-gray-600 mt-1">
            Manage your product catalog, inventory, and analytics
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={handleCreateProduct}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </button>
        </div>
      </div>

      {/* Tabs */}
      <ResponsiveTabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600 font-medium mb-2">Error loading products</p>
            <p className="text-sm text-red-500">{error}</p>
            <button
              onClick={handleRefresh}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        ) : (
          renderTabContent()
        )}
      </div>

      {/* Real-time Status Indicator */}
      {connectionState === 'Connected' && (
        <div className="fixed bottom-4 right-4 bg-green-100 border border-green-200 rounded-lg px-4 py-2 shadow-lg">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-green-900">Live Updates Active</span>
          </div>
        </div>
      )}
    </div>
  );
}
