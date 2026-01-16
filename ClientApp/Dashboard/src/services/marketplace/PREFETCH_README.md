# Data Prefetching for Marketplace Features

## Overview

The prefetching service improves performance by loading data before the user explicitly requests it. This creates a smoother, faster user experience by reducing perceived loading times.

## Features

### 1. Hover Prefetching
When a user hovers over a product or service item in a list, the system automatically prefetches the detailed data for that item. This ensures instant loading when the user clicks to view details.

### 2. Next Page Prefetching
When a user scrolls near the bottom of a list (80% threshold), the system automatically prefetches the next page of results. This enables seamless pagination without loading delays.

### 3. Smart Queue Management
- Maximum 3 concurrent prefetch requests to avoid overwhelming the network
- Automatic request queuing and prioritization
- Silent failure handling (prefetch errors don't affect user experience)

## Usage

### Basic Usage with Hooks

#### Product Prefetching

```typescript
import { useProductPrefetch } from '../../hooks/marketplace';
import { useProducts } from '../../hooks/marketplace';

function ProductList() {
  const { products, loading } = useProducts();
  const { handleScroll, createHoverHandlers } = useProductPrefetch(
    products?.currentPage || 1,
    filters,
    true // enabled
  );

  return (
    <div onScroll={handleScroll}>
      {products?.items.map(product => (
        <div 
          key={product.id}
          {...createHoverHandlers(product.id)}
        >
          {product.name}
        </div>
      ))}
    </div>
  );
}
```

#### Service Prefetching

```typescript
import { useServicePrefetch } from '../../hooks/marketplace';
import { useServices } from '../../hooks/marketplace';

function ServiceList() {
  const { services, loading } = useServices();
  const { handleScroll, createHoverHandlers } = useServicePrefetch(
    services?.currentPage || 1,
    filters,
    true // enabled
  );

  return (
    <div onScroll={handleScroll}>
      {services?.items.map(service => (
        <div 
          key={service.id}
          {...createHoverHandlers(service.id)}
        >
          {service.name}
        </div>
      ))}
    </div>
  );
}
```

### Direct Service Usage

If you need more control, you can use the prefetch services directly:

```typescript
import { productPrefetchService, createPrefetchHandlers } from '../../services/marketplace';

// Prefetch on hover
const handlers = createPrefetchHandlers.forProduct(productId);
<div {...handlers}>Product Item</div>

// Prefetch next page manually
productPrefetchService.prefetchNextPage(currentPage, filters);

// Check if should prefetch based on scroll
const shouldPrefetch = productPrefetchService.shouldPrefetchNextPage(
  scrollTop,
  scrollHeight,
  clientHeight
);

// Clear prefetch cache
productPrefetchService.clearCache();
```

### Generic Scroll Prefetching

For custom scroll-based prefetching:

```typescript
import { useScrollPrefetch } from '../../hooks/marketplace';

function CustomList() {
  const { handleScroll } = useScrollPrefetch(
    () => {
      // Your custom prefetch logic
      console.log('Prefetch triggered!');
    },
    true // enabled
  );

  return <div onScroll={handleScroll}>...</div>;
}
```

## Configuration

The prefetch service uses these default configurations:

```typescript
const PREFETCH_CONFIG = {
  HOVER_DELAY: 150,        // Wait 150ms before prefetching on hover
  SCROLL_THRESHOLD: 0.8,   // Prefetch when 80% scrolled
  MAX_CONCURRENT: 3        // Maximum 3 concurrent prefetch requests
};
```

## Performance Considerations

### Benefits
- **Reduced Perceived Loading Time**: Data is ready before the user needs it
- **Smoother User Experience**: No loading spinners for prefetched data
- **Intelligent Caching**: Prefetched data is cached, reducing API calls

### Best Practices
1. **Enable Conditionally**: Disable prefetching on slow connections
2. **Monitor Network**: Consider user's network speed
3. **Clear Cache**: Clear prefetch cache when filters change significantly
4. **Test Performance**: Measure impact on your specific use case

### When to Disable
- On mobile devices with limited data plans
- When network connection is slow
- When server load is high
- During initial page load

## Examples

### Complete Product List with Prefetching

```typescript
import React from 'react';
import { useProducts, useProductPrefetch } from '../../hooks/marketplace';
import type { ProductFilters } from '../../types/marketplace';

interface ProductListProps {
  filters?: ProductFilters;
  enablePrefetch?: boolean;
}

export function ProductList({ filters, enablePrefetch = true }: ProductListProps) {
  const { products, loading, error } = useProducts({ initialFilters: filters });
  const { handleScroll, createHoverHandlers } = useProductPrefetch(
    products?.currentPage || 1,
    filters,
    enablePrefetch
  );

  if (loading && !products) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!products?.items.length) return <div>No products found</div>;

  return (
    <div 
      className="product-list"
      onScroll={handleScroll}
      style={{ height: '600px', overflow: 'auto' }}
    >
      {products.items.map(product => (
        <div
          key={product.id}
          className="product-item"
          {...createHoverHandlers(product.id)}
        >
          <h3>{product.name}</h3>
          <p>{product.description}</p>
          <span>${product.price}</span>
        </div>
      ))}
    </div>
  );
}
```

### Conditional Prefetching Based on Network

```typescript
import { useEffect, useState } from 'react';
import { useProductPrefetch } from '../../hooks/marketplace';

function SmartProductList() {
  const [enablePrefetch, setEnablePrefetch] = useState(true);

  useEffect(() => {
    // Disable prefetching on slow connections
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      if (connection && connection.effectiveType === '2g') {
        setEnablePrefetch(false);
      }
    }
  }, []);

  const { handleScroll, createHoverHandlers } = useProductPrefetch(
    currentPage,
    filters,
    enablePrefetch
  );

  // ... rest of component
}
```

## Testing

To test prefetching functionality:

1. **Hover Test**: Hover over items and check Network tab for prefetch requests
2. **Scroll Test**: Scroll to 80% and verify next page is prefetched
3. **Cache Test**: Navigate to prefetched item and verify instant loading
4. **Queue Test**: Hover rapidly over multiple items and verify max 3 concurrent requests

## Troubleshooting

### Prefetch Not Working
- Check if prefetching is enabled (`enabled` parameter)
- Verify scroll container has proper height and overflow
- Check browser console for errors

### Too Many Requests
- Reduce `MAX_CONCURRENT` in configuration
- Increase `HOVER_DELAY` to reduce hover sensitivity
- Adjust `SCROLL_THRESHOLD` to prefetch later

### Cache Issues
- Call `clearCache()` when filters change
- Verify cache TTL settings in cache service
- Check if cache invalidation is working properly

## Related Documentation

- [Product API Service](./product-api.service.ts)
- [Service API Service](./service-api.service.ts)
- [Cache Service](../cache/cache.service.ts)
- [Marketplace Hooks](../../hooks/marketplace/README.md)
