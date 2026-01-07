using Application.Common.Models;
using MediatR;

namespace Application.Features.Marketplace.Integration.Queries;

public class GetMarketplaceOrdersQuery : IRequest<Result<object>>
{
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public string? Search { get; set; }
    public Domain.Enums.Marketplace.OrderStatus? Status { get; set; }
    public Domain.Enums.Marketplace.OrderType? Type { get; set; }
    public DateTime? FromDate { get; set; }
    public DateTime? ToDate { get; set; }
    public string? SortBy { get; set; }
    public string? SortDirection { get; set; }
    public Guid AdminId { get; set; }
}