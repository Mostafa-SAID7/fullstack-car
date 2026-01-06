using Application.Common.Models;
using Application.Features.Marketplace.Products.DTOs.Responses;
using Domain.Enums.Marketplace;
using MediatR;

namespace Application.Features.Marketplace.Products.Queries;

public class GetProductsQuery : IRequest<Result<ProductListResponse>>
{
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public string? Search { get; set; }
    public ProductStatus? Status { get; set; }
    public ProductCategory? Category { get; set; }
    public string? Brand { get; set; }
    public decimal? MinPrice { get; set; }
    public decimal? MaxPrice { get; set; }
    public bool? IsFeatured { get; set; }
    public bool? IsLowStock { get; set; }
    public string? SortBy { get; set; } = "CreatedAt";
    public string? SortDirection { get; set; } = "desc";
}

public class GetProductByIdQuery : IRequest<Result<ProductResponse>>
{
    public Guid ProductId { get; set; }
}

public class GetProductStatisticsQuery : IRequest<Result<ProductStatistics>>
{
    public DateTime? FromDate { get; set; }
    public DateTime? ToDate { get; set; }
}

public class SearchProductsQuery : IRequest<Result<List<ProductSummary>>>
{
    public string SearchTerm { get; set; } = string.Empty;
    public int Limit { get; set; } = 20;
    public ProductCategory? Category { get; set; }
    public ProductStatus? Status { get; set; }
}
