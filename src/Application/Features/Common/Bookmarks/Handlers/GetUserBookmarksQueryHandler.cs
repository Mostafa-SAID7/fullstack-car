using Application.Common.Interfaces;
using Application.Common.Models;
using Application.Features.Common.Bookmarks.DTOs.Responses;
using Application.Features.Common.Bookmarks.Queries;
using Domain.Enums.Common;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Common.Bookmarks.Handlers;

public class GetUserBookmarksQueryHandler : IRequestHandler<GetUserBookmarksQuery, Result<PaginatedList<BookmarkResponse>>>
{
    private readonly IApplicationDbContext _context;

    public GetUserBookmarksQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<PaginatedList<BookmarkResponse>>> Handle(GetUserBookmarksQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var query = _context.Bookmarks
                .Where(b => b.UserId == request.UserId);

            if (request.ContentType.HasValue)
            {
                query = query.Where(b => b.ContentType == request.ContentType.Value);
            }

            query = query.OrderByDescending(b => b.CreatedAt);

            var totalCount = await query.CountAsync(cancellationToken);
            var bookmarks = await query
                .Skip((request.Page - 1) * request.PageSize)
                .Take(request.PageSize)
                .ToListAsync(cancellationToken);

            var bookmarkResponses = bookmarks.Select(b => new BookmarkResponse
            {
                Id = b.Id,
                ContentId = b.ContentId,
                ContentType = b.ContentType,
                UserId = b.UserId,
                Notes = b.Notes,
                CreatedAt = b.CreatedAt,
                ContentTitle = GetContentTitle(b.ContentId, b.ContentType),
                ContentUrl = GetContentUrl(b.ContentId, b.ContentType)
            }).ToList();

            var result = new PaginatedList<BookmarkResponse>(bookmarkResponses, totalCount, request.Page, request.PageSize);
            return Result<PaginatedList<BookmarkResponse>>.Success(result);
        }
        catch (Exception ex)
        {
            return Result<PaginatedList<BookmarkResponse>>.Failure($"Failed to retrieve bookmarks: {ex.Message}");
        }
    }

    private string GetContentTitle(Guid contentId, ContentType contentType)
    {
        // This would need to be implemented based on the content type
        // For now, return a placeholder
        return $"{contentType} Content";
    }

    private string GetContentUrl(Guid contentId, ContentType contentType)
    {
        // This would need to be implemented based on the content type
        // For now, return a placeholder
        return $"/{contentType.ToString().ToLower()}/{contentId}";
    }
}