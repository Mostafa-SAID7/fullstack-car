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

            // Create video view record using the actual entity properties
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

            // Update video view count if unique
            if (!isDuplicate)
            {
                video.ViewCount++;
            }

            await _context.SaveChangesAsync(cancellationToken);

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