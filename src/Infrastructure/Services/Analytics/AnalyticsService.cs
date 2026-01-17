using Application.Common.Interfaces;
using Application.Features.Media.Analytics.Services;
using Domain.Entities.Media;
using Domain.Enums.Media;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Services.Analytics;
public class MediaAnalyticsService : IMediaAnalyticsService
{
    private readonly IApplicationDbContext _context;
    private readonly ILogger<MediaAnalyticsService> _logger;

    public MediaAnalyticsService(
        IApplicationDbContext context,
        ILogger<MediaAnalyticsService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task UpdateAnalyticsAsync(Guid mediaId, MediaType mediaType, CancellationToken cancellationToken = default)
    {
        try
        {
            var analytics = await GetOrCreateAnalyticsAsync(mediaId, mediaType, cancellationToken);
            
            // Update total views/plays count
            var totalCount = mediaType == MediaType.Video
                ? await _context.VideoViews.CountAsync(vv => vv.VideoId == mediaId, cancellationToken)
                : await _context.PodcastPlays.CountAsync(pp => pp.PodcastId == mediaId, cancellationToken);

            analytics.ViewsTotal = totalCount;

            // Update today's count
            var today = DateTime.UtcNow.Date;
            var todayCount = mediaType == MediaType.Video
                ? await _context.VideoViews.CountAsync(vv => vv.VideoId == mediaId && vv.CreatedAt >= today, cancellationToken)
                : await _context.PodcastPlays.CountAsync(pp => pp.PodcastId == mediaId && pp.CreatedAt >= today, cancellationToken);

            analytics.ViewsToday = todayCount;

            // Calculate average watch time
            if (totalCount > 0)
            {
                var averageWatchTime = mediaType == MediaType.Video
                    ? (await _context.VideoViews
                        .Where(vv => vv.VideoId == mediaId)
                        .ToListAsync(cancellationToken))
                        .Average(vv => vv.WatchDuration.TotalSeconds)
                    : (await _context.PodcastPlays
                        .Where(pp => pp.PodcastId == mediaId)
                        .ToListAsync(cancellationToken))
                        .Average(pp => pp.PlayDuration.TotalSeconds);

                analytics.AverageWatchTime = (decimal)averageWatchTime;
            }
            else
            {
                analytics.AverageWatchTime = 0;
            }

            analytics.LastUpdated = DateTime.UtcNow;

            await _context.SaveChangesAsync(cancellationToken);

            _logger.LogDebug("Updated analytics for {MediaType} {MediaId}: Total={Total}, Today={Today}, AvgWatchTime={AvgWatchTime}", 
                mediaType, mediaId, totalCount, todayCount, analytics.AverageWatchTime);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating analytics for {MediaType} {MediaId}", mediaType, mediaId);
            throw;
        }
    }

    public async Task IncrementViewCountAsync(Guid mediaId, MediaType mediaType, CancellationToken cancellationToken = default)
    {
        try
        {
            // Update the media entity counter for immediate consistency
            if (mediaType == MediaType.Video)
            {
                var video = await _context.Videos.FindAsync(new object[] { mediaId }, cancellationToken);
                if (video != null && !video.IsDeleted)
                {
                    var oldViewCount = video.ViewCount;
                    video.ViewCount++;
                    _logger.LogDebug("Incrementing video {VideoId} view count from {OldCount} to {NewCount}", 
                        mediaId, oldViewCount, video.ViewCount);
                }
                else
                {
                    _logger.LogWarning("Video {VideoId} not found or is deleted", mediaId);
                }
            }
            else
            {
                var podcast = await _context.Podcasts.FindAsync(new object[] { mediaId }, cancellationToken);
                if (podcast != null && !podcast.IsDeleted)
                {
                    podcast.PlayCount++;
                }
            }

            // Save the media entity changes first
            var changesSaved = await _context.SaveChangesAsync(cancellationToken);
            _logger.LogDebug("Saved {ChangeCount} changes to database for {MediaType} {MediaId}", 
                changesSaved, mediaType, mediaId);

            // Update analytics record
            await UpdateAnalyticsAsync(mediaId, mediaType, cancellationToken);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error incrementing view count for {MediaType} {MediaId}", mediaType, mediaId);
            throw;
        }
    }

    public async Task UpdateEngagementMetricsAsync(Guid mediaId, MediaType mediaType, string engagementType, int delta = 1, CancellationToken cancellationToken = default)
    {
        try
        {
            var analytics = await GetOrCreateAnalyticsAsync(mediaId, mediaType, cancellationToken);

            switch (engagementType.ToLower())
            {
                case "like":
                    analytics.LikesCount = Math.Max(0, analytics.LikesCount + delta);
                    
                    // Update media entity counter
                    if (mediaType == MediaType.Video)
                    {
                        var video = await _context.Videos.FindAsync(new object[] { mediaId }, cancellationToken);
                        if (video != null) video.LikeCount = Math.Max(0, video.LikeCount + delta);
                    }
                    else
                    {
                        var podcast = await _context.Podcasts.FindAsync(new object[] { mediaId }, cancellationToken);
                        if (podcast != null) podcast.LikeCount = Math.Max(0, podcast.LikeCount + delta);
                    }
                    break;

                case "dislike":
                    analytics.DislikesCount = Math.Max(0, analytics.DislikesCount + delta);
                    
                    // Update media entity counter
                    if (mediaType == MediaType.Video)
                    {
                        var video = await _context.Videos.FindAsync(new object[] { mediaId }, cancellationToken);
                        if (video != null) video.DislikeCount = Math.Max(0, video.DislikeCount + delta);
                    }
                    break;

                case "comment":
                    analytics.CommentsCount = Math.Max(0, analytics.CommentsCount + delta);
                    break;

                case "share":
                    analytics.SharesCount = Math.Max(0, analytics.SharesCount + delta);
                    break;
            }

            analytics.LastUpdated = DateTime.UtcNow;
            await _context.SaveChangesAsync(cancellationToken);

            _logger.LogDebug("Updated {EngagementType} for {MediaType} {MediaId} by {Delta}", 
                engagementType, mediaType, mediaId, delta);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating engagement metrics for {MediaType} {MediaId}", mediaType, mediaId);
            throw;
        }
    }

    public async Task<MediaAnalytics> GetOrCreateAnalyticsAsync(Guid mediaId, MediaType mediaType, CancellationToken cancellationToken = default)
    {
        var analytics = await _context.MediaAnalytics
            .FirstOrDefaultAsync(ma => ma.MediaId == mediaId && ma.MediaType == mediaType, cancellationToken);

        if (analytics == null)
        {
            analytics = new MediaAnalytics
            {
                MediaId = mediaId,
                MediaType = mediaType,
                ViewsToday = 0,
                ViewsWeek = 0,
                ViewsMonth = 0,
                ViewsTotal = 0,
                LikesCount = 0,
                DislikesCount = 0,
                CommentsCount = 0,
                SharesCount = 0,
                AverageWatchTime = 0,
                CompletionRate = 0,
                LastUpdated = DateTime.UtcNow
            };

            _context.MediaAnalytics.Add(analytics);
            await _context.SaveChangesAsync(cancellationToken);

            _logger.LogDebug("Created new analytics record for {MediaType} {MediaId}", mediaType, mediaId);
        }

        return analytics;
    }

    public async Task<bool> ValidateAnalyticsIntegrityAsync(Guid mediaId, MediaType mediaType, CancellationToken cancellationToken = default)
    {
        try
        {
            var analytics = await _context.MediaAnalytics
                .FirstOrDefaultAsync(ma => ma.MediaId == mediaId && ma.MediaType == mediaType, cancellationToken);

            if (analytics == null)
            {
                _logger.LogWarning("No analytics record found for {MediaType} {MediaId}", mediaType, mediaId);
                return false;
            }

            // Validate view counts
            var actualViewCount = mediaType == MediaType.Video
                ? await _context.VideoViews.CountAsync(vv => vv.VideoId == mediaId, cancellationToken)
                : await _context.PodcastPlays.CountAsync(pp => pp.PodcastId == mediaId, cancellationToken);

            if (analytics.ViewsTotal != actualViewCount)
            {
                _logger.LogWarning("Analytics view count mismatch for {MediaType} {MediaId}: Expected={Expected}, Actual={Actual}", 
                    mediaType, mediaId, analytics.ViewsTotal, actualViewCount);
                
                // Auto-correct the discrepancy
                analytics.ViewsTotal = actualViewCount;
                analytics.LastUpdated = DateTime.UtcNow;
                await _context.SaveChangesAsync(cancellationToken);
                
                return false;
            }

            // Validate engagement counts
            var actualLikeCount = mediaType == MediaType.Video
                ? await _context.VideoLikes.CountAsync(vl => vl.VideoId == mediaId, cancellationToken)
                : await _context.PodcastLikes.CountAsync(pl => pl.PodcastId == mediaId, cancellationToken);

            if (analytics.LikesCount != actualLikeCount)
            {
                _logger.LogWarning("Analytics like count mismatch for {MediaType} {MediaId}: Expected={Expected}, Actual={Actual}", 
                    mediaType, mediaId, analytics.LikesCount, actualLikeCount);
                
                // Auto-correct the discrepancy
                analytics.LikesCount = actualLikeCount;
                analytics.LastUpdated = DateTime.UtcNow;
                await _context.SaveChangesAsync(cancellationToken);
                
                return false;
            }

            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error validating analytics integrity for {MediaType} {MediaId}", mediaType, mediaId);
            return false;
        }
    }
}