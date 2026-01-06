using Application.Common.Interfaces;
using Application.Common.Models;
using Application.Features.Media.Analytics.Commands;
using Domain.Entities.Media;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Media.Analytics.Handlers;

public class TrackVideoViewHandler : IRequestHandler<TrackVideoViewCommand, Result<bool>>
{
    private readonly IApplicationDbContext _context;

    public TrackVideoViewHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<bool>> Handle(TrackVideoViewCommand request, CancellationToken cancellationToken)
    {
        var video = await _context.Videos
            .FirstOrDefaultAsync(v => v.Id == request.VideoId && !v.IsDeleted, cancellationToken);

        if (video == null)
        {
            return Result<bool>.Failure("Video not found");
        }

        // Check if this is a duplicate view (same user/IP within last hour)
        var oneHourAgo = DateTime.UtcNow.AddHours(-1);
        var existingView = await _context.VideoViews
            .FirstOrDefaultAsync(v => v.VideoId == request.VideoId &&
                               ((request.UserId.HasValue && v.UserId == request.UserId.Value) ||
                                (!request.UserId.HasValue && v.IpAddress == request.IpAddress)) &&
                               v.CreatedAt > oneHourAgo, cancellationToken);

        if (existingView != null)
        {
            // Update existing view with new duration
            existingView.WatchDuration = request.WatchDuration;
            existingView.IsCompleted = request.IsCompleted;
            existingView.UpdatedAt = DateTime.UtcNow;
        }
        else
        {
            // Create new view record
            var videoView = new VideoView
            {
                VideoId = request.VideoId,
                UserId = request.UserId,
                IpAddress = request.IpAddress,
                WatchDuration = request.WatchDuration,
                IsCompleted = request.IsCompleted,
                UserAgent = request.UserAgent,
                Country = request.Country
            };

            _context.VideoViews.Add(videoView);

            // Update video view count
            video.ViewCount = await _context.VideoViews
                .CountAsync(v => v.VideoId == request.VideoId, cancellationToken) + 1;
        }

        await _context.SaveChangesAsync(cancellationToken);

        return Result<bool>.Success(true);
    }
}

public class TrackPodcastPlayHandler : IRequestHandler<TrackPodcastPlayCommand, Result<bool>>
{
    private readonly IApplicationDbContext _context;

    public TrackPodcastPlayHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<bool>> Handle(TrackPodcastPlayCommand request, CancellationToken cancellationToken)
    {
        var podcast = await _context.Podcasts
            .FirstOrDefaultAsync(p => p.Id == request.PodcastId && !p.IsDeleted, cancellationToken);

        if (podcast == null)
        {
            return Result<bool>.Failure("Podcast not found");
        }

        // Check if this is a duplicate play (same user/IP within last hour)
        var oneHourAgo = DateTime.UtcNow.AddHours(-1);
        var existingPlay = await _context.PodcastPlays
            .FirstOrDefaultAsync(p => p.PodcastId == request.PodcastId &&
                               ((request.UserId.HasValue && p.UserId == request.UserId.Value) ||
                                (!request.UserId.HasValue && p.IpAddress == request.IpAddress)) &&
                               p.CreatedAt > oneHourAgo, cancellationToken);

        if (existingPlay != null)
        {
            // Update existing play with new duration
            existingPlay.PlayDuration = request.PlayDuration;
            existingPlay.IsCompleted = request.IsCompleted;
            existingPlay.UpdatedAt = DateTime.UtcNow;
        }
        else
        {
            // Create new play record
            var podcastPlay = new PodcastPlay
            {
                PodcastId = request.PodcastId,
                UserId = request.UserId,
                IpAddress = request.IpAddress,
                PlayDuration = request.PlayDuration,
                IsCompleted = request.IsCompleted,
                UserAgent = request.UserAgent,
                Country = request.Country
            };

            _context.PodcastPlays.Add(podcastPlay);

            // Update podcast play count
            podcast.PlayCount = await _context.PodcastPlays
                .CountAsync(p => p.PodcastId == request.PodcastId, cancellationToken) + 1;
        }

        await _context.SaveChangesAsync(cancellationToken);

        return Result<bool>.Success(true);
    }
}
