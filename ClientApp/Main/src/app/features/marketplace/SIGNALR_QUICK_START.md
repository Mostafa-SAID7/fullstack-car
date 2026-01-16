# SignalR Quick Start Guide

## For Developers

This guide helps you quickly integrate SignalR real-time updates into marketplace components.

## Basic Usage

### 1. Inject the Service

```typescript
import { MarketplaceSignalRService } from '../../services/marketplace-signalr.service';

constructor(private marketplaceSignalR: MarketplaceSignalRService) {}
```

### 2. Subscribe to Events

```typescript
ngOnInit(): void {
  // Subscribe to product created events
  this.marketplaceSignalR.productCreated$.pipe(
    takeUntil(this.destroy$)
  ).subscribe(product => {
    console.log('New product:', product);
    // Handle the new product
  });

  // Subscribe to product updated events
  this.marketplaceSignalR.productUpdated$.pipe(
    takeUntil(this.destroy$)
  ).subscribe(product => {
    console.log('Updated product:', product);
    // Update your local data
  });

  // Subscribe to product deleted events
  this.marketplaceSignalR.productDeleted$.pipe(
    takeUntil(this.destroy$)
  ).subscribe(productId => {
    console.log('Deleted product:', productId);
    // Remove from your list
  });
}
```

### 3. Monitor Connection Status

```typescript
// Add property
isConnected = false;

// Subscribe to connection status
this.marketplaceSignalR.connectionStatus$.pipe(
  takeUntil(this.destroy$)
).subscribe(isConnected => {
  this.isConnected = isConnected;
  console.log('SignalR connected:', isConnected);
});
```

### 4. Clean Up

```typescript
private destroy$ = new Subject<void>();

ngOnDestroy(): void {
  this.destroy$.next();
  this.destroy$.complete();
}
```

## Available Events

### Product Events

```typescript
// New product created
marketplaceSignalR.productCreated$: Observable<ProductDto>

// Product updated
marketplaceSignalR.productUpdated$: Observable<ProductDto>

// Product deleted
marketplaceSignalR.productDeleted$: Observable<string>

// Product price changed
marketplaceSignalR.priceChanged$: Observable<{
  id: string;
  oldPrice: number;
  newPrice: number;
}>
```

### Service Events

```typescript
// New service created
marketplaceSignalR.serviceCreated$: Observable<ServiceDto>

// Service updated
marketplaceSignalR.serviceUpdated$: Observable<ServiceDto>

// Service deleted
marketplaceSignalR.serviceDeleted$: Observable<string>

// Service status changed
marketplaceSignalR.serviceStatus$: Observable<{
  id: string;
  status: string;
}>
```

## Connection Status Indicator

### HTML Template

```html
<div class="connection-status" 
     [class.connected]="isConnected" 
     [class.disconnected]="!isConnected">
  <span class="status-indicator"></span>
  <span class="status-text">
    {{ isConnected ? 'Live updates active' : 'Live updates inactive' }}
  </span>
</div>
```

### SCSS Styles

```scss
.connection-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;

  &.connected {
    background: #d1fae5;
    color: #065f46;
    border: 1px solid #6ee7b7;

    .status-indicator {
      background: #10b981;
      animation: pulse 2s ease-in-out infinite;
    }
  }

  &.disconnected {
    background: #fee2e2;
    color: #991b1b;
    border: 1px solid #fca5a5;

    .status-indicator {
      background: #ef4444;
    }
  }

  .status-indicator {
    width: 8px;
    height: 8px;
    border-radius: 50%;
  }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
```

## Common Patterns

### Pattern 1: Update List Item

```typescript
this.marketplaceSignalR.productUpdated$.pipe(
  takeUntil(this.destroy$)
).subscribe(updatedProduct => {
  const index = this.products.findIndex(p => p.id === updatedProduct.id);
  if (index !== -1) {
    this.products[index] = updatedProduct;
    this.products = [...this.products]; // Trigger change detection
  }
});
```

### Pattern 2: Add New Item

```typescript
this.marketplaceSignalR.productCreated$.pipe(
  takeUntil(this.destroy$)
).subscribe(newProduct => {
  this.products = [newProduct, ...this.products];
  this.totalCount++;
});
```

### Pattern 3: Remove Item

```typescript
this.marketplaceSignalR.productDeleted$.pipe(
  takeUntil(this.destroy$)
).subscribe(productId => {
  this.products = this.products.filter(p => p.id !== productId);
  this.totalCount--;
});
```

### Pattern 4: Conditional Updates

```typescript
this.marketplaceSignalR.productUpdated$.pipe(
  takeUntil(this.destroy$)
).subscribe(updatedProduct => {
  // Only update if it matches current filters
  if (this.matchesFilters(updatedProduct)) {
    this.updateProduct(updatedProduct);
  } else {
    this.removeProduct(updatedProduct.id);
  }
});
```

## Troubleshooting

### Events Not Received

1. Check connection status: `marketplaceSignalR.isConnected`
2. Verify user is authenticated
3. Check browser console for errors
4. Verify backend is broadcasting events

### Memory Leaks

Always use `takeUntil(destroy$)` pattern:

```typescript
// ✅ GOOD
this.marketplaceSignalR.productCreated$.pipe(
  takeUntil(this.destroy$)
).subscribe(...)

// ❌ BAD
this.marketplaceSignalR.productCreated$.subscribe(...)
```

### Change Detection Not Triggering

Create new array reference:

```typescript
// ✅ GOOD
this.products = [...this.products];

// ❌ BAD
this.products.push(newProduct); // Mutates array
```

## Best Practices

1. **Always Clean Up**: Use `takeUntil(destroy$)` for all subscriptions
2. **Immutable Updates**: Create new array/object references for change detection
3. **Filter Events**: Only process events relevant to current view
4. **Show Status**: Display connection status to users
5. **Handle Errors**: Implement error handling for edge cases
6. **Log Events**: Use console.log for debugging (remove in production)

## Examples

See these files for complete examples:
- `components/product-list/product-list.component.ts`
- `components/product-detail/product-detail.component.ts`

## Need Help?

Check the full documentation:
- `SIGNALR_INTEGRATION.md` - Complete integration guide
- `SIGNALR_IMPLEMENTATION_SUMMARY.md` - Implementation details
