using Application.Common.DTOs;
using Domain.Entities.Community.Groups;

namespace Application.Features.Community.Groups.Interfaces
{
    public interface IGroupJoinRequestRepository : IRepository<GroupJoinRequest>
    {
        // Join request queries
        Task<GroupJoinRequest?> GetByIdWithDetailsAsync(Guid id, CancellationToken cancellationToken = default);
        Task<GroupJoinRequest?> GetByGroupAndUserAsync(Guid groupId, Guid userId, CancellationToken cancellationToken = default);
        Task<GroupJoinRequest?> GetPendingByGroupAndUserAsync(Guid groupId, Guid userId, CancellationToken cancellationToken = default);
        Task<IEnumerable<GroupJoinRequest>> GetGroupJoinRequestsAsync(Guid groupId, CancellationToken cancellationToken = default);
        Task<IEnumerable<GroupJoinRequest>> GetPendingJoinRequestsAsync(Guid groupId, CancellationToken cancellationToken = default);
        Task<IEnumerable<GroupJoinRequest>> GetUserJoinRequestsAsync(Guid userId, CancellationToken cancellationToken = default);

        // Paginated queries
        Task<PaginatedResult<GroupJoinRequest>> GetGroupJoinRequestsPagedAsync(
            Guid groupId,
            int pageNumber,
            int pageSize,
            string? status = null,
            CancellationToken cancellationToken = default);

        // Join request statistics
        Task<int> GetJoinRequestCountAsync(Guid groupId, CancellationToken cancellationToken = default);
        Task<int> GetPendingJoinRequestCountAsync(Guid groupId, CancellationToken cancellationToken = default);
        Task<Dictionary<string, int>> GetJoinRequestCountsByStatusAsync(Guid groupId, CancellationToken cancellationToken = default);

        // Join request validation
        Task<bool> ExistsAsync(Guid id, CancellationToken cancellationToken = default);
        Task<bool> HasPendingRequestAsync(Guid groupId, Guid userId, CancellationToken cancellationToken = default);

        // Join request operations
        Task<bool> ApproveRequestAsync(Guid id, Guid approvedBy, string? welcomeMessage = null, CancellationToken cancellationToken = default);
        Task<bool> RejectRequestAsync(Guid id, Guid rejectedBy, string reason, CancellationToken cancellationToken = default);
        Task<bool> CancelRequestAsync(Guid id, CancellationToken cancellationToken = default);
    }
}
