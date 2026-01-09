using Application.Common.Interfaces;
using Application.Common.Models;
using Application.Features.Media.Analytics.DTOs;
using Application.Features.Media.Analytics.Queries;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Media.Analytics.Handlers;

public class GetVideoAnalyticsHandler : IRequestHandler<GetVideoAnalyticsQuery, Result<VideoAnalyticsDto>>
{
    private readonly IApplicationDbContext _context;

    public GetVideoAnalyticsHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<VideoAnalyticsDto>> Handle(GetVideoAnalyticsQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var video = await _context.Videos
                .FirstOrDefaultAsync(v => v.Id == request.VideoId && !v.IsDeleted, cancellationToken);

            if (video == null)
            {
                return Result<VideoAnalyticsDto>.Failure(new[] { "Video not found" });
            }

            var (fromDate, toDate) = GetDateRange(request.TimeRange, request.FromDate, request.ToDate);

            var analytics = new VideoAnalyticsDto
            {
                VideoId = video.Id,
                VideoTitle = video.Title,
                TimeRange = request.TimeRange,
                Metrics = new VideoMetricsDto
                {
                    TotalViews = video.ViewCount,
                    TotalLikes = video.LikeCount,
                    TotalDislikes = video.DislikeCount,
                    VideoDuration = video.Duration,
                    EngagementRate = video.ViewCount > 0 ? (double)video.LikeCount / video.ViewCount * 100 : 0
                }
            };

            // Get views trend
            if (request.IncludeEngagement)
            {
                analytics.ViewsTrend = await GetViewsTrend(request.VideoId, fromDate, toDate, cancellationToken);
            }

            // Get geographic breakdown
            if (request.IncludeGeographics)
            {
                analytics.GeographicBreakdown = await GetGeographicBreakdown(request.VideoId, fromDate, toDate, cancellationToken);
            }

            return Result<VideoAnalyticsDto>.Success(analytics);
        }
        catch (Exception ex)
        {
            return Result<VideoAnalyticsDto>.Failure(new[] { $"Error retrieving video analytics: {ex.Message}" });
        }
    }

    private async Task<List<TrendDataPointDto>> GetViewsTrend(Guid videoId, DateTime fromDate, DateTime toDate, CancellationToken cancellationToken)
    {
        var days = (toDate - fromDate).Days;
        var trendData = new List<TrendDataPointDto>();

        for (int i = 0; i <= days; i++)
        {
            var date = fromDate.AddDays(i).Date;
            var nextDate = date.AddDays(1);

            var views = await _context.VideoViews
                .Where(vv => vv.VideoId == videoId && vv.CreatedAt >= date && vv.CreatedAt < nextDate)
                .LongCountAsync(cancellationToken);

            trendData.Add(new TrendDataPointDto
            {
                Date = date,
                Value = views
            });
        }

        return trendData;
    }

    private async Task<List<GeographicDataDto>> GetGeographicBreakdown(Guid videoId, DateTime fromDate, DateTime toDate, CancellationToken cancellationToken)
    {
        var countries = await _context.VideoViews
            .Where(vv => vv.VideoId == videoId && vv.CreatedAt >= fromDate && vv.CreatedAt <= toDate && !string.IsNullOrEmpty(vv.Country))
            .GroupBy(vv => vv.Country)
            .Select(g => new { Country = g.Key, Count = g.LongCount() })
            .OrderByDescending(x => x.Count)
            .Take(10)
            .ToListAsync(cancellationToken);

        var totalViews = countries.Sum(x => x.Count);

        return countries.Select(x => new GeographicDataDto
        {
            Country = x.Country ?? "Unknown",
            Views = x.Count,
            Percentage = totalViews > 0 ? (double)x.Count / totalViews * 100 : 0
        }).ToList();
    }

    private (DateTime fromDate, DateTime toDate) GetDateRange(string timeRange, DateTime? fromDate, DateTime? toDate)
    {
        if (fromDate.HasValue && toDate.HasValue)
        {
            return (fromDate.Value, toDate.Value);
        }

        var now = DateTime.UtcNow;
        return timeRange.ToLower() switch
        {
            "1d" => (now.AddDays(-1), now),
            "7d" => (now.AddDays(-7), now),
            "30d" => (now.AddDays(-30), now),
            "90d" => (now.AddDays(-90), now),
            "1y" => (now.AddYears(-1), now),
            _ => (now.AddDays(-30), now)
        };
    }
}