# Marketplace Platform - Design Specification

## Architecture Overview

The Marketplace Platform extends the existing Clean Architecture with CQRS and MediatR patterns, building upon the current v6/v7 API infrastructure while adding comprehensive e-commerce and service booking capabilities.

### System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Presentation Layer                       │
├─────────────────────────────────────────────────────────────────┤
│  React Dashboard      │  Angular Main App    │  Mobile Apps      │
│  - Admin Panel        │  - Customer Portal   │  - iOS/Android    │
│  - Vendor Dashboard   │  - Product Catalog   │  - PWA Support    │
│  - Analytics          │  - Service Booking   │  - Offline Mode   │
└─────────────────────────────────────────────────────────────────┘
                                │
┌─────────────────────────────────────────────────────────────────┐
│                         API Gateway Layer                       │
├─────────────────────────────────────────────────────────────────┤
│  ASP.NET Core Web API │  SignalR Hubs       │  Authentication   │
│  - Marketplace API    │  - Real-time Updates │  - JWT Tokens     │
│  - Products API       │  - Notifications     │  - OAuth2         │
│  - Services API       │  - Order Tracking    │  - Multi-tenant   │
│  - Payments API       │  - Inventory Alerts  │  - Role-based     │
└─────────────────────────────────────────────────────────────────┘
                                │
┌─────────────────────────────────────────────────────────────────┐
│                       Application Layer                         │
├─────────────────────────────────────────────────────────────────┤
│  CQRS + MediatR       │  Domain Services    │  Event Handlers   │
│  - Command Handlers   │  - Business Logic   │  - Domain Events  │
│  - Query Handlers     │  - Validation       │  - Integration    │
│  - DTOs & Mapping     │  - Authorization    │  - Notifications  │
└─────────────────────────────────────────────────────────────────┘
                                │
┌─────────────────────────────────────────────────────────────────┐
│                       Infrastructure Layer                      │
├─────────────────────────────────────────────────────────────────┤
│  Entity Framework    │  External Services  │  Caching & Storage │
│  - SQL Server        │  - Payment Gateways │  - Redis Cache     │
│  - Repository Pattern│  - Shipping APIs    │  - Blob Storage    │
│  - Unit of Work      │  - Email/SMS        │  - Search Index    │
└─────────────────────────────────────────────────────────────────┘
```

## Database Design

### Enhanced Marketplace Schema

#### Products and Inventory
```sql
-- Extends existing Product entity
ALTER TABLE Products ADD COLUMN
    MetaTitle NVARCHAR(200),
    MetaDescription NVARCHAR(500),
    MetaKeywords NVARCHAR(500),
    IsDigitalProduct BIT DEFAULT 0,
    DigitalFileUrl NVARCHAR(2048),
    DownloadLimit INT,
    LicenseType NVARCHAR(50),
    WarrantyPeriod INT, -- in days
    ShippingWeight DECIMAL(10,2),
    ShippingDimensions NVARCHAR(100), -- JSON: {length, width, height}
    HSCode NVARCHAR(20), -- Harmonized System Code
    CountryOfOrigin NVARCHAR(50),
    ManufacturerPartNumber NVARCHAR(100),
    GTIN NVARCHAR(50), -- Global Trade Item Number
    IsCustomizable BIT DEFAULT 0,
    CustomizationOptions NVARCHAR(MAX), -- JSON
    MinOrderQuantity INT DEFAULT 1,
    MaxOrderQuantity INT,
    BulkPricingTiers NVARCHAR(MAX); -- JSON

-- Product Variants
CREATE TABLE ProductVariants (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    ProductId UNIQUEIDENTIFIER NOT NULL,
    SKU NVARCHAR(100) NOT NULL UNIQUE,
    Name NVARCHAR(200) NOT NULL,
    Price DECIMAL(18,2) NOT NULL,
    CompareAtPrice DECIMAL(18,2),
    CostPrice DECIMAL(18,2),
    StockQuantity INT NOT NULL DEFAULT 0,
    Weight DECIMAL(10,2),
    Barcode NVARCHAR(100),
    ImageUrl NVARCHAR(2048),
    Position INT DEFAULT 0,
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2,
    FOREIGN KEY (ProductId) REFERENCES Products(Id)
);
```

#### Orders and Shopping Cart
```sql
-- Shopping Cart
CREATE TABLE ShoppingCarts (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    CustomerId UNIQUEIDENTIFIER,
    SessionId NVARCHAR(100), -- For guest users
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2,
    ExpiresAt DATETIME2,
    FOREIGN KEY (CustomerId) REFERENCES Customers(Id)
);

CREATE TABLE ShoppingCartItems (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    CartId UNIQUEIDENTIFIER NOT NULL,
    ProductId UNIQUEIDENTIFIER,
    VariantId UNIQUEIDENTIFIER,
    ServiceId UNIQUEIDENTIFIER,
    Quantity INT NOT NULL DEFAULT 1,
    UnitPrice DECIMAL(18,2) NOT NULL,
    CustomizationData NVARCHAR(MAX), -- JSON
    AddedAt DATETIME2 DEFAULT GETUTCDATE(),
    FOREIGN KEY (CartId) REFERENCES ShoppingCarts(Id),
    FOREIGN KEY (ProductId) REFERENCES Products(Id),
    FOREIGN KEY (VariantId) REFERENCES ProductVariants(Id),
    FOREIGN KEY (ServiceId) REFERENCES Services(Id)
);

-- Orders (extends existing structure)
CREATE TABLE Orders (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    OrderNumber NVARCHAR(50) NOT NULL UNIQUE,
    CustomerId UNIQUEIDENTIFIER NOT NULL,
    OrderStatus NVARCHAR(20) DEFAULT 'Pending',
    PaymentStatus NVARCHAR(20) DEFAULT 'Pending',
    FulfillmentStatus NVARCHAR(20) DEFAULT 'Unfulfilled',
    
    -- Financial Details
    SubtotalAmount DECIMAL(18,2) NOT NULL,
    TaxAmount DECIMAL(18,2) DEFAULT 0,
    ShippingAmount DECIMAL(18,2) DEFAULT 0,
    DiscountAmount DECIMAL(18,2) DEFAULT 0,
    TotalAmount DECIMAL(18,2) NOT NULL,
    Currency NVARCHAR(3) DEFAULT 'USD',
    
    -- Addresses and metadata
    BillingAddress NVARCHAR(MAX), -- JSON
    ShippingAddress NVARCHAR(MAX), -- JSON
    ShippingMethod NVARCHAR(100),
    TrackingNumber NVARCHAR(100),
    Notes NVARCHAR(1000),
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    
    FOREIGN KEY (CustomerId) REFERENCES Customers(Id)
);
```

## API Design

### Enhanced RESTful Endpoints

#### Products API
```csharp
[ApiController]
[Route("api/v7/marketplace/products")]
public class ProductsController : ControllerBase
{
    // GET api/v7/marketplace/products
    [HttpGet]
    public async Task<ActionResult<PagedResult<ProductDto>>> GetProducts(
        [FromQuery] GetProductsQuery query)

    // POST api/v7/marketplace/products
    [HttpPost]
    [Authorize(Roles = "Vendor,Admin")]
    public async Task<ActionResult<ProductDto>> CreateProduct(
        [FromBody] CreateProductCommand command)

    // PUT api/v7/marketplace/products/{id}
    [HttpPut("{id}")]
    [Authorize(Roles = "Vendor,Admin")]
    public async Task<ActionResult<ProductDto>> UpdateProduct(
        Guid id, [FromBody] UpdateProductCommand command)

    // GET api/v7/marketplace/products/search
    [HttpGet("search")]
    public async Task<ActionResult<PagedResult<ProductDto>>> SearchProducts(
        [FromQuery] SearchProductsQuery query)

    // POST api/v7/marketplace/products/bulk-import
    [HttpPost("bulk-import")]
    [Authorize(Roles = "Vendor,Admin")]
    public async Task<ActionResult<BulkImportResultDto>> BulkImportProducts(
        IFormFile file)
}
```

#### Orders API
```csharp
[ApiController]
[Route("api/v7/marketplace/orders")]
public class OrdersController : ControllerBase
{
    // GET api/v7/marketplace/orders
    [HttpGet]
    [Authorize]
    public async Task<ActionResult<PagedResult<OrderDto>>> GetOrders(
        [FromQuery] GetOrdersQuery query)

    // POST api/v7/marketplace/orders
    [HttpPost]
    [Authorize]
    public async Task<ActionResult<OrderDto>> CreateOrder(
        [FromBody] CreateOrderCommand command)

    // PUT api/v7/marketplace/orders/{id}/status
    [HttpPut("{id}/status")]
    [Authorize(Roles = "Vendor,Admin")]
    public async Task<ActionResult> UpdateOrderStatus(
        Guid id, [FromBody] UpdateOrderStatusCommand command)

    // POST api/v7/marketplace/orders/{id}/fulfill
    [HttpPost("{id}/fulfill")]
    [Authorize(Roles = "Vendor,Admin")]
    public async Task<ActionResult> FulfillOrder(
        Guid id, [FromBody] FulfillOrderCommand command)
}
```

### SignalR Hubs

#### Marketplace Hub
```csharp
[Authorize]
public class MarketplaceHub : Hub
{
    public async Task JoinVendorGroup(string vendorId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, $"vendor_{vendorId}");
    }

    public async Task JoinOrderTracking(string orderId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, $"order_{orderId}");
    }

    // Real-time inventory updates
    public async Task NotifyInventoryUpdate(string productId, int newQuantity)
    {
        await Clients.All.SendAsync("InventoryUpdated", new { ProductId = productId, Quantity = newQuantity });
    }

    // Order status updates
    public async Task NotifyOrderStatusUpdate(string orderId, string status)
    {
        await Clients.Group($"order_{orderId}").SendAsync("OrderStatusUpdated", new { OrderId = orderId, Status = status });
    }
}
```

## CQRS Implementation

### Command Examples

#### Create Order Command
```csharp
public class CreateOrderCommand : IRequest<OrderDto>
{
    public Guid CustomerId { get; set; }
    public List<OrderItemDto> Items { get; set; } = new();
    public AddressDto BillingAddress { get; set; }
    public AddressDto ShippingAddress { get; set; }
    public string ShippingMethod { get; set; }
    public string PaymentMethodId { get; set; }
    public string? PromotionCode { get; set; }
}

public class CreateOrderCommandHandler : IRequestHandler<CreateOrderCommand, OrderDto>
{
    private readonly IRepository<Order> _orderRepository;
    private readonly IInventoryService _inventoryService;
    private readonly IPaymentService _paymentService;
    private readonly IMediator _mediator;

    public async Task<OrderDto> Handle(CreateOrderCommand request, CancellationToken cancellationToken)
    {
        // Validate inventory availability
        await _inventoryService.ValidateAvailabilityAsync(request.Items);

        // Calculate totals
        var subtotal = await CalculateSubtotalAsync(request.Items);
        var total = subtotal; // Add tax, shipping, discounts

        // Create order
        var order = new Order
        {
            OrderNumber = await GenerateOrderNumberAsync(),
            CustomerId = request.CustomerId,
            SubtotalAmount = subtotal,
            TotalAmount = total,
            CreatedAt = DateTime.UtcNow
        };

        await _orderRepository.AddAsync(order);
        await _orderRepository.SaveChangesAsync();

        // Process payment
        var paymentResult = await _paymentService.ProcessPaymentAsync(new ProcessPaymentRequest
        {
            OrderId = order.Id,
            Amount = total,
            PaymentMethodId = request.PaymentMethodId
        });

        if (paymentResult.IsSuccess)
        {
            order.PaymentStatus = PaymentStatus.Paid;
            await _mediator.Publish(new OrderCreatedEvent(order.Id, order.CustomerId));
        }

        await _orderRepository.SaveChangesAsync();
        return _mapper.Map<OrderDto>(order);
    }
}
```

## External Service Integration

### Payment Gateway Integration
```csharp
public interface IPaymentGatewayService
{
    Task<PaymentResult> ProcessPaymentAsync(PaymentRequest request);
    Task<RefundResult> ProcessRefundAsync(RefundRequest request);
}

public class StripePaymentService : IPaymentGatewayService
{
    private readonly StripeClient _stripeClient;

    public async Task<PaymentResult> ProcessPaymentAsync(PaymentRequest request)
    {
        try
        {
            var paymentIntentService = new PaymentIntentService(_stripeClient);
            
            var createOptions = new PaymentIntentCreateOptions
            {
                Amount = (long)(request.Amount * 100), // Convert to cents
                Currency = request.Currency.ToLower(),
                PaymentMethod = request.PaymentMethodId,
                Confirm = true
            };

            var paymentIntent = await paymentIntentService.CreateAsync(createOptions);

            return new PaymentResult
            {
                IsSuccess = paymentIntent.Status == "succeeded",
                TransactionId = paymentIntent.Id,
                Amount = request.Amount,
                ProcessedAt = DateTime.UtcNow
            };
        }
        catch (StripeException ex)
        {
            return new PaymentResult
            {
                IsSuccess = false,
                ErrorMessage = ex.Message
            };
        }
    }
}
```

This design specification provides the technical foundation for building a comprehensive marketplace platform that integrates seamlessly with the existing architecture while adding robust e-commerce capabilities.