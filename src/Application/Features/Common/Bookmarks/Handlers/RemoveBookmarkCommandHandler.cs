using Application.Common.Interfaces;
using Application.Common.Models;
using Application.Features.Common.Bookmarks.Commands;
using Domain.Enums.Common;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Common.Bookmarks.Handlers;

public class RemoveBookmarkCommandHandler : IRequestHandler<RemoveBookmarkCommand, Result<bool>>
{
    private readonly IApplicationDbContext _context;

    public RemoveBookmarkCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<bool>> Handle(RemoveBookmarkCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var bookmark = await _context.Bookmarks
                .FirstOrDefaultAsync(b => b.ContentId == request.ContentId && 
                                        b.ContentType == request.ContentType && 
                                        b.UserId == request.UserId, cancellationToken);

            if (bookmark == null)
            {
                return Result<bool>.Failure("Bookmark not found");
            }

            _context.Bookmarks.Remove(bookmark);
            await UpdateContentBookmarkCount(request.ContentId, request.ContentType, -1, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);

            return Result<bool>.Success(true);
        }
        catch (Exception ex)
        {
            return Result<bool>.Failure($"Failed to remove bookmark: {ex.Message}");
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