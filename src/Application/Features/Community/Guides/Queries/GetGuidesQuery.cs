using Application.Common.Interfaces;
using Application.Common.Models;
using Application.Features.Community.Guides.DTOs.Responses;
using Domain.Enums.Community.Guides;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Community.Guides.Queries;

public record GetGuidesQuery(
    int Page = 1,
    int PageSize = 10,
    GuideCategory? Category = null,
    GuideDifficulty? Difficulty = null,
    string? SearchTerm = null,
    bool? IsFeatured = null,
    string? SortBy = "CreatedAt",
    bool SortDescending = true,
    Guid? UserId = null
) : IRequest<PaginatedList<GuideListDto>>;

public class GetGuidesQueryHandler : IRequestHandler<GetGuidesQuery, PaginatedList<GuideListDto>>
{
    private readonly IApplicationDbContext _context;

    public GetGuidesQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<PaginatedList<GuideListDto>> Handle(GetGuidesQuery request, CancellationToken cancellationToken)
    {
        var query = _context.Guides
            .Include(g => g.Author)
            .Include(g => g.Ratings)
            .Include(g => g.Bookmarks)
            .Where(g => g.IsPublished);

        // Apply filters
        if (request.Category.HasValue)
            query = query.Where(g => g.Category == request.Category.Value);

        if (request.Difficulty.HasValue)
            query = query.Where(g => g.Difficulty == request.Difficulty.Value);

        if (request.IsFeatured.HasValue)
            query = query.Where(g => g.IsFeatured == request.IsFeatured.Value);

        if (!string.IsNullOrEmpty(request.SearchTerm))
        {
            var searchTerm = request.SearchTerm.ToLower();
            query = query.Where(g => 
                g.Title.ToLower().Contains(searchTerm) ||
                g.Summary.ToLower().Contains(searchTerm) ||
                g.Tags.ToLower().Contains(searchTerm));
        }

        // Apply sorting
        query = request.SortBy?.ToLower() switch
        {
            "title" => request.SortDescending ? query.OrderByDescending(g => g.Title) : query.OrderBy(g => g.Title),
            "viewcount" => request.SortDescending ? query.OrderByDescending(g => g.ViewCount) : query.OrderBy(g => g.ViewCount),
            "likecount" => request.SortDescending ? query.OrderByDescending(g => g.LikeCount) : query.OrderBy(g => g.LikeCount),
            "rating" => request.SortDescending ? 
                query.OrderByDescending(g => g.Ratings.Any() ? g.Ratings.Average(r => r.Rating) : 0) : 
                query.OrderBy(g => g.Ratings.Any() ? g.Ratings.Average(r => r.Rating) : 0),
            _ => request.SortDescending ? query.OrderByDescending(g => g.CreatedAt) : query.OrderBy(g => g.CreatedAt)
        };

        var totalCount = await query.CountAsync(cancellationToken);
        var guides = await query
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToListAsync(cancellationToken);

        var guideDtos = guides.Select(g => new GuideListDto
        {
            Id = g.Id,
            Title = g.Title,
            Summary = g.Summary,
            Category = g.Category,
            CategoryName = g.Category.ToString(),
            Difficulty = g.Difficulty,
            DifficultyName = g.Difficulty.ToString(),
            EstimatedReadTime = g.EstimatedReadTime,
            IsFeatured = g.IsFeatured,
            ViewCount = g.ViewCount,
            LikeCount = g.LikeCount,
            BookmarkCount = g.BookmarkCount,
            Tags = string.IsNullOrEmpty(g.Tags) ? new List<string>() : 
                   System.Text.Json.JsonSerializer.Deserialize<List<string>>(g.Tags) ?? new List<string>(),
            ThumbnailUrl = g.ThumbnailUrl,
            CreatedAt = g.CreatedAt,
            AuthorName = g.Author?.UserName ?? "Unknown",
            AuthorAvatar = g.Author?.ProfileImageUrl,
            IsBookmarked = request.UserId.HasValue && 
                          g.Bookmarks.Any(b => b.UserId == request.UserId.Value),
            AverageRating = g.Ratings.Any() ? g.Ratings.Average(r => r.Rating) : 0,
            RatingCount = g.Ratings.Count
        }).ToList();

        return new PaginatedList<GuideListDto>(guideDtos, totalCount, request.Page, request.PageSize);
    }
}