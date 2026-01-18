using Application.Common.DTOs;
using Application.Common.Models;
using Application.Features.Community.Groups.Interfaces;
using Domain.Entities.Community.Groups;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories.Community.Groups;

public class GroupBanRepository : Repository<GroupBan>, IGroupBanRepository
{
    public GroupBanRepository(ApplicationDbContext context) : base(context)
    {
    }

    // Ban queries
    public async Task<GroupBan?> GetByIdWithDetailsAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.Set<GroupBan>()
            .Include(b => b.Group)
            .Include(b => b.User)
            .Include(b => b.BannedByUser)
            .FirstOrDefaultAsync(b => b.Id == id, cancellationToken);
    }

    public async Task<GroupBan?> GetByGroupAndUserAsync(Guid groupId, Guid userId, CancellationToken cancellationToken = default)
    {
        return await _context.Set<GroupBan>()
            .Include(b => b.User)
            .Include(b => b.BannedByUser)
            .FirstOrDefaultAsync(b => b.GroupId == groupId && b.UserId == userId, cancellationToken);
    }

    public async Task<GroupBan?> GetActiveByGroupAndUserAsync(Guid groupId, Guid userId, CancellationToken cancellationToken = default)
    {
        return await _context.Set<GroupBan>()
            .Include(b => b.User)
            .Include(b => b.BannedByUser)
            .FirstOrDefaultAsync(b => b.GroupId == groupId && b.UserId == userId && 
                               b.IsActive && (b.BanUntil == null || b.BanUntil > DateTime.UtcNow), cancellationToken);
    }

    public async Task<IEnumerable<GroupBan>> GetGroupBansAsync(Guid groupId, CancellationToken cancellationToken = default)
    {
        return await _context.Set<GroupBan>()
            .Include(b => b.User)
            .Include(b => b.BannedByUser)
            .Where(b => b.GroupId == groupId)
            .OrderByDescending(b => b.BannedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<GroupBan>> GetActiveBansAsync(Guid groupId, CancellationToken cancellationToken = default)
    {
        return await _context.Set<GroupBan>()
            .Include(b => b.User)
            .Include(b => b.BannedByUser)
            .Where(b => b.GroupId == groupId && b.IsActive && 
                       (b.BanUntil == null || b.BanUntil > DateTime.UtcNow))
            .OrderByDescending(b => b.BannedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<GroupBan>> GetExpiredBansAsync(CancellationToken cancellationToken = default)
    {
        return await _context.Set<GroupBan>()
            .Where(b => b.IsActive && b.BanUntil != null && b.BanUntil <= DateTime.UtcNow)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<GroupBan>> GetUserBansAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        return await _context.Set<GroupBan>()
            .Include(b => b.Group)
            .Include(b => b.BannedByUser)
            .Where(b => b.UserId == userId)
            .OrderByDescending(b => b.BannedAt)
            .ToListAsync(cancellationToken);
    }

    // Paginated queries
    public async Task<PaginatedResult<GroupBan>> GetGroupBansPagedAsync(
        Guid groupId,
        int pageNumber,
        int pageSize,
        bool? activeOnly = null,
        CancellationToken cancellationToken = default)
    {
        var query = _context.Set<GroupBan>()
            .Include(b => b.User)
            .Include(b => b.BannedByUser)
            .Where(b => b.GroupId == groupId);

        if (activeOnly == true)
        {
            query = query.Where(b => b.IsActive && (b.BanUntil == null || b.BanUntil > DateTime.UtcNow));
        }

        query = query.OrderByDescending(b => b.BannedAt);

        var totalCount = await query.CountAsync(cancellationToken);
        var items = await query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        return new PaginatedResult<GroupBan>(items, totalCount, pageNumber, pageSize);
    }

    // Ban statistics
    public async Task<int> GetBanCountAsync(Guid groupId, CancellationToken cancellationToken = default)
    {
        return await _context.Set<GroupBan>()
            .CountAsync(b => b.GroupId == groupId, cancellationToken);
    }

    public async Task<int> GetActiveBanCountAsync(Guid groupId, CancellationToken cancellationToken = default)
    {
        return await _context.Set<GroupBan>()
            .CountAsync(b => b.GroupId == groupId && b.IsActive && 
                       (b.BanUntil == null || b.BanUntil > DateTime.UtcNow), cancellationToken);
    }

    public async Task<Dictionary<string, int>> GetBansByReasonAsync(Guid groupId, CancellationToken cancellationToken = default)
    {
        return await _context.Set<GroupBan>()
            .Where(b => b.GroupId == groupId)
            .GroupBy(b => b.Reason)
            .ToDictionaryAsync(g => g.Key, g => g.Count(), cancellationToken);
    }

    // Ban validation
    public async Task<bool> ExistsAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.Set<GroupBan>()
            .AnyAsync(b => b.Id == id, cancellationToken);
    }

    public async Task<bool> IsUserBannedAsync(Guid groupId, Guid userId, CancellationToken cancellationToken = default)
    {
        return await _context.Set<GroupBan>()
            .AnyAsync(b => b.GroupId == groupId && b.UserId == userId && 
                     b.IsActive && (b.BanUntil == null || b.BanUntil > DateTime.UtcNow), cancellationToken);
    }

    public async Task<bool> IsActiveBanAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.Set<GroupBan>()
            .AnyAsync(b => b.Id == id && b.IsActive && 
                     (b.BanUntil == null || b.BanUntil > DateTime.UtcNow), cancellationToken);
    }

    // Ban operations
    public async Task<bool> LiftBanAsync(Guid id, CancellationToken cancellationToken = default)
    {
        try
        {
            var ban = await _context.Set<GroupBan>()
                .FirstOrDefaultAsync(b => b.Id == id, cancellationToken);

            if (ban != null && ban.IsActive)
            {
                ban.IsActive = false;
                ban.UpdatedAt = DateTime.UtcNow;
                _context.Set<GroupBan>().Update(ban);
                return true;
            }
            return false;
        }
        catch
        {
            return false;
        }
    }

    public async Task<bool> ExtendBanAsync(Guid id, DateTime newExpiryDate, CancellationToken cancellationToken = default)
    {
        try
        {
            var ban = await _context.Set<GroupBan>()
                .FirstOrDefaultAsync(b => b.Id == id, cancellationToken);

            if (ban != null && ban.IsActive)
            {
                ban.BanUntil = newExpiryDate;
                ban.UpdatedAt = DateTime.UtcNow;
                _context.Set<GroupBan>().Update(ban);
                return true;
            }
            return false;
        }
        catch
        {
            return false;
        }
    }

    public async Task<int> ProcessExpiredBansAsync(CancellationToken cancellationToken = default)
    {
        try
        {
            var expiredBans = await GetExpiredBansAsync(cancellationToken);
            var count = 0;

            foreach (var ban in expiredBans)
            {
                ban.IsActive = false;
                ban.UpdatedAt = DateTime.UtcNow;
                _context.Set<GroupBan>().Update(ban);
                count++;
            }

            return count;
        }
        catch
        {
            return 0;
        }
    }
}