using Application.Common.DTOs;
using Domain.Entities.Community.Events;

namespace Application.Features.Community.Events.Interfaces
{
    public interface IEventInvitationRepository : IRepository<EventInvitation>
    {
        // Invitation queries
        Task<EventInvitation?> GetByIdWithDetailsAsync(Guid id, CancellationToken cancellationToken = default);
        Task<EventInvitation?> GetByEventAndEmailAsync(Guid eventId, string email, CancellationToken cancellationToken = default);
        Task<IEnumerable<EventInvitation>> GetEventInvitationsAsync(Guid eventId, CancellationToken cancellationToken = default);
        Task<IEnumerable<EventInvitation>> GetUserInvitationsAsync(string email, CancellationToken cancellationToken = default);
        Task<IEnumerable<EventInvitation>> GetPendingInvitationsAsync(CancellationToken cancellationToken = default);
        Task<IEnumerable<EventInvitation>> GetExpiredInvitationsAsync(CancellationToken cancellationToken = default);

        // Paginated queries
        Task<PaginatedResult<EventInvitation>> GetEventInvitationsPagedAsync(
            Guid eventId,
            int pageNumber,
            int pageSize,
            string? status = null,
            string? sortBy = null,
            bool sortDescending = false,
            CancellationToken cancellationToken = default);

        // Invitation statistics
        Task<int> GetEventInvitationCountAsync(Guid eventId, CancellationToken cancellationToken = default);
        Task<int> GetPendingInvitationCountAsync(Guid eventId, CancellationToken cancellationToken = default);
        Task<int> GetAcceptedInvitationCountAsync(Guid eventId, CancellationToken cancellationToken = default);
        Task<Dictionary<string, int>> GetInvitationStatusCountsAsync(Guid eventId, CancellationToken cancellationToken = default);

        // Invitation validation
        Task<bool> ExistsAsync(Guid id, CancellationToken cancellationToken = default);
        Task<bool> IsInvitationValidAsync(Guid id, CancellationToken cancellationToken = default);
        Task<bool> HasUserBeenInvitedAsync(Guid eventId, string email, CancellationToken cancellationToken = default);

        // Invitation operations
        Task<bool> UpdateInvitationStatusAsync(Guid id, string status, CancellationToken cancellationToken = default);
        Task<bool> AcceptInvitationAsync(Guid id, CancellationToken cancellationToken = default);
        Task<bool> DeclineInvitationAsync(Guid id, CancellationToken cancellationToken = default);
        Task<bool> CancelInvitationAsync(Guid id, CancellationToken cancellationToken = default);
        Task<bool> ExpireInvitationAsync(Guid id, CancellationToken cancellationToken = default);
        Task<int> CleanupExpiredInvitationsAsync(CancellationToken cancellationToken = default);
    }
}