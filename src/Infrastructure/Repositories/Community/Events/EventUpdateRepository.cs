using Application.Common.DTOs;
using Application.Common.Models;
using Application.Features.Community.Events.Interfaces;
using Domain.Entities.Community.Events;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories.Community.Events;

public class EventUpdateRepository : Repository<EventUpdate>, IEventUpdateRepository
{
    public EventUpdateRepository(ApplicationDbContext context) : base(context)
    {
    }

    // Update queries
    public async Task<EventUpdate?> GetByIdWithDetailsAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.Set<EventUpdate>()
            .Include(u => u.Event)
            .Include(u => u.CreatedByUser)
            .FirstOrDefaultAsync(u => u.Id == id, cancellationToken);
    }

    public async Task<IEnumerable<EventUpdate>> GetEventUpdatesAsync(Guid eventId, CancellationToken cancellationToken = default)
    {
        return await _context.Set<EventUpdate>()
            .Where(u => u.EventId == eventId)
            .Include(u => u.CreatedByUser)
            .OrderByDescending(u => u.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<EventUpdate>> GetEventUpdatesByTypeAsync(Guid eventId, string updateType, CancellationToken cancellationToken = default)
    {
        return await _context.Set<EventUpdate>()
            .Where(u => u.EventId == eventId && u.UpdateType.ToLower() == updateType.ToLower())
            .Include(u => u.CreatedByUser)
            .OrderByDescending(u => u.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<EventUpdate>> GetRecentUpdatesAsync(int count, CancellationToken cancellationToken = default)
    {
        return await _context.Set<EventUpdate>()
            .Include(u => u.Event)
            .Include(u => u.CreatedByUser)
            .OrderByDescending(u => u.CreatedAt)
            .Take(count)
            .ToListAsync(cancellationToken);
    }

    // Paginated queries
    public async Task<PaginatedResult<EventUpdate>> GetEventUpdatesPagedAsync(
        Guid eventId,
        int pageNumber,
        int pageSize,
        string? updateType = null,
        string? sortBy = null,
        bool sortDescending = false,
        CancellationToken cancellationToken = default)
    {
        var query = _context.Set<EventUpdate>()
            .Where(u => u.EventId == eventId)
            .Include(u => u.CreatedByUser)
            .AsQueryable();

        // Apply update type filter
        if (!string.IsNullOrEmpty(updateType))
        {
            query = query.Where(u => u.UpdateType.ToLower() == updateType.ToLower());
        }

        // Apply sorting
        IOrderedQueryable<EventUpdate> orderedQuery = sortBy?.ToLower() switch
        {
            "title" => sortDescending ? query.OrderByDescending(u => u.Title) : query.OrderBy(u => u.Title),
            "updatetype" => sortDescending ? query.OrderByDescending(u => u.UpdateType) : query.OrderBy(u => u.UpdateType),
            _ => sortDescending ? query.OrderByDescending(u => u.CreatedAt) : query.OrderBy(u => u.CreatedAt)
        };

        var totalCount = await query.CountAsync(cancellationToken);
        var items = await orderedQuery
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        return new PaginatedResult<EventUpdate>(items, totalCount, pageNumber, pageSize);
    }

    // Update statistics
    public async Task<int> GetEventUpdateCountAsync(Guid eventId, CancellationToken cancellationToken = default)
    {
        return await _context.Set<EventUpdate>()
            .CountAsync(u => u.EventId == eventId, cancellationToken);
    }

    public async Task<int> GetUpdateCountByTypeAsync(Guid eventId, string updateType, CancellationToken cancellationToken = default)
    {
        return await _context.Set<EventUpdate>()
            .CountAsync(u => u.EventId == eventId && u.UpdateType.ToLower() == updateType.ToLower(), cancellationToken);
    }

    public async Task<Dictionary<string, int>> GetUpdateTypeCountsAsync(Guid eventId, CancellationToken cancellationToken = default)
    {
        return await _context.Set<EventUpdate>()
            .Where(u => u.EventId == eventId)
            .GroupBy(u => u.UpdateType)
            .ToDictionaryAsync(g => g.Key, g => g.Count(), cancellationToken);
    }

    // Update validation
    public async Task<bool> ExistsAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.Set<EventUpdate>()
            .AnyAsync(u => u.Id == id, cancellationToken);
    }

    public async Task<bool> CanUserCreateUpdateAsync(Guid eventId, Guid userId, CancellationToken cancellationToken = default)
    {
        // Check if user is the event organizer
        return await _context.Set<Event>()
            .AnyAsync(e => e.Id == eventId && e.OrganizerId == userId, cancellationToken);
    }

    // Update operations
    public async Task<bool> UpdateEventUpdateAsync(EventUpdate update, CancellationToken cancellationToken = default)
    {
        try
        {
            _context.Set<EventUpdate>().Update(update);
            return true;
        }
        catch
        {
            return false;
        }
    }

    public async Task<bool> DeleteUpdateAsync(Guid id, CancellationToken cancellationToken = default)
    {
        try
        {
            var update = await _context.Set<EventUpdate>()
                .FirstOrDefaultAsync(u => u.Id == id, cancellationToken);

            if (update != null)
            {
                _context.Set<EventUpdate>().Remove(update);
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