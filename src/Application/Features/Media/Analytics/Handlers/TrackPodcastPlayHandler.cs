using Application.Common.Interfaces;
using Application.Common.Models;
using Application.Features.Media.Analytics.Commands;
using Application.Features.Media.Analytics.DTOs;
using Domain.Entities.Media;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Media.Analytics.Handlers;

public class TrackPodcastPlayHandler : IRequestHandler<TrackPodcastPlayCommand, Result<PodcastPlayDto>>
{
    private readonly IApplicationDbContext _context;

    public TrackPodcastPlayHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<PodcastPlayDto>> Handle(TrackPodcastPlayCommand request, CancellationToken cancellationToken)
    {
        try
        {
            // Verify podcast exists
            var podcast = await _context.Podcasts
                .FirstOrDefaultAsync(p => p.Id == request.PodcastId && !p.IsDeleted, cancellationToken);

            if (podcast == null)
            {
                return Result<PodcastPlayDto>.Failure(new[] { "Podcast not found" });
            }

            // Check for duplicate plays (same user/IP within time window)
            var isDuplicate = false;
            if (request.IsUnique)
            {
                var timeWindow = DateTime.UtcNow.AddMinutes(-30); // 30-minute window
                var existingPlay = await _context.PodcastPlays
                    .AnyAsync(pp => pp.PodcastId == request.PodcastId &&
                                   pp.CreatedAt >= timeWindow &&
                                   ((request.UserId.HasValue && pp.UserId == request.UserId) ||
                                    (!string.IsNullOrEmpty(request.IpAddress) && pp.IpAddress == request.IpAddress)),
                             cancellationToken);

                isDuplicate = existingPlay;
            }

            // Create podcast play record
            var podcastPlay = new PodcastPlay
            {
                PodcastId = request.PodcastId,
                UserId = request.UserId,
                IpAddress = request.IpAddress,
                UserAgent = request.UserAgent,
                Referrer = request.Referrer,
                Country = request.Country,
                City = request.City,
                Device = request.Device,
                Browser = request.Browser,
                OperatingSystem = request.OperatingSystem,
                ListenTimeSeconds = request.ListenTimeSeconds ?? 0,
                CompletionPercentage = request.CompletionPercentage ?? 0,
                PlaybackSpeed = request.PlaybackSpeed ?? 1.0,
                IsDownload = request.IsDownload,
                IsUnique = !isDuplicate,
                CreatedAt = DateTime.UtcNow
            };

            _context.PodcastPlays.Add(podcastPlay);

            // Update podcast play count if unique
            if (!isDuplicate)
            {
                podcast.PlayCount++;
                
                if (request.IsDownload)
                {
                    podcast.DownloadCount++;
                }
            }

            // Update analytics
            await UpdatePodcastAnalytics(request.PodcastId, !isDuplicate, request.ListenTimeSeconds ?? 0, request.IsDownload, cancellationToken);

            await _context.SaveChangesAsync(cancellationToken);

            var result = new PodcastPlayDto
            {
                Id = podcastPlay.Id,
                PodcastId = podcastPlay.PodcastId,
                UserId = podcastPlay.UserId,
                IpAddress = podcastPlay.IpAddress,
                Country = podcastPlay.Country,
                City = podcastPlay.City,
                Device = podcastPlay.Device,
                Browser = podcastPlay.Browser,
                OperatingSystem = podcastPlay.OperatingSystem,
                ListenTimeSeconds = podcastPlay.ListenTimeSeconds,
                CompletionPercentage = podcastPlay.CompletionPercentage,
                PlaybackSpeed = podcastPlay.PlaybackSpeed,
                IsDownload = podcastPlay.IsDownload,
                IsUnique = podcastPlay.IsUnique,
                PlayedAt = podcastPlay.CreatedAt
            };

            return Result<PodcastPlayDto>.Success(result);
        }
        catch (Exception ex)
        {
            return Result<PodcastPlayDto>.Failure(new[] { $"Error tracking podcast play: {ex.Message}" });
        }
    }

    private async Task UpdatePodcastAnalytics(Guid podcastId, bool isUnique, int listenTimeSeconds, bool isDownload, CancellationToken cancellationToken)
    {
        var analytics = await _context.MediaAnalytics
            .FirstOrDefaultAsync(a => a.MediaId == podcastId, cancellationToken);

        if (analytics == null)
        {
            analytics = new MediaAnalytics
            {
                MediaId = podcastId,
                MediaType = Domain.Enums.Media.MediaType.Podcast,
                CreatedAt = DateTime.UtcNow
            };
            _context.MediaAnalytics.Add(analytics);
        }

        if (isUnique)
        {
            analytics.ViewsTotal++; // Using ViewsTotal for plays
            
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
            
            analytics.ViewsWeek = await _context.PodcastPlays
                .CountAsync(pp => pp.PodcastId == podcastId && pp.CreatedAt >= weekStart && pp.IsUnique, cancellationToken);
            
            analytics.ViewsMonth = await _context.PodcastPlays
                .CountAsync(pp => pp.PodcastId == podcastId && pp.CreatedAt >= monthStart && pp.IsUnique, cancellationToken);
        }

        // Update average listen time
        if (listenTimeSeconds > 0)
        {
            var totalListenTime = await _context.PodcastPlays
                .Where(pp => pp.PodcastId == podcastId)
                .SumAsync(pp => pp.ListenTimeSeconds, cancellationToken);
            
            var totalPlays = await _context.PodcastPlays
                .CountAsync(pp => pp.PodcastId == podcastId, cancellationToken);

            analytics.AverageWatchTime = totalPlays > 0 ? (decimal)(totalListenTime / totalPlays) : 0;
        }

        analytics.LastUpdated = DateTime.UtcNow;
    }
}