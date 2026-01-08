using Application.Common.Interfaces;
using Application.Common.Models;
using Application.Features.Media.Analytics.DTOs;
using Application.Features.Media.Analytics.Queries;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Media.Analytics.Handlers;

public class GetPodcastAnalyticsHandler : IRequestHandler<GetPodcastAnalyticsQuery, Result<PodcastAnalyticsDto>>
{
    private readonly IApplicationDbContext _context;

    public GetPodcastAnalyticsHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<PodcastAnalyticsDto>> Handle(GetPodcastAnalyticsQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var podcast = await _context.Podcasts
                .FirstOrDefaultAsync(p => p.Id == request.PodcastId && !p.IsDeleted, cancellationToken);

            if (podcast == null)
            {
                return Result<PodcastAnalyticsDto>.Failure(new[] { "Podcast not found" });
            }

            var analytics = new PodcastAnalyticsDto
            {
                PodcastId = podcast.Id,
                PodcastTitle = podcast.Title,
                TimeRange = request.TimeRange,
                Metrics = new PodcastMetricsDto
                {
                    TotalPlays = podcast.PlayCount,
                    TotalDownloads = podcast.DownloadCount,
                    TotalLikes = podcast.LikeCount,
                    EpisodeDuration = podcast.Duration,
                    EngagementRate = podcast.PlayCount > 0 ? (double)podcast.LikeCount / podcast.PlayCount * 100 : 0
                }
            };

            return Result<PodcastAnalyticsDto>.Success(analytics);
        }
        catch (Exception ex)
        {
            return Result<PodcastAnalyticsDto>.Failure(new[] { $"Error retrieving podcast analytics: {ex.Message}" });
        }
    }
}