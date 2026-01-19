using Application.Common.DTOs;
using Domain.Entities.Community.Groups;

namespace Application.Features.Community.Groups.Interfaces
{
    public interface IGroupRepository : IRepository<Group>
    {
        // Group queries
        Task<Group?> GetByIdWithMembersAsync(Guid id, CancellationToken cancellationToken = default);
        Task<Group?> GetByIdWithEventsAsync(Guid id, CancellationToken cancellationToken = default);
        Task<Group?> GetByIdWithDiscussionsAsync(Guid id, CancellationToken cancellationToken = default);
        Task<Group?> GetByNameAsync(string name, CancellationToken cancellationToken = default);
        Task<IEnumerable<Group>> GetFeaturedGroupsAsync(int count, CancellationToken cancellationToken = default);
        Task<IEnumerable<Group>> GetTrendingGroupsAsync(string timeframe, int count, CancellationToken cancellationToken = default);
        Task<IEnumerable<Group>> GetPopularGroupsAsync(int count, CancellationToken cancellationToken = default);
        Task<IEnumerable<Group>> GetGroupsByCategoryAsync(string category, CancellationToken cancellationToken = default);
        Task<IEnumerable<Group>> SearchGroupsAsync(string searchTerm, CancellationToken cancellationToken = default);
        Task<IEnumerable<Group>> GetUserGroupsAsync(Guid userId, string? role = null, CancellationToken cancellationToken = default);
        Task<IEnumerable<Group>> GetUserOwnedGroupsAsync(Guid userId, CancellationToken cancellationToken = default);

        // Paginated queries
        Task<PaginatedResult<Group>> GetGroupsPagedAsync(
            int pageNumber, 
            int pageSize, 
            string? category = null, 
            string? searchTerm = null, 
            string? sortBy = null, 
            bool sortDescending = false,
            bool? isPublic = null,
            bool? isActive = null,
            CancellationToken cancellationToken = default);

        // Group membership
        Task<bool> IsUserMemberAsync(Guid groupId, Guid userId, CancellationToken cancellationToken = default);
        Task<bool> IsUserOwnerAsync(Guid groupId, Guid userId, CancellationToken cancellationToken = default);
        Task<bool> IsUserModeratorAsync(Guid groupId, Guid userId, CancellationToken cancellationToken = default);
        Task<bool> IsUserBannedAsync(Guid groupId, Guid userId, CancellationToken cancellationToken = default);
        Task<string?> GetUserRoleAsync(Guid groupId, Guid userId, CancellationToken cancellationToken = default);

        // Group statistics
        Task<int> GetGroupCountAsync(CancellationToken cancellationToken = default);
        Task<int> GetActiveGroupCountAsync(CancellationToken cancellationToken = default);
        Task<int> GetPublicGroupCountAsync(CancellationToken cancellationToken = default);
        Task<int> GetPrivateGroupCountAsync(CancellationToken cancellationToken = default);
        Task<int> GetFeaturedGroupCountAsync(CancellationToken cancellationToken = default);
        Task<Dictionary<string, int>> GetGroupCountsByCategoryAsync(CancellationToken cancellationToken = default);

        // Group validation
        Task<bool> ExistsAsync(Guid id, CancellationToken cancellationToken = default);
        Task<bool> ExistsByNameAsync(string name, CancellationToken cancellationToken = default);
        Task<bool> CanUserCreateGroupAsync(Guid userId, CancellationToken cancellationToken = default);
        Task<int> GetUserGroupCountAsync(Guid userId, CancellationToken cancellationToken = default);
        Task<int> GetUserOwnedGroupCountAsync(Guid userId, CancellationToken cancellationToken = default);
    }
}
