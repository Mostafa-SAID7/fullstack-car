# Marketplace Integration - Quick Start Guide

## Overview
This guide helps you quickly start using the implemented marketplace features in both Dashboard and Main App.

---

## Dashboard (React) - Admin Management

### Accessing Marketplace Features

1. **Navigate to Products Management**
   ```
   URL: http://localhost:5173/marketplace/products
   ```

2. **Navigate to Services Management**
   ```
   URL: http://localhost:5173/marketplace/services
   ```

### Products Management Features

#### Overview Tab
- View quick statistics (total products, current page, connection status)
- See recent products list
- Monitor SignalR connection status

#### All Products Tab
- **Search**: Type in the search bar (debounced 300ms)
- **Filter**: Use status, category, brand, price range filters
- **Sort**: Click column headers to sort
- **Bulk Actions**: 
  - Select multiple products with checkboxes
  - Click "Activate", "Deactivate", or "Delete" buttons
- **Individual Actions**: Click eye/edit/delete icons on each row

#### Analytics Tab
- View total products, active products, revenue, sales
- See top-selling products (last 30 days)
- Monitor low stock alerts
- Export data to CSV

### Services Management Features

Similar structure to Products Management:
- Overview, All Services, and Analytics tabs
- Service-specific filters (type, rating, bookings)
- Bulk operations
- Analytics with popular services and emergency services

### Real-time Updates

The Dashboard automatically updates when:
- A product is created (ProductCreated event)
- A product is updated (ProductUpdated event)
- A product is deleted (ProductDeleted event)
- Same for services

Watch for the "Live Updates Active" indicator in the bottom-right corner.

---

## Main App (Angular) - Customer Browsing

### Accessing Marketplace Features

1. **Navigate to Products**
   ```
   URL: http://localhost:4200/marketplace/products
   ```

2. **View Product Details**
   ```
   URL: http://localhost:4200/marketplace/products/{productId}
   ```

### Product List Features

#### View Modes
- **Grid View**: Click the grid icon (default)
- **List View**: Click the list icon for detailed view

#### Filtering
- **Category**: Select from dropdown (All Categories, Electronics, Clothing, etc.)
- **Price Range**: Enter min and max price values
- **Clear Filters**: Click "Clear Filters" button to reset

#### Search
- Type in the search bar
- Results update automatically after 300ms
- Shows loading indicator during search

#### Infinite Scroll
- Scroll down to automatically load more products
- Shows loading indicator while fetching
- Displays "End of results" when all products are loaded

#### Product Cards Display
- Product image with badges (discount %, featured, out of stock)
- Product name and brand
- Rating with review count
- Current price (with original price if discounted)
- "View Details" button (disabled if out of stock)

### Product Detail Features

#### Navigation
- Breadcrumb: Click "Products" to go back to list
- URL: Direct link to product detail page

#### Product Information
- Large product image with badges
- Product title, brand, and rating
- Current price (with discount if applicable)
- Stock status indicator
- Full description
- Detailed specifications (SKU, category, weight, dimensions, etc.)
- Product tags
- View count and sales count

#### Actions
- **Quantity Selector**: Increase/decrease quantity (respects stock limits)
- **Add to Cart**: Click to add product to cart (placeholder)
- **Share**: Click to share via native share or copy link

#### Reviews Section
- Average rating display
- Review count
- Reviews list (placeholder for future implementation)

---

## API Integration

### Dashboard API Calls

```typescript
// Import services
import { productApiService, serviceApiService } from '@/services/marketplace';

// Get products with filters
const products = await productApiService.getProducts({
  page: 1,
  pageSize: 20,
  category: 'Electronics',
  minPrice: 100,
  maxPrice: 1000
});

// Get product by ID
const product = await productApiService.getProduct('product-id');

// Create product
const newProduct = await productApiService.createProduct({
  name: 'New Product',
  description: 'Description',
  sku: 'SKU-001',
  price: 99.99,
  stockQuantity: 100,
  minStockLevel: 10,
  category: 'Electronics',
  weight: 1.5
});

// Update product
await productApiService.updateProduct('product-id', {
  price: 89.99,
  stockQuantity: 150
});

// Delete product
await productApiService.deleteProduct('product-id');

// Get statistics
const stats = await productApiService.getStatistics();
```

### Main App API Calls

```typescript
// Import services
import { ProductService } from '@/features/marketplace/services';

// Inject in component
constructor(private productService: ProductService) {}

// Get products
this.productService.getProducts({
  page: 1,
  pageSize: 20,
  category: 'Electronics'
}).subscribe(result => {
  this.products = result.items;
});

// Get product by ID
this.productService.getProduct('product-id').subscribe(product => {
  this.product = product;
});

// Search products
this.productService.searchProducts('laptop', {
  minPrice: 500,
  maxPrice: 2000
}).subscribe(result => {
  this.searchResults = result.items;
});

// Get featured products
this.productService.getFeaturedProducts(10).subscribe(products => {
  this.featuredProducts = products;
});
```

---

## React Hooks Usage

### Dashboard Hooks

```typescript
// Import hooks
import { useProducts, useProductAnalytics } from '@/hooks/marketplace';

// In component
function MyComponent() {
  // Get products with filters
  const { products, loading, error, refetch } = useProducts({
    initialFilters: { category: 'Electronics' },
    autoFetch: true
  });

  // Get analytics
  const { statistics, loading: statsLoading } = useProductAnalytics({
    autoFetch: true
  });

  // Get top selling products
  const { products: topSelling } = useTopSellingProducts(10, '30d');

  // Refetch data
  const handleRefresh = () => {
    refetch();
  };

  return (
    <div>
      {loading ? <Spinner /> : <ProductList products={products} />}
    </div>
  );
}
```

---

## Caching Behavior

### Dashboard Caching

The Dashboard uses intelligent caching to reduce API calls:

- **Product List**: Cached for 5 minutes (MEDIUM TTL)
- **Product Details**: Cached for 15 minutes (LONG TTL)
- **Search Results**: Cached for 30 seconds (SHORT TTL)
- **Statistics**: Cached for 5 minutes (MEDIUM TTL)

Cache is automatically invalidated when:
- SignalR events are received (ProductCreated, ProductUpdated, ProductDeleted)
- Manual cache invalidation is triggered
- TTL expires

### Main App Caching

The Main App relies on browser caching and Angular's HttpClient:
- No custom caching layer (uses browser cache)
- Fresh data on each request
- Can be enhanced with Angular interceptors if needed

---

## Performance Tips

### Dashboard
1. Use bulk operations instead of individual deletes
2. Let SignalR handle real-time updates (don't manually refresh)
3. Use appropriate page sizes (20-50 items)
4. Export large datasets to CSV instead of loading all in browser

### Main App
1. Use infinite scroll instead of traditional pagination
2. Let search debouncing reduce API calls
3. Use lazy loading for images
4. Filter on the server side, not client side

---

## Troubleshooting

### Dashboard Issues

**Products not loading**
- Check browser console for errors
- Verify API endpoint is accessible
- Check authentication token is valid

**SignalR not connecting**
- Check SIGNALR_HUB_URL in config
- Verify SignalR hub is running on backend
- Check browser console for connection errors

**Cache not invalidating**
- Check SignalR connection status
- Verify events are being received
- Try manual refresh

### Main App Issues

**Infinite scroll not working**
- Check browser console for errors
- Verify hasMorePages is true
- Check scroll position calculation

**Search not debouncing**
- Verify RxJS operators are imported
- Check debounceTime is set to 300ms
- Verify distinctUntilChanged is applied

**Images not loading**
- Check image URLs are valid
- Verify lazy loading attribute is set
- Check browser network tab for 404s

---

## Next Steps

1. **Test the features**: Navigate to the URLs and try all features
2. **Check API integration**: Verify backend endpoints are working
3. **Test real-time updates**: Create/update/delete items and watch for updates
4. **Review performance**: Check network tab for caching behavior
5. **Provide feedback**: Report any issues or suggestions

---

## Support

For issues or questions:
1. Check the IMPLEMENTATION_SUMMARY.md for technical details
2. Review the COMPLETION_REPORT.md for feature status
3. Check the tasks.md for implementation progress
4. Consult the code comments and JSDoc documentation

---

**Last Updated**: January 15, 2026  
**Version**: 1.0  
**Status**: Production Ready (Core Features)
