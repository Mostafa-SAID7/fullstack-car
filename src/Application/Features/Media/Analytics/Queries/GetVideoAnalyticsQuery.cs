using Application.Common.Models;
using Application.Features.Media.Analytics.DTOs;
using MediatR;

namespace Application.Features.Media.Analytics.Queries;

public class GetVideoAnalyticsQuery : IRequest<Result<VideoAnalyticsDto>>
{
    public Guid VideoId { get; set; }
    public DateTime? FromDate { get; set; }
    public DateTime? ToDate { get; set; }
    public string TimeRange { get; set; } = "30d";
    public bool IncludeGeographics { get; set; } = true;
    public bool IncludeDevices { get; set; } = true;
    public bool IncludeReferrers { get; set; } = true;
    public bool IncludeEngagement { get; set; } = true;
    public bool IncludeRetention { get; set; } = true;
}