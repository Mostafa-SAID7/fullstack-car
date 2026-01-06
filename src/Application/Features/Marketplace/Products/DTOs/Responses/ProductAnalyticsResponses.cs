namespace Application.Features.Marketplace.Products.DTOs.Responses;

public class ProductPerformanceResponse
{
    public List<ProductPerformanceItem> TopProducts { get; set; } = new();
    public decimal TotalRevenue { get; set; }
    public int TotalSales { get; set; }
    public DateTime FromDate { get; set; }
    public DateTime ToDate { get; set; }
}

public class ProductPerformanceItem
{
    public Guid ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public decimal Revenue { get; set; }
    public int SalesCount { get; set; }
    public int ViewCount { get; set; }
    public decimal ConversionRate { get; set; }
}

public class ProductSalesTrendsResponse
{
    public List<SalesTrendItem> Trends { get; set; } = new();
    public string GroupBy { get; set; } = string.Empty;
    public DateTime FromDate { get; set; }
    public DateTime ToDate { get; set; }
}

public class SalesTrendItem
{
    public string Period { get; set; } = string.Empty;
    public decimal Revenue { get; set; }
    public int SalesCount { get; set; }
    public int ProductsSold { get; set; }
}

public class CategoryPerformanceResponse
{
    public List<CategoryPerformanceItem> Categories { get; set; } = new();
    public DateTime FromDate { get; set; }
    public DateTime ToDate { get; set; }
}

public class CategoryPerformanceItem
{
    public string CategoryName { get; set; } = string.Empty;
    public decimal Revenue { get; set; }
    public int SalesCount { get; set; }
    public int ProductCount { get; set; }
    public decimal AveragePrice { get; set; }
}

public class InventoryAnalysisResponse
{
    public int TotalProducts { get; set; }
    public int LowStockProducts { get; set; }
    public int OutOfStockProducts { get; set; }
    public decimal TotalInventoryValue { get; set; }
    public List<InventoryAnalysisItem> Categories { get; set; } = new();
}

public class InventoryAnalysisItem
{
    public string CategoryName { get; set; } = string.Empty;
    public int ProductCount { get; set; }
    public int LowStockCount { get; set; }
    public int OutOfStockCount { get; set; }
    public decimal InventoryValue { get; set; }
}
