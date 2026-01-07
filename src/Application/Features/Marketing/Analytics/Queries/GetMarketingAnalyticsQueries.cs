using Application.Common.Models;
using Application.Features.Marketing.Analytics.DTOs;
using MediatR;

namespace Application.Features.Marketing.Analytics.Queries;

public class GetMarketingOverviewQuery : IRequest<Result<MarketingOverviewDto>>
{
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public string? TimeRange { get; set; } = "30d";
}

public class GetPlatformAnalyticsQuery : IRequest<Result<List<PlatformAnalyticsDto>>>
{
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public Guid? PlatformId { get; set; }
    public string? TimeRange { get; set; } = "30d";
}

public class GetCampaignAnalyticsQuery : IRequest<Result<List<CampaignAnalyticsDto>>>
{
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public Guid? CampaignId { get; set; }
    public string? TimeRange { get; set; } = "30d";
}

public class GetMarketingPerformanceQuery : IRequest<Result<MarketingPerformanceDto>>
{
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public string? TimeRange { get; set; } = "30d";
}

public class GetTopPerformingContentQuery : IRequest<Result<List<TopPerformingContentDto>>>
{
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public int Limit { get; set; } = 10;
    public string? TimeRange { get; set; } = "30d";
}

public class GetSocialPlatformsQuery : IRequest<Result<List<SocialPlatformDto>>>
{
    public bool? IsActive { get; set; }
}