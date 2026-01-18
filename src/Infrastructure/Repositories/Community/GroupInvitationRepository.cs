using Application.Common.DTOs;
using Application.Features.Community.Groups.Interfaces;
using Domain.Entities.Community.Groups;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories.Community;

public class GroupInvitationRepository : Repository<GroupInvitation>, IGroupInvitationRepository
{
    public GroupInvitationRepository(ApplicationDbContext context) : base(context)
    {
    }

    // Invitation queries
    public async Task<GroupInvitation?> GetByIdWithGroupAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.Set<GroupInvitation>()
            .Include(i => i.Group)
            .FirstOrDefaultAsync(i => i.Id == id, cancellationToken);
    }

    public async Task<GroupInvitation?> GetByGroupAndEmailAsync(Guid groupId, string email, CancellationToken cancellationToken = default)
    {
        return await _context.Set<GroupInvitation>()
            .FirstOrDefaultAsync(i => i.GroupId == groupId && i.Email.ToLower() == email.ToLower(), cancellationToken);
    }

    public async Task<IEnumerable<GroupInvitation>> GetGroupInvitationsAsync(Guid groupId, CancellationToken cancellationToken = default)
    {
        return await _context.Set<GroupInvitation>()
            .Where(i => i.GroupId == groupId)
            .OrderByDescending(i => i.InvitedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<GroupInvitation>> GetUserInvitationsAsync(string email, CancellationToken cancellationToken = default)
    {
        return await _context.Set<GroupInvitation>()
            .Include(i => i.Group)
            .Where(i => i.Email.ToLower() == email.ToLower())
            .OrderByDescending(i => i.InvitedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<GroupInvitation>> GetPendingInvitationsAsync(Guid groupId, CancellationToken cancellationToken = default)
    {
        return await _context.Set<GroupInvitation>()
            .Where(i => i.GroupId == groupId && i.Status == "Pending" && 
                       (i.ExpiresAt == null || i.ExpiresAt > DateTime.UtcNow))
            .OrderByDescending(i => i.InvitedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<GroupInvitation>> GetExpiredInvitationsAsync(CancellationToken cancellationToken = default)
    {
        return await _context.Set<GroupInvitation>()
            .Where(i => i.Status == "Pending" && i.ExpiresAt != null && i.ExpiresAt <= DateTime.UtcNow)
            .ToListAsync(cancellationToken);
    }

    // Paginated queries
    public async Task<PaginatedResult<GroupInvitation>> GetGroupInvitationsPagedAsync(
        Guid groupId,
        int pageNumber,
        int pageSize,
        string? status = null,
        CancellationToken cancellationToken = default)
    {
        var query = _context.Set<GroupInvitation>()
            .Where(i => i.GroupId == groupId);

        if (!string.IsNullOrEmpty(status))
        {
            query = query.Where(i => i.Status == status);
        }

        query = query.OrderByDescending(i => i.InvitedAt);

        var totalCount = await query.CountAsync(cancellationToken);
        var items = await query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        return new PaginatedResult<GroupInvitation>
        {
            Items = items,
            TotalCount = totalCount,
            PageNumber = pageNumber,
            PageSize = pageSize,
            TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize)
        };
    }

    public async Task<PaginatedResult<GroupInvitation>> GetUserInvitationsPagedAsync(
        string email,
        int pageNumber,
        int pageSize,
        string? status = null,
        CancellationToken cancellationToken = default)
    {
        var query = _context.Set<GroupInvitation>()
            .Include(i => i.Group)
            .Where(i => i.Email.ToLower() == email.ToLower());

        if (!string.IsNullOrEmpty(status))
        {
            query = query.Where(i => i.Status == status);
        }

        query = query.OrderByDescending(i => i.InvitedAt);

        var totalCount = await query.CountAsync(cancellationToken);
        var items = await query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        return new PaginatedResult<GroupInvitation>
        {
            Items = items,
            TotalCount = totalCount,
            PageNumber = pageNumber,
            PageSize = pageSize,
            TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize)
        };
    }

    // Invitation statistics
    public async Task<int> GetInvitationCountAsync(Guid groupId, CancellationToken cancellationToken = default)
    {
        return await _context.Set<GroupInvitation>()
            .CountAsync(i => i.GroupId == groupId, cancellationToken);
    }

    public async Task<int> GetPendingInvitationCountAsync(Guid groupId, CancellationToken cancellationToken = default)
    {
        return await _context.Set<GroupInvitation>()
            .CountAsync(i => i.GroupId == groupId && i.Status == "Pending" && 
                       (i.ExpiresAt == null || i.ExpiresAt > DateTime.UtcNow), cancellationToken);
    }

    public async Task<Dictionary<string, int>> GetInvitationCountsByStatusAsync(Guid groupId, CancellationToken cancellationToken = default)
    {
        return await _context.Set<GroupInvitation>()
            .Where(i => i.GroupId == groupId)
            .GroupBy(i => i.Status)
            .ToDictionaryAsync(g => g.Key, g => g.Count(), cancellationToken);
    }

    // Invitation validation
    public async Task<bool> ExistsAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.Set<GroupInvitation>()
            .AnyAsync(i => i.Id == id, cancellationToken);
    }

    public async Task<bool> HasPendingInvitationAsync(Guid groupId, string email, CancellationToken cancellationToken = default)
    {
        return await _context.Set<GroupInvitation>()
            .AnyAsync(i => i.GroupId == groupId && i.Email.ToLower() == email.ToLower() && 
                     i.Status == "Pending" && (i.ExpiresAt == null || i.ExpiresAt > DateTime.UtcNow), cancellationToken);
    }

    public async Task<bool> IsInvitationValidAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.Set<GroupInvitation>()
            .AnyAsync(i => i.Id == id && i.Status == "Pending" && 
                     (i.ExpiresAt == null || i.ExpiresAt > DateTime.UtcNow), cancellationToken);
    }

    // Invitation operations
    public async Task<bool> AcceptInvitationAsync(Guid id, CancellationToken cancellationToken = default)
    {
        try
        {
            var invitation = await _context.Set<GroupInvitation>()
                .FirstOrDefaultAsync(i => i.Id == id, cancellationToken);

            if (invitation != null && invitation.Status == "Pending")
            {
                invitation.Status = "Accepted";
                invitation.AcceptedAt = DateTime.UtcNow;
                _context.Set<GroupInvitation>().Update(invitation);
                return true;
            }
            return false;
        }
        catch
        {
            return false;
        }
    }

    public async Task<bool> RejectInvitationAsync(Guid id, CancellationToken cancellationToken = default)
    {
        try
        {
            var invitation = await _context.Set<GroupInvitation>()
                .FirstOrDefaultAsync(i => i.Id == id, cancellationToken);

            if (invitation != null && invitation.Status == "Pending")
            {
                invitation.Status = "Rejected";
                _context.Set<GroupInvitation>().Update(invitation);
                return true;
            }
            return false;
        }
        catch
        {
            return false;
        }
    }

    public async Task<bool> CancelInvitationAsync(Guid id, CancellationToken cancellationToken = default)
    {
        try
        {
            var invitation = await _context.Set<GroupInvitation>()
                .FirstOrDefaultAsync(i => i.Id == id, cancellationToken);

            if (invitation != null && invitation.Status == "Pending")
            {
                invitation.Status = "Cancelled";
                _context.Set<GroupInvitation>().Update(invitation);
                return true;
            }
            return false;
        }
        catch
        {
            return false;
        }
    }

    public async Task<int> CleanupExpiredInvitationsAsync(CancellationToken cancellationToken = default)
    {
        try
        {
            var expiredInvitations = await GetExpiredInvitationsAsync(cancellationToken);
            var count = 0;

            foreach (var invitation in expiredInvitations)
            {
                invitation.Status = "Expired";
                _context.Set<GroupInvitation>().Update(invitation);
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