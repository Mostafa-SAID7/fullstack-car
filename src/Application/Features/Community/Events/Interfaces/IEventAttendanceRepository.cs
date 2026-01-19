using Application.Common.DTOs;
using Application.Features.Community.Events.Models;
using Domain.Entities.Community.Events;

namespace Application.Features.Community.Events.Interfaces
{
    public interface IEventAttendanceRepository : IRepository<EventAttendance>
    {
        // Attendance queries
        Task<EventAttendance?> GetByEventAndUserAsync(Guid eventId, Guid userId, CancellationToken cancellationToken = default);
        Task<IEnumerable<EventAttendance>> GetEventAttendeesAsync(Guid eventId, CancellationToken cancellationToken = default);
        Task<IEnumerable<EventAttendance>> GetUserAttendancesAsync(Guid userId, CancellationToken cancellationToken = default);
        Task<IEnumerable<EventAttendance>> GetUserAttendancesByTypeAsync(Guid userId, string? type = null, CancellationToken cancellationToken = default);
        Task<IEnumerable<EventAttendance>> GetAttendeesByTypeAsync(Guid eventId, string attendanceType, CancellationToken cancellationToken = default);
        Task<IEnumerable<EventAttendance>> GetPendingApprovalsAsync(Guid eventId, CancellationToken cancellationToken = default);
        Task<IEnumerable<EventAttendance>> GetCheckedInAttendeesAsync(Guid eventId, CancellationToken cancellationToken = default);

        // Paginated queries
        Task<PaginatedResult<EventAttendance>> GetEventAttendeesPagedAsync(
            Guid eventId,
            int pageNumber,
            int pageSize,
            string? attendanceType = null,
            bool? isApproved = null,
            bool? checkedIn = null,
            string? searchTerm = null,
            CancellationToken cancellationToken = default);

        // Attendance statistics
        Task<int> GetAttendeeCountAsync(Guid eventId, CancellationToken cancellationToken = default);
        Task<int> GetAttendeeCountByTypeAsync(Guid eventId, string attendanceType, CancellationToken cancellationToken = default);
        Task<int> GetPendingApprovalCountAsync(Guid eventId, CancellationToken cancellationToken = default);
        Task<int> GetCheckedInCountAsync(Guid eventId, CancellationToken cancellationToken = default);
        Task<Dictionary<string, int>> GetAttendanceStatsByTypeAsync(Guid eventId, CancellationToken cancellationToken = default);
        Task<EventAttendanceStats> GetAttendanceStatsAsync(Guid eventId, CancellationToken cancellationToken = default);

        // Attendance validation
        Task<bool> IsUserAttendingAsync(Guid eventId, Guid userId, CancellationToken cancellationToken = default);
        Task<bool> IsUserApprovedAsync(Guid eventId, Guid userId, CancellationToken cancellationToken = default);
        Task<bool> IsUserCheckedInAsync(Guid eventId, Guid userId, CancellationToken cancellationToken = default);

        // Attendance operations
        Task<bool> UpdateAttendanceAsync(Guid eventId, Guid userId, string attendanceType, string? notes = null, CancellationToken cancellationToken = default);
        Task<bool> ApproveAttendanceAsync(Guid eventId, Guid userId, Guid approvedBy, CancellationToken cancellationToken = default);
        Task<bool> CheckInAttendeeAsync(Guid eventId, Guid userId, CancellationToken cancellationToken = default);
        Task<bool> RemoveAttendanceAsync(Guid eventId, Guid userId, CancellationToken cancellationToken = default);
    }
}
