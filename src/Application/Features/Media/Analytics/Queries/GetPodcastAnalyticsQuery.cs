using Application.Common.Models;
using Application.Features.Media.Analytics.DTOs;
using MediatR;

namespace Application.Features.Media.Analytics.Queries;

public class GetPodcastAnalyticsQuery : IRequest<Result<PodcastAnalyticsDto>>
{
    public Guid PodcastId { get; set; }
    public DateTime? FromDate { get; set; }
    public DateTime? ToDate { get; set; }
    public string TimeRange { get; set; } = "30d";
    public bool IncludeGeographics { get; set; } = true;
    public bool IncludeDevices { get; set; } = true;
    public bool IncludeReferrers { get; set; } = true;
    public bool IncludeEngagement { get; set; } = true;
    public bool IncludeRetention { get; set; } = true;
    public bool IncludeDownloads { get; set; } = true;
}