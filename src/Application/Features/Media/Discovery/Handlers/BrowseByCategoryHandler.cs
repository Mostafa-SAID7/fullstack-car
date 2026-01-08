using Application.Common.Interfaces;
using Application.Common.Models;
using Application.Features.Media.Discovery.DTOs;
using Application.Features.Media.Discovery.Queries;
using Domain.Enums.Media;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Media.Discovery.Handlers;

public class BrowseByCategoryHandler : IRequestHandler<BrowseByCategoryQuery, Result<PaginatedList<MediaSearchResultDto>>>
{
    private readonly IApplicationDbContext _context;

    public BrowseByCategoryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<PaginatedList<MediaSearchResultDto>>> Handle(BrowseByCategoryQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var results = new List<MediaSearchResultDto>();

            // Browse Videos if requested
            if (request.MediaType == null || request.MediaType == MediaType.Video)
            {
                var videoResults = await BrowseVideosByCategory(request, cancellationToken);
                results.AddRange(videoResults);
            }

            // Browse Podcasts if requested
            if (request.MediaType == null || request.MediaType == MediaType.Podcast)
            {
                var podcastResults = await BrowsePodcastsByCategory(request, cancellationToken);
                results.AddRange(podcastResults);
            }

            // Apply sorting
            results = ApplySorting(results, request.SortBy, request.SortDescending);

            // Apply pagination
            var totalCount = results.Count;
            var pagedResults = results
                .Skip((request.PageNumber - 1) * request.PageSize)
                .Take(request.PageSize)
                .ToList();

            var paginatedList = new PaginatedList<MediaSearchResultDto>(
                pagedResults, totalCount, request.PageNumber, request.PageSize);

            return Result<PaginatedList<MediaSearchResultDto>>.Success(paginatedList);
        }
        catch (Exception ex)
        {
            return Result<PaginatedList<MediaSearchResultDto>>.Failure(new[] { $"Error browsing category '{request.Category}': {ex.Message}" });
        }
    }

    private async Task<List<MediaSearchResultDto>> BrowseVideosByCategory(BrowseByCategoryQuery request, CancellationToken cancellationToken)
    {
        var query = _context.Videos
            .Where(v => !v.IsDeleted && 
                       v.Status == MediaStatus.Published && 
                       v.IsPublic &&
                       v.Tags != null && 
                       v.Tags.ToLower().Contains(request.Category.ToLower()))
            .AsQueryable();

        // Apply date filters if specified
        if (request.FromDate.HasValue)
        {
            query = query.Where(v => v.PublishedAt >= request.FromDate.Value);
        }

        if (request.ToDate.HasValue)
        {
            query = query.Where(v => v.PublishedAt <= request.ToDate.Value);
        }

        var videos = await query.ToListAsync(cancellationToken);

        return videos.Select(v => new MediaSearchResultDto
        {
            Id = v.Id,
            Title = v.Title,
            Description = v.Description,
            Thumbnail = v.Thumbnail,
            MediaType = MediaType.Video,
            Duration = v.Duration,
            ViewCount = v.ViewCount,
            LikeCount = v.LikeCount,
            PublishedAt = v.PublishedAt,
            CreatorId = v.CreatorId,
            CreatorName = "", // Would need to join with Users table
            Tags = v.Tags,
            Category = request.Category,
            Quality = v.Quality,
            IsPublic = v.IsPublic,
            Status = v.Status
        }).ToList();
    }

    private async Task<List<MediaSearchResultDto>> BrowsePodcastsByCategory(BrowseByCategoryQuery request, CancellationToken cancellationToken)
    {
        var query = _context.Podcasts
            .Where(p => !p.IsDeleted && 
                       p.Status == MediaStatus.Published && 
                       p.IsPublic &&
                       p.Tags != null && 
                       p.Tags.ToLower().Contains(request.Category.ToLower()))
            .AsQueryable();

        // Apply date filters if specified
        if (request.FromDate.HasValue)
        {
            query = query.Where(p => p.PublishedAt >= request.FromDate.Value);
        }

        if (request.ToDate.HasValue)
        {
            query = query.Where(p => p.PublishedAt <= request.ToDate.Value);
        }

        var podcasts = await query.ToListAsync(cancellationToken);

        return podcasts.Select(p => new MediaSearchResultDto
        {
            Id = p.Id,
            Title = p.Title,
            Description = p.Description,
            CoverImage = p.CoverImage,
            MediaType = MediaType.Podcast,
            Duration = p.Duration,
            PlayCount = p.PlayCount,
            LikeCount = p.LikeCount,
            PublishedAt = p.PublishedAt,
            CreatorId = p.CreatorId,
            CreatorName = "", // Would need to join with Users table
            Tags = p.Tags,
            Category = request.Category,
            IsPublic = p.IsPublic,
            Status = p.Status
        }).ToList();
    }

    private List<MediaSearchResultDto> ApplySorting(List<MediaSearchResultDto> results, string sortBy, bool descending)
    {
        return sortBy.ToLower() switch
        {
            "popular" => descending 
                ? results.OrderByDescending(r => r.ViewCount + r.PlayCount + (r.LikeCount * 2)).ToList()
                : results.OrderBy(r => r.ViewCount + r.PlayCount + (r.LikeCount * 2)).ToList(),
            "recent" => descending 
                ? results.OrderByDescending(r => r.PublishedAt).ToList()
                : results.OrderBy(r => r.PublishedAt).ToList(),
            "trending" => descending 
                ? results.OrderByDescending(r => CalculateTrendingScore(r)).ToList()
                : results.OrderBy(r => CalculateTrendingScore(r)).ToList(),
            "alphabetical" => descending 
                ? results.OrderByDescending(r => r.Title).ToList()
                : results.OrderBy(r => r.Title).ToList(),
            _ => descending 
                ? results.OrderByDescending(r => r.ViewCount + r.PlayCount + (r.LikeCount * 2)).ToList()
                : results.OrderBy(r => r.ViewCount + r.PlayCount + (r.LikeCount * 2)).ToList()
        };
    }

    private double CalculateTrendingScore(MediaSearchResultDto media)
    {
        // Calculate trending score based on recent performance
        var daysSincePublished = media.PublishedAt.HasValue 
            ? (DateTime.UtcNow - media.PublishedAt.Value).TotalDays 
            : 365;

        // Newer content gets higher score
        var recencyMultiplier = Math.Max(0.1, 1.0 - (daysSincePublished / 30.0));
        
        var baseScore = (media.ViewCount + media.PlayCount) + (media.LikeCount * 2);
        
        return baseScore * recencyMultiplier;
    }
}