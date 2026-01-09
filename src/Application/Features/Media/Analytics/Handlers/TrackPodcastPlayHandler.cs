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

            // Create podcast play record using the actual entity properties
            var podcastPlay = new PodcastPlay
            {
                PodcastId = request.PodcastId,
                UserId = request.UserId,
                IpAddress = request.IpAddress,
                UserAgent = request.UserAgent,
                Country = request.Country,
                PlayDuration = TimeSpan.FromSeconds(request.ListenTimeSeconds ?? 0),
                IsCompleted = (request.CompletionPercentage ?? 0) >= 90,
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

            await _context.SaveChangesAsync(cancellationToken);

            var result = new PodcastPlayDto
            {
                Id = podcastPlay.Id,
                PodcastId = podcastPlay.PodcastId,
                UserId = podcastPlay.UserId,
                IpAddress = podcastPlay.IpAddress,
                Country = podcastPlay.Country,
                Device = request.Device ?? "Unknown",
                Browser = request.Browser ?? "Unknown",
                OperatingSystem = request.OperatingSystem ?? "Unknown",
                ListenTimeSeconds = request.ListenTimeSeconds ?? 0,
                CompletionPercentage = request.CompletionPercentage ?? 0,
                PlaybackSpeed = request.PlaybackSpeed ?? 1.0,
                IsDownload = request.IsDownload,
                IsUnique = !isDuplicate,
                PlayedAt = podcastPlay.CreatedAt
            };

            return Result<PodcastPlayDto>.Success(result);
        }
        catch (Exception ex)
        {
            return Result<PodcastPlayDto>.Failure(new[] { $"Error tracking podcast play: {ex.Message}" });
        }
    }
}