using Application.Common.DTOs;
using Application.Common.Models;
using Application.Features.Community.Groups.Interfaces;
using Domain.Entities.Community.Groups;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories.Community.Groups;

public class GroupJoinRequestRepository : Repository<GroupJoinRequest>, IGroupJoinRequestRepository
{
    public GroupJoinRequestRepository(ApplicationDbContext context) : base(context)
    {
    }

    // Join request queries
    public async Task<GroupJoinRequest?> GetByIdWithDetailsAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.Set<GroupJoinRequest>()
            .Include(r => r.Group)
            .Include(r => r.User)
            .Include(r => r.ProcessedByUser)
            .FirstOrDefaultAsync(r => r.Id == id, cancellationToken);
    }

    public async Task<GroupJoinRequest?> GetByGroupAndUserAsync(Guid groupId, Guid userId, CancellationToken cancellationToken = default)
    {
        return await _context.Set<GroupJoinRequest>()
            .Include(r => r.User)
            .FirstOrDefaultAsync(r => r.GroupId == groupId && r.UserId == userId, cancellationToken);
    }

    public async Task<GroupJoinRequest?> GetPendingByGroupAndUserAsync(Guid groupId, Guid userId, CancellationToken cancellationToken = default)
    {
        return await _context.Set<GroupJoinRequest>()
            .Include(r => r.User)
            .FirstOrDefaultAsync(r => r.GroupId == groupId && r.UserId == userId && r.Status == "Pending", cancellationToken);
    }

    public async Task<IEnumerable<GroupJoinRequest>> GetGroupJoinRequestsAsync(Guid groupId, CancellationToken cancellationToken = default)
    {
        return await _context.Set<GroupJoinRequest>()
            .Include(r => r.User)
            .Include(r => r.ProcessedByUser)
            .Where(r => r.GroupId == groupId)
            .OrderByDescending(r => r.RequestedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<GroupJoinRequest>> GetPendingJoinRequestsAsync(Guid groupId, CancellationToken cancellationToken = default)
    {
        return await _context.Set<GroupJoinRequest>()
            .Include(r => r.User)
            .Where(r => r.GroupId == groupId && r.Status == "Pending")
            .OrderByDescending(r => r.RequestedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<GroupJoinRequest>> GetUserJoinRequestsAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        return await _context.Set<GroupJoinRequest>()
            .Include(r => r.Group)
            .Include(r => r.ProcessedByUser)
            .Where(r => r.UserId == userId)
            .OrderByDescending(r => r.RequestedAt)
            .ToListAsync(cancellationToken);
    }

    // Paginated queries
    public async Task<PaginatedResult<GroupJoinRequest>> GetGroupJoinRequestsPagedAsync(
        Guid groupId,
        int pageNumber,
        int pageSize,
        string? status = null,
        CancellationToken cancellationToken = default)
    {
        var query = _context.Set<GroupJoinRequest>()
            .Include(r => r.User)
            .Include(r => r.ProcessedByUser)
            .Where(r => r.GroupId == groupId);

        if (!string.IsNullOrEmpty(status))
        {
            query = query.Where(r => r.Status == status);
        }

        query = query.OrderByDescending(r => r.RequestedAt);

        var totalCount = await query.CountAsync(cancellationToken);
        var items = await query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        return new PaginatedResult<GroupJoinRequest>(items, totalCount, pageNumber, pageSize);
    }

    // Join request statistics
    public async Task<int> GetJoinRequestCountAsync(Guid groupId, CancellationToken cancellationToken = default)
    {
        return await _context.Set<GroupJoinRequest>()
            .CountAsync(r => r.GroupId == groupId, cancellationToken);
    }

    public async Task<int> GetPendingJoinRequestCountAsync(Guid groupId, CancellationToken cancellationToken = default)
    {
        return await _context.Set<GroupJoinRequest>()
            .CountAsync(r => r.GroupId == groupId && r.Status == "Pending", cancellationToken);
    }

    public async Task<Dictionary<string, int>> GetJoinRequestCountsByStatusAsync(Guid groupId, CancellationToken cancellationToken = default)
    {
        return await _context.Set<GroupJoinRequest>()
            .Where(r => r.GroupId == groupId)
            .GroupBy(r => r.Status)
            .ToDictionaryAsync(g => g.Key, g => g.Count(), cancellationToken);
    }

    // Join request validation
    public async Task<bool> ExistsAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.Set<GroupJoinRequest>()
            .AnyAsync(r => r.Id == id, cancellationToken);
    }

    public async Task<bool> HasPendingRequestAsync(Guid groupId, Guid userId, CancellationToken cancellationToken = default)
    {
        return await _context.Set<GroupJoinRequest>()
            .AnyAsync(r => r.GroupId == groupId && r.UserId == userId && r.Status == "Pending", cancellationToken);
    }

    // Join request operations
    public async Task<bool> ApproveRequestAsync(Guid id, Guid approvedBy, string? welcomeMessage = null, CancellationToken cancellationToken = default)
    {
        try
        {
            var request = await _context.Set<GroupJoinRequest>()
                .FirstOrDefaultAsync(r => r.Id == id, cancellationToken);

            if (request != null && request.Status == "Pending")
            {
                request.Status = "Approved";
                request.ProcessedBy = approvedBy;
                request.ProcessedAt = DateTime.UtcNow;
                request.ProcessingReason = welcomeMessage;
                _context.Set<GroupJoinRequest>().Update(request);
                return true;
            }
            return false;
        }
        catch
        {
            return false;
        }
    }

    public async Task<bool> RejectRequestAsync(Guid id, Guid rejectedBy, string reason, CancellationToken cancellationToken = default)
    {
        try
        {
            var request = await _context.Set<GroupJoinRequest>()
                .FirstOrDefaultAsync(r => r.Id == id, cancellationToken);

            if (request != null && request.Status == "Pending")
            {
                request.Status = "Rejected";
                request.ProcessedBy = rejectedBy;
                request.ProcessedAt = DateTime.UtcNow;
                request.ProcessingReason = reason;
                _context.Set<GroupJoinRequest>().Update(request);
                return true;
            }
            return false;
        }
        catch
        {
            return false;
        }
    }

    public async Task<bool> CancelRequestAsync(Guid id, CancellationToken cancellationToken = default)
    {
        try
        {
            var request = await _context.Set<GroupJoinRequest>()
                .FirstOrDefaultAsync(r => r.Id == id, cancellationToken);

            if (request != null && request.Status == "Pending")
            {
                request.Status = "Cancelled";
                request.ProcessedAt = DateTime.UtcNow;
                _context.Set<GroupJoinRequest>().Update(request);
                return true;
            }
            return false;
        }
        catch
        {
            return false;
        }
    }
}