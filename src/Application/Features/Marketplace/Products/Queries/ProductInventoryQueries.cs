using Application.Common.Models;
using Application.Features.Marketplace.Products.DTOs.Responses;
using MediatR;

namespace Application.Features.Marketplace.Products.Queries;

public class GetLowStockProductsQuery : IRequest<Result<PaginatedList<ProductInventoryResponse>>>
{
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public int? Threshold { get; set; }
}

public class GetOutOfStockProductsQuery : IRequest<Result<PaginatedList<ProductInventoryResponse>>>
{
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}

public class GetInventoryReportQuery : IRequest<Result<InventoryReportResponse>>
{
    public DateTime FromDate { get; set; }
    public DateTime ToDate { get; set; }
    public bool IncludeMovements { get; set; }
}
