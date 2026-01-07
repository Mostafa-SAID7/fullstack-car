using Application.Common.Models;
using MediatR;

namespace Application.Features.Marketplace.Integration.Queries;

public class GetCrossSellRecommendationsQuery : IRequest<Result<object>>
{
    public Guid CustomerId { get; set; }
    public int Limit { get; set; } = 10;
    public Guid AdminId { get; set; }
}