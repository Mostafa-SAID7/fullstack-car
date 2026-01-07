using Application.Common.Models;
using MediatR;

namespace Application.Features.Marketplace.Integration.Queries;

public class GetMarketplaceTransactionsQuery : IRequest<Result<object>>
{
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public string? Search { get; set; }
    public Domain.Enums.Marketplace.TransactionStatus? Status { get; set; }
    public Domain.Enums.Marketplace.PaymentMethod? PaymentMethod { get; set; }
    public DateTime? FromDate { get; set; }
    public DateTime? ToDate { get; set; }
    public Guid AdminId { get; set; }
}