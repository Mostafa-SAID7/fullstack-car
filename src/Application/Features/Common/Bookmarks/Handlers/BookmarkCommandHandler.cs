using Application.Common.Interfaces;
using Application.Common.Models;
using Application.Features.Common.Bookmarks.Commands;
using Domain.Entities.Common;
using Domain.Enums.Common;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Common.Bookmarks.Handlers;

public class BookmarkCommandHandler : IRequestHandler<BookmarkCommand, Result<bool>>
{
    private readonly IApplicationDbContext _context;

    public BookmarkCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<bool>> Handle(BookmarkCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var existingBookmark = await _context.Bookmarks
                .FirstOrDefaultAsync(b => b.ContentId == request.ContentId && 
                                        b.ContentType == request.ContentType && 
                                        b.UserId == request.UserId, cancellationToken);

            if (existingBookmark != null)
            {
                // Remove bookmark (toggle)
                _context.Bookmarks.Remove(existingBookmark);
                await UpdateContentBookmarkCount(request.ContentId, request.ContentType, -1, cancellationToken);
            }
            else
            {
                // Add bookmark
                var bookmark = new Bookmark
                {
                    ContentId = request.ContentId,
                    ContentType = request.ContentType,
                    UserId = request.UserId,
                    Notes = request.Notes,
                    CreatedAt = DateTime.UtcNow
                };

                _context.Bookmarks.Add(bookmark);
                await UpdateContentBookmarkCount(request.ContentId, request.ContentType, 1, cancellationToken);
            }

            await _context.SaveChangesAsync(cancellationToken);
            return Result<bool>.Success(true);
        }
        catch (Exception ex)
        {
            return Result<bool>.Failure($"Failed to toggle bookmark: {ex.Message}");
        }
    }

    private async Task UpdateContentBookmarkCount(Guid contentId, ContentType contentType, int increment, CancellationToken cancellationToken)
    {
        switch (contentType)
        {
            case ContentType.Guide:
                var guide = await _context.Guides.FirstOrDefaultAsync(g => g.Id == contentId, cancellationToken);
                if (guide != null)
                {
                    guide.BookmarkCount = Math.Max(0, guide.BookmarkCount + increment);
                }
                break;
            case ContentType.Question:
                // Update question bookmark count if needed
                break;
            case ContentType.Post:
                // Update post bookmark count if needed
                break;
            case ContentType.Page:
                // Update page bookmark count if needed
                break;
        }
    }
}