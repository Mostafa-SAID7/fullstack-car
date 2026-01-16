/**
 * Prefetch Example Component
 * Demonstrates how to use data prefetching for marketplace features
 */

import React, { useState } from 'react';
import { useProducts, useProductPrefetch } from '../../hooks/marketplace';
import type { ProductFilters } from '../../types/marketplace';

/**
 * Example component showing product list with prefetching
 */
export function ProductListWithPrefetch() {
  const [filters, setFilters] = useState<ProductFilters>({
    page: 1,
    pageSize: 20
  });
  const [enablePrefetch, setEnablePrefetch] = useState(true);

  const { products, loading, error } = useProducts({ 
    initialFilters: filters,
    autoFetch: true 
  });

  const { handleScroll, createHoverHandlers, prefetchNextPage } = useProductPrefetch(
    products?.currentPage || 1,
    filters,
    enablePrefetch
  );

  if (loading && !products) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-600">Loading products...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-red-600">Error: {error}</div>
      </div>
    );
  }

  if (!products?.items.length) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-600">No products found</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={enablePrefetch}
              onChange={(e) => setEnablePrefetch(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm font-medium">Enable Prefetching</span>
          </label>
          <div className="text-sm text-gray-600">
            {enablePrefetch ? (
              <span className="text-green-600">✓ Hover & scroll prefetch active</span>
            ) : (
              <span className="text-gray-500">Prefetch disabled</span>
            )}
          </div>
        </div>
        <button
          onClick={() => prefetchNextPage()}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700"
        >
          Prefetch Next Page
        </button>
      </div>

      {/* Product List */}
      <div
        className="space-y-2 overflow-auto"
        style={{ maxHeight: '600px' }}
        onScroll={handleScroll}
      >
        {products.items.map((product) => (
          <div
            key={product.id}
            {...createHoverHandlers(product.id)}
            className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  {product.name}
                </h3>
                <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex items-center mt-2 space-x-4">
                  <span className="text-sm font-medium text-gray-900">
                    ${product.price.toFixed(2)}
                  </span>
                  {product.discountPrice && (
                    <span className="text-sm text-gray-500 line-through">
                      ${product.discountPrice.toFixed(2)}
                    </span>
                  )}
                  <span className="text-sm text-gray-600">
                    Stock: {product.stockQuantity}
                  </span>
                </div>
              </div>
              {product.imageUrl && (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="object-cover w-20 h-20 ml-4 rounded"
                />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Info */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div className="text-sm text-gray-600">
          Showing {products.items.length} of {products.totalCount} products
        </div>
        <div className="text-sm text-gray-600">
          Page {products.currentPage} of {products.totalPages}
        </div>
      </div>

      {/* Prefetch Info */}
      {enablePrefetch && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="text-sm font-semibold text-blue-900">
            Prefetching Active
          </h4>
          <ul className="mt-2 space-y-1 text-sm text-blue-800">
            <li>• Hover over any product to prefetch its details</li>
            <li>• Scroll to 80% to automatically prefetch the next page</li>
            <li>• Maximum 3 concurrent prefetch requests</li>
            <li>• Prefetched data is cached for instant access</li>
          </ul>
        </div>
      )}
    </div>
  );
}

/**
 * Example showing how to use prefetching with services
 */
export function ServiceListWithPrefetch() {
  // Similar implementation for services
  // Left as an exercise - follows the same pattern as ProductListWithPrefetch
  return (
    <div className="p-4">
      <p className="text-gray-600">
        Service list with prefetching - implementation follows the same pattern as products
      </p>
    </div>
  );
}

/**
 * Example showing conditional prefetching based on network
 */
export function SmartPrefetchExample() {
  const [networkInfo, setNetworkInfo] = useState<{
    effectiveType?: string;
    downlink?: number;
  }>({});
  const [enablePrefetch, setEnablePrefetch] = useState(true);

  React.useEffect(() => {
    // Check network connection
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      if (connection) {
        setNetworkInfo({
          effectiveType: connection.effectiveType,
          downlink: connection.downlink
        });

        // Disable prefetching on slow connections
        if (connection.effectiveType === '2g' || connection.effectiveType === 'slow-2g') {
          setEnablePrefetch(false);
        }
      }
    }
  }, []);

  return (
    <div className="p-4 space-y-4">
      <div className="p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold">Network-Aware Prefetching</h3>
        <div className="mt-2 space-y-1 text-sm text-gray-600">
          <p>Connection Type: {networkInfo.effectiveType || 'Unknown'}</p>
          <p>Downlink: {networkInfo.downlink ? `${networkInfo.downlink} Mbps` : 'Unknown'}</p>
          <p>Prefetch Status: {enablePrefetch ? 'Enabled' : 'Disabled (slow connection)'}</p>
        </div>
      </div>

      {/* Use ProductListWithPrefetch with conditional enablePrefetch */}
      <div className="text-sm text-gray-600">
        Prefetching is automatically disabled on slow connections (2G) to save bandwidth.
      </div>
    </div>
  );
}

export default ProductListWithPrefetch;
