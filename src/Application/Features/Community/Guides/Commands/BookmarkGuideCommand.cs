using Application.Common.Interfaces;
using Domain.Entities.Community.Guides;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Community.Guides.Commands;

public record BookmarkGuideCommand(int GuideId, string UserId, string? Notes = null) : IRequest<bool>;

public class BookmarkGuideCommandHandler : IRequestHandler<BookmarkGuideCommand, bool>
{
    private readonly IApplicationDbContext _context;

    public BookmarkGuideCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(BookmarkGuideCommand request, CancellationToken cancellationToken)
    {
        var guide = await _context.Guides
            .FirstOrDefaultAsync(g => g.Id == request.GuideId, cancellationToken);

        if (guide == null)
            return false;

        var existingBookmark = await _context.GuideBookmarks
            .FirstOrDefaultAsync(b => b.GuideId == request.GuideId && b.UserId == request.UserId, cancellationToken);

        if (existingBookmark != null)
        {
            // Remove bookmark (toggle)
            _context.GuideBookmarks.Remove(existingBookmark);
            guide.BookmarkCount = Math.Max(0, guide.BookmarkCount - 1);
        }
        else
        {
            // Add bookmark
            var bookmark = new GuideBookmark
            {
                GuideId = request.GuideId,
                UserId = request.UserId,
                Notes = request.Notes
            };

            _context.GuideBookmarks.Add(bookmark);
            guide.BookmarkCount++;
        }

        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}