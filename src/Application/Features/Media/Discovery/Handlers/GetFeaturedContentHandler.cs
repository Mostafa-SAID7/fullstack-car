using Application.Common.Interfaces;
using Application.Common.Models;
using Application.Features.Media.Discovery.DTOs;
using Application.Features.Media.Discovery.Queries;
using Application.Features.Media.Videos.DTOs.Responses;
using Application.Features.Media.Podcasts.DTOs.Responses;
using Domain.Enums.Media;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Media.Discovery.Handlers;

public class GetFeaturedContentHandler : IRequestHandler<GetFeaturedContentQuery, Result<FeaturedContentDto>>
{
    private readonly IApplicationDbContext _context;

    public GetFeaturedContentHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<FeaturedContentDto>> Handle(GetFeaturedContentQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var result = new FeaturedContentDto();

            // Get hero content if requested
            if (request.IncludeHeroContent)
            {
                result.HeroContent = await GetHeroContent(request.Category, cancellationToken);
            }

            // Get featured videos if requested
            if (request.MediaType == null || request.MediaType == MediaType.Video)
            {
                result.FeaturedVideos = await GetFeaturedVideos(request, cancellationToken);
            }

            // Get featured podcasts if requested
            if (request.MediaType == null || request.MediaType == MediaType.Podcast)
            {
                result.FeaturedPodcasts = await GetFeaturedPodcasts(request, cancellationToken);
            }

            return Result<FeaturedContentDto>.Success(result);
        }
        catch (Exception ex)
        {
            return Result<FeaturedContentDto>.Failure(new[] { $"Error retrieving featured content: {ex.Message}" });
        }
    }

    private async Task<MediaSearchResultDto?> GetHeroContent(string? category, CancellationToken cancellationToken)
    {
        // For hero content, we want the most popular recent content
        var cutoffDate = DateTime.UtcNow.AddDays(-30);

        // Try to get a high-performing video first
        var heroVideo = await _context.Videos
            .Where(v => !v.IsDeleted && 
                       v.Status == MediaStatus.Published && 
                       v.IsPublic && 
                       v.CreatedAt >= cutoffDate &&
                       (string.IsNullOrEmpty(category) || (v.Tags != null && v.Tags.ToLower().Contains(category.ToLower()))))
            .OrderByDescending(v => v.ViewCount + (v.LikeCount * 3))
            .FirstOrDefaultAsync(cancellationToken);

        if (heroVideo != null)
        {
            return new MediaSearchResultDto
            {
                Id = heroVideo.Id,
                Title = heroVideo.Title,
                Description = heroVideo.Description,
                Thumbnail = heroVideo.Thumbnail,
                MediaType = MediaType.Video,
                Duration = heroVideo.Duration,
                ViewCount = heroVideo.ViewCount,
                LikeCount = heroVideo.LikeCount,
                PublishedAt = heroVideo.PublishedAt,
                CreatorId = heroVideo.CreatorId,
                Tags = heroVideo.Tags,
                Quality = heroVideo.Quality,
                IsPublic = heroVideo.IsPublic,
                Status = heroVideo.Status
            };
        }

        // Fallback to podcast if no suitable video found
        var heroPodcast = await _context.Podcasts
            .Where(p => !p.IsDeleted && 
                       p.Status == MediaStatus.Published && 
                       p.IsPublic && 
                       p.CreatedAt >= cutoffDate &&
                       (string.IsNullOrEmpty(category) || (p.Tags != null && p.Tags.ToLower().Contains(category.ToLower()))))
            .OrderByDescending(p => p.PlayCount + (p.LikeCount * 3))
            .FirstOrDefaultAsync(cancellationToken);

        if (heroPodcast != null)
        {
            return new MediaSearchResultDto
            {
                Id = heroPodcast.Id,
                Title = heroPodcast.Title,
                Description = heroPodcast.Description,
                CoverImage = heroPodcast.CoverImage,
                MediaType = MediaType.Podcast,
                Duration = heroPodcast.Duration,
                PlayCount = heroPodcast.PlayCount,
                LikeCount = heroPodcast.LikeCount,
                PublishedAt = heroPodcast.PublishedAt,
                CreatorId = heroPodcast.CreatorId,
                Tags = heroPodcast.Tags,
                IsPublic = heroPodcast.IsPublic,
                Status = heroPodcast.Status
            };
        }

        return null;
    }

    private async Task<List<VideoListDto>> GetFeaturedVideos(GetFeaturedContentQuery request, CancellationToken cancellationToken)
    {
        // Featured videos are high-quality, well-performing content
        var query = _context.Videos
            .Where(v => !v.IsDeleted && 
                       v.Status == MediaStatus.Published && 
                       v.IsPublic &&
                       v.ViewCount > 100 && // Minimum view threshold
                       v.LikeCount > 5)     // Minimum like threshold
            .AsQueryable();

        // Apply category filter if specified
        if (!string.IsNullOrEmpty(request.Category))
        {
            query = query.Where(v => v.Tags != null && v.Tags.ToLower().Contains(request.Category.ToLower()));
        }

        // Select featured videos based on a combination of metrics
        var featuredVideos = await query
            .Select(v => new
            {
                Video = v,
                FeaturedScore = (v.ViewCount * 0.4) + (v.LikeCount * 0.6) - (v.DislikeCount * 0.2)
            })
            .OrderByDescending(x => x.FeaturedScore)
            .Take(request.VideoCount)
            .Select(x => new VideoListDto
            {
                Id = x.Video.Id,
                Title = x.Video.Title,
                Thumbnail = x.Video.Thumbnail,
                Duration = x.Video.Duration,
                ViewCount = x.Video.ViewCount,
                LikeCount = x.Video.LikeCount,
                PublishedAt = x.Video.PublishedAt,
                CreatorId = x.Video.CreatorId
            })
            .ToListAsync(cancellationToken);

        return featuredVideos;
    }

    private async Task<List<PodcastListDto>> GetFeaturedPodcasts(GetFeaturedContentQuery request, CancellationToken cancellationToken)
    {
        // Featured podcasts are high-quality, well-performing content
        var query = _context.Podcasts
            .Where(p => !p.IsDeleted && 
                       p.Status == MediaStatus.Published && 
                       p.IsPublic &&
                       p.PlayCount > 50 && // Minimum play threshold
                       p.LikeCount > 3)    // Minimum like threshold
            .AsQueryable();

        // Apply category filter if specified
        if (!string.IsNullOrEmpty(request.Category))
        {
            query = query.Where(p => p.Tags != null && p.Tags.ToLower().Contains(request.Category.ToLower()));
        }

        // Select featured podcasts based on a combination of metrics
        var featuredPodcasts = await query
            .Select(p => new
            {
                Podcast = p,
                FeaturedScore = (p.PlayCount * 0.4) + (p.LikeCount * 0.4) + (p.DownloadCount * 0.2)
            })
            .OrderByDescending(x => x.FeaturedScore)
            .Take(request.PodcastCount)
            .Select(x => new PodcastListDto
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
            })
            .ToListAsync(cancellationToken);

        return featuredPodcasts;
    }
}