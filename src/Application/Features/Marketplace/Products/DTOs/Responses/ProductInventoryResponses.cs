namespace Application.Features.Marketplace.Products.DTOs.Responses;

public class ProductInventoryResponse
{
    public Guid ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public string SKU { get; set; } = string.Empty;
    public int CurrentStock { get; set; }
    public int MinimumStock { get; set; }
    public int MaximumStock { get; set; }
    public decimal UnitCost { get; set; }
    public decimal TotalValue { get; set; }
    public DateTime LastUpdated { get; set; }
    public string? Location { get; set; }
    public string CategoryName { get; set; } = string.Empty;
}

public class InventoryReportResponse
{
    public List<ProductInventoryResponse> Products { get; set; } = new();
    public InventoryReportSummary Summary { get; set; } = new();
    public DateTime FromDate { get; set; }
    public DateTime ToDate { get; set; }
    public bool IncludeMovements { get; set; }
}

public class InventoryReportSummary
{
    public int TotalProducts { get; set; }
    public decimal TotalValue { get; set; }
    public int LowStockCount { get; set; }
    public int OutOfStockCount { get; set; }
    public int OverstockCount { get; set; }
}
