using Application.Common.Interfaces;
using Application.Common.Models;
using Application.Features.Media.Discovery.DTOs;
using Application.Features.Media.Discovery.Queries;
using Application.Features.Media.Videos.DTOs.Responses;
using Application.Features.Media.Podcasts.DTOs.Responses;
using AutoMapper;
using Domain.Enums.Media;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Media.Discovery.Handlers;

public class GetTrendingContentHandler : IRequestHandler<GetTrendingContentQuery, Result<TrendingContentDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetTrendingContentHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<Result<TrendingContentDto>> Handle(GetTrendingContentQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var result = new TrendingContentDto
            {
                TimeWindowDays = request.Days,
                Algorithm = request.Algorithm.ToString()
            };

            // Get trending videos if requested
            if (request.MediaType == null || request.MediaType == MediaType.Video)
            {
                result.TrendingVideos = await GetTrendingVideos(request, cancellationToken);
            }

            // Get trending podcasts if requested
            if (request.MediaType == null || request.MediaType == MediaType.Podcast)
            {
                result.TrendingPodcasts = await GetTrendingPodcasts(request, cancellationToken);
            }

            return Result<TrendingContentDto>.Success(result);
        }
        catch (Exception ex)
        {
            return Result<TrendingContentDto>.Failure(new[] { $"Error retrieving trending content: {ex.Message}" });
        }
    }

    private async Task<List<VideoListDto>> GetTrendingVideos(GetTrendingContentQuery request, CancellationToken cancellationToken)
    {
        var cutoffDate = DateTime.UtcNow.AddDays(-request.Days);

        var query = _context.Videos
            .Where(v => !v.IsDeleted && 
                       v.Status == MediaStatus.Published && 
                       v.IsPublic && 
                       v.CreatedAt >= cutoffDate)
            .AsQueryable();

        // Apply category filter if specified
        if (!string.IsNullOrEmpty(request.Category))
        {
            query = query.Where(v => v.Tags != null && v.Tags.ToLower().Contains(request.Category.ToLower()));
        }

        List<VideoListDto> trendingVideos;

        switch (request.Algorithm)
        {
            case TrendingAlgorithm.ViewsOnly:
                trendingVideos = await query
                    .OrderByDescending(v => v.ViewCount)
                    .Take(request.VideoCount)
                    .Select(v => new VideoListDto
                    {
                        Id = v.Id,
                        Title = v.Title,
                        Thumbnail = v.Thumbnail,
                        Duration = v.Duration,
                        ViewCount = v.ViewCount,
                        LikeCount = v.LikeCount,
                        PublishedAt = v.PublishedAt,
                        CreatorId = v.CreatorId
                    })
                    .ToListAsync(cancellationToken);
                break;

            case TrendingAlgorithm.ViewsAndEngagement:
                // Weight views and likes (likes worth 2x views)
                var videosWithScore = await query
                    .Select(v => new
                    {
                        Video = v,
                        TrendingScore = v.ViewCount + (v.LikeCount * 2)
                    })
                    .OrderByDescending(x => x.TrendingScore)
                    .Take(request.VideoCount)
                    .ToListAsync(cancellationToken);

                trendingVideos = videosWithScore.Select(x => new VideoListDto
                {
                    Id = x.Video.Id,
                    Title = x.Video.Title,
                    Thumbnail = x.Video.Thumbnail,
                    Duration = x.Video.Duration,
                    ViewCount = x.Video.ViewCount,
                    LikeCount = x.Video.LikeCount,
                    PublishedAt = x.Video.PublishedAt,
                    CreatorId = x.Video.CreatorId
                }).ToList();
                break;

            case TrendingAlgorithm.EngagementRate:
                // Calculate engagement rate (likes / views)
                var videosWithEngagement = await query
                    .Where(v => v.ViewCount > 0)
                    .Select(v => new
                    {
                        Video = v,
                        EngagementRate = (double)v.LikeCount / v.ViewCount
                    })
                    .OrderByDescending(x => x.EngagementRate)
                    .Take(request.VideoCount)
                    .ToListAsync(cancellationToken);

                trendingVideos = videosWithEngagement.Select(x => new VideoListDto
                {
                    Id = x.Video.Id,
                    Title = x.Video.Title,
                    Thumbnail = x.Video.Thumbnail,
                    Duration = x.Video.Duration,
                    ViewCount = x.Video.ViewCount,
                    LikeCount = x.Video.LikeCount,
                    PublishedAt = x.Video.PublishedAt,
                    CreatorId = x.Video.CreatorId
                }).ToList();
                break;

            case TrendingAlgorithm.RecentPopularity:
                // Favor recent content with good engagement
                var recentCutoff = DateTime.UtcNow.AddDays(-Math.Min(request.Days, 3));
                var recentVideos = await query
                    .Where(v => v.CreatedAt >= recentCutoff)
                    .Select(v => new
                    {
                        Video = v,
                        RecentScore = v.ViewCount + (v.LikeCount * 3) + 
                                     (int)(DateTime.UtcNow - v.CreatedAt).TotalHours // Bonus for recency
                    })
                    .OrderByDescending(x => x.RecentScore)
                    .Take(request.VideoCount)
                    .ToListAsync(cancellationToken);

                trendingVideos = recentVideos.Select(x => new VideoListDto
                {
                    Id = x.Video.Id,
                    Title = x.Video.Title,
                    Thumbnail = x.Video.Thumbnail,
                    Duration = x.Video.Duration,
                    ViewCount = x.Video.ViewCount,
                    LikeCount = x.Video.LikeCount,
                    PublishedAt = x.Video.PublishedAt,
                    CreatorId = x.Video.CreatorId
                }).ToList();
                break;

            default:
                trendingVideos = new List<VideoListDto>();
                break;
        }

        return trendingVideos;
    }

    private async Task<List<PodcastListDto>> GetTrendingPodcasts(GetTrendingContentQuery request, CancellationToken cancellationToken)
    {
        var cutoffDate = DateTime.UtcNow.AddDays(-request.Days);

        var query = _context.Podcasts
            .Where(p => !p.IsDeleted && 
                       p.Status == MediaStatus.Published && 
                       p.IsPublic && 
                       p.CreatedAt >= cutoffDate)
            .AsQueryable();

        // Apply category filter if specified
        if (!string.IsNullOrEmpty(request.Category))
        {
            query = query.Where(p => p.Tags != null && p.Tags.ToLower().Contains(request.Category.ToLower()));
        }

        List<PodcastListDto> trendingPodcasts;

        switch (request.Algorithm)
        {
            case TrendingAlgorithm.ViewsOnly:
                trendingPodcasts = await query
                    .OrderByDescending(p => p.PlayCount)
                    .Take(request.PodcastCount)
                    .Select(p => new PodcastListDto
                    {
                        Id = p.Id,
                        Title = p.Title,
                        CoverImage = p.CoverImage,
                        Duration = p.Duration,
                        PlayCount = p.PlayCount,
                        LikeCount = p.LikeCount,
                        PublishedAt = p.PublishedAt,
                        EpisodeNumber = p.EpisodeNumber,
                        CreatorId = p.CreatorId
                    })
                    .ToListAsync(cancellationToken);
                break;

            case TrendingAlgorithm.ViewsAndEngagement:
                var podcastsWithScore = await query
                    .Select(p => new
                    {
                        Podcast = p,
                        TrendingScore = p.PlayCount + (p.LikeCount * 2) + (p.DownloadCount / 2)
                    })
                    .OrderByDescending(x => x.TrendingScore)
                    .Take(request.PodcastCount)
                    .ToListAsync(cancellationToken);

                trendingPodcasts = podcastsWithScore.Select(x => new PodcastListDto
                {
                    Id = x.Podcast.Id,
                    Title = x.Podcast.Title,
                    CoverImage = x.Podcast.CoverImage,
                    Duration = x.Podcast.Duration,
                    PlayCount = x.Podcast.PlayCount,
                    LikeCount = x.Podcast.LikeCount,
                    PublishedAt = x.Podcast.PublishedAt,
                    EpisodeNumber = x.Podcast.EpisodeNumber,
                    CreatorId = x.Podcast.CreatorId
                }).ToList();
                break;

            case TrendingAlgorithm.EngagementRate:
                var podcastsWithEngagement = await query
                    .Where(p => p.PlayCount > 0)
                    .Select(p => new
                    {
                        Podcast = p,
                        EngagementRate = (double)p.LikeCount / p.PlayCount
                    })
                    .OrderByDescending(x => x.EngagementRate)
                    .Take(request.PodcastCount)
                    .ToListAsync(cancellationToken);

                trendingPodcasts = podcastsWithEngagement.Select(x => new PodcastListDto
                {
                    Id = x.Podcast.Id,
                    Title = x.Podcast.Title,
                    CoverImage = x.Podcast.CoverImage,
                    Duration = x.Podcast.Duration,
                    PlayCount = x.Podcast.PlayCount,
                    LikeCount = x.Podcast.LikeCount,
                    PublishedAt = x.Podcast.PublishedAt,
                    EpisodeNumber = x.Podcast.EpisodeNumber,
                    CreatorId = x.Podcast.CreatorId
                }).ToList();
                break;

            case TrendingAlgorithm.RecentPopularity:
                var recentCutoff = DateTime.UtcNow.AddDays(-Math.Min(request.Days, 3));
                var recentPodcasts = await query
                    .Where(p => p.CreatedAt >= recentCutoff)
                    .Select(p => new
                    {
                        Podcast = p,
                        RecentScore = p.PlayCount + (p.LikeCount * 3) + (p.DownloadCount / 2) +
                                     (int)(DateTime.UtcNow - p.CreatedAt).TotalHours
                    })
                    .OrderByDescending(x => x.RecentScore)
                    .Take(request.PodcastCount)
                    .ToListAsync(cancellationToken);

                trendingPodcasts = recentPodcasts.Select(x => new PodcastListDto
                {
                    Id = x.Podcast.Id,
                    Title = x.Podcast.Title,
                    CoverImage = x.Podcast.CoverImage,
                    Duration = x.Podcast.Duration,
                    PlayCount = x.Podcast.PlayCount,
                    LikeCount = x.Podcast.LikeCount,
                    PublishedAt = x.Podcast.PublishedAt,
                    EpisodeNumber = x.Podcast.EpisodeNumber,
                    CreatorId = x.Podcast.CreatorId
                }).ToList();
                break;

            default:
                trendingPodcasts = new List<PodcastListDto>();
                break;
        }

        return trendingPodcasts;
    }
}