using Application.Common.Models;
using Application.Features.Marketplace.Products.DTOs.Responses;
using Domain.Enums.Marketplace;
using MediatR;

namespace Application.Features.Marketplace.Products.Queries;

public class GetProductCategoriesQuery : IRequest<Result<List<ProductCategoryResponse>>>
{
}

public class GetProductsByCategoryQuery : IRequest<Result<PaginatedList<ProductResponse>>>
{
    public ProductCategory Category { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public string? Search { get; set; }
    public ProductStatus? Status { get; set; }
}

public class GetCategoryStatisticsQuery : IRequest<Result<CategoryStatisticsResponse>>
{
    public ProductCategory Category { get; set; }
    public DateTime FromDate { get; set; }
    public DateTime ToDate { get; set; }
}
