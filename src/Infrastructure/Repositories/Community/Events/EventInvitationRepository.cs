using Application.Common.DTOs;
using Application.Common.Models;
using Application.Features.Community.Events.Interfaces;
using Domain.Entities.Community.Events;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories.Community.Events;

public class EventInvitationRepository : Repository<EventInvitation>, IEventInvitationRepository
{
    public EventInvitationRepository(ApplicationDbContext context) : base(context)
    {
    }

    // Invitation queries
    public async Task<EventInvitation?> GetByIdWithDetailsAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.Set<EventInvitation>()
            .Include(i => i.Event)
            .Include(i => i.InvitedByUser)
            .FirstOrDefaultAsync(i => i.Id == id, cancellationToken);
    }

    public async Task<EventInvitation?> GetByEventAndEmailAsync(Guid eventId, string email, CancellationToken cancellationToken = default)
    {
        return await _context.Set<EventInvitation>()
            .FirstOrDefaultAsync(i => i.EventId == eventId && i.Email.ToLower() == email.ToLower(), cancellationToken);
    }

    public async Task<IEnumerable<EventInvitation>> GetEventInvitationsAsync(Guid eventId, CancellationToken cancellationToken = default)
    {
        return await _context.Set<EventInvitation>()
            .Where(i => i.EventId == eventId)
            .Include(i => i.InvitedByUser)
            .OrderByDescending(i => i.InvitedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<EventInvitation>> GetUserInvitationsAsync(string email, CancellationToken cancellationToken = default)
    {
        return await _context.Set<EventInvitation>()
            .Where(i => i.Email.ToLower() == email.ToLower())
            .Include(i => i.Event)
            .Include(i => i.InvitedByUser)
            .OrderByDescending(i => i.InvitedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<EventInvitation>> GetPendingInvitationsAsync(CancellationToken cancellationToken = default)
    {
        return await _context.Set<EventInvitation>()
            .Where(i => i.Status == "Pending" && i.ExpiresAt > DateTime.UtcNow)
            .Include(i => i.Event)
            .OrderBy(i => i.ExpiresAt)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<EventInvitation>> GetExpiredInvitationsAsync(CancellationToken cancellationToken = default)
    {
        return await _context.Set<EventInvitation>()
            .Where(i => i.Status == "Pending" && i.ExpiresAt <= DateTime.UtcNow)
            .ToListAsync(cancellationToken);
    }

    // Paginated queries
    public async Task<PaginatedResult<EventInvitation>> GetEventInvitationsPagedAsync(
        Guid eventId,
        int pageNumber,
        int pageSize,
        string? status = null,
        string? sortBy = null,
        bool sortDescending = false,
        CancellationToken cancellationToken = default)
    {
        var query = _context.Set<EventInvitation>()
            .Where(i => i.EventId == eventId)
            .Include(i => i.InvitedByUser)
            .AsQueryable();

        // Apply status filter
        if (!string.IsNullOrEmpty(status))
        {
            query = query.Where(i => i.Status.ToLower() == status.ToLower());
        }

        // Apply sorting
        IOrderedQueryable<EventInvitation> orderedQuery = sortBy?.ToLower() switch
        {
            "email" => sortDescending ? query.OrderByDescending(i => i.Email) : query.OrderBy(i => i.Email),
            "status" => sortDescending ? query.OrderByDescending(i => i.Status) : query.OrderBy(i => i.Status),
            "expiresat" => sortDescending ? query.OrderByDescending(i => i.ExpiresAt) : query.OrderBy(i => i.ExpiresAt),
            _ => sortDescending ? query.OrderByDescending(i => i.InvitedAt) : query.OrderBy(i => i.InvitedAt)
        };

        var totalCount = await query.CountAsync(cancellationToken);
        var items = await orderedQuery
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        return new PaginatedResult<EventInvitation>(items, totalCount, pageNumber, pageSize);
    }

    // Invitation statistics
    public async Task<int> GetEventInvitationCountAsync(Guid eventId, CancellationToken cancellationToken = default)
    {
        return await _context.Set<EventInvitation>()
            .CountAsync(i => i.EventId == eventId, cancellationToken);
    }

    public async Task<int> GetPendingInvitationCountAsync(Guid eventId, CancellationToken cancellationToken = default)
    {
        return await _context.Set<EventInvitation>()
            .CountAsync(i => i.EventId == eventId && i.Status == "Pending", cancellationToken);
    }

    public async Task<int> GetAcceptedInvitationCountAsync(Guid eventId, CancellationToken cancellationToken = default)
    {
        return await _context.Set<EventInvitation>()
            .CountAsync(i => i.EventId == eventId && i.Status == "Accepted", cancellationToken);
    }

    public async Task<Dictionary<string, int>> GetInvitationStatusCountsAsync(Guid eventId, CancellationToken cancellationToken = default)
    {
        return await _context.Set<EventInvitation>()
            .Where(i => i.EventId == eventId)
            .GroupBy(i => i.Status)
            .ToDictionaryAsync(g => g.Key, g => g.Count(), cancellationToken);
    }

    // Invitation validation
    public async Task<bool> ExistsAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.Set<EventInvitation>()
            .AnyAsync(i => i.Id == id, cancellationToken);
    }

    public async Task<bool> IsInvitationValidAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.Set<EventInvitation>()
            .AnyAsync(i => i.Id == id && i.Status == "Pending" && i.ExpiresAt > DateTime.UtcNow, cancellationToken);
    }

    public async Task<bool> HasUserBeenInvitedAsync(Guid eventId, string email, CancellationToken cancellationToken = default)
    {
        return await _context.Set<EventInvitation>()
            .AnyAsync(i => i.EventId == eventId && i.Email.ToLower() == email.ToLower(), cancellationToken);
    }

    // Invitation operations
    public async Task<bool> UpdateInvitationStatusAsync(Guid id, string status, CancellationToken cancellationToken = default)
    {
        try
        {
            var invitation = await _context.Set<EventInvitation>()
                .FirstOrDefaultAsync(i => i.Id == id, cancellationToken);

            if (invitation != null)
            {
                invitation.Status = status;
                invitation.RespondedAt = DateTime.UtcNow;
                _context.Set<EventInvitation>().Update(invitation);
                return true;
            }
            return false;
        }
        catch
        {
            return false;
        }
    }

    public async Task<bool> AcceptInvitationAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await UpdateInvitationStatusAsync(id, "Accepted", cancellationToken);
    }

    public async Task<bool> DeclineInvitationAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await UpdateInvitationStatusAsync(id, "Declined", cancellationToken);
    }

    public async Task<bool> CancelInvitationAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await UpdateInvitationStatusAsync(id, "Cancelled", cancellationToken);
    }

    public async Task<bool> ExpireInvitationAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await UpdateInvitationStatusAsync(id, "Expired", cancellationToken);
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
                _context.Set<EventInvitation>().Update(invitation);
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