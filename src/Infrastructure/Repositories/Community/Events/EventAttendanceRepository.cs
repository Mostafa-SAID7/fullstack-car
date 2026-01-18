using Application.Common.DTOs;
using Application.Common.Models;
using Application.Features.Community.Events.Interfaces;
using Application.Features.Community.Events.Models;
using Domain.Entities.Community.Events;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories.Community.Events;

public class EventAttendanceRepository : Repository<EventAttendance>, IEventAttendanceRepository
{
    public EventAttendanceRepository(ApplicationDbContext context) : base(context)
    {
    }

    // Attendance queries
    public async Task<EventAttendance?> GetByEventAndUserAsync(Guid eventId, Guid userId, CancellationToken cancellationToken = default)
    {
        return await _context.Set<EventAttendance>()
            .Include(a => a.User)
            .Include(a => a.Event)
            .FirstOrDefaultAsync(a => a.EventId == eventId && a.UserId == userId, cancellationToken);
    }

    public async Task<IEnumerable<EventAttendance>> GetEventAttendeesAsync(Guid eventId, CancellationToken cancellationToken = default)
    {
        return await _context.Set<EventAttendance>()
            .Include(a => a.User)
            .Where(a => a.EventId == eventId)
            .OrderBy(a => a.ResponseDate)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<EventAttendance>> GetUserAttendancesAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        return await _context.Set<EventAttendance>()
            .Include(a => a.Event)
            .Where(a => a.UserId == userId)
            .OrderByDescending(a => a.ResponseDate)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<EventAttendance>> GetUserAttendancesByTypeAsync(Guid userId, string? type = null, CancellationToken cancellationToken = default)
    {
        var query = _context.Set<EventAttendance>()
            .Include(a => a.Event)
            .Where(a => a.UserId == userId);

        if (!string.IsNullOrEmpty(type))
        {
            query = query.Where(a => a.AttendanceType == type);
        }

        return await query
            .OrderByDescending(a => a.ResponseDate)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<EventAttendance>> GetAttendeesByTypeAsync(Guid eventId, string attendanceType, CancellationToken cancellationToken = default)
    {
        return await _context.Set<EventAttendance>()
            .Include(a => a.User)
            .Where(a => a.EventId == eventId && a.AttendanceType == attendanceType)
            .OrderBy(a => a.ResponseDate)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<EventAttendance>> GetPendingApprovalsAsync(Guid eventId, CancellationToken cancellationToken = default)
    {
        return await _context.Set<EventAttendance>()
            .Include(a => a.User)
            .Where(a => a.EventId == eventId && !a.IsApproved)
            .OrderBy(a => a.ResponseDate)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<EventAttendance>> GetCheckedInAttendeesAsync(Guid eventId, CancellationToken cancellationToken = default)
    {
        return await _context.Set<EventAttendance>()
            .Include(a => a.User)
            .Where(a => a.EventId == eventId && a.CheckedIn)
            .OrderByDescending(a => a.CheckedInAt)
            .ToListAsync(cancellationToken);
    }

    // Paginated queries
    public async Task<PaginatedResult<EventAttendance>> GetEventAttendeesPagedAsync(
        Guid eventId,
        int pageNumber,
        int pageSize,
        string? attendanceType = null,
        bool? isApproved = null,
        bool? checkedIn = null,
        string? searchTerm = null,
        CancellationToken cancellationToken = default)
    {
        var query = _context.Set<EventAttendance>()
            .Include(a => a.User)
            .Where(a => a.EventId == eventId);

        // Apply filters
        if (!string.IsNullOrEmpty(attendanceType))
        {
            query = query.Where(a => a.AttendanceType == attendanceType);
        }

        if (isApproved.HasValue)
        {
            query = query.Where(a => a.IsApproved == isApproved.Value);
        }

        if (checkedIn.HasValue)
        {
            query = query.Where(a => a.CheckedIn == checkedIn.Value);
        }

        if (!string.IsNullOrEmpty(searchTerm))
        {
            query = query.Where(a => a.User.UserName.Contains(searchTerm) || 
                                   a.User.Email.Contains(searchTerm));
        }

        query = query.OrderBy(a => a.ResponseDate);

        var totalCount = await query.CountAsync(cancellationToken);
        var items = await query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        return new PaginatedResult<EventAttendance>(items, totalCount, pageNumber, pageSize);
    }

    // Attendance statistics
    public async Task<int> GetAttendeeCountAsync(Guid eventId, CancellationToken cancellationToken = default)
    {
        return await _context.Set<EventAttendance>()
            .CountAsync(a => a.EventId == eventId, cancellationToken);
    }

    public async Task<int> GetAttendeeCountByTypeAsync(Guid eventId, string attendanceType, CancellationToken cancellationToken = default)
    {
        return await _context.Set<EventAttendance>()
            .CountAsync(a => a.EventId == eventId && a.AttendanceType == attendanceType, cancellationToken);
    }

    public async Task<int> GetPendingApprovalCountAsync(Guid eventId, CancellationToken cancellationToken = default)
    {
        return await _context.Set<EventAttendance>()
            .CountAsync(a => a.EventId == eventId && !a.IsApproved, cancellationToken);
    }

    public async Task<int> GetCheckedInCountAsync(Guid eventId, CancellationToken cancellationToken = default)
    {
        return await _context.Set<EventAttendance>()
            .CountAsync(a => a.EventId == eventId && a.CheckedIn, cancellationToken);
    }

    public async Task<Dictionary<string, int>> GetAttendanceStatsByTypeAsync(Guid eventId, CancellationToken cancellationToken = default)
    {
        return await _context.Set<EventAttendance>()
            .Where(a => a.EventId == eventId)
            .GroupBy(a => a.AttendanceType)
            .ToDictionaryAsync(g => g.Key, g => g.Count(), cancellationToken);
    }

    public async Task<EventAttendanceStats> GetAttendanceStatsAsync(Guid eventId, CancellationToken cancellationToken = default)
    {
        var attendances = await _context.Set<EventAttendance>()
            .Where(a => a.EventId == eventId)
            .ToListAsync(cancellationToken);

        var totalAttendees = attendances.Count;
        var goingCount = attendances.Count(a => a.AttendanceType == "Going");
        var maybeCount = attendances.Count(a => a.AttendanceType == "Maybe");
        var notGoingCount = attendances.Count(a => a.AttendanceType == "NotGoing");
        var pendingApprovalCount = attendances.Count(a => !a.IsApproved);
        var checkedInCount = attendances.Count(a => a.CheckedIn);

        var attendanceRate = goingCount > 0 ? (double)checkedInCount / goingCount * 100 : 0;

        return new EventAttendanceStats
        {
            TotalAttendees = totalAttendees,
            GoingCount = goingCount,
            MaybeCount = maybeCount,
            NotGoingCount = notGoingCount,
            PendingApprovalCount = pendingApprovalCount,
            CheckedInCount = checkedInCount,
            AttendanceRate = attendanceRate
        };
    }

    // Attendance validation
    public async Task<bool> IsUserAttendingAsync(Guid eventId, Guid userId, CancellationToken cancellationToken = default)
    {
        return await _context.Set<EventAttendance>()
            .AnyAsync(a => a.EventId == eventId && a.UserId == userId, cancellationToken);
    }

    public async Task<bool> IsUserApprovedAsync(Guid eventId, Guid userId, CancellationToken cancellationToken = default)
    {
        return await _context.Set<EventAttendance>()
            .AnyAsync(a => a.EventId == eventId && a.UserId == userId && a.IsApproved, cancellationToken);
    }

    public async Task<bool> IsUserCheckedInAsync(Guid eventId, Guid userId, CancellationToken cancellationToken = default)
    {
        return await _context.Set<EventAttendance>()
            .AnyAsync(a => a.EventId == eventId && a.UserId == userId && a.CheckedIn, cancellationToken);
    }

    // Attendance operations
    public async Task<bool> UpdateAttendanceAsync(Guid eventId, Guid userId, string attendanceType, string? notes = null, CancellationToken cancellationToken = default)
    {
        try
        {
            var attendance = await _context.Set<EventAttendance>()
                .FirstOrDefaultAsync(a => a.EventId == eventId && a.UserId == userId, cancellationToken);

            if (attendance != null)
            {
                attendance.AttendanceType = attendanceType;
                attendance.Notes = notes;
                attendance.ResponseDate = DateTime.UtcNow;
                _context.Set<EventAttendance>().Update(attendance);
                return true;
            }
            return false;
        }
        catch
        {
            return false;
        }
    }

    public async Task<bool> ApproveAttendanceAsync(Guid eventId, Guid userId, Guid approvedBy, CancellationToken cancellationToken = default)
    {
        try
        {
            var attendance = await _context.Set<EventAttendance>()
                .FirstOrDefaultAsync(a => a.EventId == eventId && a.UserId == userId, cancellationToken);

            if (attendance != null && !attendance.IsApproved)
            {
                attendance.IsApproved = true;
                attendance.ApprovedAt = DateTime.UtcNow;
                attendance.ApprovedBy = approvedBy;
                _context.Set<EventAttendance>().Update(attendance);
                return true;
            }
            return false;
        }
        catch
        {
            return false;
        }
    }

    public async Task<bool> CheckInAttendeeAsync(Guid eventId, Guid userId, CancellationToken cancellationToken = default)
    {
        try
        {
            var attendance = await _context.Set<EventAttendance>()
                .FirstOrDefaultAsync(a => a.EventId == eventId && a.UserId == userId, cancellationToken);

            if (attendance != null && attendance.IsApproved && !attendance.CheckedIn)
            {
                attendance.CheckedIn = true;
                attendance.CheckedInAt = DateTime.UtcNow;
                _context.Set<EventAttendance>().Update(attendance);
                return true;
            }
            return false;
        }
        catch
        {
            return false;
        }
    }

    public async Task<bool> RemoveAttendanceAsync(Guid eventId, Guid userId, CancellationToken cancellationToken = default)
    {
        try
        {
            var attendance = await _context.Set<EventAttendance>()
                .FirstOrDefaultAsync(a => a.EventId == eventId && a.UserId == userId, cancellationToken);

            if (attendance != null)
            {
                _context.Set<EventAttendance>().Remove(attendance);
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