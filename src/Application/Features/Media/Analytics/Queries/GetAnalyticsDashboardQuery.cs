using Application.Common.Models;
using Application.Features.Media.Analytics.DTOs;
using Domain.Enums.Media;
using MediatR;

namespace Application.Features.Media.Analytics.Queries;

public class GetAnalyticsDashboardQuery : IRequest<Result<AnalyticsDashboardDto>>
{
    public Guid? UserId { get; set; }
    public Guid? CreatorId { get; set; }
    public MediaType? MediaType { get; set; }
    public DateTime? FromDate { get; set; }
    public DateTime? ToDate { get; set; }
    public string TimeRange { get; set; } = "30d"; // 1d, 7d, 30d, 90d, 1y
    public bool IncludeComparisons { get; set; } = true;
    public bool IncludeBreakdowns { get; set; } = true;
}