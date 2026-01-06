using Application.Common.Models;
using Application.Features.Marketplace.Products.DTOs.Responses;
using MediatR;

namespace Application.Features.Marketplace.Products.Queries;

public class GetProductSalesReportQuery : IRequest<Result<ProductSalesReportResponse>>
{
    public DateTime FromDate { get; set; }
    public DateTime ToDate { get; set; }
    public string? Format { get; set; } = "json";
}

public class GetProductInventoryReportQuery : IRequest<Result<ProductInventoryReportResponse>>
{
    public DateTime AsOfDate { get; set; }
    public string? Format { get; set; } = "json";
    public bool IncludeZeroStock { get; set; }
}

public class GetProductPerformanceReportQuery : IRequest<Result<ProductPerformanceReportResponse>>
{
    public DateTime FromDate { get; set; }
    public DateTime ToDate { get; set; }
    public string? Format { get; set; } = "json";
    public int TopCount { get; set; } = 50;
}

public class GetCategoryAnalysisReportQuery : IRequest<Result<CategoryAnalysisReportResponse>>
{
    public DateTime FromDate { get; set; }
    public DateTime ToDate { get; set; }
    public string? Format { get; set; } = "json";
}
