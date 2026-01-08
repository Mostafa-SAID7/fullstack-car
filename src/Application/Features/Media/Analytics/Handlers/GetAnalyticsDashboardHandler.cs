using Application.Common.Interfaces;
using Application.Common.Models;
using Application.Features.Media.Analytics.DTOs;
using Application.Features.Media.Analytics.Queries;
using Domain.Enums.Media;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Media.Analytics.Handlers;

public class GetAnalyticsDashboardHandler : IRequestHandler<GetAnalyticsDashboardQuery, Result<AnalyticsDashboardDto>>
{
    private readonly IApplicationDbContext _context;

    public GetAnalyticsDashboardHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<AnalyticsDashboardDto>> Handle(GetAnalyticsDashboardQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var (fromDate, toDate) = GetDateRange(request.TimeRange, request.FromDate, request.ToDate);
            
            var dashboard = new AnalyticsDashboardDto
            {
                TimeRange = request.TimeRange,
                GeneratedAt = DateTime.UtcNow
            };

            // Get overview metrics
            dashboard.Overview = await GetOverviewMetrics(request, fromDate, toDate, cancellationToken);

            // Get trends
            dashboard.ViewsTrend = await GetViewsTrend(request, fromDate, toDate, cancellationToken);
            dashboard.EngagementTrend = await GetEngagementTrend(request, fromDate, toDate, cancellationToken);

            // Get top content
            dashboard.TopVideos = await GetTopVideos(request, fromDate, toDate, cancellationToken);
            dashboard.TopPodcasts = await GetTopPodcasts(request, fromDate, toDate, cancellationToken);

            // Get breakdowns if requested
            if (request.IncludeBreakdowns)
            {
                dashboard.TopCountries = await GetTopCountries(request, fromDate, toDate, cancellationToken);
                dashboard.TopDevices = await GetTopDevices(request, fromDate, toDate, cancellationToken);
                dashboard.TopReferrers = await GetTopReferrers(request, fromDate, toDate, cancellationToken);
            }

            // Get comparisons if requested
            if (request.IncludeComparisons)
            {
                dashboard.Comparison = await GetComparison(request, fromDate, toDate, cancellationToken);
            }

            return Result<AnalyticsDashboardDto>.Success(dashboard);
        }
        catch (Exception ex)
        {
            return Result<AnalyticsDashboardDto>.Failure(new[] { $"Error retrieving dashboard data: {ex.Message}" });
        }
    }

    private async Task<OverviewMetricsDto> GetOverviewMetrics(GetAnalyticsDashboardQuery request, DateTime fromDate, DateTime toDate, CancellationToken cancellationToken)
    {
        var videoQuery = _context.VideoViews.Where(vv => vv.CreatedAt >= fromDate && vv.CreatedAt <= toDate);
        var podcastQuery = _context.PodcastPlays.Where(pp => pp.CreatedAt >= fromDate && pp.CreatedAt <= toDate);

        // Apply filters
        if (request.CreatorId.HasValue)
        {
            var creatorVideos = _context.Videos.Where(v => v.CreatorId == request.CreatorId.Value).Select(v => v.Id);
            var creatorPodcasts = _context.Podcasts.Where(p => p.CreatorId == request.CreatorId.Value).Select(p => p.Id);
            
            videoQuery = videoQuery.Where(vv => creatorVideos.Contains(vv.VideoId));
            podcastQuery = podcastQuery.Where(pp => creatorPodcasts.Contains(pp.PodcastId));
        }

        var totalViews = await videoQuery.LongCountAsync(cancellationToken);
        var totalPlays = await podcastQuery.LongCountAsync(cancellationToken);
        var uniqueViews = await videoQuery.Where(vv => vv.IsUnique).LongCountAsync(cancellationToken);
        var uniquePlays = await podcastQuery.Where(pp => pp.IsUnique).LongCountAsync(cancellationToken);

        // Get engagement metrics
        var videoLikes = await _context.VideoLikes
            .Where(vl => vl.CreatedAt >= fromDate && vl.CreatedAt <= toDate)
            .LongCountAsync(cancellationToken);
        
        var podcastLikes = await _context.PodcastLikes
            .Where(pl => pl.CreatedAt >= fromDate && pl.CreatedAt <= toDate)
            .LongCountAsync(cancellationToken);

        var videoComments = await _context.VideoComments
            .Where(vc => vc.CreatedAt >= fromDate && vc.CreatedAt <= toDate)
            .LongCountAsync(cancellationToken);
        
        var podcastComments = await _context.PodcastComments
            .Where(pc => pc.CreatedAt >= fromDate && pc.CreatedAt <= toDate)
            .LongCountAsync(cancellationToken);

        var subscriptions = await _context.PodcastSubscriptions
            .Where(ps => ps.CreatedAt >= fromDate && ps.CreatedAt <= toDate)
            .LongCountAsync(cancellationToken);

        // Calculate average watch time
        var avgVideoWatchTime = await videoQuery
            .AverageAsync(vv => (double?)vv.WatchTimeSeconds, cancellationToken) ?? 0;
        
        var avgPodcastListenTime = await podcastQuery
            .AverageAsync(pp => (double?)pp.ListenTimeSeconds, cancellationToken) ?? 0;

        var avgWatchTime = (avgVideoWatchTime + avgPodcastListenTime) / 2;

        // Calculate engagement rate
        var totalEngagements = videoLikes + podcastLikes + videoComments + podcastComments;
        var totalContent = totalViews + totalPlays;
        var engagementRate = totalContent > 0 ? (double)totalEngagements / totalContent * 100 : 0;

        return new OverviewMetricsDto
        {
            TotalViews = totalViews,
            TotalPlays = totalPlays,
            TotalLikes = videoLikes + podcastLikes,
            TotalComments = videoComments + podcastComments,
            TotalShares = 0, // Would need shares tracking
            TotalSubscribers = subscriptions,
            AverageWatchTime = avgWatchTime,
            AverageEngagementRate = engagementRate,
            UniqueViewers = uniqueViews + uniquePlays,
            ReturningViewers = 0 // Would need user session tracking
        };
    }

    private async Task<List<TrendDataPointDto>> GetViewsTrend(GetAnalyticsDashboardQuery request, DateTime fromDate, DateTime toDate, CancellationToken cancellationToken)
    {
        var days = (toDate - fromDate).Days;
        var trendData = new List<TrendDataPointDto>();

        for (int i = 0; i <= days; i++)
        {
            var date = fromDate.AddDays(i).Date;
            var nextDate = date.AddDays(1);

            var videoViews = await _context.VideoViews
                .Where(vv => vv.CreatedAt >= date && vv.CreatedAt < nextDate && vv.IsUnique)
                .LongCountAsync(cancellationToken);

            var podcastPlays = await _context.PodcastPlays
                .Where(pp => pp.CreatedAt >= date && pp.CreatedAt < nextDate && pp.IsUnique)
                .LongCountAsync(cancellationToken);

            trendData.Add(new TrendDataPointDto
            {
                Date = date,
                Value = videoViews + podcastPlays
            });
        }

        // Calculate percentage changes
        for (int i = 1; i < trendData.Count; i++)
        {
            var current = trendData[i].Value;
            var previous = trendData[i - 1].Value;
            
            if (previous > 0)
            {
                trendData[i].PercentageChange = ((double)(current - previous) / previous) * 100;
            }
        }

        return trendData;
    }

    private async Task<List<TrendDataPointDto>> GetEngagementTrend(GetAnalyticsDashboardQuery request, DateTime fromDate, DateTime toDate, CancellationToken cancellationToken)
    {
        var days = (toDate - fromDate).Days;
        var trendData = new List<TrendDataPointDto>();

        for (int i = 0; i <= days; i++)
        {
            var date = fromDate.AddDays(i).Date;
            var nextDate = date.AddDays(1);

            var videoLikes = await _context.VideoLikes
                .Where(vl => vl.CreatedAt >= date && vl.CreatedAt < nextDate)
                .LongCountAsync(cancellationToken);

            var podcastLikes = await _context.PodcastLikes
                .Where(pl => pl.CreatedAt >= date && pl.CreatedAt < nextDate)
                .LongCountAsync(cancellationToken);

            var videoComments = await _context.VideoComments
                .Where(vc => vc.CreatedAt >= date && vc.CreatedAt < nextDate)
                .LongCountAsync(cancellationToken);

            var podcastComments = await _context.PodcastComments
                .Where(pc => pc.CreatedAt >= date && pc.CreatedAt < nextDate)
                .LongCountAsync(cancellationToken);

            trendData.Add(new TrendDataPointDto
            {
                Date = date,
                Value = videoLikes + podcastLikes + videoComments + podcastComments
            });
        }

        return trendData;
    }

    private async Task<List<TopContentDto>> GetTopVideos(GetAnalyticsDashboardQuery request, DateTime fromDate, DateTime toDate, CancellationToken cancellationToken)
    {
        var query = _context.Videos
            .Where(v => !v.IsDeleted && v.Status == MediaStatus.Published)
            .AsQueryable();

        if (request.CreatorId.HasValue)
        {
            query = query.Where(v => v.CreatorId == request.CreatorId.Value);
        }

        var topVideos = await query
            .OrderByDescending(v => v.ViewCount)
            .Take(10)
            .Select(v => new TopContentDto
            {
                Id = v.Id,
                Title = v.Title,
                Thumbnail = v.Thumbnail,
                Views = v.ViewCount,
                Likes = v.LikeCount,
                EngagementRate = v.ViewCount > 0 ? (double)v.LikeCount / v.ViewCount * 100 : 0,
                PublishedAt = v.PublishedAt ?? v.CreatedAt
            })
            .ToListAsync(cancellationToken);

        return topVideos;
    }

    private async Task<List<TopContentDto>> GetTopPodcasts(GetAnalyticsDashboardQuery request, DateTime fromDate, DateTime toDate, CancellationToken cancellationToken)
    {
        var query = _context.Podcasts
            .Where(p => !p.IsDeleted && p.Status == MediaStatus.Published)
            .AsQueryable();

        if (request.CreatorId.HasValue)
        {
            query = query.Where(p => p.CreatorId == request.CreatorId.Value);
        }

        var topPodcasts = await query
            .OrderByDescending(p => p.PlayCount)
            .Take(10)
            .Select(p => new TopContentDto
            {
                Id = p.Id,
                Title = p.Title,
                Thumbnail = p.CoverImage,
                Views = p.PlayCount,
                Likes = p.LikeCount,
                EngagementRate = p.PlayCount > 0 ? (double)p.LikeCount / p.PlayCount * 100 : 0,
                PublishedAt = p.PublishedAt ?? p.CreatedAt
            })
            .ToListAsync(cancellationToken);

        return topPodcasts;
    }

    private async Task<List<GeographicDataDto>> GetTopCountries(GetAnalyticsDashboardQuery request, DateTime fromDate, DateTime toDate, CancellationToken cancellationToken)
    {
        var videoCountries = await _context.VideoViews
            .Where(vv => vv.CreatedAt >= fromDate && vv.CreatedAt <= toDate && !string.IsNullOrEmpty(vv.Country))
            .GroupBy(vv => vv.Country)
            .Select(g => new { Country = g.Key, Count = g.LongCount() })
            .ToListAsync(cancellationToken);

        var podcastCountries = await _context.PodcastPlays
            .Where(pp => pp.CreatedAt >= fromDate && pp.CreatedAt <= toDate && !string.IsNullOrEmpty(pp.Country))
            .GroupBy(pp => pp.Country)
            .Select(g => new { Country = g.Key, Count = g.LongCount() })
            .ToListAsync(cancellationToken);

        var combinedCountries = videoCountries.Concat(podcastCountries)
            .GroupBy(x => x.Country)
            .Select(g => new { Country = g.Key, Count = g.Sum(x => x.Count) })
            .OrderByDescending(x => x.Count)
            .Take(10)
            .ToList();

        var totalViews = combinedCountries.Sum(x => x.Count);

        return combinedCountries.Select(x => new GeographicDataDto
        {
            Country = x.Country ?? "Unknown",
            Views = x.Count,
            Percentage = totalViews > 0 ? (double)x.Count / totalViews * 100 : 0
        }).ToList();
    }

    private async Task<List<DeviceDataDto>> GetTopDevices(GetAnalyticsDashboardQuery request, DateTime fromDate, DateTime toDate, CancellationToken cancellationToken)
    {
        // Similar implementation for devices
        return new List<DeviceDataDto>();
    }

    private async Task<List<ReferrerDataDto>> GetTopReferrers(GetAnalyticsDashboardQuery request, DateTime fromDate, DateTime toDate, CancellationToken cancellationToken)
    {
        // Similar implementation for referrers
        return new List<ReferrerDataDto>();
    }

    private async Task<ComparisonDataDto> GetComparison(GetAnalyticsDashboardQuery request, DateTime fromDate, DateTime toDate, CancellationToken cancellationToken)
    {
        // Implementation for comparison with previous period
        return new ComparisonDataDto
        {
            PreviousPeriod = "Previous period",
            ViewsChange = 0,
            EngagementChange = 0,
            SubscribersChange = 0
        };
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