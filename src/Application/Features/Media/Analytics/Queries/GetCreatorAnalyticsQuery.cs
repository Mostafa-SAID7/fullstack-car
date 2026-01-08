using Application.Common.Models;
using Application.Features.Media.Analytics.DTOs;
using Domain.Enums.Media;
using MediatR;

namespace Application.Features.Media.Analytics.Queries;

public class GetCreatorAnalyticsQuery : IRequest<Result<CreatorAnalyticsDto>>
{
    public Guid CreatorId { get; set; }
    public MediaType? MediaType { get; set; }
    public DateTime? FromDate { get; set; }
    public DateTime? ToDate { get; set; }
    public string TimeRange { get; set; } = "30d";
    public bool IncludeTopContent { get; set; } = true;
    public bool IncludeAudience { get; set; } = true;
    public bool IncludeRevenue { get; set; } = false;
    public bool IncludeComparisons { get; set; } = true;
    public int TopContentLimit { get; set; } = 10;
}