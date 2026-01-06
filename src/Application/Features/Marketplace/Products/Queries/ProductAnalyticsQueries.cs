using Application.Common.Models;
using Application.Features.Marketplace.Products.DTOs.Responses;
using MediatR;

namespace Application.Features.Marketplace.Products.Queries;

public class GetProductPerformanceQuery : IRequest<Result<ProductPerformanceResponse>>
{
    public DateTime FromDate { get; set; }
    public DateTime ToDate { get; set; }
    public int TopCount { get; set; } = 10;
}

public class GetProductSalesTrendsQuery : IRequest<Result<ProductSalesTrendsResponse>>
{
    public DateTime FromDate { get; set; }
    public DateTime ToDate { get; set; }
    public string? GroupBy { get; set; } = "month";
}

public class GetProductCategoryPerformanceQuery : IRequest<Result<CategoryPerformanceResponse>>
{
    public DateTime FromDate { get; set; }
    public DateTime ToDate { get; set; }
}

public class GetProductInventoryAnalysisQuery : IRequest<Result<InventoryAnalysisResponse>>
{
}
