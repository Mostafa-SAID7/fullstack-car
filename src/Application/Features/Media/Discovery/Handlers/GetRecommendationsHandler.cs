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

public class GetRecommendationsHandler : IRequestHandler<GetRecommendationsQuery, Result<RecommendationsDto>>
{
    private readonly IApplicationDbContext _context;

    public GetRecommendationsHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<RecommendationsDto>> Handle(GetRecommendationsQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var result = new RecommendationsDto
            {
                IsPersonalized = request.UserId.HasValue
            };

            if (request.UserId.HasValue)
            {
                // Personalized recommendations
                await GeneratePersonalizedRecommendations(result, request, cancellationToken);
            }
            else
            {
                // Generic recommendations for anonymous users
                await GenerateGenericRecommendations(result, request, cancellationToken);
            }

            return Result<RecommendationsDto>.Success(result);
        }
        catch (Exception ex)
        {
            return Result<RecommendationsDto>.Failure(new[] { $"Error generating recommendations: {ex.Message}" });
        }
    }

    private async Task GeneratePersonalizedRecommendations(RecommendationsDto result, GetRecommendationsQuery request, CancellationToken cancellationToken)
    {
        var userId = request.UserId!.Value;

        // Get user's watch history if enabled
        if (request.IncludeWatchHistory)
        {
            result.BasedOnWatchHistory = await GetRecommendationsBasedOnWatchHistory(userId, request.VideoCount / 2, cancellationToken);
        }

        // Get recommendations based on liked content if enabled
        if (request.IncludeLikedContent)
        {
            result.BasedOnLikes = await GetRecommendationsBasedOnLikes(userId, request.VideoCount / 2, cancellationToken);
        }

        // Get content from followed creators if enabled
        if (request.IncludeFollowedCreators)
        {
            result.FromFollowedCreators = await GetRecommendationsFromFollowedCreators(userId, Math.Min(request.VideoCount, request.PodcastCount), cancellationToken);
        }

        // Fill main recommendation lists
        if (request.MediaType == null || request.MediaType == MediaType.Video)
        {
            result.RecommendedVideos = await GetPersonalizedVideoRecommendations(userId, request.VideoCount, cancellationToken);
        }

        if (request.MediaType == null || request.MediaType == MediaType.Podcast)
        {
            result.RecommendedPodcasts = await GetPersonalizedPodcastRecommendations(userId, request.PodcastCount, cancellationToken);
        }
    }

    private async Task GenerateGenericRecommendations(RecommendationsDto result, GetRecommendationsQuery request, CancellationToken cancellationToken)
    {
        // For anonymous users, provide popular and trending content
        if (request.MediaType == null || request.MediaType == MediaType.Video)
        {
            result.RecommendedVideos = await GetPopularVideos(request.VideoCount, cancellationToken);
        }

        if (request.MediaType == null || request.MediaType == MediaType.Podcast)
        {
            result.RecommendedPodcasts = await GetPopularPodcasts(request.PodcastCount, cancellationToken);
        }
    }

    private async Task<List<VideoListDto>> GetRecommendationsBasedOnWatchHistory(Guid userId, int count, CancellationToken cancellationToken)
    {
        // Get user's recently watched videos
        var watchedVideoIds = await _context.VideoViews
            .Where(vv => vv.UserId == userId)
            .OrderByDescending(vv => vv.CreatedAt)
            .Take(20) // Look at last 20 watched videos
            .Select(vv => vv.VideoId)
            .ToListAsync(cancellationToken);

        if (!watchedVideoIds.Any())
            return new List<VideoListDto>();

        // Get tags from watched videos
        var watchedVideoTags = await _context.Videos
            .Where(v => watchedVideoIds.Contains(v.Id) && !string.IsNullOrEmpty(v.Tags))
            .Select(v => v.Tags!)
            .ToListAsync(cancellationToken);

        var allTags = watchedVideoTags
            .SelectMany(tags => ParseTags(tags))
            .GroupBy(tag => tag)
            .OrderByDescending(g => g.Count())
            .Take(5)
            .Select(g => g.Key)
            .ToList();

        if (!allTags.Any())
            return new List<VideoListDto>();

        // Find similar videos based on tags
        var recommendations = await _context.Videos
            .Where(v => !v.IsDeleted && 
                       v.Status == MediaStatus.Published && 
                       v.IsPublic &&
                       v.CreatorId != userId && // Don't recommend user's own content
                       !watchedVideoIds.Contains(v.Id) && // Don't recommend already watched
                       v.Tags != null &&
                       allTags.Any(tag => v.Tags.ToLower().Contains(tag)))
            .OrderByDescending(v => v.ViewCount + (v.LikeCount * 2))
            .Take(count)
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

        return recommendations;
    }

    private async Task<List<VideoListDto>> GetRecommendationsBasedOnLikes(Guid userId, int count, CancellationToken cancellationToken)
    {
        // Get user's liked videos
        var likedVideoIds = await _context.VideoLikes
            .Where(vl => vl.UserId == userId)
            .Select(vl => vl.VideoId)
            .ToListAsync(cancellationToken);

        if (!likedVideoIds.Any())
            return new List<VideoListDto>();

        // Get tags from liked videos
        var likedVideoTags = await _context.Videos
            .Where(v => likedVideoIds.Contains(v.Id) && !string.IsNullOrEmpty(v.Tags))
            .Select(v => v.Tags!)
            .ToListAsync(cancellationToken);

        var allTags = likedVideoTags
            .SelectMany(tags => ParseTags(tags))
            .GroupBy(tag => tag)
            .OrderByDescending(g => g.Count())
            .Take(5)
            .Select(g => g.Key)
            .ToList();

        if (!allTags.Any())
            return new List<VideoListDto>();

        // Find similar videos based on tags
        var recommendations = await _context.Videos
            .Where(v => !v.IsDeleted && 
                       v.Status == MediaStatus.Published && 
                       v.IsPublic &&
                       v.CreatorId != userId &&
                       !likedVideoIds.Contains(v.Id) &&
                       v.Tags != null &&
                       allTags.Any(tag => v.Tags.ToLower().Contains(tag)))
            .OrderByDescending(v => v.LikeCount)
            .Take(count)
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

        return recommendations;
    }

    private async Task<List<MediaSearchResultDto>> GetRecommendationsFromFollowedCreators(Guid userId, int count, CancellationToken cancellationToken)
    {
        // This would require a UserFollows table to track followed creators
        // For now, return empty list as placeholder
        await Task.CompletedTask;
        return new List<MediaSearchResultDto>();
    }

    private async Task<List<VideoListDto>> GetPersonalizedVideoRecommendations(Guid userId, int count, CancellationToken cancellationToken)
    {
        // Combine different recommendation strategies
        var recommendations = new List<VideoListDto>();

        // Add some from watch history
        var historyRecs = await GetRecommendationsBasedOnWatchHistory(userId, count / 3, cancellationToken);
        recommendations.AddRange(historyRecs);

        // Add some from likes
        var likeRecs = await GetRecommendationsBasedOnLikes(userId, count / 3, cancellationToken);
        recommendations.AddRange(likeRecs);

        // Fill remaining with popular content
        var remaining = count - recommendations.Count;
        if (remaining > 0)
        {
            var popularRecs = await GetPopularVideos(remaining, cancellationToken);
            recommendations.AddRange(popularRecs.Where(p => !recommendations.Any(r => r.Id == p.Id)));
        }

        return recommendations.Take(count).ToList();
    }

    private async Task<List<PodcastListDto>> GetPersonalizedPodcastRecommendations(Guid userId, int count, CancellationToken cancellationToken)
    {
        // Similar logic for podcasts - for now, return popular podcasts
        return await GetPopularPodcasts(count, cancellationToken);
    }

    private async Task<List<VideoListDto>> GetPopularVideos(int count, CancellationToken cancellationToken)
    {
        return await _context.Videos
            .Where(v => !v.IsDeleted && 
                       v.Status == MediaStatus.Published && 
                       v.IsPublic)
            .OrderByDescending(v => v.ViewCount + (v.LikeCount * 2))
            .Take(count)
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
    }

    private async Task<List<PodcastListDto>> GetPopularPodcasts(int count, CancellationToken cancellationToken)
    {
        return await _context.Podcasts
            .Where(p => !p.IsDeleted && 
                       p.Status == MediaStatus.Published && 
                       p.IsPublic)
            .OrderByDescending(p => p.PlayCount + (p.LikeCount * 2))
            .Take(count)
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
    }

    private List<string> ParseTags(string tagString)
    {
        if (string.IsNullOrEmpty(tagString))
            return new List<string>();

        return tagString
            .Split(new[] { ',', ';', '|' }, StringSplitOptions.RemoveEmptyEntries)
            .Select(tag => tag.Trim().ToLower())
            .Where(tag => !string.IsNullOrEmpty(tag))
            .Distinct()
            .ToList();
    }
}