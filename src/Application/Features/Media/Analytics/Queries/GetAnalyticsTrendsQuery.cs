using Application.Common.Models;
using Application.Features.Media.Analytics.DTOs;
using Domain.Enums.Media;
using MediatR;

namespace Application.Features.Media.Analytics.Queries;

public class GetAnalyticsTrendsQuery : IRequest<Result<AnalyticsTrendsDto>>
{
    public Guid? UserId { get; set; }
    public Guid? CreatorId { get; set; }
    public MediaType? MediaType { get; set; }
    public DateTime? FromDate { get; set; }
    public DateTime? ToDate { get; set; }
    public string TimeRange { get; set; } = "30d";
    public string Granularity { get; set; } = "daily"; // hourly, daily, weekly, monthly
    public List<string> Metrics { get; set; } = new() { "views", "engagement", "subscribers" };
    public bool IncludePredictions { get; set; } = false;
    public bool IncludeComparisons { get; set; } = true;
}