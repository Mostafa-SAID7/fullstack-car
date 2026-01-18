using Application.Common.DTOs;
using Application.Common.Models;
using Application.Features.Community.Groups.Interfaces;
using Domain.Entities.Community.Groups;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories.Community.Groups;

public class GroupEventRepository : Repository<GroupEvent>, IGroupEventRepository
{
    public GroupEventRepository(ApplicationDbContext context) : base(context)
    {
    }

    // Event queries
    public async Task<GroupEvent?> GetByIdWithGroupAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.Set<GroupEvent>()
            .Include(e => e.Group)
            .FirstOrDefaultAsync(e => e.Id == id, cancellationToken);
    }

    public async Task<GroupEvent?> GetByIdWithAttendeesAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.Set<GroupEvent>()
            .Include(e => e.Attendances)
            .ThenInclude(a => a.User)
            .FirstOrDefaultAsync(e => e.Id == id, cancellationToken);
    }

    public async Task<IEnumerable<GroupEvent>> GetGroupEventsAsync(Guid groupId, CancellationToken cancellationToken = default)
    {
        return await _context.Set<GroupEvent>()
            .Where(e => e.GroupId == groupId)
            .OrderBy(e => e.StartDate)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<GroupEvent>> GetUpcomingEventsAsync(Guid groupId, CancellationToken cancellationToken = default)
    {
        return await _context.Set<GroupEvent>()
            .Where(e => e.GroupId == groupId && e.StartDate > DateTime.UtcNow && e.Status == "Active")
            .OrderBy(e => e.StartDate)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<GroupEvent>> GetEventsByTypeAsync(Guid groupId, string eventType, CancellationToken cancellationToken = default)
    {
        return await _context.Set<GroupEvent>()
            .Where(e => e.GroupId == groupId && e.EventType == eventType)
            .OrderBy(e => e.StartDate)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<GroupEvent>> GetEventsByDateRangeAsync(Guid groupId, DateTime fromDate, DateTime toDate, CancellationToken cancellationToken = default)
    {
        return await _context.Set<GroupEvent>()
            .Where(e => e.GroupId == groupId && e.StartDate >= fromDate && e.StartDate <= toDate)
            .OrderBy(e => e.StartDate)
            .ToListAsync(cancellationToken);
    }

    // Paginated queries
    public async Task<PaginatedResult<GroupEvent>> GetGroupEventsPagedAsync(
        Guid groupId,
        int pageNumber,
        int pageSize,
        bool? upcomingOnly = null,
        DateTime? fromDate = null,
        DateTime? toDate = null,
        string? eventType = null,
        CancellationToken cancellationToken = default)
    {
        var query = _context.Set<GroupEvent>()
            .Where(e => e.GroupId == groupId);

        // Apply filters
        if (upcomingOnly == true)
        {
            query = query.Where(e => e.StartDate > DateTime.UtcNow && e.Status == "Active");
        }

        if (fromDate.HasValue)
        {
            query = query.Where(e => e.StartDate >= fromDate.Value);
        }

        if (toDate.HasValue)
        {
            query = query.Where(e => e.StartDate <= toDate.Value);
        }

        if (!string.IsNullOrEmpty(eventType))
        {
            query = query.Where(e => e.EventType == eventType);
        }

        // Apply sorting
        query = query.OrderBy(e => e.StartDate);

        var totalCount = await query.CountAsync(cancellationToken);
        var items = await query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        return new PaginatedResult<GroupEvent>(items, totalCount, pageNumber, pageSize);
    }

    // Event statistics
    public async Task<int> GetEventCountAsync(Guid groupId, CancellationToken cancellationToken = default)
    {
        return await _context.Set<GroupEvent>()
            .CountAsync(e => e.GroupId == groupId, cancellationToken);
    }

    public async Task<int> GetUpcomingEventCountAsync(Guid groupId, CancellationToken cancellationToken = default)
    {
        return await _context.Set<GroupEvent>()
            .CountAsync(e => e.GroupId == groupId && e.StartDate > DateTime.UtcNow && e.Status == "Active", cancellationToken);
    }

    public async Task<Dictionary<string, int>> GetEventCountsByTypeAsync(Guid groupId, CancellationToken cancellationToken = default)
    {
        return await _context.Set<GroupEvent>()
            .Where(e => e.GroupId == groupId)
            .GroupBy(e => e.EventType)
            .ToDictionaryAsync(g => g.Key, g => g.Count(), cancellationToken);
    }

    public async Task<Dictionary<string, int>> GetEventsByMonthAsync(Guid groupId, int year, CancellationToken cancellationToken = default)
    {
        return await _context.Set<GroupEvent>()
            .Where(e => e.GroupId == groupId && e.StartDate.Year == year)
            .GroupBy(e => e.StartDate.Month)
            .ToDictionaryAsync(g => g.Key.ToString(), g => g.Count(), cancellationToken);
    }

    // Event validation
    public async Task<bool> ExistsAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.Set<GroupEvent>()
            .AnyAsync(e => e.Id == id, cancellationToken);
    }

    public async Task<bool> IsUserCreatorAsync(Guid eventId, Guid userId, CancellationToken cancellationToken = default)
    {
        return await _context.Set<GroupEvent>()
            .AnyAsync(e => e.Id == eventId && e.CreatedBy == userId, cancellationToken);
    }

    public async Task<bool> CanUserManageEventAsync(Guid eventId, Guid userId, CancellationToken cancellationToken = default)
    {
        var eventEntity = await _context.Set<GroupEvent>()
            .FirstOrDefaultAsync(e => e.Id == eventId, cancellationToken);

        if (eventEntity == null) return false;

        // Check if user is event creator
        if (eventEntity.CreatedBy == userId) return true;

        // Check if user is group owner or moderator
        var group = await _context.Set<Group>()
            .FirstOrDefaultAsync(g => g.Id == eventEntity.GroupId, cancellationToken);

        if (group?.OwnerId == userId) return true;

        return await _context.Set<GroupMember>()
            .AnyAsync(m => m.GroupId == eventEntity.GroupId && m.UserId == userId && 
                     (m.Role == "Moderator" || m.Role == "Admin"), cancellationToken);
    }

    // Event operations
    public async Task<bool> UpdateEventAsync(GroupEvent eventEntity, CancellationToken cancellationToken = default)
    {
        try
        {
            _context.Set<GroupEvent>().Update(eventEntity);
            return true;
        }
        catch
        {
            return false;
        }
    }

    public async Task<bool> DeleteEventAsync(Guid id, CancellationToken cancellationToken = default)
    {
        try
        {
            var eventEntity = await _context.Set<GroupEvent>()
                .FirstOrDefaultAsync(e => e.Id == id, cancellationToken);

            if (eventEntity != null)
            {
                _context.Set<GroupEvent>().Remove(eventEntity);
                return true;
            }
            return false;
        }
        catch
        {
            return false;
        }
    }

    public async Task<bool> CancelEventAsync(Guid id, string reason, CancellationToken cancellationToken = default)
    {
        try
        {
            var eventEntity = await _context.Set<GroupEvent>()
                .FirstOrDefaultAsync(e => e.Id == id, cancellationToken);

            if (eventEntity != null)
            {
                eventEntity.Status = "Cancelled";
                eventEntity.UpdatedAt = DateTime.UtcNow;
                _context.Set<GroupEvent>().Update(eventEntity);
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