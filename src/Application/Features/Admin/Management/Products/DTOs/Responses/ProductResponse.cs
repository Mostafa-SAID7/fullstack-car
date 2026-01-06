using Domain.Enums.Admin.Management;

namespace Application.Features.Admin.Management.Products.DTOs.Responses;

public class ProductResponse
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string SKU { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public decimal? DiscountPrice { get; set; }
    public int StockQuantity { get; set; }
    public int MinStockLevel { get; set; }
    public ProductStatus Status { get; set; }
    public string StatusName { get; set; } = string.Empty;
    public ProductCategory Category { get; set; }
    public string CategoryName { get; set; } = string.Empty;
    public string? ImageUrl { get; set; }
    public string? Brand { get; set; }
    public string? Model { get; set; }
    public decimal Weight { get; set; }
    public string? Dimensions { get; set; }
    public bool IsFeatured { get; set; }
    public bool IsDigital { get; set; }
    public DateTime? LaunchDate { get; set; }
    public string? Tags { get; set; }
    public int ViewCount { get; set; }
    public int SalesCount { get; set; }
    public decimal Rating { get; set; }
    public int ReviewCount { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public string? CreatedByUser { get; set; }
    public string? UpdatedByUser { get; set; }
}

public class ProductListResponse
{
    public List<ProductSummary> Products { get; set; } = new();
    public int TotalCount { get; set; }
    public int PageNumber { get; set; }
    public int PageSize { get; set; }
    public int TotalPages { get; set; }
    public bool HasNextPage { get; set; }
    public bool HasPreviousPage { get; set; }
}

public class ProductSummary
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string SKU { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public decimal? DiscountPrice { get; set; }
    public int StockQuantity { get; set; }
    public ProductStatus Status { get; set; }
    public string StatusName { get; set; } = string.Empty;
    public ProductCategory Category { get; set; }
    public string CategoryName { get; set; } = string.Empty;
    public string? ImageUrl { get; set; }
    public string? Brand { get; set; }
    public bool IsFeatured { get; set; }
    public int SalesCount { get; set; }
    public decimal Rating { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class ProductStatistics
{
    public int TotalProducts { get; set; }
    public int ActiveProducts { get; set; }
    public int InactiveProducts { get; set; }
    public int OutOfStockProducts { get; set; }
    public int LowStockProducts { get; set; }
    public int FeaturedProducts { get; set; }
    public decimal TotalValue { get; set; }
    public decimal AveragePrice { get; set; }
    public int NewProductsThisMonth { get; set; }
    public Dictionary<string, int> ProductsByCategory { get; set; } = new();
    public Dictionary<string, int> ProductsByStatus { get; set; } = new();
}