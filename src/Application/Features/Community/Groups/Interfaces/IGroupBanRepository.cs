using Application.Common.DTOs;
using Domain.Entities.Community.Groups;

namespace Application.Features.Community.Groups.Interfaces
{
    public interface IGroupBanRepository : IRepository<GroupBan>
    {
        // Ban queries
        Task<GroupBan?> GetByIdWithDetailsAsync(Guid id, CancellationToken cancellationToken = default);
        Task<GroupBan?> GetByGroupAndUserAsync(Guid groupId, Guid userId, CancellationToken cancellationToken = default);
        Task<GroupBan?> GetActiveByGroupAndUserAsync(Guid groupId, Guid userId, CancellationToken cancellationToken = default);
        Task<IEnumerable<GroupBan>> GetGroupBansAsync(Guid groupId, CancellationToken cancellationToken = default);
        Task<IEnumerable<GroupBan>> GetActiveBansAsync(Guid groupId, CancellationToken cancellationToken = default);
        Task<IEnumerable<GroupBan>> GetExpiredBansAsync(CancellationToken cancellationToken = default);
        Task<IEnumerable<GroupBan>> GetUserBansAsync(Guid userId, CancellationToken cancellationToken = default);

        // Paginated queries
        Task<PaginatedResult<GroupBan>> GetGroupBansPagedAsync(
            Guid groupId,
            int pageNumber,
            int pageSize,
            bool? activeOnly = null,
            CancellationToken cancellationToken = default);

        // Ban statistics
        Task<int> GetBanCountAsync(Guid groupId, CancellationToken cancellationToken = default);
        Task<int> GetActiveBanCountAsync(Guid groupId, CancellationToken cancellationToken = default);
        Task<Dictionary<string, int>> GetBansByReasonAsync(Guid groupId, CancellationToken cancellationToken = default);

        // Ban validation
        Task<bool> ExistsAsync(Guid id, CancellationToken cancellationToken = default);
        Task<bool> IsUserBannedAsync(Guid groupId, Guid userId, CancellationToken cancellationToken = default);
        Task<bool> IsActiveBanAsync(Guid id, CancellationToken cancellationToken = default);

        // Ban operations
        Task<bool> LiftBanAsync(Guid id, CancellationToken cancellationToken = default);
        Task<bool> ExtendBanAsync(Guid id, DateTime newExpiryDate, CancellationToken cancellationToken = default);
        Task<int> ProcessExpiredBansAsync(CancellationToken cancellationToken = default);
    }
}