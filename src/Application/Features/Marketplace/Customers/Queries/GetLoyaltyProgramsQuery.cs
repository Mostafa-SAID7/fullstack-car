using Application.Common.Models;
using MediatR;

namespace Application.Features.Marketplace.Customers.Queries;

public class GetLoyaltyProgramsQuery : IRequest<Result<List<LoyaltyProgramDto>>>
{
}

public class LoyaltyProgramDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public bool IsActive { get; set; }
    public decimal PointsPerDollar { get; set; }
    public int MemberCount { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public List<LoyaltyTierDto> Tiers { get; set; } = new();
}
