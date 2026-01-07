using Application.Common.Models;
using MediatR;

namespace Application.Features.Marketplace.Integration.Queries;

public class GetMarketplacePromotionQuery : IRequest<Result<object>>
{
    public Guid PromotionId { get; set; }
}