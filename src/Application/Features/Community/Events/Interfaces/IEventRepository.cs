using Application.Common.DTOs;
using Domain.Entities.Community.Events;

namespace Application.Features.Community.Events.Interfaces
{
    public interface IEventRepository : IRepository<Event>
    {
        // Event queries
        Task<Event?> GetByIdWithDetailsAsync(Guid id, CancellationToken cancellationToken = default);
        Task<Event?> GetByIdWithAttendeesAsync(Guid id, CancellationToken cancellationToken = default);
        Task<Event?> GetByIdWithCommentsAsync(Guid id, CancellationToken cancellationToken = default);
        Task<IEnumerable<Event>> GetFeaturedEventsAsync(int count, CancellationToken cancellationToken = default);
        Task<IEnumerable<Event>> GetTrendingEventsAsync(string timeframe, int count, CancellationToken cancellationToken = default);
        Task<IEnumerable<Event>> GetPopularEventsAsync(int count, CancellationToken cancellationToken = default);
        Task<IEnumerable<Event>> GetUpcomingEventsAsync(int count, CancellationToken cancellationToken = default);
        Task<IEnumerable<Event>> GetEventsByCategoryAsync(string category, CancellationToken cancellationToken = default);
        Task<IEnumerable<Event>> GetEventsByTypeAsync(string eventType, CancellationToken cancellationToken = default);
        Task<IEnumerable<Event>> GetEventsByDateRangeAsync(DateTime fromDate, DateTime toDate, CancellationToken cancellationToken = default);
        Task<IEnumerable<Event>> GetUserEventsAsync(Guid userId, CancellationToken cancellationToken = default);
        Task<IEnumerable<Event>> GetUserOrganizedEventsAsync(Guid userId, CancellationToken cancellationToken = default);
        Task<IEnumerable<Event>> GetUserAttendingEventsAsync(Guid userId, CancellationToken cancellationToken = default);
        Task<IEnumerable<Event>> SearchEventsAsync(string searchTerm, CancellationToken cancellationToken = default);

        // Paginated queries
        Task<PaginatedResult<Event>> GetEventsPagedAsync(
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
            CancellationToken cancellationToken = default);

        // Event statistics
        Task<int> GetEventCountAsync(CancellationToken cancellationToken = default);
        Task<int> GetActiveEventCountAsync(CancellationToken cancellationToken = default);
        Task<int> GetUpcomingEventCountAsync(CancellationToken cancellationToken = default);
        Task<int> GetFeaturedEventCountAsync(CancellationToken cancellationToken = default);
        Task<Dictionary<string, int>> GetEventCountsByCategoryAsync(CancellationToken cancellationToken = default);
        Task<Dictionary<string, int>> GetEventCountsByTypeAsync(CancellationToken cancellationToken = default);
        Task<Dictionary<string, int>> GetEventsByMonthAsync(int year, CancellationToken cancellationToken = default);

        // Event validation
        Task<bool> ExistsAsync(Guid id, CancellationToken cancellationToken = default);
        Task<bool> IsUserOrganizerAsync(Guid eventId, Guid userId, CancellationToken cancellationToken = default);
        Task<bool> CanUserEditEventAsync(Guid eventId, Guid userId, CancellationToken cancellationToken = default);
        Task<bool> IsEventFullAsync(Guid eventId, CancellationToken cancellationToken = default);
        Task<bool> IsEventActiveAsync(Guid eventId, CancellationToken cancellationToken = default);

        // Event operations
        Task<bool> UpdateEventAsync(Event eventEntity, CancellationToken cancellationToken = default);
        Task<bool> CancelEventAsync(Guid id, string reason, CancellationToken cancellationToken = default);
        Task<bool> FeatureEventAsync(Guid id, CancellationToken cancellationToken = default);
        Task<bool> UnfeatureEventAsync(Guid id, CancellationToken cancellationToken = default);
    }
}
