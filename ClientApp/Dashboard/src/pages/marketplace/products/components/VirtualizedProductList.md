# VirtualizedProductList Component

## Overview

The `VirtualizedProductList` component is a high-performance alternative to the standard `ProductList` component, designed to handle large datasets efficiently using virtual scrolling. It renders only the visible items in the viewport, significantly improving performance when dealing with hundreds or thousands of products.

## Features

- **Virtual Scrolling**: Only renders visible items for optimal performance
- **Responsive Design**: Automatically adapts to mobile and desktop layouts
- **Bulk Operations**: Supports bulk selection, deletion, and status updates
- **Real-time Updates**: Compatible with SignalR for live data updates
- **Customizable**: Configurable container height and item height
- **Performance Monitoring**: Shows performance metrics in development mode

## Usage

### Basic Usage

```tsx
import { VirtualizedProductList } from './components/VirtualizedProductList';

function ProductsPage() {
  return (
    <VirtualizedProductList
      containerHeight={600}
      showBulkActions={true}
    />
  );
}
```

### With Filters

```tsx
const filters = {
  search: 'laptop',
  category: 'Electronics',
  status: 'Active'
};

<VirtualizedProductList
  filters={filters}
  containerHeight={800}
  onProductClick={handleProductClick}
  onEditProduct={handleEditProduct}
  onDeleteProduct={handleDeleteProduct}
/>
```

### Custom Item Height

```tsx
<VirtualizedProductList
  containerHeight={600}
  itemHeight={120} // Custom height per item
  showBulkActions={true}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `filters` | `ProductFilters` | `undefined` | Optional filters to apply |
| `onProductClick` | `(product: ProductDto) => void` | `undefined` | Callback when a product is clicked |
| `onEditProduct` | `(product: ProductDto) => void` | `undefined` | Callback when edit is clicked |
| `onDeleteProduct` | `(product: ProductDto) => void` | `undefined` | Callback when delete is clicked |
| `showBulkActions` | `boolean` | `false` | Whether to show bulk actions |
| `className` | `string` | `''` | Custom class name |
| `containerHeight` | `number` | `600` | Container height for virtual scrolling |
| `itemHeight` | `number` | `80` (desktop), `200` (mobile) | Item height for virtual scrolling |

## Performance Benefits

### Memory Usage
- **Standard List**: Renders all items in DOM (e.g., 1000 items = 1000 DOM nodes)
- **Virtual List**: Renders only visible items (e.g., ~10-15 DOM nodes regardless of total items)

### Rendering Performance
- **Standard List**: Initial render time increases linearly with item count
- **Virtual List**: Consistent render time regardless of total items

### Scroll Performance
- **Standard List**: Scroll performance degrades with large lists
- **Virtual List**: Smooth scrolling performance maintained

## When to Use

### Use VirtualizedProductList when:
- Displaying more than 100 products
- Performance is critical
- Users need to scroll through large datasets
- Memory usage needs to be optimized

### Use standard ProductList when:
- Displaying fewer than 100 products
- Simple implementation is preferred
- Advanced virtual scrolling features are not needed

## Automatic Switching

The `ProductsManagement` page automatically enables virtual scrolling when:
- Total product count exceeds 100 items
- User manually toggles the performance mode

```tsx
// Automatic switching logic
useEffect(() => {
  if (products && products.totalCount > 100) {
    setUseVirtualScrolling(true);
  }
}, [products]);
```

## Mobile Responsiveness

The component automatically adapts to mobile devices:
- **Desktop**: Table layout with 80px item height
- **Mobile**: Card layout with 200px item height

## Bulk Operations

Bulk operations work the same as the standard ProductList:
- Select individual items with checkboxes
- Select all items with header checkbox
- Perform bulk delete or status updates
- Real-time UI updates after operations

## Performance Monitoring

In development mode, the component shows performance information:
```
Virtual scrolling enabled: 1000 items, 80px per item
```

## Integration with ProductsManagement

The `ProductsManagement` page includes a toggle to switch between standard and virtual scrolling:

```tsx
<div className="flex items-center gap-3">
  <Zap className="w-4 h-4 text-yellow-600" />
  <span>Performance Mode</span>
  <button onClick={handleToggleVirtualScrolling}>
    {useVirtualScrolling ? 'Virtual Scrolling ON' : 'Standard View'}
  </button>
</div>
```

## Technical Implementation

### Virtual Scrolling Engine
- Uses the shared `VirtualList` component
- Calculates visible range based on scroll position
- Renders items with proper positioning and transforms
- Maintains scroll position during updates

### State Management
- Integrates with existing `useProducts` hook
- Maintains selection state across virtual renders
- Handles sorting and filtering efficiently

### Memory Management
- Automatically cleans up unused DOM nodes
- Throttles scroll events for optimal performance
- Uses React.memo and useCallback for optimization

## Testing

The component includes comprehensive tests covering:
- Virtual list rendering
- Container height configuration
- Loading and error states
- Filter application
- Performance monitoring
- Mobile responsiveness

Run tests with:
```bash
npm test -- --testPathPatterns=VirtualizedProductList.test.tsx
```

## Browser Support

Virtual scrolling is supported in all modern browsers:
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Troubleshooting

### Common Issues

1. **Items not rendering correctly**
   - Check that `itemHeight` matches actual rendered height
   - Ensure container has fixed height

2. **Scroll position jumping**
   - Verify consistent item heights
   - Check for dynamic content affecting height

3. **Performance issues**
   - Reduce `overscan` prop if too many items are rendered
   - Optimize item rendering components

### Debug Mode

Enable debug logging in development:
```tsx
<VirtualizedProductList
  containerHeight={600}
  // Component shows debug info in development mode
/>
```

## Future Enhancements

Potential improvements for future versions:
- Dynamic item heights
- Horizontal virtual scrolling
- Infinite loading integration
- Advanced caching strategies
- Keyboard navigation optimization