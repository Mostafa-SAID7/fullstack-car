using Application.Common.DTOs;
using Domain.Entities.Community.Groups;

namespace Application.Features.Community.Groups.Interfaces
{
    public interface IGroupInvitationRepository : IRepository<GroupInvitation>
    {
        // Invitation queries
        Task<GroupInvitation?> GetByIdWithGroupAsync(Guid id, CancellationToken cancellationToken = default);
        Task<GroupInvitation?> GetByGroupAndEmailAsync(Guid groupId, string email, CancellationToken cancellationToken = default);
        Task<IEnumerable<GroupInvitation>> GetGroupInvitationsAsync(Guid groupId, CancellationToken cancellationToken = default);
        Task<IEnumerable<GroupInvitation>> GetUserInvitationsAsync(string email, CancellationToken cancellationToken = default);
        Task<IEnumerable<GroupInvitation>> GetPendingInvitationsAsync(Guid groupId, CancellationToken cancellationToken = default);
        Task<IEnumerable<GroupInvitation>> GetExpiredInvitationsAsync(CancellationToken cancellationToken = default);

        // Paginated queries
        Task<PaginatedResult<GroupInvitation>> GetGroupInvitationsPagedAsync(
            Guid groupId,
            int pageNumber,
            int pageSize,
            string? status = null,
            CancellationToken cancellationToken = default);

        Task<PaginatedResult<GroupInvitation>> GetUserInvitationsPagedAsync(
            string email,
            int pageNumber,
            int pageSize,
            string? status = null,
            CancellationToken cancellationToken = default);

        // Invitation statistics
        Task<int> GetInvitationCountAsync(Guid groupId, CancellationToken cancellationToken = default);
        Task<int> GetPendingInvitationCountAsync(Guid groupId, CancellationToken cancellationToken = default);
        Task<Dictionary<string, int>> GetInvitationCountsByStatusAsync(Guid groupId, CancellationToken cancellationToken = default);

        // Invitation validation
        Task<bool> ExistsAsync(Guid id, CancellationToken cancellationToken = default);
        Task<bool> HasPendingInvitationAsync(Guid groupId, string email, CancellationToken cancellationToken = default);
        Task<bool> IsInvitationValidAsync(Guid id, CancellationToken cancellationToken = default);

        // Invitation operations
        Task<bool> AcceptInvitationAsync(Guid id, CancellationToken cancellationToken = default);
        Task<bool> RejectInvitationAsync(Guid id, CancellationToken cancellationToken = default);
        Task<bool> CancelInvitationAsync(Guid id, CancellationToken cancellationToken = default);
        Task<int> CleanupExpiredInvitationsAsync(CancellationToken cancellationToken = default);
    }
}