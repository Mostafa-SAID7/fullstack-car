using Application.Common.Interfaces;
using Domain.Entities.Media;
using Domain.Enums.Media;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System.Text.Json;

namespace Infrastructure.Services.Analytics;
public class AnalyticsAggregationService : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly ILogger<AnalyticsAggregationService> _logger;
    private readonly TimeSpan _aggregationInterval = TimeSpan.FromMinutes(5); // Run every 5 minutes

    public AnalyticsAggregationService(
        IServiceProvider serviceProvider,
        ILogger<AnalyticsAggregationService> logger)
    {
        _serviceProvider = serviceProvider;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("Analytics Aggregation Service started");

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                await AggregateAnalyticsData(stoppingToken);
                await Task.Delay(_aggregationInterval, stoppingToken);
            }
            catch (OperationCanceledException)
            {
                // Expected when cancellation is requested
                break;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred during analytics aggregation");
                await Task.Delay(TimeSpan.FromMinutes(1), stoppingToken); // Wait before retrying
            }
        }

        _logger.LogInformation("Analytics Aggregation Service stopped");
    }

    private async Task AggregateAnalyticsData(CancellationToken cancellationToken)
    {
        using var scope = _serviceProvider.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<IApplicationDbContext>();

        _logger.LogDebug("Starting analytics aggregation");

        // Get all videos and podcasts that need analytics updates
        var videosToUpdate = await GetVideosNeedingUpdate(context, cancellationToken);
        var podcastsToUpdate = await GetPodcastsNeedingUpdate(context, cancellationToken);

        var totalUpdated = 0;

        // Update video analytics
        foreach (var video in videosToUpdate)
        {
            await UpdateVideoAnalytics(context, video, cancellationToken);
            totalUpdated++;
        }

        // Update podcast analytics
        foreach (var podcast in podcastsToUpdate)
        {
            await UpdatePodcastAnalytics(context, podcast, cancellationToken);
            totalUpdated++;
        }

        if (totalUpdated > 0)
        {
            await context.SaveChangesAsync(cancellationToken);
            _logger.LogInformation("Updated analytics for {Count} media items", totalUpdated);
        }
        else
        {
            _logger.LogDebug("No analytics updates needed");
        }
    }

    private async Task<List<Video>> GetVideosNeedingUpdate(IApplicationDbContext context, CancellationToken cancellationToken)
    {
        // Get videos that have been viewed in the last hour or don't have analytics records
        var cutoffTime = DateTime.UtcNow.AddHours(-1);
        
        var videosWithRecentViews = await context.VideoViews
            .Where(vv => vv.CreatedAt >= cutoffTime)
            .Select(vv => vv.VideoId)
            .Distinct()
            .ToListAsync(cancellationToken);

        var videosWithoutAnalytics = await context.Videos
            .Where(v => !v.IsDeleted && !context.MediaAnalytics.Any(ma => ma.MediaId == v.Id && ma.MediaType == MediaType.Video))
            .Select(v => v.Id)
            .ToListAsync(cancellationToken);

        var videoIdsToUpdate = videosWithRecentViews.Union(videosWithoutAnalytics).ToList();

        return await context.Videos
            .Where(v => videoIdsToUpdate.Contains(v.Id) && !v.IsDeleted)
            .ToListAsync(cancellationToken);
    }

    private async Task<List<Podcast>> GetPodcastsNeedingUpdate(IApplicationDbContext context, CancellationToken cancellationToken)
    {
        // Get podcasts that have been played in the last hour or don't have analytics records
        var cutoffTime = DateTime.UtcNow.AddHours(-1);
        
        var podcastsWithRecentPlays = await context.PodcastPlays
            .Where(pp => pp.CreatedAt >= cutoffTime)
            .Select(pp => pp.PodcastId)
            .Distinct()
            .ToListAsync(cancellationToken);

        var podcastsWithoutAnalytics = await context.Podcasts
            .Where(p => !p.IsDeleted && !context.MediaAnalytics.Any(ma => ma.MediaId == p.Id && ma.MediaType == MediaType.Podcast))
            .Select(p => p.Id)
            .ToListAsync(cancellationToken);

        var podcastIdsToUpdate = podcastsWithRecentPlays.Union(podcastsWithoutAnalytics).ToList();

        return await context.Podcasts
            .Where(p => podcastIdsToUpdate.Contains(p.Id) && !p.IsDeleted)
            .ToListAsync(cancellationToken);
    }

    private async Task UpdateVideoAnalytics(IApplicationDbContext context, Video video, CancellationToken cancellationToken)
    {
        var analytics = await context.MediaAnalytics
            .FirstOrDefaultAsync(ma => ma.MediaId == video.Id && ma.MediaType == MediaType.Video, cancellationToken);

        if (analytics == null)
        {
            analytics = new MediaAnalytics
            {
                MediaId = video.Id,
                MediaType = MediaType.Video,
                LastUpdated = DateTime.UtcNow
            };
            context.MediaAnalytics.Add(analytics);
        }

        // Calculate time-based views
        var now = DateTime.UtcNow;
        var today = now.Date;
        var weekStart = today.AddDays(-(int)today.DayOfWeek);
        var monthStart = new DateTime(today.Year, today.Month, 1);

        // Get view counts for different time periods
        analytics.ViewsToday = await context.VideoViews
            .Where(vv => vv.VideoId == video.Id && vv.CreatedAt >= today)
            .CountAsync(cancellationToken);

        analytics.ViewsWeek = await context.VideoViews
            .Where(vv => vv.VideoId == video.Id && vv.CreatedAt >= weekStart)
            .CountAsync(cancellationToken);

        analytics.ViewsMonth = await context.VideoViews
            .Where(vv => vv.VideoId == video.Id && vv.CreatedAt >= monthStart)
            .CountAsync(cancellationToken);

        analytics.ViewsTotal = await context.VideoViews
            .Where(vv => vv.VideoId == video.Id)
            .CountAsync(cancellationToken);

        // Sync with video entity counters
        video.ViewCount = analytics.ViewsTotal;

        // Get engagement metrics
        analytics.LikesCount = await context.VideoLikes
            .Where(vl => vl.VideoId == video.Id)
            .CountAsync(cancellationToken);

        analytics.CommentsCount = await context.VideoComments
            .Where(vc => vc.VideoId == video.Id && !vc.IsDeleted)
            .CountAsync(cancellationToken);

        // Sync with video entity counters
        video.LikeCount = analytics.LikesCount;

        // Calculate average watch time and completion rate
        var videoViews = await context.VideoViews
            .Where(vv => vv.VideoId == video.Id)
            .ToListAsync(cancellationToken);

        if (videoViews.Any())
        {
            analytics.AverageWatchTime = (decimal)videoViews.Average(vv => vv.WatchDuration.TotalSeconds);
            analytics.CompletionRate = (decimal)(videoViews.Count(vv => vv.IsCompleted) * 100.0 / videoViews.Count);
        }

        // Get geographic and device breakdowns
        await UpdateGeographicAndDeviceData(context, analytics, MediaType.Video, cancellationToken);

        analytics.LastUpdated = DateTime.UtcNow;
    }

    private async Task UpdatePodcastAnalytics(IApplicationDbContext context, Podcast podcast, CancellationToken cancellationToken)
    {
        var analytics = await context.MediaAnalytics
            .FirstOrDefaultAsync(ma => ma.MediaId == podcast.Id && ma.MediaType == MediaType.Podcast, cancellationToken);

        if (analytics == null)
        {
            analytics = new MediaAnalytics
            {
                MediaId = podcast.Id,
                MediaType = MediaType.Podcast,
                LastUpdated = DateTime.UtcNow
            };
            context.MediaAnalytics.Add(analytics);
        }

        // Calculate time-based plays
        var now = DateTime.UtcNow;
        var today = now.Date;
        var weekStart = today.AddDays(-(int)today.DayOfWeek);
        var monthStart = new DateTime(today.Year, today.Month, 1);

        // Get play counts for different time periods
        analytics.ViewsToday = await context.PodcastPlays
            .Where(pp => pp.PodcastId == podcast.Id && pp.CreatedAt >= today)
            .CountAsync(cancellationToken);

        analytics.ViewsWeek = await context.PodcastPlays
            .Where(pp => pp.PodcastId == podcast.Id && pp.CreatedAt >= weekStart)
            .CountAsync(cancellationToken);

        analytics.ViewsMonth = await context.PodcastPlays
            .Where(pp => pp.PodcastId == podcast.Id && pp.CreatedAt >= monthStart)
            .CountAsync(cancellationToken);

        analytics.ViewsTotal = await context.PodcastPlays
            .Where(pp => pp.PodcastId == podcast.Id)
            .CountAsync(cancellationToken);

        // Sync with podcast entity counters
        podcast.PlayCount = analytics.ViewsTotal;

        // Get engagement metrics
        analytics.LikesCount = await context.PodcastLikes
            .Where(pl => pl.PodcastId == podcast.Id)
            .CountAsync(cancellationToken);

        analytics.CommentsCount = await context.PodcastComments
            .Where(pc => pc.PodcastId == podcast.Id && !pc.IsDeleted)
            .CountAsync(cancellationToken);

        // Sync with podcast entity counters
        podcast.LikeCount = analytics.LikesCount;

        // Calculate average listen time and completion rate
        var podcastPlays = await context.PodcastPlays
            .Where(pp => pp.PodcastId == podcast.Id)
            .ToListAsync(cancellationToken);

        if (podcastPlays.Any())
        {
            analytics.AverageWatchTime = (decimal)podcastPlays.Average(pp => pp.PlayDuration.TotalSeconds);
            analytics.CompletionRate = (decimal)(podcastPlays.Count(pp => pp.IsCompleted) * 100.0 / podcastPlays.Count);
        }

        // Get geographic and device breakdowns
        await UpdateGeographicAndDeviceData(context, analytics, MediaType.Podcast, cancellationToken);

        analytics.LastUpdated = DateTime.UtcNow;
    }

    private async Task UpdateGeographicAndDeviceData(IApplicationDbContext context, MediaAnalytics analytics, MediaType mediaType, CancellationToken cancellationToken)
    {
        // Get top countries
        List<object> topCountries;
        List<object> topDevices;

        if (mediaType == MediaType.Video)
        {
            topCountries = await context.VideoViews
                .Where(vv => vv.VideoId == analytics.MediaId && !string.IsNullOrEmpty(vv.Country))
                .GroupBy(vv => vv.Country)
                .Select(g => new { Country = g.Key, Count = g.Count() })
                .OrderByDescending(x => x.Count)
                .Take(10)
                .Cast<object>()
                .ToListAsync(cancellationToken);

            // Extract device info from UserAgent - simplified approach
            topDevices = await context.VideoViews
                .Where(vv => vv.VideoId == analytics.MediaId && !string.IsNullOrEmpty(vv.UserAgent))
                .GroupBy(vv => vv.UserAgent!.Contains("Mobile") ? "Mobile" : 
                              vv.UserAgent.Contains("Tablet") ? "Tablet" : "Desktop")
                .Select(g => new { Device = g.Key, Count = g.Count() })
                .OrderByDescending(x => x.Count)
                .Cast<object>()
                .ToListAsync(cancellationToken);
        }
        else
        {
            topCountries = await context.PodcastPlays
                .Where(pp => pp.PodcastId == analytics.MediaId && !string.IsNullOrEmpty(pp.Country))
                .GroupBy(pp => pp.Country)
                .Select(g => new { Country = g.Key, Count = g.Count() })
                .OrderByDescending(x => x.Count)
                .Take(10)
                .Cast<object>()
                .ToListAsync(cancellationToken);

            topDevices = await context.PodcastPlays
                .Where(pp => pp.PodcastId == analytics.MediaId && !string.IsNullOrEmpty(pp.UserAgent))
                .GroupBy(pp => pp.UserAgent!.Contains("Mobile") ? "Mobile" : 
                              pp.UserAgent.Contains("Tablet") ? "Tablet" : "Desktop")
                .Select(g => new { Device = g.Key, Count = g.Count() })
                .OrderByDescending(x => x.Count)
                .Cast<object>()
                .ToListAsync(cancellationToken);
        }

        // Store as JSON
        analytics.TopCountries = topCountries.Any() ? JsonSerializer.Serialize(topCountries) : null;
        analytics.TopDevices = topDevices.Any() ? JsonSerializer.Serialize(topDevices) : null;
    }
}