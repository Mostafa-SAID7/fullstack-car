using Domain.Base;
using Domain.Enums.Admin.Management;

namespace Domain.Entities.Admin.Management.Products;

public class Product : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string SKU { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public decimal? DiscountPrice { get; set; }
    public int StockQuantity { get; set; }
    public int MinStockLevel { get; set; }
    public ProductStatus Status { get; set; } = ProductStatus.Active;
    public ProductCategory Category { get; set; } = ProductCategory.General;
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
    public Guid? CreatedByUserId { get; set; }
    public Guid? UpdatedByUserId { get; set; }
}