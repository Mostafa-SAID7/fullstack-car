using Application.Common.Models;
using Domain.Entities.Community.Groups;

namespace Application.Features.Community.Groups.Interfaces
{
    public interface IGroupService
    {
        Task<Result<Group>> GetGroupByIdAsync(Guid id, CancellationToken cancellationToken = default);
        Task<Result<PaginatedList<Group>>> GetGroupsAsync(int pageNumber, int pageSize, CancellationToken cancellationToken = default);
        Task<Result<Group>> CreateGroupAsync(Group group, CancellationToken cancellationToken = default);
        Task<Result<Group>> UpdateGroupAsync(Group group, CancellationToken cancellationToken = default);
        Task<Result> DeleteGroupAsync(Guid id, CancellationToken cancellationToken = default);
        Task<Result> JoinGroupAsync(Guid groupId, Guid userId, CancellationToken cancellationToken = default);
        Task<Result> LeaveGroupAsync(Guid groupId, Guid userId, CancellationToken cancellationToken = default);
        Task<Result<PaginatedList<GroupMember>>> GetGroupMembersAsync(Guid groupId, int pageNumber, int pageSize, CancellationToken cancellationToken = default);
    }
}