using Application.Common.Interfaces;
using Application.Common.Models;
using Application.Features.Media.Analytics.Commands;
using Application.Features.Media.Analytics.DTOs;
using Application.Features.Media.Analytics.Services;
using Domain.Entities.Media;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Media.Analytics.Handlers;

public class TrackEngagementHandler : IRequestHandler<TrackEngagementCommand, Result<EngagementDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMediaAnalyticsService _analyticsService;

    public TrackEngagementHandler(IApplicationDbContext context, IMediaAnalyticsService analyticsService)
    {
        _context = context;
        _analyticsService = analyticsService;
    }

    public async Task<Result<EngagementDto>> Handle(TrackEngagementCommand request, CancellationToken cancellationToken)
    {
        try
        {
            // Verify media exists
            var mediaExists = request.MediaType == Domain.Enums.Media.MediaType.Video
                ? await _context.Videos.AnyAsync(v => v.Id == request.MediaId && !v.IsDeleted, cancellationToken)
                : await _context.Podcasts.AnyAsync(p => p.Id == request.MediaId && !p.IsDeleted, cancellationToken);

            if (!mediaExists)
            {
                return Result<EngagementDto>.Failure(new[] { "Media not found" });
            }

            // Handle different engagement types
            var result = request.EngagementType switch
            {
                EngagementType.Like => await HandleLike(request, cancellationToken),
                EngagementType.Dislike => await HandleDislike(request, cancellationToken),
                EngagementType.Comment => await HandleComment(request, cancellationToken),
                EngagementType.Share => await HandleShare(request, cancellationToken),
                EngagementType.Subscribe => await HandleSubscribe(request, cancellationToken),
                EngagementType.Bookmark => await HandleBookmark(request, cancellationToken),
                EngagementType.Report => await HandleReport(request, cancellationToken),
                _ => throw new ArgumentException($"Unsupported engagement type: {request.EngagementType}")
            };

            // Update analytics using the analytics service for accuracy
            await _analyticsService.UpdateEngagementMetricsAsync(
                request.MediaId, 
                request.MediaType, 
                request.EngagementType.ToString(), 
                1, 
                cancellationToken);

            await _context.SaveChangesAsync(cancellationToken);

            return Result<EngagementDto>.Success(result);
        }
        catch (Exception ex)
        {
            return Result<EngagementDto>.Failure(new[] { $"Error tracking engagement: {ex.Message}" });
        }
    }

    private async Task<EngagementDto> HandleLike(TrackEngagementCommand request, CancellationToken cancellationToken)
    {
        if (request.MediaType == Domain.Enums.Media.MediaType.Video)
        {
            // Check if already liked
            var existingLike = await _context.VideoLikes
                .FirstOrDefaultAsync(vl => vl.VideoId == request.MediaId && vl.UserId == request.UserId, cancellationToken);

            if (existingLike != null)
            {
                // Unlike
                _context.VideoLikes.Remove(existingLike);
                // The analytics service will handle updating counters
            }
            else
            {
                // Like
                var videoLike = new VideoLike
                {
                    VideoId = request.MediaId,
                    UserId = request.UserId,
                    CreatedAt = DateTime.UtcNow
                };
                _context.VideoLikes.Add(videoLike);

                // The analytics service will handle updating both the media entity and analytics record
                // Don't update the video.LikeCount here to avoid double counting

                // Remove dislike if exists
                var existingDislike = await _context.VideoLikes
                    .FirstOrDefaultAsync(vl => vl.VideoId == request.MediaId && vl.UserId == request.UserId && !vl.IsLike, cancellationToken);
                if (existingDislike != null)
                {
                    _context.VideoLikes.Remove(existingDislike);
                    // The analytics service will handle updating counters
                    // Update analytics for dislike removal
                    await _analyticsService.UpdateEngagementMetricsAsync(request.MediaId, request.MediaType, "dislike", -1, cancellationToken);
                }
            }
        }
        else
        {
            // Similar logic for podcasts
            var existingLike = await _context.PodcastLikes
                .FirstOrDefaultAsync(pl => pl.PodcastId == request.MediaId && pl.UserId == request.UserId, cancellationToken);

            if (existingLike != null)
            {
                _context.PodcastLikes.Remove(existingLike);
                // The analytics service will handle updating counters
            }
            else
            {
                var podcastLike = new PodcastLike
                {
                    PodcastId = request.MediaId,
                    UserId = request.UserId,
                    CreatedAt = DateTime.UtcNow
                };
                _context.PodcastLikes.Add(podcastLike);

                // The analytics service will handle updating counters
            }
        }

        return new EngagementDto
        {
            Id = Guid.NewGuid(),
            MediaId = request.MediaId,
            MediaType = request.MediaType,
            UserId = request.UserId,
            EngagementType = request.EngagementType,
            CreatedAt = DateTime.UtcNow
        };
    }

    private async Task<EngagementDto> HandleDislike(TrackEngagementCommand request, CancellationToken cancellationToken)
    {
        // Similar to like but for dislikes
        if (request.MediaType == Domain.Enums.Media.MediaType.Video)
        {
            var video = await _context.Videos.FindAsync(request.MediaId);
            if (video != null)
            {
                video.DislikeCount++;
            }
        }

        return new EngagementDto
        {
            Id = Guid.NewGuid(),
            MediaId = request.MediaId,
            MediaType = request.MediaType,
            UserId = request.UserId,
            EngagementType = request.EngagementType,
            CreatedAt = DateTime.UtcNow
        };
    }

    private async Task<EngagementDto> HandleComment(TrackEngagementCommand request, CancellationToken cancellationToken)
    {
        if (request.MediaType == Domain.Enums.Media.MediaType.Video)
        {
            var comment = new VideoComment
            {
                VideoId = request.MediaId,
                UserId = request.UserId,
                Content = request.Content ?? string.Empty,
                ParentCommentId = request.ParentCommentId,
                CreatedAt = DateTime.UtcNow
            };
            _context.VideoComments.Add(comment);
        }
        else
        {
            var comment = new PodcastComment
            {
                PodcastId = request.MediaId,
                UserId = request.UserId,
                Content = request.Content ?? string.Empty,
                ParentCommentId = request.ParentCommentId,
                CreatedAt = DateTime.UtcNow
            };
            _context.PodcastComments.Add(comment);
        }

        return new EngagementDto
        {
            Id = Guid.NewGuid(),
            MediaId = request.MediaId,
            MediaType = request.MediaType,
            UserId = request.UserId,
            EngagementType = request.EngagementType,
            Content = request.Content,
            ParentCommentId = request.ParentCommentId,
            CreatedAt = DateTime.UtcNow
        };
    }

    private async Task<EngagementDto> HandleShare(TrackEngagementCommand request, CancellationToken cancellationToken)
    {
        // Track share event - could be stored in a separate shares table
        return new EngagementDto
        {
            Id = Guid.NewGuid(),
            MediaId = request.MediaId,
            MediaType = request.MediaType,
            UserId = request.UserId,
            EngagementType = request.EngagementType,
            SharePlatform = request.SharePlatform,
            CreatedAt = DateTime.UtcNow
        };
    }

    private async Task<EngagementDto> HandleSubscribe(TrackEngagementCommand request, CancellationToken cancellationToken)
    {
        if (request.MediaType == Domain.Enums.Media.MediaType.Podcast)
        {
            var existingSubscription = await _context.PodcastSubscriptions
                .FirstOrDefaultAsync(ps => ps.PodcastId == request.MediaId && ps.UserId == request.UserId, cancellationToken);

            if (existingSubscription == null)
            {
                var subscription = new PodcastSubscription
                {
                    PodcastId = request.MediaId,
                    UserId = request.UserId,
                    CreatedAt = DateTime.UtcNow
                };
                _context.PodcastSubscriptions.Add(subscription);
            }
        }

        return new EngagementDto
        {
            Id = Guid.NewGuid(),
            MediaId = request.MediaId,
            MediaType = request.MediaType,
            UserId = request.UserId,
            EngagementType = request.EngagementType,
            CreatedAt = DateTime.UtcNow
        };
    }

    private async Task<EngagementDto> HandleBookmark(TrackEngagementCommand request, CancellationToken cancellationToken)
    {
        // Handle bookmark logic
        return new EngagementDto
        {
            Id = Guid.NewGuid(),
            MediaId = request.MediaId,
            MediaType = request.MediaType,
            UserId = request.UserId,
            EngagementType = request.EngagementType,
            CreatedAt = DateTime.UtcNow
        };
    }

    private async Task<EngagementDto> HandleReport(TrackEngagementCommand request, CancellationToken cancellationToken)
    {
        // Handle report logic
        return new EngagementDto
        {
            Id = Guid.NewGuid(),
            MediaId = request.MediaId,
            MediaType = request.MediaType,
            UserId = request.UserId,
            EngagementType = request.EngagementType,
            Content = request.Content,
            CreatedAt = DateTime.UtcNow
        };
    }

    private async Task UpdateEngagementAnalytics(Guid mediaId, EngagementType engagementType, CancellationToken cancellationToken)
    {
        // Analytics are tracked through the actual engagement entities (likes, comments, etc.)
        // No separate analytics table needed as counts are maintained on the media entities themselves
        await Task.CompletedTask;
    }
}