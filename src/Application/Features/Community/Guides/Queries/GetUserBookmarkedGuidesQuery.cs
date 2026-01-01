using Application.Common.Interfaces;
using Application.Common.Models;
using Application.Features.Community.Guides.DTOs.Responses;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Community.Guides.Queries;

public record GetUserBookmarkedGuidesQuery(
    string UserId,
    int Page = 1,
    int PageSize = 10
) : IRequest<PaginatedList<GuideListDto>>;

public class GetUserBookmarkedGuidesQueryHandler : IRequestHandler<GetUserBookmarkedGuidesQuery, PaginatedList<GuideListDto>>
{
    private readonly IApplicationDbContext _context;

    public GetUserBookmarkedGuidesQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<PaginatedList<GuideListDto>> Handle(GetUserBookmarkedGuidesQuery request, CancellationToken cancellationToken)
    {
        var query = _context.GuideBookmarks
            .Include(b => b.Guide)
                .ThenInclude(g => g.Author)
            .Include(b => b.Guide)
                .ThenInclude(g => g.Ratings)
            .Where(b => b.UserId == request.UserId && b.Guide.IsPublished)
            .OrderByDescending(b => b.CreatedAt);

        var totalCount = await query.CountAsync(cancellationToken);
        var bookmarks = await query
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToListAsync(cancellationToken);

        var guideDtos = bookmarks.Select(b => new GuideListDto
        {
            Id = b.Guide.Id,
            Title = b.Guide.Title,
            Summary = b.Guide.Summary,
            Category = b.Guide.Category,
            CategoryName = b.Guide.Category.ToString(),
            Difficulty = b.Guide.Difficulty,
            DifficultyName = b.Guide.Difficulty.ToString(),
            EstimatedReadTime = b.Guide.EstimatedReadTime,
            IsFeatured = b.Guide.IsFeatured,
            ViewCount = b.Guide.ViewCount,
            LikeCount = b.Guide.LikeCount,
            BookmarkCount = b.Guide.BookmarkCount,
            Tags = string.IsNullOrEmpty(b.Guide.Tags) ? new List<string>() : 
                   System.Text.Json.JsonSerializer.Deserialize<List<string>>(b.Guide.Tags) ?? new List<string>(),
            ThumbnailUrl = b.Guide.ThumbnailUrl,
            CreatedAt = b.Guide.CreatedAt,
            AuthorName = b.Guide.Author?.UserName ?? "Unknown",
            AuthorAvatar = b.Guide.Author?.Avatar,
            IsBookmarked = true,
            AverageRating = b.Guide.Ratings.Any() ? b.Guide.Ratings.Average(r => r.Rating) : 0,
            RatingCount = b.Guide.Ratings.Count
        }).ToList();

        return new PaginatedList<GuideListDto>(guideDtos, totalCount, request.Page, request.PageSize);
    }
}