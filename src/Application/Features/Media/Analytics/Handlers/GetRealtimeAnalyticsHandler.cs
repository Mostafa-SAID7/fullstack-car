using Application.Common.Interfaces;
using Application.Common.Models;
using Application.Features.Media.Analytics.DTOs;
using Application.Features.Media.Analytics.Queries;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Media.Analytics.Handlers;

public class GetRealtimeAnalyticsHandler : IRequestHandler<GetRealtimeAnalyticsQuery, Result<RealtimeAnalyticsDto>>
{
    private readonly IApplicationDbContext _context;

    public GetRealtimeAnalyticsHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<RealtimeAnalyticsDto>> Handle(GetRealtimeAnalyticsQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var timeWindow = DateTime.UtcNow.AddMinutes(-request.TimeWindowMinutes);

            var analytics = new RealtimeAnalyticsDto
            {
                TimeWindowMinutes = request.TimeWindowMinutes
            };

            // Get active viewers (simplified - would need session tracking)
            var recentVideoViews = await _context.VideoViews
                .Where(vv => vv.CreatedAt >= timeWindow)
                .CountAsync(cancellationToken);

            var recentPodcastPlays = await _context.PodcastPlays
                .Where(pp => pp.CreatedAt >= timeWindow)
                .CountAsync(cancellationToken);

            analytics.ActiveViewers = recentVideoViews;
            analytics.ActiveListeners = recentPodcastPlays;

            // Get top content in time window
            if (request.IncludeTopContent)
            {
                var topVideos = await _context.VideoViews
                    .Where(vv => vv.CreatedAt >= timeWindow)
                    .GroupBy(vv => vv.VideoId)
                    .Select(g => new { VideoId = g.Key, ViewCount = g.Count() })
                    .OrderByDescending(x => x.ViewCount)
                    .Take(request.TopContentLimit)
                    .Join(_context.Videos, x => x.VideoId, v => v.Id, (x, v) => new RealtimeContentDto
                    {
                        Id = v.Id,
                        Title = v.Title,
                        Type = "Video",
                        CurrentViewers = x.ViewCount,
                        ViewsInWindow = x.ViewCount
                    })
                    .ToListAsync(cancellationToken);

                analytics.TopContent = topVideos;
            }

            // Get metrics
            analytics.Metrics = new RealtimeMetricsDto
            {
                ViewsPerMinute = recentVideoViews / request.TimeWindowMinutes,
                PlaysPerMinute = recentPodcastPlays / request.TimeWindowMinutes
            };

            return Result<RealtimeAnalyticsDto>.Success(analytics);
        }
        catch (Exception ex)
        {
            return Result<RealtimeAnalyticsDto>.Failure(new[] { $"Error retrieving real-time analytics: {ex.Message}" });
        }
    }
}