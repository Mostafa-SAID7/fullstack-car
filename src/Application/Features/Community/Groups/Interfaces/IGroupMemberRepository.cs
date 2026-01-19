using Application.Common.DTOs;
using Domain.Entities.Community.Groups;

namespace Application.Features.Community.Groups.Interfaces
{
    public interface IGroupMemberRepository : IRepository<GroupMember>
    {
        // Member queries
        Task<GroupMember?> GetByGroupAndUserAsync(Guid groupId, Guid userId, CancellationToken cancellationToken = default);
        Task<IEnumerable<GroupMember>> GetGroupMembersAsync(Guid groupId, CancellationToken cancellationToken = default);
        Task<IEnumerable<GroupMember>> GetGroupModeratorsAsync(Guid groupId, CancellationToken cancellationToken = default);
        Task<IEnumerable<GroupMember>> GetOnlineMembersAsync(Guid groupId, CancellationToken cancellationToken = default);
        Task<IEnumerable<GroupMember>> GetMembersByRoleAsync(Guid groupId, string role, CancellationToken cancellationToken = default);

        // Paginated queries
        Task<PaginatedResult<GroupMember>> GetGroupMembersPagedAsync(
            Guid groupId,
            int pageNumber,
            int pageSize,
            string? role = null,
            string? searchTerm = null,
            string? sortBy = null,
            bool sortDescending = false,
            CancellationToken cancellationToken = default);

        // Member statistics
        Task<int> GetMemberCountAsync(Guid groupId, CancellationToken cancellationToken = default);
        Task<int> GetActiveMemberCountAsync(Guid groupId, CancellationToken cancellationToken = default);
        Task<int> GetOnlineMemberCountAsync(Guid groupId, CancellationToken cancellationToken = default);
        Task<Dictionary<string, int>> GetMemberCountsByRoleAsync(Guid groupId, CancellationToken cancellationToken = default);
        Task<Dictionary<string, int>> GetMembersJoinedByMonthAsync(Guid groupId, int months = 12, CancellationToken cancellationToken = default);

        // Member validation
        Task<bool> IsMemberAsync(Guid groupId, Guid userId, CancellationToken cancellationToken = default);
        Task<bool> IsOwnerAsync(Guid groupId, Guid userId, CancellationToken cancellationToken = default);
        Task<bool> IsModeratorAsync(Guid groupId, Guid userId, CancellationToken cancellationToken = default);
        Task<bool> CanInviteMembersAsync(Guid groupId, Guid userId, CancellationToken cancellationToken = default);
        Task<bool> CanManageMembersAsync(Guid groupId, Guid userId, CancellationToken cancellationToken = default);
        Task<bool> CanModerateAsync(Guid groupId, Guid userId, CancellationToken cancellationToken = default);

        // Member operations
        Task AddMemberAsync(GroupMember member, CancellationToken cancellationToken = default);
        Task RemoveMemberAsync(Guid groupId, Guid userId, CancellationToken cancellationToken = default);
        Task UpdateMemberRoleAsync(Guid groupId, Guid userId, string newRole, CancellationToken cancellationToken = default);
        Task UpdateMemberLastActivityAsync(Guid groupId, Guid userId, DateTime lastActivity, CancellationToken cancellationToken = default);
        Task SetMemberOnlineStatusAsync(Guid groupId, Guid userId, bool isOnline, CancellationToken cancellationToken = default);
    }
}
