using Application.Common.Models;
using Application.Features.Marketplace.Integration.DTOs.Requests;
using MediatR;

namespace Application.Features.Marketplace.Integration.Commands;

public class CreateMarketplacePromotionCommand : IRequest<Result<object>>
{
    public Guid AdminId { get; set; }
    public CreateMarketplacePromotionRequest Request { get; set; } = null!;
}