using Application.Common.Interfaces;
using Application.Common.DTOs;
using Application.Common.Models;
using Application.Features.Community.Groups.Interfaces;
using Domain.Entities.Community.Groups;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories.Community.Groups;

public class GroupRepository : Repository<Group>, IGroupRepository
{
    public GroupRepository(ApplicationDbContext context) : base(context)
    {
    }

    // Group queries
    public async Task<Group?> GetByIdWithMembersAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.Set<Group>()
            .Include(g => g.Members)
            .ThenInclude(m => m.User)
            .FirstOrDefaultAsync(g => g.Id == id, cancellationToken);
    }

    public async Task<Group?> GetByIdWithEventsAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.Set<Group>()
            .Include(g => g.Events)
            .FirstOrDefaultAsync(g => g.Id == id, cancellationToken);
    }

    public async Task<Group?> GetByIdWithDiscussionsAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.Set<Group>()
            .Include(g => g.Discussions)
            .FirstOrDefaultAsync(g => g.Id == id, cancellationToken);
    }

    public async Task<Group?> GetByNameAsync(string name, CancellationToken cancellationToken = default)
    {
        return await _context.Set<Group>()
            .FirstOrDefaultAsync(g => g.Name.ToLower() == name.ToLower(), cancellationToken);
    }

    public async Task<IEnumerable<Group>> GetFeaturedGroupsAsync(int count, CancellationToken cancellationToken = default)
    {
        return await _context.Set<Group>()
            .Where(g => g.IsFeatured && g.IsActive)
            .OrderByDescending(g => g.CreatedAt)
            .Take(count)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Group>> GetTrendingGroupsAsync(string timeframe, int count, CancellationToken cancellationToken = default)
    {
        var cutoffDate = timeframe.ToLower() switch
        {
            "day" => DateTime.UtcNow.AddDays(-1),
            "week" => DateTime.UtcNow.AddDays(-7),
            "month" => DateTime.UtcNow.AddDays(-30),
            _ => DateTime.UtcNow.AddDays(-7)
        };

        return await _context.Set<Group>()
            .Where(g => g.IsActive && g.IsPublic)
            .Where(g => g.LastActivity >= cutoffDate)
            .OrderByDescending(g => g.MemberCount)
            .ThenByDescending(g => g.LastActivity)
            .Take(count)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Group>> GetPopularGroupsAsync(int count, CancellationToken cancellationToken = default)
    {
        return await _context.Set<Group>()
            .Where(g => g.IsActive && g.IsPublic)
            .OrderByDescending(g => g.MemberCount)
            .ThenByDescending(g => g.PostCount)
            .Take(count)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Group>> GetGroupsByCategoryAsync(string category, CancellationToken cancellationToken = default)
    {
        return await _context.Set<Group>()
            .Where(g => g.Category.ToLower() == category.ToLower() && g.IsActive)
            .OrderByDescending(g => g.MemberCount)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Group>> SearchGroupsAsync(string searchTerm, CancellationToken cancellationToken = default)
    {
        return await _context.Set<Group>()
            .Where(g => g.IsActive && g.IsPublic)
            .Where(g => g.Name.Contains(searchTerm) || g.Description.Contains(searchTerm))
            .OrderByDescending(g => g.MemberCount)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Group>> GetUserGroupsAsync(Guid userId, string? role = null, CancellationToken cancellationToken = default)
    {
        var query = _context.Set<Group>()
            .Where(g => g.Members.Any(m => m.UserId == userId));

        if (!string.IsNullOrEmpty(role))
        {
            query = query.Where(g => g.Members.Any(m => m.UserId == userId && m.Role == role));
        }

        return await query
            .OrderByDescending(g => g.LastActivity)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Group>> GetUserOwnedGroupsAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        return await _context.Set<Group>()
            .Where(g => g.OwnerId == userId)
            .OrderByDescending(g => g.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task<PaginatedResult<Group>> GetGroupsPagedAsync(
        int pageNumber, 
        int pageSize, 
        string? category = null, 
        string? searchTerm = null, 
        string? sortBy = null, 
        bool sortDescending = false,
        bool? isPublic = null,
        bool? isActive = null,
        CancellationToken cancellationToken = default)
    {
        var query = _context.Set<Group>().AsQueryable();

        // Apply filters
        if (!string.IsNullOrEmpty(category))
        {
            query = query.Where(g => g.Category.ToLower() == category.ToLower());
        }

        if (!string.IsNullOrEmpty(searchTerm))
        {
            query = query.Where(g => g.Name.Contains(searchTerm) || g.Description.Contains(searchTerm));
        }

        if (isPublic.HasValue)
        {
            query = query.Where(g => g.IsPublic == isPublic.Value);
        }

        if (isActive.HasValue)
        {
            query = query.Where(g => g.IsActive == isActive.Value);
        }

        // Apply sorting
        query = sortBy?.ToLower() switch
        {
            "name" => sortDescending ? query.OrderByDescending(g => g.Name) : query.OrderBy(g => g.Name),
            "membercount" => sortDescending ? query.OrderByDescending(g => g.MemberCount) : query.OrderBy(g => g.MemberCount),
            "lastactivity" => sortDescending ? query.OrderByDescending(g => g.LastActivity) : query.OrderBy(g => g.LastActivity),
            _ => sortDescending ? query.OrderByDescending(g => g.CreatedAt) : query.OrderBy(g => g.CreatedAt)
        };

        var totalCount = await query.CountAsync(cancellationToken);
        var items = await query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        return new PaginatedResult<Group>(items, totalCount, pageNumber, pageSize);
    }

    // Group membership
    public async Task<bool> IsUserMemberAsync(Guid groupId, Guid userId, CancellationToken cancellationToken = default)
    {
        return await _context.Set<GroupMember>()
            .AnyAsync(m => m.GroupId == groupId && m.UserId == userId, cancellationToken);
    }

    public async Task<bool> IsUserOwnerAsync(Guid groupId, Guid userId, CancellationToken cancellationToken = default)
    {
        return await _context.Set<Group>()
            .AnyAsync(g => g.Id == groupId && g.OwnerId == userId, cancellationToken);
    }

    public async Task<bool> IsUserModeratorAsync(Guid groupId, Guid userId, CancellationToken cancellationToken = default)
    {
        return await _context.Set<GroupMember>()
            .AnyAsync(m => m.GroupId == groupId && m.UserId == userId && 
                     (m.Role == "Moderator" || m.Role == "Admin"), cancellationToken);
    }

    public async Task<bool> IsUserBannedAsync(Guid groupId, Guid userId, CancellationToken cancellationToken = default)
    {
        return await _context.Set<GroupBan>()
            .AnyAsync(b => b.GroupId == groupId && b.UserId == userId && 
                     (b.BanUntil == null || b.BanUntil > DateTime.UtcNow), cancellationToken);
    }

    public async Task<string?> GetUserRoleAsync(Guid groupId, Guid userId, CancellationToken cancellationToken = default)
    {
        var member = await _context.Set<GroupMember>()
            .FirstOrDefaultAsync(m => m.GroupId == groupId && m.UserId == userId, cancellationToken);
        
        return member?.Role;
    }

    // Group statistics
    public async Task<int> GetGroupCountAsync(CancellationToken cancellationToken = default)
    {
        return await _context.Set<Group>().CountAsync(cancellationToken);
    }

    public async Task<int> GetActiveGroupCountAsync(CancellationToken cancellationToken = default)
    {
        return await _context.Set<Group>()
            .CountAsync(g => g.IsActive, cancellationToken);
    }

    public async Task<int> GetPublicGroupCountAsync(CancellationToken cancellationToken = default)
    {
        return await _context.Set<Group>()
            .CountAsync(g => g.IsPublic && g.IsActive, cancellationToken);
    }

    public async Task<int> GetPrivateGroupCountAsync(CancellationToken cancellationToken = default)
    {
        return await _context.Set<Group>()
            .CountAsync(g => !g.IsPublic && g.IsActive, cancellationToken);
    }

    public async Task<int> GetFeaturedGroupCountAsync(CancellationToken cancellationToken = default)
    {
        return await _context.Set<Group>()
            .CountAsync(g => g.IsFeatured && g.IsActive, cancellationToken);
    }

    public async Task<Dictionary<string, int>> GetGroupCountsByCategoryAsync(CancellationToken cancellationToken = default)
    {
        return await _context.Set<Group>()
            .Where(g => g.IsActive)
            .GroupBy(g => g.Category)
            .ToDictionaryAsync(g => g.Key, g => g.Count(), cancellationToken);
    }

    // Group validation
    public async Task<bool> ExistsAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.Set<Group>()
            .AnyAsync(g => g.Id == id, cancellationToken);
    }

    public async Task<bool> ExistsByNameAsync(string name, CancellationToken cancellationToken = default)
    {
        return await _context.Set<Group>()
            .AnyAsync(g => g.Name.ToLower() == name.ToLower(), cancellationToken);
    }

    public async Task<bool> CanUserCreateGroupAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        const int maxGroupsPerUser = 10; // This could be configurable
        var userGroupCount = await GetUserOwnedGroupCountAsync(userId, cancellationToken);
        return userGroupCount < maxGroupsPerUser;
    }

    public async Task<int> GetUserGroupCountAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        return await _context.Set<GroupMember>()
            .CountAsync(m => m.UserId == userId, cancellationToken);
    }

    public async Task<int> GetUserOwnedGroupCountAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        return await _context.Set<Group>()
            .CountAsync(g => g.OwnerId == userId, cancellationToken);
    }
}