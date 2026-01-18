using Application.Common.DTOs;
using Application.Common.Models;
using Application.Features.Community.Events.Interfaces;
using Domain.Entities.Community.Events;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories.Community.Events;

public class EventCommentRepository : Repository<EventComment>, IEventCommentRepository
{
    public EventCommentRepository(ApplicationDbContext context) : base(context)
    {
    }

    // Comment queries
    public async Task<EventComment?> GetByIdWithDetailsAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.Set<EventComment>()
            .Include(c => c.CreatedByUser)
            .Include(c => c.Event)
            .FirstOrDefaultAsync(c => c.Id == id, cancellationToken);
    }

    public async Task<IEnumerable<EventComment>> GetEventCommentsAsync(Guid eventId, CancellationToken cancellationToken = default)
    {
        return await _context.Set<EventComment>()
            .Where(c => c.EventId == eventId && !c.IsDeleted)
            .Include(c => c.CreatedByUser)
            .OrderByDescending(c => c.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<EventComment>> GetEventCommentsWithRepliesAsync(Guid eventId, CancellationToken cancellationToken = default)
    {
        return await _context.Set<EventComment>()
            .Where(c => c.EventId == eventId && !c.IsDeleted)
            .Include(c => c.CreatedByUser)
            .Include(c => c.ChildComments.Where(cc => !cc.IsDeleted))
            .ThenInclude(cc => cc.CreatedByUser)
            .OrderByDescending(c => c.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<EventComment>> GetCommentRepliesAsync(Guid parentCommentId, CancellationToken cancellationToken = default)
    {
        return await _context.Set<EventComment>()
            .Where(c => c.ParentCommentId == parentCommentId && !c.IsDeleted)
            .Include(c => c.CreatedByUser)
            .OrderBy(c => c.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<EventComment>> GetUserCommentsAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        return await _context.Set<EventComment>()
            .Where(c => c.CreatedBy == userId.ToString() && !c.IsDeleted)
            .Include(c => c.Event)
            .OrderByDescending(c => c.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    // Paginated queries
    public async Task<PaginatedResult<EventComment>> GetEventCommentsPagedAsync(
        Guid eventId,
        int pageNumber,
        int pageSize,
        string? sortBy = null,
        bool sortDescending = false,
        CancellationToken cancellationToken = default)
    {
        var query = _context.Set<EventComment>()
            .Where(c => c.EventId == eventId && !c.IsDeleted)
            .Include(c => c.CreatedByUser)
            .AsQueryable();

        // Apply sorting
        IOrderedQueryable<EventComment> orderedQuery = sortBy?.ToLower() switch
        {
            "likecount" => sortDescending ? query.OrderByDescending(c => c.LikeCount) : query.OrderBy(c => c.LikeCount),
            "updatedat" => sortDescending ? query.OrderByDescending(c => c.UpdatedAt ?? c.CreatedAt) : query.OrderBy(c => c.UpdatedAt ?? c.CreatedAt),
            _ => sortDescending ? query.OrderByDescending(c => c.CreatedAt) : query.OrderBy(c => c.CreatedAt)
        };

        var totalCount = await query.CountAsync(cancellationToken);
        var items = await orderedQuery
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        return new PaginatedResult<EventComment>(items, totalCount, pageNumber, pageSize);
    }

    // Comment statistics
    public async Task<int> GetEventCommentCountAsync(Guid eventId, CancellationToken cancellationToken = default)
    {
        return await _context.Set<EventComment>()
            .CountAsync(c => c.EventId == eventId && !c.IsDeleted, cancellationToken);
    }

    public async Task<int> GetCommentReplyCountAsync(Guid commentId, CancellationToken cancellationToken = default)
    {
        return await _context.Set<EventComment>()
            .CountAsync(c => c.ParentCommentId == commentId && !c.IsDeleted, cancellationToken);
    }

    public async Task<int> GetUserCommentCountAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        return await _context.Set<EventComment>()
            .CountAsync(c => c.CreatedBy == userId.ToString() && !c.IsDeleted, cancellationToken);
    }

    // Comment validation
    public async Task<bool> ExistsAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.Set<EventComment>()
            .AnyAsync(c => c.Id == id, cancellationToken);
    }

    public async Task<bool> IsUserCommentOwnerAsync(Guid commentId, Guid userId, CancellationToken cancellationToken = default)
    {
        return await _context.Set<EventComment>()
            .AnyAsync(c => c.Id == commentId && c.CreatedBy == userId.ToString(), cancellationToken);
    }

    public async Task<bool> CanUserEditCommentAsync(Guid commentId, Guid userId, CancellationToken cancellationToken = default)
    {
        var comment = await _context.Set<EventComment>()
            .FirstOrDefaultAsync(c => c.Id == commentId, cancellationToken);

        if (comment == null || comment.IsDeleted) return false;

        // User can edit their own comments within 24 hours
        return comment.CreatedBy == userId.ToString() && 
               DateTime.UtcNow.Subtract(comment.CreatedAt).TotalHours <= 24;
    }

    // Comment operations
    public async Task<bool> UpdateCommentAsync(EventComment comment, CancellationToken cancellationToken = default)
    {
        try
        {
            _context.Set<EventComment>().Update(comment);
            return true;
        }
        catch
        {
            return false;
        }
    }

    public async Task<bool> DeleteCommentAsync(Guid id, CancellationToken cancellationToken = default)
    {
        try
        {
            var comment = await _context.Set<EventComment>()
                .FirstOrDefaultAsync(c => c.Id == id, cancellationToken);

            if (comment != null)
            {
                _context.Set<EventComment>().Remove(comment);
                return true;
            }
            return false;
        }
        catch
        {
            return false;
        }
    }

    public async Task<bool> SoftDeleteCommentAsync(Guid id, CancellationToken cancellationToken = default)
    {
        try
        {
            var comment = await _context.Set<EventComment>()
                .FirstOrDefaultAsync(c => c.Id == id, cancellationToken);

            if (comment != null)
            {
                comment.IsDeleted = true;
                comment.UpdatedAt = DateTime.UtcNow;
                _context.Set<EventComment>().Update(comment);
                return true;
            }
            return false;
        }
        catch
        {
            return false;
        }
    }

    public async Task<bool> LikeCommentAsync(Guid commentId, Guid userId, CancellationToken cancellationToken = default)
    {
        try
        {
            // Check if already liked
            var hasLiked = await HasUserLikedCommentAsync(commentId, userId, cancellationToken);
            if (hasLiked) return false;

            // Add like record
            var like = new EventCommentLike
            {
                Id = Guid.NewGuid(),
                CommentId = commentId,
                UserId = userId,
                LikedAt = DateTime.UtcNow
            };

            await _context.Set<EventCommentLike>().AddAsync(like, cancellationToken);

            // Update like count
            var comment = await _context.Set<EventComment>()
                .FirstOrDefaultAsync(c => c.Id == commentId, cancellationToken);

            if (comment != null)
            {
                comment.LikeCount++;
                _context.Set<EventComment>().Update(comment);
                return true;
            }
            return false;
        }
        catch
        {
            return false;
        }
    }

    public async Task<bool> UnlikeCommentAsync(Guid commentId, Guid userId, CancellationToken cancellationToken = default)
    {
        try
        {
            // Find and remove like record
            var like = await _context.Set<EventCommentLike>()
                .FirstOrDefaultAsync(l => l.CommentId == commentId && l.UserId == userId, cancellationToken);

            if (like == null) return false;

            _context.Set<EventCommentLike>().Remove(like);

            // Update like count
            var comment = await _context.Set<EventComment>()
                .FirstOrDefaultAsync(c => c.Id == commentId, cancellationToken);

            if (comment != null && comment.LikeCount > 0)
            {
                comment.LikeCount--;
                _context.Set<EventComment>().Update(comment);
                return true;
            }
            return false;
        }
        catch
        {
            return false;
        }
    }

    public async Task<bool> HasUserLikedCommentAsync(Guid commentId, Guid userId, CancellationToken cancellationToken = default)
    {
        try
        {
            return await _context.Set<EventCommentLike>()
                .AnyAsync(l => l.CommentId == commentId && l.UserId == userId, cancellationToken);
        }
        catch
        {
            return false;
        }
    }
}