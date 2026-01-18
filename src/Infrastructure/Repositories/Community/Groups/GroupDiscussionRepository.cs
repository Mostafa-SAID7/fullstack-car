using Application.Common.DTOs;
using Application.Common.Models;
using Application.Features.Community.Groups.Interfaces;
using Domain.Entities.Community.Groups;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories.Community.Groups;

public class GroupDiscussionRepository : Repository<GroupDiscussion>, IGroupDiscussionRepository
{
    public GroupDiscussionRepository(ApplicationDbContext context) : base(context)
    {
    }

    // Discussion queries
    public async Task<GroupDiscussion?> GetByIdWithDetailsAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.Set<GroupDiscussion>()
            .Include(d => d.Group)
            .Include(d => d.CreatedByUser)
            .Include(d => d.LockedByUser)
            .Include(d => d.PollOptions)
            .FirstOrDefaultAsync(d => d.Id == id, cancellationToken);
    }

    public async Task<GroupDiscussion?> GetByIdWithRepliesAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.Set<GroupDiscussion>()
            .Include(d => d.Replies.Take(10)) // Limit initial replies
            .ThenInclude(r => r.CreatedByUser)
            .FirstOrDefaultAsync(d => d.Id == id, cancellationToken);
    }

    public async Task<IEnumerable<GroupDiscussion>> GetGroupDiscussionsAsync(Guid groupId, CancellationToken cancellationToken = default)
    {
        return await _context.Set<GroupDiscussion>()
            .Include(d => d.CreatedByUser)
            .Where(d => d.GroupId == groupId)
            .OrderByDescending(d => d.LastActivity)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<GroupDiscussion>> GetPinnedDiscussionsAsync(Guid groupId, CancellationToken cancellationToken = default)
    {
        return await _context.Set<GroupDiscussion>()
            .Include(d => d.CreatedByUser)
            .Where(d => d.GroupId == groupId && d.IsPinned)
            .OrderByDescending(d => d.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<GroupDiscussion>> GetDiscussionsByCategoryAsync(Guid groupId, string category, CancellationToken cancellationToken = default)
    {
        return await _context.Set<GroupDiscussion>()
            .Include(d => d.CreatedByUser)
            .Where(d => d.GroupId == groupId && d.Category == category)
            .OrderByDescending(d => d.LastActivity)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<GroupDiscussion>> GetRecentDiscussionsAsync(Guid groupId, int count, CancellationToken cancellationToken = default)
    {
        return await _context.Set<GroupDiscussion>()
            .Include(d => d.CreatedByUser)
            .Where(d => d.GroupId == groupId)
            .OrderByDescending(d => d.LastActivity)
            .Take(count)
            .ToListAsync(cancellationToken);
    }

    // Paginated queries
    public async Task<PaginatedResult<GroupDiscussion>> GetGroupDiscussionsPagedAsync(
        Guid groupId,
        int pageNumber,
        int pageSize,
        string? category = null,
        string? sortBy = null,
        bool sortDescending = true,
        bool? isPinned = null,
        CancellationToken cancellationToken = default)
    {
        var query = _context.Set<GroupDiscussion>()
            .Include(d => d.CreatedByUser)
            .Where(d => d.GroupId == groupId);

        // Apply filters
        if (!string.IsNullOrEmpty(category))
        {
            query = query.Where(d => d.Category == category);
        }

        if (isPinned.HasValue)
        {
            query = query.Where(d => d.IsPinned == isPinned.Value);
        }

        // Apply sorting
        query = sortBy?.ToLower() switch
        {
            "title" => sortDescending ? query.OrderByDescending(d => d.Title) : query.OrderBy(d => d.Title),
            "createdat" => sortDescending ? query.OrderByDescending(d => d.CreatedAt) : query.OrderBy(d => d.CreatedAt),
            "replycount" => sortDescending ? query.OrderByDescending(d => d.ReplyCount) : query.OrderBy(d => d.ReplyCount),
            "viewcount" => sortDescending ? query.OrderByDescending(d => d.ViewCount) : query.OrderBy(d => d.ViewCount),
            _ => sortDescending ? query.OrderByDescending(d => d.LastActivity) : query.OrderBy(d => d.LastActivity)
        };

        var totalCount = await query.CountAsync(cancellationToken);
        var items = await query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        return new PaginatedResult<GroupDiscussion>(items, totalCount, pageNumber, pageSize);
    }

    // Discussion statistics
    public async Task<int> GetDiscussionCountAsync(Guid groupId, CancellationToken cancellationToken = default)
    {
        return await _context.Set<GroupDiscussion>()
            .CountAsync(d => d.GroupId == groupId, cancellationToken);
    }

    public async Task<int> GetActiveDiscussionCountAsync(Guid groupId, CancellationToken cancellationToken = default)
    {
        var cutoffDate = DateTime.UtcNow.AddDays(-7); // Active in last 7 days
        return await _context.Set<GroupDiscussion>()
            .CountAsync(d => d.GroupId == groupId && d.LastActivity >= cutoffDate, cancellationToken);
    }

    public async Task<Dictionary<string, int>> GetDiscussionCountsByCategoryAsync(Guid groupId, CancellationToken cancellationToken = default)
    {
        return await _context.Set<GroupDiscussion>()
            .Where(d => d.GroupId == groupId && !string.IsNullOrEmpty(d.Category))
            .GroupBy(d => d.Category)
            .ToDictionaryAsync(g => g.Key, g => g.Count(), cancellationToken);
    }

    // Discussion validation
    public async Task<bool> ExistsAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.Set<GroupDiscussion>()
            .AnyAsync(d => d.Id == id, cancellationToken);
    }

    public async Task<bool> IsUserCreatorAsync(Guid discussionId, Guid userId, CancellationToken cancellationToken = default)
    {
        return await _context.Set<GroupDiscussion>()
            .AnyAsync(d => d.Id == discussionId && d.CreatedBy == userId, cancellationToken);
    }

    public async Task<bool> CanUserModerateAsync(Guid discussionId, Guid userId, CancellationToken cancellationToken = default)
    {
        var discussion = await _context.Set<GroupDiscussion>()
            .FirstOrDefaultAsync(d => d.Id == discussionId, cancellationToken);

        if (discussion == null) return false;

        // Check if user is discussion creator
        if (discussion.CreatedBy == userId) return true;

        // Check if user is group owner or moderator
        var group = await _context.Set<Group>()
            .FirstOrDefaultAsync(g => g.Id == discussion.GroupId, cancellationToken);

        if (group?.OwnerId == userId) return true;

        return await _context.Set<GroupMember>()
            .AnyAsync(m => m.GroupId == discussion.GroupId && m.UserId == userId && 
                     (m.Role == "Moderator" || m.Role == "Admin"), cancellationToken);
    }

    // Discussion operations
    public async Task<bool> PinDiscussionAsync(Guid id, CancellationToken cancellationToken = default)
    {
        try
        {
            var discussion = await _context.Set<GroupDiscussion>()
                .FirstOrDefaultAsync(d => d.Id == id, cancellationToken);

            if (discussion != null && !discussion.IsPinned)
            {
                discussion.IsPinned = true;
                discussion.UpdatedAt = DateTime.UtcNow;
                _context.Set<GroupDiscussion>().Update(discussion);
                return true;
            }
            return false;
        }
        catch
        {
            return false;
        }
    }

    public async Task<bool> UnpinDiscussionAsync(Guid id, CancellationToken cancellationToken = default)
    {
        try
        {
            var discussion = await _context.Set<GroupDiscussion>()
                .FirstOrDefaultAsync(d => d.Id == id, cancellationToken);

            if (discussion != null && discussion.IsPinned)
            {
                discussion.IsPinned = false;
                discussion.UpdatedAt = DateTime.UtcNow;
                _context.Set<GroupDiscussion>().Update(discussion);
                return true;
            }
            return false;
        }
        catch
        {
            return false;
        }
    }

    public async Task<bool> LockDiscussionAsync(Guid id, string reason, Guid lockedBy, DateTime? lockUntil = null, CancellationToken cancellationToken = default)
    {
        try
        {
            var discussion = await _context.Set<GroupDiscussion>()
                .FirstOrDefaultAsync(d => d.Id == id, cancellationToken);

            if (discussion != null && !discussion.IsLocked)
            {
                discussion.IsLocked = true;
                discussion.LockReason = reason;
                discussion.LockedBy = lockedBy;
                discussion.LockedUntil = lockUntil;
                discussion.UpdatedAt = DateTime.UtcNow;
                _context.Set<GroupDiscussion>().Update(discussion);
                return true;
            }
            return false;
        }
        catch
        {
            return false;
        }
    }

    public async Task<bool> UnlockDiscussionAsync(Guid id, CancellationToken cancellationToken = default)
    {
        try
        {
            var discussion = await _context.Set<GroupDiscussion>()
                .FirstOrDefaultAsync(d => d.Id == id, cancellationToken);

            if (discussion != null && discussion.IsLocked)
            {
                discussion.IsLocked = false;
                discussion.LockReason = null;
                discussion.LockedBy = null;
                discussion.LockedUntil = null;
                discussion.UpdatedAt = DateTime.UtcNow;
                _context.Set<GroupDiscussion>().Update(discussion);
                return true;
            }
            return false;
        }
        catch
        {
            return false;
        }
    }

    public async Task<bool> IncrementViewCountAsync(Guid id, CancellationToken cancellationToken = default)
    {
        try
        {
            var discussion = await _context.Set<GroupDiscussion>()
                .FirstOrDefaultAsync(d => d.Id == id, cancellationToken);

            if (discussion != null)
            {
                discussion.ViewCount++;
                discussion.UpdatedAt = DateTime.UtcNow;
                _context.Set<GroupDiscussion>().Update(discussion);
                return true;
            }
            return false;
        }
        catch
        {
            return false;
        }
    }

    // Poll operations
    public async Task AddPollOptionAsync(GroupDiscussionPollOption option, CancellationToken cancellationToken = default)
    {
        await _context.Set<GroupDiscussionPollOption>().AddAsync(option, cancellationToken);
    }

    public async Task<IEnumerable<GroupDiscussionPollOption>> GetPollOptionsAsync(Guid discussionId, CancellationToken cancellationToken = default)
    {
        return await _context.Set<GroupDiscussionPollOption>()
            .Where(o => o.DiscussionId == discussionId)
            .OrderBy(o => o.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task<bool> VoteOnPollAsync(Guid optionId, Guid userId, CancellationToken cancellationToken = default)
    {
        try
        {
            // Check if user already voted on this option
            var existingVote = await _context.Set<GroupDiscussionPollVote>()
                .FirstOrDefaultAsync(v => v.PollOptionId == optionId && v.UserId == userId, cancellationToken);

            if (existingVote != null) return false; // Already voted

            // Add vote
            var vote = new GroupDiscussionPollVote
            {
                Id = Guid.NewGuid(),
                PollOptionId = optionId,
                UserId = userId,
                VotedAt = DateTime.UtcNow
            };

            await _context.Set<GroupDiscussionPollVote>().AddAsync(vote, cancellationToken);

            // Update vote count
            var option = await _context.Set<GroupDiscussionPollOption>()
                .FirstOrDefaultAsync(o => o.Id == optionId, cancellationToken);

            if (option != null)
            {
                option.VoteCount++;
                _context.Set<GroupDiscussionPollOption>().Update(option);
            }

            return true;
        }
        catch
        {
            return false;
        }
    }

    public async Task<bool> RemovePollVoteAsync(Guid optionId, Guid userId, CancellationToken cancellationToken = default)
    {
        try
        {
            var vote = await _context.Set<GroupDiscussionPollVote>()
                .FirstOrDefaultAsync(v => v.PollOptionId == optionId && v.UserId == userId, cancellationToken);

            if (vote == null) return false; // No vote to remove

            _context.Set<GroupDiscussionPollVote>().Remove(vote);

            // Update vote count
            var option = await _context.Set<GroupDiscussionPollOption>()
                .FirstOrDefaultAsync(o => o.Id == optionId, cancellationToken);

            if (option != null)
            {
                option.VoteCount = Math.Max(0, option.VoteCount - 1);
                _context.Set<GroupDiscussionPollOption>().Update(option);
            }

            return true;
        }
        catch
        {
            return false;
        }
    }

    // Reply operations
    public async Task<IEnumerable<GroupDiscussionReply>> GetDiscussionRepliesAsync(Guid discussionId, CancellationToken cancellationToken = default)
    {
        return await _context.Set<GroupDiscussionReply>()
            .Include(r => r.CreatedByUser)
            .Where(r => r.DiscussionId == discussionId)
            .OrderBy(r => r.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task<PaginatedResult<GroupDiscussionReply>> GetDiscussionRepliesPagedAsync(
        Guid discussionId,
        int pageNumber,
        int pageSize,
        string? sortBy = null,
        bool sortDescending = false,
        CancellationToken cancellationToken = default)
    {
        var query = _context.Set<GroupDiscussionReply>()
            .Include(r => r.CreatedByUser)
            .Where(r => r.DiscussionId == discussionId);

        // Apply sorting
        query = sortBy?.ToLower() switch
        {
            "likecount" => sortDescending ? query.OrderByDescending(r => r.LikeCount) : query.OrderBy(r => r.LikeCount),
            _ => sortDescending ? query.OrderByDescending(r => r.CreatedAt) : query.OrderBy(r => r.CreatedAt)
        };

        var totalCount = await query.CountAsync(cancellationToken);
        var items = await query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        return new PaginatedResult<GroupDiscussionReply>(items, totalCount, pageNumber, pageSize);
    }

    public async Task AddReplyAsync(GroupDiscussionReply reply, CancellationToken cancellationToken = default)
    {
        await _context.Set<GroupDiscussionReply>().AddAsync(reply, cancellationToken);

        // Update discussion reply count and last activity
        var discussion = await _context.Set<GroupDiscussion>()
            .FirstOrDefaultAsync(d => d.Id == reply.DiscussionId, cancellationToken);

        if (discussion != null)
        {
            discussion.ReplyCount++;
            discussion.LastActivity = DateTime.UtcNow;
            _context.Set<GroupDiscussion>().Update(discussion);
        }
    }
}