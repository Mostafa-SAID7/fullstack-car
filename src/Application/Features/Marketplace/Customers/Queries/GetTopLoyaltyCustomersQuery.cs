using Application.Common.Models;
using MediatR;

namespace Application.Features.Marketplace.Customers.Queries;

public class GetTopLoyaltyCustomersQuery : IRequest<Result<List<TopLoyaltyCustomerDto>>>
{
    public int TopCount { get; set; } = 10;
    public DateTime FromDate { get; set; }
    public DateTime ToDate { get; set; }
    public Guid? ProgramId { get; set; }
}

public class TopLoyaltyCustomerDto
{
    public Guid CustomerId { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public decimal TotalPoints { get; set; }
    public decimal AvailablePoints { get; set; }
    public string TierName { get; set; } = string.Empty;
    public DateTime JoinDate { get; set; }
    public int OrderCount { get; set; }
    public decimal TotalSpent { get; set; }
}
