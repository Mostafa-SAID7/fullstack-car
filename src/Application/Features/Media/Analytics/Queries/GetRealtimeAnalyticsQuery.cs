using Application.Common.Models;
using Application.Features.Media.Analytics.DTOs;
using Domain.Enums.Media;
using MediatR;

namespace Application.Features.Media.Analytics.Queries;

public class GetRealtimeAnalyticsQuery : IRequest<Result<RealtimeAnalyticsDto>>
{
    public MediaType? MediaType { get; set; }
    public Guid? CreatorId { get; set; }
    public int TimeWindowMinutes { get; set; } = 60; // Real-time window
    public bool IncludeActiveViewers { get; set; } = true;
    public bool IncludeTopContent { get; set; } = true;
    public bool IncludeGeographics { get; set; } = true;
    public int TopContentLimit { get; set; } = 10;
}