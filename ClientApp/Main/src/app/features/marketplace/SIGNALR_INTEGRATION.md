# SignalR Integration for Marketplace Features

## Overview

This document describes the SignalR integration for real-time updates in the marketplace features (Products and Services) of the Main App (Angular).

## Architecture

### Components

1. **SignalRService** (`core/services/signalr.service.ts`)
   - Core service managing the SignalR connection
   - Handles authentication and connection lifecycle
   - Provides methods to register/unregister event handlers
   - Auto-connects when user is authenticated

2. **MarketplaceSignalRService** (`features/marketplace/services/marketplace-signalr.service.ts`)
   - Marketplace-specific SignalR service
   - Subscribes to marketplace events (Products and Services)
   - Exposes RxJS Observables for components to consume
   - Automatically registers handlers when connection is established

3. **ProductListComponent** (`features/marketplace/components/product-list/product-list.component.ts`)
   - Displays list of products with real-time updates
   - Subscribes to product events (created, updated, deleted, price changed)
   - Automatically updates the product list when events are received
   - Shows connection status indicator

4. **ProductDetailComponent** (`features/marketplace/components/product-detail/product-detail.component.ts`)
   - Displays detailed product information
   - Subscribes to product events for the current product
   - Updates product data in real-time
   - Redirects to product list if product is deleted

## SignalR Events

### Product Events

| Event Name | Payload Type | Description |
|------------|--------------|-------------|
| `ProductCreated` | `ProductDto` | Fired when a new product is created |
| `ProductUpdated` | `ProductDto` | Fired when a product is updated |
| `ProductDeleted` | `string` (product ID) | Fired when a product is deleted |
| `ProductPriceChanged` | `{ id: string, oldPrice: number, newPrice: number }` | Fired when product price changes |

### Service Events

| Event Name | Payload Type | Description |
|------------|--------------|-------------|
| `ServiceCreated` | `ServiceDto` | Fired when a new service is created |
| `ServiceUpdated` | `ServiceDto` | Fired when a service is updated |
| `ServiceDeleted` | `string` (service ID) | Fired when a service is deleted |
| `ServiceStatusChanged` | `{ id: string, status: string }` | Fired when service status changes |

## Implementation Details

### Connection Management

The SignalR connection is automatically managed:

1. **Auto-connect**: Connection starts when user is authenticated
2. **Auto-reconnect**: Built-in reconnection with exponential backoff
3. **Auto-disconnect**: Connection stops when user logs out

### Event Handler Registration

Event handlers are registered automatically when the connection is established:

```typescript
// MarketplaceSignalRService monitors connection state
this.connectionSubscription = this.signalRService.connectionState$.subscribe(isConnected => {
  if (isConnected && !this.handlersRegistered) {
    this.registerHandlers();
  }
});
```

### Real-time Updates in Components

Components subscribe to marketplace events using RxJS Observables:

```typescript
// Subscribe to product created events
this.marketplaceSignalR.productCreated$.pipe(
  takeUntil(this.destroy$)
).subscribe(product => {
  this.handleProductCreated(product);
});
```

### Connection Status Indicator

The ProductListComponent displays a connection status indicator:

- **Green indicator**: "Live updates active" - SignalR connected
- **Red indicator**: "Live updates inactive" - SignalR disconnected

## Usage in Components

### ProductListComponent

The product list automatically:
- Adds new products when `ProductCreated` event is received
- Updates existing products when `ProductUpdated` event is received
- Removes products when `ProductDeleted` event is received
- Updates prices when `ProductPriceChanged` event is received
- Filters events based on current filters (category, price range, search)

### ProductDetailComponent

The product detail page automatically:
- Updates product data when `ProductUpdated` event is received
- Updates price when `ProductPriceChanged` event is received
- Redirects to product list when `ProductDeleted` event is received
- Adjusts quantity if stock changes

## Testing

### Manual Testing

1. **Test Product Creation**:
   - Open product list in Main App
   - Create a product in Dashboard
   - Verify product appears in Main App list

2. **Test Product Update**:
   - Open product detail in Main App
   - Update product in Dashboard
   - Verify changes appear in Main App

3. **Test Product Deletion**:
   - Open product detail in Main App
   - Delete product in Dashboard
   - Verify Main App redirects to product list

4. **Test Connection Status**:
   - Open product list in Main App
   - Check connection indicator shows "Live updates active"
   - Disconnect network
   - Verify indicator shows "Live updates inactive"
   - Reconnect network
   - Verify indicator shows "Live updates active" again

### Backend Requirements

For SignalR to work, the backend must:

1. Have SignalR hub configured at `/notificationHub`
2. Broadcast marketplace events to connected clients
3. Support JWT authentication for SignalR connections
4. Implement the following hub methods:
   - `JoinUserGroup(userId)` - Join user-specific group
   - Broadcast events: `ProductCreated`, `ProductUpdated`, `ProductDeleted`, `ProductPriceChanged`
   - Broadcast events: `ServiceCreated`, `ServiceUpdated`, `ServiceDeleted`, `ServiceStatusChanged`

## Configuration

### Environment Configuration

Ensure the `hubUrl` is configured in environment files:

```typescript
// src/environments/environment.ts
export const environment = {
  apiUrl: 'https://api.example.com',
  hubUrl: 'https://api.example.com', // SignalR hub URL
  // ...
};
```

### Authentication

SignalR uses JWT token authentication:

```typescript
this.hubConnection = new HubConnectionBuilder()
  .withUrl(`${environment.hubUrl}/notificationHub`, {
    accessTokenFactory: () => token || ''
  })
  .build();
```

## Troubleshooting

### Connection Issues

**Problem**: SignalR not connecting

**Solutions**:
1. Check if user is authenticated (SignalR only connects for authenticated users)
2. Verify `hubUrl` in environment configuration
3. Check browser console for connection errors
4. Verify backend SignalR hub is running and accessible

### Events Not Received

**Problem**: Real-time updates not working

**Solutions**:
1. Check connection status indicator (should be green)
2. Verify backend is broadcasting events
3. Check browser console for event logs
4. Ensure event names match between frontend and backend

### Performance Issues

**Problem**: Too many updates causing performance issues

**Solutions**:
1. Implement debouncing for frequent updates
2. Use virtual scrolling for large lists
3. Batch multiple updates together
4. Consider implementing selective event subscriptions

## Future Enhancements

1. **Optimistic Updates**: Update UI immediately before server confirmation
2. **Conflict Resolution**: Handle concurrent updates from multiple users
3. **Offline Support**: Queue updates when offline and sync when reconnected
4. **Selective Subscriptions**: Subscribe only to relevant events based on current view
5. **Event Replay**: Replay missed events after reconnection

## References

- [SignalR Documentation](https://docs.microsoft.com/en-us/aspnet/core/signalr/)
- [RxJS Documentation](https://rxjs.dev/)
- [Angular Best Practices](https://angular.io/guide/styleguide)
