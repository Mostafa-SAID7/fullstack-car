using Application.Common.Models;
using MediatR;

namespace Application.Features.Marketplace.Customers.Queries;

public class GetLoyaltyPointsHistoryQuery : IRequest<Result<PaginatedList<LoyaltyPointsHistoryDto>>>
{
    public Guid CustomerId { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public DateTime FromDate { get; set; }
    public DateTime ToDate { get; set; }
}

public class LoyaltyPointsHistoryDto
{
    public Guid Id { get; set; }
    public Guid CustomerId { get; set; }
    public string TransactionType { get; set; } = string.Empty; // Earned, Redeemed, Expired, Adjusted
    public decimal Points { get; set; }
    public decimal Balance { get; set; }
    public string Description { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public Guid? OrderId { get; set; }
    public string? OrderNumber { get; set; }
}
