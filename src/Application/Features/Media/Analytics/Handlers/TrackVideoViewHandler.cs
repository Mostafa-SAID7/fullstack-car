using Application.Common.Interfaces;
using Application.Common.Models;
using Application.Features.Media.Analytics.Commands;
using Application.Features.Media.Analytics.DTOs;
using Domain.Entities.Media;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Media.Analytics.Handlers;

public class TrackVideoViewHandler : IRequestHandler<TrackVideoViewCommand, Result<VideoViewDto>>
{
    private readonly IApplicationDbContext _context;

    public TrackVideoViewHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<VideoViewDto>> Handle(TrackVideoViewCommand request, CancellationToken cancellationToken)
    {
        try
        {
            // Verify video exists
            var video = await _context.Videos
                .FirstOrDefaultAsync(v => v.Id == request.VideoId && !v.IsDeleted, cancellationToken);

            if (video == null)
            {
                return Result<VideoViewDto>.Failure(new[] { "Video not found" });
            }

            // Check for duplicate views (same user/IP within time window)
            var isDuplicate = false;
            if (request.IsUnique)
            {
                var timeWindow = DateTime.UtcNow.AddMinutes(-30); // 30-minute window
                var existingView = await _context.VideoViews
                    .AnyAsync(vv => vv.VideoId == request.VideoId &&
                                   vv.CreatedAt >= timeWindow &&
                                   ((request.UserId.HasValue && vv.UserId == request.UserId) ||
                                    (!string.IsNullOrEmpty(request.IpAddress) && vv.IpAddress == request.IpAddress)),
                             cancellationToken);

                isDuplicate = existingView;
            }

            // Create video view record
            var videoView = new VideoView
            {
                VideoId = request.VideoId,
                UserId = request.UserId,
                IpAddress = request.IpAddress,
                UserAgent = request.UserAgent,
                Referrer = request.Referrer,
                Country = request.Country,
                City = request.City,
                Device = request.Device,
                Browser = request.Browser,
                OperatingSystem = request.OperatingSystem,
                WatchTimeSeconds = request.WatchTimeSeconds ?? 0,
                CompletionPercentage = request.CompletionPercentage ?? 0,
                Quality = request.Quality,
                IsUnique = !isDuplicate,
                CreatedAt = DateTime.UtcNow
            };

            _context.VideoViews.Add(videoView);

            // Update video view count if unique
            if (!isDuplicate)
            {
                video.ViewCount++;
            }

            // Update analytics
            await UpdateVideoAnalytics(request.VideoId, !isDuplicate, request.WatchTimeSeconds ?? 0, cancellationToken);

            await _context.SaveChangesAsync(cancellationToken);

            var result = new VideoViewDto
            {
                Id = videoView.Id,
                VideoId = videoView.VideoId,
                UserId = videoView.UserId,
                IpAddress = videoView.IpAddress,
                Country = videoView.Country,
                City = videoView.City,
                Device = videoView.Device,
                Browser = videoView.Browser,
                OperatingSystem = videoView.OperatingSystem,
                WatchTimeSeconds = videoView.WatchTimeSeconds,
                CompletionPercentage = videoView.CompletionPercentage,
                Quality = videoView.Quality,
                IsUnique = videoView.IsUnique,
                ViewedAt = videoView.CreatedAt
            };

            return Result<VideoViewDto>.Success(result);
        }
        catch (Exception ex)
        {
            return Result<VideoViewDto>.Failure(new[] { $"Error tracking video view: {ex.Message}" });
        }
    }

    private async Task UpdateVideoAnalytics(Guid videoId, bool isUnique, int watchTimeSeconds, CancellationToken cancellationToken)
    {
        var analytics = await _context.MediaAnalytics
            .FirstOrDefaultAsync(a => a.MediaId == videoId, cancellationToken);

        if (analytics == null)
        {
            analytics = new MediaAnalytics
            {
                MediaId = videoId,
                MediaType = Domain.Enums.Media.MediaType.Video,
                CreatedAt = DateTime.UtcNow
            };
            _context.MediaAnalytics.Add(analytics);
        }

        if (isUnique)
        {
            analytics.ViewsTotal++;
            
            var today = DateTime.UtcNow.Date;
            if (analytics.LastUpdated.Date != today)
            {
                // Reset daily counters
                analytics.ViewsToday = 1;
            }
            else
            {
                analytics.ViewsToday++;
            }

            // Update weekly and monthly counters
            var weekStart = DateTime.UtcNow.AddDays(-7);
            var monthStart = DateTime.UtcNow.AddDays(-30);
            
            analytics.ViewsWeek = await _context.VideoViews
                .CountAsync(vv => vv.VideoId == videoId && vv.CreatedAt >= weekStart && vv.IsUnique, cancellationToken);
            
            analytics.ViewsMonth = await _context.VideoViews
                .CountAsync(vv => vv.VideoId == videoId && vv.CreatedAt >= monthStart && vv.IsUnique, cancellationToken);
        }

        // Update average watch time
        if (watchTimeSeconds > 0)
        {
            var totalWatchTime = await _context.VideoViews
                .Where(vv => vv.VideoId == videoId)
                .SumAsync(vv => vv.WatchTimeSeconds, cancellationToken);
            
            var totalViews = await _context.VideoViews
                .CountAsync(vv => vv.VideoId == videoId, cancellationToken);

            analytics.AverageWatchTime = totalViews > 0 ? (decimal)(totalWatchTime / totalViews) : 0;
        }

        analytics.LastUpdated = DateTime.UtcNow;
    }
}