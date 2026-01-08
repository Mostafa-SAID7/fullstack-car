using Application.Common.Interfaces;
using Application.Common.Models;
using Application.Features.Media.Discovery.DTOs;
using Application.Features.Media.Discovery.Queries;
using AutoMapper;
using Domain.Enums.Media;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Media.Discovery.Handlers;

public class SearchMediaHandler : IRequestHandler<SearchMediaQuery, Result<PaginatedList<MediaSearchResultDto>>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public SearchMediaHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<Result<PaginatedList<MediaSearchResultDto>>> Handle(SearchMediaQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var results = new List<MediaSearchResultDto>();

            // Search Videos if requested
            if (request.MediaType == null || request.MediaType == MediaType.Video)
            {
                var videoResults = await SearchVideos(request, cancellationToken);
                results.AddRange(videoResults);
            }

            // Search Podcasts if requested
            if (request.MediaType == null || request.MediaType == MediaType.Podcast)
            {
                var podcastResults = await SearchPodcasts(request, cancellationToken);
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
            return Result<PaginatedList<MediaSearchResultDto>>.Failure(new[] { $"Error searching media: {ex.Message}" });
        }
    }

    private async Task<List<MediaSearchResultDto>> SearchVideos(SearchMediaQuery request, CancellationToken cancellationToken)
    {
        var query = _context.Videos
            .Where(v => !v.IsDeleted && v.Status == MediaStatus.Published)
            .AsQueryable();

        if (request.IsPublic.HasValue)
        {
            query = query.Where(v => v.IsPublic == request.IsPublic.Value);
        }

        // Apply search term
        if (!string.IsNullOrEmpty(request.SearchTerm))
        {
            var searchTerm = request.SearchTerm.ToLower();
            query = query.Where(v => 
                v.Title.ToLower().Contains(searchTerm) ||
                v.Description.ToLower().Contains(searchTerm) ||
                (v.Tags != null && v.Tags.ToLower().Contains(searchTerm)));
        }

        // Apply filters
        if (!string.IsNullOrEmpty(request.Category))
        {
            query = query.Where(v => v.Tags != null && v.Tags.ToLower().Contains(request.Category.ToLower()));
        }

        if (!string.IsNullOrEmpty(request.Tags))
        {
            var tags = request.Tags.Split(',', StringSplitOptions.RemoveEmptyEntries);
            foreach (var tag in tags)
            {
                var trimmedTag = tag.Trim().ToLower();
                query = query.Where(v => v.Tags != null && v.Tags.ToLower().Contains(trimmedTag));
            }
        }

        if (request.Quality.HasValue)
        {
            query = query.Where(v => v.Quality == request.Quality.Value);
        }

        if (request.FromDate.HasValue)
        {
            query = query.Where(v => v.PublishedAt >= request.FromDate.Value);
        }

        if (request.ToDate.HasValue)
        {
            query = query.Where(v => v.PublishedAt <= request.ToDate.Value);
        }

        if (request.MinDuration.HasValue)
        {
            query = query.Where(v => v.Duration.TotalSeconds >= request.MinDuration.Value);
        }

        if (request.MaxDuration.HasValue)
        {
            query = query.Where(v => v.Duration.TotalSeconds <= request.MaxDuration.Value);
        }

        if (request.MinViews.HasValue)
        {
            query = query.Where(v => v.ViewCount >= request.MinViews.Value);
        }

        if (request.MinLikes.HasValue)
        {
            query = query.Where(v => v.LikeCount >= request.MinLikes.Value);
        }

        if (request.CreatorId.HasValue)
        {
            query = query.Where(v => v.CreatorId == request.CreatorId.Value);
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
            Quality = v.Quality,
            RelevanceScore = CalculateRelevanceScore(v.Title, v.Description, v.Tags, request.SearchTerm),
            IsPublic = v.IsPublic,
            Status = v.Status
        }).ToList();
    }

    private async Task<List<MediaSearchResultDto>> SearchPodcasts(SearchMediaQuery request, CancellationToken cancellationToken)
    {
        var query = _context.Podcasts
            .Where(p => !p.IsDeleted && p.Status == MediaStatus.Published)
            .AsQueryable();

        if (request.IsPublic.HasValue)
        {
            query = query.Where(p => p.IsPublic == request.IsPublic.Value);
        }

        // Apply search term
        if (!string.IsNullOrEmpty(request.SearchTerm))
        {
            var searchTerm = request.SearchTerm.ToLower();
            query = query.Where(p => 
                p.Title.ToLower().Contains(searchTerm) ||
                p.Description.ToLower().Contains(searchTerm) ||
                (p.Tags != null && p.Tags.ToLower().Contains(searchTerm)) ||
                (p.Transcript != null && p.Transcript.ToLower().Contains(searchTerm)));
        }

        // Apply filters
        if (!string.IsNullOrEmpty(request.Category))
        {
            query = query.Where(p => p.Tags != null && p.Tags.ToLower().Contains(request.Category.ToLower()));
        }

        if (!string.IsNullOrEmpty(request.Tags))
        {
            var tags = request.Tags.Split(',', StringSplitOptions.RemoveEmptyEntries);
            foreach (var tag in tags)
            {
                var trimmedTag = tag.Trim().ToLower();
                query = query.Where(p => p.Tags != null && p.Tags.ToLower().Contains(trimmedTag));
            }
        }

        if (request.FromDate.HasValue)
        {
            query = query.Where(p => p.PublishedAt >= request.FromDate.Value);
        }

        if (request.ToDate.HasValue)
        {
            query = query.Where(p => p.PublishedAt <= request.ToDate.Value);
        }

        if (request.MinDuration.HasValue)
        {
            query = query.Where(p => p.Duration.TotalSeconds >= request.MinDuration.Value);
        }

        if (request.MaxDuration.HasValue)
        {
            query = query.Where(p => p.Duration.TotalSeconds <= request.MaxDuration.Value);
        }

        if (request.MinViews.HasValue)
        {
            query = query.Where(p => p.PlayCount >= request.MinViews.Value);
        }

        if (request.MinLikes.HasValue)
        {
            query = query.Where(p => p.LikeCount >= request.MinLikes.Value);
        }

        if (request.CreatorId.HasValue)
        {
            query = query.Where(p => p.CreatorId == request.CreatorId.Value);
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
            RelevanceScore = CalculateRelevanceScore(p.Title, p.Description, p.Tags, request.SearchTerm),
            IsPublic = p.IsPublic,
            Status = p.Status
        }).ToList();
    }

    private double CalculateRelevanceScore(string title, string description, string? tags, string? searchTerm)
    {
        if (string.IsNullOrEmpty(searchTerm))
            return 1.0;

        double score = 0.0;
        var term = searchTerm.ToLower();

        // Title match (highest weight)
        if (title.ToLower().Contains(term))
        {
            score += title.ToLower() == term ? 10.0 : 5.0;
        }

        // Description match
        if (description.ToLower().Contains(term))
        {
            score += 2.0;
        }

        // Tags match
        if (!string.IsNullOrEmpty(tags) && tags.ToLower().Contains(term))
        {
            score += 3.0;
        }

        return Math.Max(score, 0.1); // Minimum score for any result
    }

    private List<MediaSearchResultDto> ApplySorting(List<MediaSearchResultDto> results, string sortBy, bool descending)
    {
        return sortBy.ToLower() switch
        {
            "relevance" => descending 
                ? results.OrderByDescending(r => r.RelevanceScore).ToList()
                : results.OrderBy(r => r.RelevanceScore).ToList(),
            "date" => descending 
                ? results.OrderByDescending(r => r.PublishedAt).ToList()
                : results.OrderBy(r => r.PublishedAt).ToList(),
            "views" => descending 
                ? results.OrderByDescending(r => r.ViewCount + r.PlayCount).ToList()
                : results.OrderBy(r => r.ViewCount + r.PlayCount).ToList(),
            "likes" => descending 
                ? results.OrderByDescending(r => r.LikeCount).ToList()
                : results.OrderBy(r => r.LikeCount).ToList(),
            "duration" => descending 
                ? results.OrderByDescending(r => r.Duration).ToList()
                : results.OrderBy(r => r.Duration).ToList(),
            _ => descending 
                ? results.OrderByDescending(r => r.RelevanceScore).ToList()
                : results.OrderBy(r => r.RelevanceScore).ToList()
        };
    }
}