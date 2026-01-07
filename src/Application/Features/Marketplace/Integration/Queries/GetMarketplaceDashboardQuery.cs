using Application.Common.Models;
using MediatR;

namespace Application.Features.Marketplace.Integration.Queries;

public class GetMarketplaceDashboardQuery : IRequest<Result<object>>
{
    public DateTime FromDate { get; set; }
    public DateTime ToDate { get; set; }
    public Guid AdminId { get; set; }
}