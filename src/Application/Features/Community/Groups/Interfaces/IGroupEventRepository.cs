using Application.Common.DTOs;
using Domain.Entities.Community.Groups;

namespace Application.Features.Community.Groups.Interfaces
{
    public interface IGroupEventRepository : IRepository<GroupEvent>
    {
        // Event queries
        Task<GroupEvent?> GetByIdWithGroupAsync(Guid id, CancellationToken cancellationToken = default);
        Task<GroupEvent?> GetByIdWithAttendeesAsync(Guid id, CancellationToken cancellationToken = default);
        Task<IEnumerable<GroupEvent>> GetGroupEventsAsync(Guid groupId, CancellationToken cancellationToken = default);
        Task<IEnumerable<GroupEvent>> GetUpcomingEventsAsync(Guid groupId, CancellationToken cancellationToken = default);
        Task<IEnumerable<GroupEvent>> GetEventsByTypeAsync(Guid groupId, string eventType, CancellationToken cancellationToken = default);
        Task<IEnumerable<GroupEvent>> GetEventsByDateRangeAsync(Guid groupId, DateTime fromDate, DateTime toDate, CancellationToken cancellationToken = default);

        // Paginated queries
        Task<PaginatedResult<GroupEvent>> GetGroupEventsPagedAsync(
            Guid groupId,
            int pageNumber,
            int pageSize,
            bool? upcomingOnly = null,
            DateTime? fromDate = null,
            DateTime? toDate = null,
            string? eventType = null,
            CancellationToken cancellationToken = default);

        // Event statistics
        Task<int> GetEventCountAsync(Guid groupId, CancellationToken cancellationToken = default);
        Task<int> GetUpcomingEventCountAsync(Guid groupId, CancellationToken cancellationToken = default);
        Task<Dictionary<string, int>> GetEventCountsByTypeAsync(Guid groupId, CancellationToken cancellationToken = default);
        Task<Dictionary<string, int>> GetEventsByMonthAsync(Guid groupId, int year, CancellationToken cancellationToken = default);

        // Event validation
        Task<bool> ExistsAsync(Guid id, CancellationToken cancellationToken = default);
        Task<bool> IsUserCreatorAsync(Guid eventId, Guid userId, CancellationToken cancellationToken = default);
        Task<bool> CanUserManageEventAsync(Guid eventId, Guid userId, CancellationToken cancellationToken = default);

        // Event operations
        Task<bool> UpdateEventAsync(GroupEvent eventEntity, CancellationToken cancellationToken = default);
        Task<bool> DeleteEventAsync(Guid id, CancellationToken cancellationToken = default);
        Task<bool> CancelEventAsync(Guid id, string reason, CancellationToken cancellationToken = default);
    }
}
