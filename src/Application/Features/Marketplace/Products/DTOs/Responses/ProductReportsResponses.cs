namespace Application.Features.Marketplace.Products.DTOs.Responses;

public class ProductSalesReportResponse
{
    public object? JsonData { get; set; }
    public byte[]? CsvData { get; set; }
    public byte[]? ExcelData { get; set; }
    public DateTime FromDate { get; set; }
    public DateTime ToDate { get; set; }
    public string Format { get; set; } = string.Empty;
}

public class ProductInventoryReportResponse
{
    public object? JsonData { get; set; }
    public byte[]? CsvData { get; set; }
    public byte[]? ExcelData { get; set; }
    public DateTime AsOfDate { get; set; }
    public string Format { get; set; } = string.Empty;
    public bool IncludeZeroStock { get; set; }
}

public class ProductPerformanceReportResponse
{
    public object? JsonData { get; set; }
    public byte[]? CsvData { get; set; }
    public byte[]? ExcelData { get; set; }
    public DateTime FromDate { get; set; }
    public DateTime ToDate { get; set; }
    public string Format { get; set; } = string.Empty;
    public int TopCount { get; set; }
}

public class CategoryAnalysisReportResponse
{
    public object? JsonData { get; set; }
    public byte[]? CsvData { get; set; }
    public byte[]? ExcelData { get; set; }
    public DateTime FromDate { get; set; }
    public DateTime ToDate { get; set; }
    public string Format { get; set; } = string.Empty;
}
