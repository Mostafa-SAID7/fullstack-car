using Domain.Enums.Marketplace;

namespace Application.Features.Marketplace.Products.DTOs.Requests;

public class CreateProductRequest
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string SKU { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public decimal? DiscountPrice { get; set; }
    public int StockQuantity { get; set; }
    public int MinStockLevel { get; set; }
    public ProductCategory Category { get; set; }
    public string? ImageUrl { get; set; }
    public string? Brand { get; set; }
    public string? Model { get; set; }
    public decimal Weight { get; set; }
    public string? Dimensions { get; set; }
    public bool IsFeatured { get; set; }
    public bool IsDigital { get; set; }
    public DateTime? LaunchDate { get; set; }
    public string? Tags { get; set; }
}

public class UpdateProductRequest
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public decimal? DiscountPrice { get; set; }
    public int StockQuantity { get; set; }
    public int MinStockLevel { get; set; }
    public ProductStatus Status { get; set; }
    public ProductCategory Category { get; set; }
    public string? ImageUrl { get; set; }
    public string? Brand { get; set; }
    public string? Model { get; set; }
    public decimal Weight { get; set; }
    public string? Dimensions { get; set; }
    public bool IsFeatured { get; set; }
    public bool IsDigital { get; set; }
    public DateTime? LaunchDate { get; set; }
    public string? Tags { get; set; }
}

public class UpdateProductStockRequest
{
    public int NewStockQuantity { get; set; }
    public string Reason { get; set; } = string.Empty;
    public bool AdjustMinLevel { get; set; }
    public int? NewMinStockLevel { get; set; }
}

public class BulkUpdateStockRequest
{
    public List<ProductStockUpdate> Products { get; set; } = new();
    public string Reason { get; set; } = string.Empty;
}

public class ProductStockUpdate
{
    public Guid ProductId { get; set; }
    public int NewStockQuantity { get; set; }
    public int? NewMinStockLevel { get; set; }
}

public class BulkUpdateCategoryProductsRequest
{
    public List<Guid> ProductIds { get; set; } = new();
    public ProductStatus? Status { get; set; }
    public bool? IsFeatured { get; set; }
    public decimal? DiscountPercentage { get; set; }
}
