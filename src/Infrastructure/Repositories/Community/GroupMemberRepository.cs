using Application.Common.Interfaces;
using Application.Common.DTOs;
using Domain.Entities.Community.Groups;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories.Community;

public class GroupMemberRepository : Repository<GroupMember>, IGroupMemberRepository
{
    public GroupMemberRepository(ApplicationDbContext context) : base(context)
    {
    }

    // Member queries
    public async Task<GroupMember?> GetByGroupAndUserAsync(Guid groupId, Guid userId, CancellationToken cancellationToken = default)
    {
        return await _context.Set<GroupMember>()
            .Include(m => m.User)
            .Include(m => m.Group)
            .FirstOrDefaultAsync(m => m.GroupId == groupId && m.UserId == userId, cancellationToken);
    }

    public async Task<IEnumerable<GroupMember>> GetGroupMembersAsync(Guid groupId, CancellationToken cancellationToken = default)
    {
        return await _context.Set<GroupMember>()
            .Include(m => m.User)
            .Where(m => m.GroupId == groupId)
            .OrderBy(m => m.JoinedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<GroupMember>> GetGroupModeratorssync(Guid groupId, CancellationToken cancellationToken = default)
    {
        return await _context.Set<GroupMember>()
            .Include(m => m.User)
            .Where(m => m.GroupId == groupId && (m.Role == "Moderator" || m.Role == "Admin"))
            .OrderBy(m => m.JoinedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<GroupMember>> GetOnlineMembersAsync(Guid groupId, CancellationToken cancellationToken = default)
    {
        return await _context.Set<GroupMember>()
            .Include(m => m.User)
            .Where(m => m.GroupId == groupId && m.IsOnline)
            .OrderByDescending(m => m.LastActivity)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<GroupMember>> GetMembersByRoleAsync(Guid groupId, string role, CancellationToken cancellationToken = default)
    {
        return await _context.Set<GroupMember>()
            .Include(m => m.User)
            .Where(m => m.GroupId == groupId && m.Role == role)
            .OrderBy(m => m.JoinedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task<PaginatedResult<GroupMember>> GetGroupMembersPagedAsync(
        Guid groupId,
        int pageNumber,
        int pageSize,
        string? role = null,
        string? searchTerm = null,
        string? sortBy = null,
        bool sortDescending = false,
        CancellationToken cancellationToken = default)
    {
        var query = _context.Set<GroupMember>()
            .Include(m => m.User)
            .Where(m => m.GroupId == groupId);

        // Apply filters
        if (!string.IsNullOrEmpty(role))
        {
            query = query.Where(m => m.Role == role);
        }

        if (!string.IsNullOrEmpty(searchTerm))
        {
            query = query.Where(m => m.User.UserName.Contains(searchTerm) || 
                                   m.User.Email.Contains(searchTerm));
        }

        // Apply sorting
        query = sortBy?.ToLower() switch
        {
            "username" => sortDescending ? query.OrderByDescending(m => m.User.UserName) : query.OrderBy(m => m.User.UserName),
            "role" => sortDescending ? query.OrderByDescending(m => m.Role) : query.OrderBy(m => m.Role),
            "lastactivity" => sortDescending ? query.OrderByDescending(m => m.LastActivity) : query.OrderBy(m => m.LastActivity),
            _ => sortDescending ? query.OrderByDescending(m => m.JoinedAt) : query.OrderBy(m => m.JoinedAt)
        };

        var totalCount = await query.CountAsync(cancellationToken);
        var items = await query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        return new PaginatedResult<GroupMember>
        {
            Items = items,
            TotalCount = totalCount,
            PageNumber = pageNumber,
            PageSize = pageSize,
            TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize)
        };
    }

    // Member statistics
    public async Task<int> GetMemberCountAsync(Guid groupId, CancellationToken cancellationToken = default)
    {
        return await _context.Set<GroupMember>()
            .CountAsync(m => m.GroupId == groupId, cancellationToken);
    }

    public async Task<int> GetActiveMemberCountAsync(Guid groupId, CancellationToken cancellationToken = default)
    {
        var cutoffDate = DateTime.UtcNow.AddDays(-30); // Active in last 30 days
        return await _context.Set<GroupMember>()
            .CountAsync(m => m.GroupId == groupId && m.LastActivity >= cutoffDate, cancellationToken);
    }

    public async Task<int> GetOnlineMemberCountAsync(Guid groupId, CancellationToken cancellationToken = default)
    {
        return await _context.Set<GroupMember>()
            .CountAsync(m => m.GroupId == groupId && m.IsOnline, cancellationToken);
    }

    public async Task<Dictionary<string, int>> GetMemberCountsByRoleAsync(Guid groupId, CancellationToken cancellationToken = default)
    {
        return await _context.Set<GroupMember>()
            .Where(m => m.GroupId == groupId)
            .GroupBy(m => m.Role)
            .ToDictionaryAsync(g => g.Key, g => g.Count(), cancellationToken);
    }

    public async Task<Dictionary<string, int>> GetMembersJoinedByMonthAsync(Guid groupId, int months = 12, CancellationToken cancellationToken = default)
    {
        var cutoffDate = DateTime.UtcNow.AddMonths(-months);
        
        return await _context.Set<GroupMember>()
            .Where(m => m.GroupId == groupId && m.JoinedAt >= cutoffDate)
            .GroupBy(m => new { m.JoinedAt.Year, m.JoinedAt.Month })
            .ToDictionaryAsync(
                g => $"{g.Key.Year}-{g.Key.Month:D2}",
                g => g.Count(),
                cancellationToken);
    }

    // Member validation
    public async Task<bool> IsMemberAsync(Guid groupId, Guid userId, CancellationToken cancellationToken = default)
    {
        return await _context.Set<GroupMember>()
            .AnyAsync(m => m.GroupId == groupId && m.UserId == userId, cancellationToken);
    }

    public async Task<bool> IsOwnerAsync(Guid groupId, Guid userId, CancellationToken cancellationToken = default)
    {
        return await _context.Set<Group>()
            .AnyAsync(g => g.Id == groupId && g.OwnerId == userId, cancellationToken);
    }

    public async Task<bool> IsModeratorAsync(Guid groupId, Guid userId, CancellationToken cancellationToken = default)
    {
        return await _context.Set<GroupMember>()
            .AnyAsync(m => m.GroupId == groupId && m.UserId == userId && 
                     (m.Role == "Moderator" || m.Role == "Admin"), cancellationToken);
    }

    public async Task<bool> CanInviteMembersAsync(Guid groupId, Guid userId, CancellationToken cancellationToken = default)
    {
        var isOwner = await IsOwnerAsync(groupId, userId, cancellationToken);
        if (isOwner) return true;

        return await IsModeratorAsync(groupId, userId, cancellationToken);
    }

    public async Task<bool> CanManageMembersAsync(Guid groupId, Guid userId, CancellationToken cancellationToken = default)
    {
        var isOwner = await IsOwnerAsync(groupId, userId, cancellationToken);
        if (isOwner) return true;

        return await IsModeratorAsync(groupId, userId, cancellationToken);
    }

    public async Task<bool> CanModerateAsync(Guid groupId, Guid userId, CancellationToken cancellationToken = default)
    {
        var isOwner = await IsOwnerAsync(groupId, userId, cancellationToken);
        if (isOwner) return true;

        return await _context.Set<GroupMember>()
            .AnyAsync(m => m.GroupId == groupId && m.UserId == userId && 
                     (m.Role == "Moderator" || m.Role == "Admin"), cancellationToken);
    }

    // Member operations
    public async Task AddMemberAsync(GroupMember member, CancellationToken cancellationToken = default)
    {
        await _context.Set<GroupMember>().AddAsync(member, cancellationToken);
    }

    public async Task RemoveMemberAsync(Guid groupId, Guid userId, CancellationToken cancellationToken = default)
    {
        var member = await _context.Set<GroupMember>()
            .FirstOrDefaultAsync(m => m.GroupId == groupId && m.UserId == userId, cancellationToken);
        
        if (member != null)
        {
            _context.Set<GroupMember>().Remove(member);
        }
    }

    public async Task UpdateMemberRoleAsync(Guid groupId, Guid userId, string newRole, CancellationToken cancellationToken = default)
    {
        var member = await _context.Set<GroupMember>()
            .FirstOrDefaultAsync(m => m.GroupId == groupId && m.UserId == userId, cancellationToken);
        
        if (member != null)
        {
            member.Role = newRole;
            _context.Set<GroupMember>().Update(member);
        }
    }

    public async Task UpdateMemberLastActivityAsync(Guid groupId, Guid userId, DateTime lastActivity, CancellationToken cancellationToken = default)
    {
        var member = await _context.Set<GroupMember>()
            .FirstOrDefaultAsync(m => m.GroupId == groupId && m.UserId == userId, cancellationToken);
        
        if (member != null)
        {
            member.LastActivity = lastActivity;
            _context.Set<GroupMember>().Update(member);
        }
    }

    public async Task SetMemberOnlineStatusAsync(Guid groupId, Guid userId, bool isOnline, CancellationToken cancellationToken = default)
    {
        var member = await _context.Set<GroupMember>()
            .FirstOrDefaultAsync(m => m.GroupId == groupId && m.UserId == userId, cancellationToken);
        
        if (member != null)
        {
            member.IsOnline = isOnline;
            if (isOnline)
            {
                member.LastActivity = DateTime.UtcNow;
            }
            _context.Set<GroupMember>().Update(member);
        }
    }
}