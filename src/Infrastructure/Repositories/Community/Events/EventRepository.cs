using Application.Common.DTOs;
using Application.Common.Models;
using Application.Features.Community.Events.Interfaces;
using Domain.Entities.Community.Events;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories.Community.Events;

public class EventRepository : Repository<Event>, IEventRepository
{
    public EventRepository(ApplicationDbContext context) : base(context)
    {
    }

    // Event queries
    public async Task<Event?> GetByIdWithDetailsAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.Set<Event>()
            .Include(e => e.Organizer)
            .FirstOrDefaultAsync(e => e.Id == id, cancellationToken);
    }

    public async Task<Event?> GetByIdWithAttendeesAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.Set<Event>()
            .Include(e => e.Attendances)
            .ThenInclude(a => a.User)
            .FirstOrDefaultAsync(e => e.Id == id, cancellationToken);
    }

    public async Task<Event?> GetByIdWithCommentsAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.Set<Event>()
            .Include(e => e.Comments.Take(10))
            .ThenInclude(c => c.CreatedByUser)
            .FirstOrDefaultAsync(e => e.Id == id, cancellationToken);
    }

    public async Task<IEnumerable<Event>> GetFeaturedEventsAsync(int count, CancellationToken cancellationToken = default)
    {
        return await _context.Set<Event>()
            .Where(e => e.IsFeatured && e.IsActive && e.IsPublic)
            .OrderByDescending(e => e.CreatedAt)
            .Take(count)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Event>> GetTrendingEventsAsync(string timeframe, int count, CancellationToken cancellationToken = default)
    {
        var cutoffDate = timeframe.ToLower() switch
        {
            "day" => DateTime.UtcNow.AddDays(-1),
            "week" => DateTime.UtcNow.AddDays(-7),
            "month" => DateTime.UtcNow.AddDays(-30),
            _ => DateTime.UtcNow.AddDays(-7)
        };

        return await _context.Set<Event>()
            .Where(e => e.IsActive && e.IsPublic && e.StartDate > DateTime.UtcNow)
            .Where(e => e.CreatedAt >= cutoffDate)
            .OrderByDescending(e => e.AttendeeCount)
            .ThenByDescending(e => e.CreatedAt)
            .Take(count)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Event>> GetPopularEventsAsync(int count, CancellationToken cancellationToken = default)
    {
        return await _context.Set<Event>()
            .Where(e => e.IsActive && e.IsPublic && e.StartDate > DateTime.UtcNow)
            .OrderByDescending(e => e.AttendeeCount)
            .Take(count)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Event>> GetUpcomingEventsAsync(int count, CancellationToken cancellationToken = default)
    {
        return await _context.Set<Event>()
            .Where(e => e.IsActive && e.IsPublic && e.StartDate > DateTime.UtcNow)
            .OrderBy(e => e.StartDate)
            .Take(count)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Event>> GetEventsByCategoryAsync(string category, CancellationToken cancellationToken = default)
    {
        return await _context.Set<Event>()
            .Where(e => e.Category.ToLower() == category.ToLower() && e.IsActive && e.IsPublic)
            .OrderBy(e => e.StartDate)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Event>> GetEventsByTypeAsync(string eventType, CancellationToken cancellationToken = default)
    {
        return await _context.Set<Event>()
            .Where(e => e.EventType.ToLower() == eventType.ToLower() && e.IsActive && e.IsPublic)
            .OrderBy(e => e.StartDate)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Event>> GetEventsByDateRangeAsync(DateTime fromDate, DateTime toDate, CancellationToken cancellationToken = default)
    {
        return await _context.Set<Event>()
            .Where(e => e.StartDate >= fromDate && e.StartDate <= toDate && e.IsActive && e.IsPublic)
            .OrderBy(e => e.StartDate)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Event>> GetUserEventsAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        return await _context.Set<Event>()
            .Where(e => e.Attendances.Any(a => a.UserId == userId && a.AttendanceType == "Going"))
            .OrderBy(e => e.StartDate)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Event>> GetUserOrganizedEventsAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        return await _context.Set<Event>()
            .Where(e => e.OrganizerId == userId)
            .OrderByDescending(e => e.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Event>> GetUserAttendingEventsAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        return await _context.Set<Event>()
            .Where(e => e.Attendances.Any(a => a.UserId == userId && a.AttendanceType == "Going" && a.IsApproved))
            .OrderBy(e => e.StartDate)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Event>> SearchEventsAsync(string searchTerm, CancellationToken cancellationToken = default)
    {
        return await _context.Set<Event>()
            .Where(e => e.IsActive && e.IsPublic)
            .Where(e => e.Title.Contains(searchTerm) || e.Description.Contains(searchTerm) || 
                       (e.Location != null && e.Location.Contains(searchTerm)))
            .OrderBy(e => e.StartDate)
            .ToListAsync(cancellationToken);
    }

    // Paginated queries
    public async Task<PaginatedResult<Event>> GetEventsPagedAsync(
        int pageNumber,
        int pageSize,
        string? category = null,
        string? eventType = null,
        string? searchTerm = null,
        string? location = null,
        DateTime? fromDate = null,
        DateTime? toDate = null,
        bool? isOnline = null,
        bool? isFree = null,
        bool? isPublic = null,
        bool? isActive = null,
        string? sortBy = null,
        bool sortDescending = false,
        CancellationToken cancellationToken = default)
    {
        var query = _context.Set<Event>().AsQueryable();

        // Apply filters
        if (!string.IsNullOrEmpty(category))
        {
            query = query.Where(e => e.Category.ToLower() == category.ToLower());
        }

        if (!string.IsNullOrEmpty(eventType))
        {
            query = query.Where(e => e.EventType.ToLower() == eventType.ToLower());
        }

        if (!string.IsNullOrEmpty(searchTerm))
        {
            query = query.Where(e => e.Title.Contains(searchTerm) || e.Description.Contains(searchTerm) ||
                                   (e.Location != null && e.Location.Contains(searchTerm)));
        }

        if (!string.IsNullOrEmpty(location))
        {
            query = query.Where(e => e.Location != null && e.Location.Contains(location));
        }

        if (fromDate.HasValue)
        {
            query = query.Where(e => e.StartDate >= fromDate.Value);
        }

        if (toDate.HasValue)
        {
            query = query.Where(e => e.StartDate <= toDate.Value);
        }

        if (isOnline.HasValue)
        {
            query = query.Where(e => e.IsOnline == isOnline.Value);
        }

        if (isFree.HasValue)
        {
            if (isFree.Value)
            {
                query = query.Where(e => !e.Price.HasValue || e.Price == 0);
            }
            else
            {
                query = query.Where(e => e.Price.HasValue && e.Price > 0);
            }
        }

        if (isPublic.HasValue)
        {
            query = query.Where(e => e.IsPublic == isPublic.Value);
        }

        if (isActive.HasValue)
        {
            query = query.Where(e => e.IsActive == isActive.Value);
        }

        // Apply sorting
        query = sortBy?.ToLower() switch
        {
            "title" => sortDescending ? query.OrderByDescending(e => e.Title) : query.OrderBy(e => e.Title),
            "attendeecount" => sortDescending ? query.OrderByDescending(e => e.AttendeeCount) : query.OrderBy(e => e.AttendeeCount),
            "createdat" => sortDescending ? query.OrderByDescending(e => e.CreatedAt) : query.OrderBy(e => e.CreatedAt),
            "price" => sortDescending ? query.OrderByDescending(e => e.Price ?? 0) : query.OrderBy(e => e.Price ?? 0),
            _ => sortDescending ? query.OrderByDescending(e => e.StartDate) : query.OrderBy(e => e.StartDate)
        };

        var totalCount = await query.CountAsync(cancellationToken);
        var items = await query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        return new PaginatedResult<Event>(items, totalCount, pageNumber, pageSize);
    }

    // Event statistics
    public async Task<int> GetEventCountAsync(CancellationToken cancellationToken = default)
    {
        return await _context.Set<Event>().CountAsync(cancellationToken);
    }

    public async Task<int> GetActiveEventCountAsync(CancellationToken cancellationToken = default)
    {
        return await _context.Set<Event>()
            .CountAsync(e => e.IsActive, cancellationToken);
    }

    public async Task<int> GetUpcomingEventCountAsync(CancellationToken cancellationToken = default)
    {
        return await _context.Set<Event>()
            .CountAsync(e => e.IsActive && e.StartDate > DateTime.UtcNow, cancellationToken);
    }

    public async Task<int> GetFeaturedEventCountAsync(CancellationToken cancellationToken = default)
    {
        return await _context.Set<Event>()
            .CountAsync(e => e.IsFeatured && e.IsActive, cancellationToken);
    }

    public async Task<Dictionary<string, int>> GetEventCountsByCategoryAsync(CancellationToken cancellationToken = default)
    {
        return await _context.Set<Event>()
            .Where(e => e.IsActive)
            .GroupBy(e => e.Category)
            .ToDictionaryAsync(g => g.Key, g => g.Count(), cancellationToken);
    }

    public async Task<Dictionary<string, int>> GetEventCountsByTypeAsync(CancellationToken cancellationToken = default)
    {
        return await _context.Set<Event>()
            .Where(e => e.IsActive)
            .GroupBy(e => e.EventType)
            .ToDictionaryAsync(g => g.Key, g => g.Count(), cancellationToken);
    }

    public async Task<Dictionary<string, int>> GetEventsByMonthAsync(int year, CancellationToken cancellationToken = default)
    {
        return await _context.Set<Event>()
            .Where(e => e.StartDate.Year == year && e.IsActive)
            .GroupBy(e => e.StartDate.Month)
            .ToDictionaryAsync(g => g.Key.ToString(), g => g.Count(), cancellationToken);
    }

    // Event validation
    public async Task<bool> ExistsAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.Set<Event>()
            .AnyAsync(e => e.Id == id, cancellationToken);
    }

    public async Task<bool> IsUserOrganizerAsync(Guid eventId, Guid userId, CancellationToken cancellationToken = default)
    {
        return await _context.Set<Event>()
            .AnyAsync(e => e.Id == eventId && e.OrganizerId == userId, cancellationToken);
    }

    public async Task<bool> CanUserEditEventAsync(Guid eventId, Guid userId, CancellationToken cancellationToken = default)
    {
        return await IsUserOrganizerAsync(eventId, userId, cancellationToken);
    }

    public async Task<bool> IsEventFullAsync(Guid eventId, CancellationToken cancellationToken = default)
    {
        var eventEntity = await _context.Set<Event>()
            .FirstOrDefaultAsync(e => e.Id == eventId, cancellationToken);

        if (eventEntity?.MaxAttendees == null) return false;

        var attendeeCount = await _context.Set<EventAttendance>()
            .CountAsync(a => a.EventId == eventId && a.AttendanceType == "Going" && a.IsApproved, cancellationToken);

        return attendeeCount >= eventEntity.MaxAttendees.Value;
    }

    public async Task<bool> IsEventActiveAsync(Guid eventId, CancellationToken cancellationToken = default)
    {
        return await _context.Set<Event>()
            .AnyAsync(e => e.Id == eventId && e.IsActive && e.Status == "Active", cancellationToken);
    }

    // Event operations
    public async Task<bool> UpdateEventAsync(Event eventEntity, CancellationToken cancellationToken = default)
    {
        try
        {
            _context.Set<Event>().Update(eventEntity);
            return true;
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
            var eventEntity = await _context.Set<Event>()
                .FirstOrDefaultAsync(e => e.Id == id, cancellationToken);

            if (eventEntity != null)
            {
                eventEntity.Status = "Cancelled";
                eventEntity.UpdatedAt = DateTime.UtcNow;
                _context.Set<Event>().Update(eventEntity);
                return true;
            }
            return false;
        }
        catch
        {
            return false;
        }
    }

    public async Task<bool> FeatureEventAsync(Guid id, CancellationToken cancellationToken = default)
    {
        try
        {
            var eventEntity = await _context.Set<Event>()
                .FirstOrDefaultAsync(e => e.Id == id, cancellationToken);

            if (eventEntity != null)
            {
                eventEntity.IsFeatured = true;
                eventEntity.UpdatedAt = DateTime.UtcNow;
                _context.Set<Event>().Update(eventEntity);
                return true;
            }
            return false;
        }
        catch
        {
            return false;
        }
    }

    public async Task<bool> UnfeatureEventAsync(Guid id, CancellationToken cancellationToken = default)
    {
        try
        {
            var eventEntity = await _context.Set<Event>()
                .FirstOrDefaultAsync(e => e.Id == id, cancellationToken);

            if (eventEntity != null)
            {
                eventEntity.IsFeatured = false;
                eventEntity.UpdatedAt = DateTime.UtcNow;
                _context.Set<Event>().Update(eventEntity);
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