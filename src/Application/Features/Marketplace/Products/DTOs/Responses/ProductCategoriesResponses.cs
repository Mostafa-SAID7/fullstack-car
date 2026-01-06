using Domain.Enums.Marketplace;

namespace Application.Features.Marketplace.Products.DTOs.Responses;

public class ProductCategoryResponse
{
    public ProductCategory Category { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int ProductCount { get; set; }
    public decimal TotalValue { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CategoryStatisticsResponse
{
    public ProductCategory Category { get; set; }
    public string CategoryName { get; set; } = string.Empty;
    public int TotalProducts { get; set; }
    public int ActiveProducts { get; set; }
    public int InactiveProducts { get; set; }
    public decimal TotalRevenue { get; set; }
    public decimal AveragePrice { get; set; }
    public int TotalSales { get; set; }
    public DateTime FromDate { get; set; }
    public DateTime ToDate { get; set; }
}
