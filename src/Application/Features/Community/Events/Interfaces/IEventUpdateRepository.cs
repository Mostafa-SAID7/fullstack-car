using Application.Common.DTOs;
using Domain.Entities.Community.Events;

namespace Application.Features.Community.Events.Interfaces
{
    public interface IEventUpdateRepository : IRepository<EventUpdate>
    {
        // Update queries
        Task<EventUpdate?> GetByIdWithDetailsAsync(Guid id, CancellationToken cancellationToken = default);
        Task<IEnumerable<EventUpdate>> GetEventUpdatesAsync(Guid eventId, CancellationToken cancellationToken = default);
        Task<IEnumerable<EventUpdate>> GetEventUpdatesByTypeAsync(Guid eventId, string updateType, CancellationToken cancellationToken = default);
        Task<IEnumerable<EventUpdate>> GetRecentUpdatesAsync(int count, CancellationToken cancellationToken = default);

        // Paginated queries
        Task<PaginatedResult<EventUpdate>> GetEventUpdatesPagedAsync(
            Guid eventId,
            int pageNumber,
            int pageSize,
            string? updateType = null,
            string? sortBy = null,
            bool sortDescending = false,
            CancellationToken cancellationToken = default);

        // Update statistics
        Task<int> GetEventUpdateCountAsync(Guid eventId, CancellationToken cancellationToken = default);
        Task<int> GetUpdateCountByTypeAsync(Guid eventId, string updateType, CancellationToken cancellationToken = default);
        Task<Dictionary<string, int>> GetUpdateTypeCountsAsync(Guid eventId, CancellationToken cancellationToken = default);

        // Update validation
        Task<bool> ExistsAsync(Guid id, CancellationToken cancellationToken = default);
        Task<bool> CanUserCreateUpdateAsync(Guid eventId, Guid userId, CancellationToken cancellationToken = default);

        // Update operations
        Task<bool> UpdateEventUpdateAsync(EventUpdate update, CancellationToken cancellationToken = default);
        Task<bool> DeleteUpdateAsync(Guid id, CancellationToken cancellationToken = default);
    }
}