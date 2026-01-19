using Application.Common.DTOs;
using Application.Features.Community.Groups.Commands;
using Application.Features.Community.Groups.DTOs;
using Application.Features.Community.Groups.Queries;

namespace Application.Features.Community.Groups.Services
{
    public interface IGroupService
    {
        // Group Management
        Task<Result<GroupDto>> CreateGroupAsync(Guid createdBy, CreateGroupRequest request, CancellationToken cancellationToken = default);
        Task<Result<GroupDto>> UpdateGroupAsync(Guid groupId, Guid userId, UpdateGroupRequest request, CancellationToken cancellationToken = default);
        Task<Result<bool>> DeleteGroupAsync(Guid groupId, Guid userId, string? reason = null, CancellationToken cancellationToken = default);
        Task<Result<GroupDto>> GetGroupByIdAsync(Guid groupId, Guid? userId = null, CancellationToken cancellationToken = default);
        Task<Result<GroupsPagedResponse>> GetGroupsAsync(GetGroupsQuery query, CancellationToken cancellationToken = default);
        Task<Result<List<GroupSummaryDto>>> GetFeaturedGroupsAsync(int count = 6, CancellationToken cancellationToken = default);
        Task<Result<List<GroupSummaryDto>>> GetTrendingGroupsAsync(int count = 10, string timeframe = "week", CancellationToken cancellationToken = default);
        Task<Result<List<GroupSummaryDto>>> GetPopularGroupsAsync(int count = 10, CancellationToken cancellationToken = default);
        Task<Result<GroupsPagedResponse>> GetUserGroupsAsync(Guid userId, int pageNumber = 1, int pageSize = 10, string? type = null, CancellationToken cancellationToken = default);
        Task<Result<List<GroupCategoryDto>>> GetGroupCategoriesAsync(bool includeGroupCounts = true, CancellationToken cancellationToken = default);
        Task<Result<GroupsStatsDto>> GetGroupsStatsAsync(string? category = null, CancellationToken cancellationToken = default);

        // Member Management
        Task<Result<GroupMemberDto>> JoinGroupAsync(Guid groupId, Guid userId, string? message = null, CancellationToken cancellationToken = default);
        Task<Result<bool>> LeaveGroupAsync(Guid groupId, Guid userId, CancellationToken cancellationToken = default);
        Task<Result<GroupMembersPagedResponse>> GetGroupMembersAsync(Guid groupId, int pageNumber = 1, int pageSize = 20, string? role = null, CancellationToken cancellationToken = default);
        Task<Result<bool>> UpdateMemberRoleAsync(Guid groupId, Guid memberId, Guid updatedBy, string newRole, CancellationToken cancellationToken = default);
        Task<Result<bool>> RemoveMemberAsync(Guid groupId, Guid memberId, Guid removedBy, string? reason = null, CancellationToken cancellationToken = default);
        Task<Result<List<GroupInvitationDto>>> InviteToGroupAsync(Guid groupId, Guid invitedBy, InviteToGroupRequest request, CancellationToken cancellationToken = default);

        // Join Requests
        Task<Result<GroupJoinRequestsPagedResponse>> GetJoinRequestsAsync(Guid groupId, Guid userId, int pageNumber = 1, int pageSize = 20, CancellationToken cancellationToken = default);
        Task<Result<bool>> ApproveJoinRequestAsync(Guid groupId, Guid requestId, Guid approvedBy, CancellationToken cancellationToken = default);
        Task<Result<bool>> RejectJoinRequestAsync(Guid groupId, Guid requestId, Guid rejectedBy, string? reason = null, CancellationToken cancellationToken = default);

        // Group Events
        Task<Result<GroupEventDto>> CreateGroupEventAsync(Guid groupId, Guid createdBy, CreateGroupEventRequest request, CancellationToken cancellationToken = default);
        Task<Result<GroupEventsPagedResponse>> GetGroupEventsAsync(Guid groupId, int pageNumber = 1, int pageSize = 10, CancellationToken cancellationToken = default);
        Task<Result<bool>> RSVPToGroupEventAsync(Guid groupId, Guid eventId, Guid userId, string rsvpType, CancellationToken cancellationToken = default);

        // Discussions
        Task<Result<GroupDiscussionDto>> CreateDiscussionAsync(Guid groupId, Guid createdBy, CreateGroupDiscussionRequest request, CancellationToken cancellationToken = default);
        Task<Result<GroupDiscussionsPagedResponse>> GetGroupDiscussionsAsync(Guid groupId, int pageNumber = 1, int pageSize = 10, string? category = null, CancellationToken cancellationToken = default);
        Task<Result<GroupDiscussionDto>> ReplyToDiscussionAsync(Guid groupId, Guid discussionId, Guid userId, CreateGroupDiscussionReplyRequest request, CancellationToken cancellationToken = default);

        // Moderation
        Task<Result<bool>> BanMemberAsync(Guid groupId, Guid memberId, Guid bannedBy, BanGroupMemberRequest request, CancellationToken cancellationToken = default);
        Task<Result<bool>> UnbanMemberAsync(Guid groupId, Guid memberId, Guid unbannedBy, CancellationToken cancellationToken = default);
        Task<Result<GroupBansPagedResponse>> GetGroupBansAsync(Guid groupId, Guid userId, int pageNumber = 1, int pageSize = 20, CancellationToken cancellationToken = default);

        // Admin Operations
        Task<Result<bool>> FeatureGroupAsync(Guid groupId, Guid userId, bool isFeatured = true, CancellationToken cancellationToken = default);
        Task<Result<bool>> ArchiveGroupAsync(Guid groupId, Guid userId, string? reason = null, CancellationToken cancellationToken = default);

        // Search and Filter
        Task<Result<GroupsPagedResponse>> SearchGroupsAsync(string searchTerm, int pageNumber = 1, int pageSize = 10, string? category = null, CancellationToken cancellationToken = default);

        // Validation Methods
        Task<Result<bool>> CanUserEditGroupAsync(Guid groupId, Guid userId, CancellationToken cancellationToken = default);
        Task<Result<bool>> IsUserGroupMemberAsync(Guid groupId, Guid userId, CancellationToken cancellationToken = default);
        Task<Result<bool>> IsUserGroupAdminAsync(Guid groupId, Guid userId, CancellationToken cancellationToken = default);
        Task<Result<bool>> CanUserJoinGroupAsync(Guid groupId, Guid userId, CancellationToken cancellationToken = default);
    }
}
