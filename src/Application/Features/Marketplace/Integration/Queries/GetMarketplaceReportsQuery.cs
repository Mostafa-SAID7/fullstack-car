using Application.Common.Models;
using MediatR;

namespace Application.Features.Marketplace.Integration.Queries;

public class GetMarketplaceReportsQuery : IRequest<Result<object>>
{
    public string ReportType { get; set; } = string.Empty;
    public DateTime FromDate { get; set; }
    public DateTime ToDate { get; set; }
    public string Format { get; set; } = "json";
    public Guid AdminId { get; set; }
}