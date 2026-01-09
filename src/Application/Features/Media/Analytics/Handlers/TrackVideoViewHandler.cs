using Application.Common.Interfaces;
using Application.Common.Models;
using Application.Features.Media.Analytics.Commands;
using Application.Features.Media.Analytics.DTOs;
using Application.Features.Media.Analytics.Services;
using Domain.Entities.Media;
using Domain.Enums.Media;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Application.Features.Media.Analytics.Handlers;

public class TrackVideoViewHandler : IRequestHandler<TrackVideoViewCommand, Result<VideoViewDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMediaAnalyticsService _analyticsService;
    private readonly ILogger<TrackVideoViewHandler> _logger;

    public TrackVideoViewHandler(IApplicationDbContext context, IMediaAnalyticsService analyticsService, ILogger<TrackVideoViewHandler> logger)
    {
        _context = context;
        _analyticsService = analyticsService;
        _logger = logger;
    }

    public async Task<Result<VideoViewDto>> Handle(TrackVideoViewCommand request, CancellationToken cancellationToken)
    {
        try
        {
            // Verify the video exists before tracking the view
            var video = await _context.Videos
                .FirstOrDefaultAsync(v => v.Id == request.VideoId && !v.IsDeleted, cancellationToken);

            if (video == null)
            {
                return Result<VideoViewDto>.Failure(new[] { "Video not found or has been deleted" });
            }

            // Check for duplicate views (same user/IP within time window)
            var isDuplicate = false;
            if (request.IsUnique)
            {
                var timeWindow = DateTime.UtcNow.AddMinutes(-30); // 30-minute window
                
                // Check for duplicates based on user ID or IP address
                var existingView = await _context.VideoViews
                    .AnyAsync(vv => vv.VideoId == request.VideoId &&
                                   vv.CreatedAt >= timeWindow &&
                                   ((request.UserId.HasValue && vv.UserId == request.UserId) ||
                                    (!string.IsNullOrEmpty(request.IpAddress) && vv.IpAddress == request.IpAddress)),
                             cancellationToken);

                isDuplicate = existingView;
                _logger.LogDebug("Duplicate check for VideoId {VideoId}, UserId {UserId}, IP {IpAddress}: isDuplicate={IsDuplicate}", 
                    request.VideoId, request.UserId, request.IpAddress, isDuplicate);
            }

            // Create video view record
            var videoView = new VideoView
            {
                VideoId = request.VideoId,
                UserId = request.UserId,
                IpAddress = request.IpAddress,
                UserAgent = request.UserAgent,
                Country = request.Country,
                WatchDuration = TimeSpan.FromSeconds(request.WatchTimeSeconds ?? 0),
                IsCompleted = (request.CompletionPercentage ?? 0) >= 90,
                CreatedAt = DateTime.UtcNow
            };

            _context.VideoViews.Add(videoView);
            
            // Save the video view record first
            await _context.SaveChangesAsync(cancellationToken);

            // Update video view count if unique
            if (!isDuplicate)
            {
                _logger.LogDebug("Calling IncrementViewCountAsync for VideoId {VideoId}", request.VideoId);
                // Use analytics service for accurate real-time updates
                await _analyticsService.IncrementViewCountAsync(request.VideoId, MediaType.Video, cancellationToken);
            }
            else
            {
                _logger.LogDebug("Calling UpdateAnalyticsAsync for duplicate view VideoId {VideoId}", request.VideoId);
                // Even for duplicates, update analytics for data accuracy
                await _analyticsService.UpdateAnalyticsAsync(request.VideoId, MediaType.Video, cancellationToken);
            }

            var result = new VideoViewDto
            {
                Id = videoView.Id,
                VideoId = videoView.VideoId,
                UserId = videoView.UserId,
                IpAddress = videoView.IpAddress,
                Country = videoView.Country,
                Device = request.Device ?? "Unknown",
                Browser = request.Browser ?? "Unknown",
                OperatingSystem = request.OperatingSystem ?? "Unknown",
                WatchTimeSeconds = request.WatchTimeSeconds ?? 0,
                CompletionPercentage = request.CompletionPercentage ?? 0,
                Quality = request.Quality ?? "Unknown",
                IsUnique = !isDuplicate,
                ViewedAt = videoView.CreatedAt
            };

            return Result<VideoViewDto>.Success(result);
        }
        catch (Exception ex)
        {
            return Result<VideoViewDto>.Failure(new[] { $"Error tracking video view: {ex.Message}" });
        }
    }
}