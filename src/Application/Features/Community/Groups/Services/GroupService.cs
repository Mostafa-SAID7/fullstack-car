using Application.Common.DTOs;
using Application.Features.Community.Groups.Commands;
using Application.Features.Community.Groups.DTOs;
using Application.Features.Community.Groups.Queries;
using MediatR;

namespace Application.Features.Community.Groups.Services
{
    public class GroupService : IGroupService
    {
        private readonly IMediator _mediator;

        public GroupService(IMediator mediator)
        {
            _mediator = mediator;
        }

        // Group Management
        public async Task<Result<GroupDto>> CreateGroupAsync(Guid createdBy, CreateGroupRequest request, CancellationToken cancellationToken = default)
        {
            var command = new CreateGroupCommand
            {
                OwnerId = createdBy,
                Request = request
            };

            return await _mediator.Send(command, cancellationToken);
        }

        public async Task<Result<GroupDto>> UpdateGroupAsync(Guid groupId, Guid userId, UpdateGroupRequest request, CancellationToken cancellationToken = default)
        {
            var command = new UpdateGroupCommand
            {
                Id = groupId,
                UserId = userId,
                Request = request
            };

            return await _mediator.Send(command, cancellationToken);
        }

        public async Task<Result<bool>> DeleteGroupAsync(Guid groupId, Guid userId, string? reason = null, CancellationToken cancellationToken = default)
        {
            var command = new DeleteGroupCommand
            {
                Id = groupId,
                UserId = userId,
                Reason = reason
            };

            return await _mediator.Send(command, cancellationToken);
        }

        public async Task<Result<GroupDto>> GetGroupByIdAsync(Guid groupId, Guid? userId = null, CancellationToken cancellationToken = default)
        {
            var query = new GetGroupByIdQuery
            {
                Id = groupId,
                UserId = userId
            };

            return await _mediator.Send(query, cancellationToken);
        }

        public async Task<Result<GroupsPagedResponse>> GetGroupsAsync(GetGroupsQuery query, CancellationToken cancellationToken = default)
        {
            return await _mediator.Send(query, cancellationToken);
        }

        public async Task<Result<List<GroupSummaryDto>>> GetFeaturedGroupsAsync(int count = 6, CancellationToken cancellationToken = default)
        {
            var query = new GetFeaturedGroupsQuery { Count = count };
            return await _mediator.Send(query, cancellationToken);
        }

        public async Task<Result<List<GroupSummaryDto>>> GetTrendingGroupsAsync(int count = 10, string timeframe = "week", CancellationToken cancellationToken = default)
        {
            var query = new GetTrendingGroupsQuery { Count = count, Timeframe = timeframe };
            return await _mediator.Send(query, cancellationToken);
        }

        public async Task<Result<List<GroupSummaryDto>>> GetPopularGroupsAsync(int count = 10, CancellationToken cancellationToken = default)
        {
            var query = new GetPopularGroupsQuery { Count = count };
            return await _mediator.Send(query, cancellationToken);
        }

        public async Task<Result<GroupsPagedResponse>> GetUserGroupsAsync(Guid userId, int pageNumber = 1, int pageSize = 10, string? type = null, CancellationToken cancellationToken = default)
        {
            var query = new GetUserGroupsQuery
            {
                UserId = userId,
                PageNumber = pageNumber,
                PageSize = pageSize,
                Type = type
            };

            return await _mediator.Send(query, cancellationToken);
        }

        public async Task<Result<List<GroupCategoryDto>>> GetGroupCategoriesAsync(bool includeGroupCounts = true, CancellationToken cancellationToken = default)
        {
            var query = new GetGroupCategoriesQuery { IncludeGroupCounts = includeGroupCounts };
            return await _mediator.Send(query, cancellationToken);
        }

        public async Task<Result<GroupsStatsDto>> GetGroupsStatsAsync(string? category = null, CancellationToken cancellationToken = default)
        {
            var query = new GetGroupsStatsQuery
            {
                Category = category
            };

            return await _mediator.Send(query, cancellationToken);
        }

        // Member Management
        public async Task<Result<GroupMemberDto>> JoinGroupAsync(Guid groupId, Guid userId, string? message = null, CancellationToken cancellationToken = default)
        {
            var command = new JoinGroupCommand
            {
                GroupId = groupId,
                UserId = userId,
                Message = message
            };

            return await _mediator.Send(command, cancellationToken);
        }

        public async Task<Result<bool>> LeaveGroupAsync(Guid groupId, Guid userId, CancellationToken cancellationToken = default)
        {
            var command = new LeaveGroupCommand
            {
                GroupId = groupId,
                UserId = userId
            };

            return await _mediator.Send(command, cancellationToken);
        }

        public async Task<Result<GroupMembersPagedResponse>> GetGroupMembersAsync(Guid groupId, int pageNumber = 1, int pageSize = 20, string? role = null, CancellationToken cancellationToken = default)
        {
            var query = new GetGroupMembersQuery
            {
                GroupId = groupId,
                PageNumber = pageNumber,
                PageSize = pageSize,
                Role = role
            };

            var result = await _mediator.Send(query, cancellationToken);
            if (!result.Succeeded)
            {
                return Result<GroupMembersPagedResponse>.Failure(result.Errors);
            }

            var response = new GroupMembersPagedResponse
            {
                Items = result.Data.Items,
                TotalCount = result.Data.TotalCount,
                PageNumber = result.Data.PageNumber,
                PageSize = result.Data.PageSize,
                TotalPages = result.Data.TotalPages
            };

            return Result<GroupMembersPagedResponse>.Success(response);
        }

        public async Task<Result<bool>> UpdateMemberRoleAsync(Guid groupId, Guid memberId, Guid updatedBy, string newRole, CancellationToken cancellationToken = default)
        {
            var command = new UpdateGroupMemberRoleCommand
            {
                GroupId = groupId,
                MemberId = memberId,
                UpdatedBy = updatedBy,
                NewRole = newRole
            };

            return await _mediator.Send(command, cancellationToken);
        }

        public async Task<Result<bool>> RemoveMemberAsync(Guid groupId, Guid memberId, Guid removedBy, string? reason = null, CancellationToken cancellationToken = default)
        {
            var command = new RemoveGroupMemberCommand
            {
                GroupId = groupId,
                MemberId = memberId,
                RemovedBy = removedBy,
                Reason = reason
            };

            return await _mediator.Send(command, cancellationToken);
        }

        public async Task<Result<List<GroupInvitationDto>>> InviteToGroupAsync(Guid groupId, Guid invitedBy, InviteToGroupRequest request, CancellationToken cancellationToken = default)
        {
            var command = new InviteToGroupCommand
            {
                GroupId = groupId,
                InvitedBy = invitedBy,
                Request = request
            };

            return await _mediator.Send(command, cancellationToken);
        }

        // Join Requests
        public async Task<Result<GroupJoinRequestsPagedResponse>> GetJoinRequestsAsync(Guid groupId, Guid userId, int pageNumber = 1, int pageSize = 20, CancellationToken cancellationToken = default)
        {
            var query = new GetGroupJoinRequestsQuery
            {
                GroupId = groupId,
                PageNumber = pageNumber,
                PageSize = pageSize
            };

            var result = await _mediator.Send(query, cancellationToken);
            if (!result.Succeeded)
            {
                return Result<GroupJoinRequestsPagedResponse>.Failure(result.Errors);
            }

            var response = new GroupJoinRequestsPagedResponse
            {
                Items = new List<GroupJoinRequestDto>(), // Convert from result.Data if needed
                TotalCount = 0, // Get from result if available
                PageNumber = pageNumber,
                PageSize = pageSize,
                TotalPages = 1
            };

            return Result<GroupJoinRequestsPagedResponse>.Success(response);
        }

        public async Task<Result<bool>> ApproveJoinRequestAsync(Guid groupId, Guid requestId, Guid approvedBy, CancellationToken cancellationToken = default)
        {
            var command = new ApproveGroupJoinRequestCommand
            {
                RequestId = requestId,
                ApprovedBy = approvedBy
            };

            return await _mediator.Send(command, cancellationToken);
        }

        public async Task<Result<bool>> RejectJoinRequestAsync(Guid groupId, Guid requestId, Guid rejectedBy, string? reason = null, CancellationToken cancellationToken = default)
        {
            var command = new RejectGroupJoinRequestCommand
            {
                RequestId = requestId,
                RejectedBy = rejectedBy,
                Reason = reason
            };

            return await _mediator.Send(command, cancellationToken);
        }

        // Group Events
        public async Task<Result<GroupEventDto>> CreateGroupEventAsync(Guid groupId, Guid createdBy, CreateGroupEventRequest request, CancellationToken cancellationToken = default)
        {
            var command = new CreateGroupEventCommand
            {
                GroupId = groupId,
                CreatedBy = createdBy,
                Request = request
            };

            var result = await _mediator.Send(command, cancellationToken);
            
            if (result.Succeeded)
            {
                // Convert ApiResponseDto<object> to Result<GroupEventDto>
                return Result<GroupEventDto>.Success(new GroupEventDto()); // Mock conversion
            }
            
            return Result<GroupEventDto>.Failure(result.Errors);
        }

        public async Task<Result<GroupEventsPagedResponse>> GetGroupEventsAsync(Guid groupId, int pageNumber = 1, int pageSize = 10, CancellationToken cancellationToken = default)
        {
            var query = new GetGroupEventsQuery
            {
                GroupId = groupId,
                PageNumber = pageNumber,
                PageSize = pageSize
            };

            return await _mediator.Send(query, cancellationToken);
        }

        public async Task<Result<bool>> RSVPToGroupEventAsync(Guid groupId, Guid eventId, Guid userId, string rsvpType, CancellationToken cancellationToken = default)
        {
            var command = new RSVPToGroupEventCommand
            {
                EventId = eventId,
                UserId = userId,
                RSVPType = rsvpType
            };

            return await _mediator.Send(command, cancellationToken);
        }

        // Discussions
        public async Task<Result<GroupDiscussionDto>> CreateDiscussionAsync(Guid groupId, Guid createdBy, CreateGroupDiscussionRequest request, CancellationToken cancellationToken = default)
        {
            var command = new CreateGroupDiscussionCommand
            {
                GroupId = groupId,
                CreatedBy = createdBy,
                Request = request
            };

            var result = await _mediator.Send(command, cancellationToken);
            
            if (result.Succeeded)
            {
                // Convert ApiResponseDto<object> to Result<GroupDiscussionDto>
                return Result<GroupDiscussionDto>.Success(new GroupDiscussionDto()); // Mock conversion
            }
            
            return Result<GroupDiscussionDto>.Failure(result.Errors);
        }

        public async Task<Result<GroupDiscussionsPagedResponse>> GetGroupDiscussionsAsync(Guid groupId, int pageNumber = 1, int pageSize = 10, string? category = null, CancellationToken cancellationToken = default)
        {
            var query = new GetGroupDiscussionsQuery
            {
                GroupId = groupId,
                PageNumber = pageNumber,
                PageSize = pageSize,
                Category = category
            };

            return await _mediator.Send(query, cancellationToken);
        }

        public async Task<Result<GroupDiscussionDto>> ReplyToDiscussionAsync(Guid groupId, Guid discussionId, Guid userId, CreateGroupDiscussionReplyRequest request, CancellationToken cancellationToken = default)
        {
            var command = new CreateGroupDiscussionReplyCommand
            {
                DiscussionId = discussionId,
                UserId = userId,
                Request = request
            };

            var result = await _mediator.Send(command, cancellationToken);
            if (!result.Succeeded)
            {
                return Result<GroupDiscussionDto>.Failure(result.Errors);
            }

            // TODO: Return proper GroupDiscussionDto
            return Result<GroupDiscussionDto>.Success(new GroupDiscussionDto());
        }

        // Moderation
        public async Task<Result<bool>> BanMemberAsync(Guid groupId, Guid memberId, Guid bannedBy, BanGroupMemberRequest request, CancellationToken cancellationToken = default)
        {
            var command = new BanGroupMemberCommand
            {
                GroupId = groupId,
                UserId = memberId,
                BannedBy = bannedBy,
                Request = request
            };

            return await _mediator.Send(command, cancellationToken);
        }

        public async Task<Result<bool>> UnbanMemberAsync(Guid groupId, Guid memberId, Guid unbannedBy, CancellationToken cancellationToken = default)
        {
            var command = new UnbanGroupMemberCommand
            {
                GroupId = groupId,
                UserId = memberId,
                UnbannedBy = unbannedBy
            };

            return await _mediator.Send(command, cancellationToken);
        }

        public async Task<Result<GroupBansPagedResponse>> GetGroupBansAsync(Guid groupId, Guid userId, int pageNumber = 1, int pageSize = 20, CancellationToken cancellationToken = default)
        {
            var query = new GetGroupBansQuery
            {
                GroupId = groupId,
                PageNumber = pageNumber,
                PageSize = pageSize
            };

            return await _mediator.Send(query, cancellationToken);
        }

        // Admin Operations
        public async Task<Result<bool>> FeatureGroupAsync(Guid groupId, Guid userId, bool isFeatured = true, CancellationToken cancellationToken = default)
        {
            var command = new FeatureGroupCommand
            {
                GroupId = groupId,
                UserId = userId,
                Request = new FeatureGroupRequest()
            };

            return await _mediator.Send(command, cancellationToken);
        }

        public async Task<Result<bool>> ArchiveGroupAsync(Guid groupId, Guid userId, string? reason = null, CancellationToken cancellationToken = default)
        {
            var command = new ArchiveGroupCommand
            {
                GroupId = groupId,
                UserId = userId,
                Reason = reason
            };

            return await _mediator.Send(command, cancellationToken);
        }

        // Search and Filter
        public async Task<Result<GroupsPagedResponse>> SearchGroupsAsync(string searchTerm, int pageNumber = 1, int pageSize = 10, string? category = null, CancellationToken cancellationToken = default)
        {
            var query = new GetGroupsQuery
            {
                SearchTerm = searchTerm,
                PageNumber = pageNumber,
                PageSize = pageSize,
                Category = category,
                SortBy = "MemberCount",
                SortDescending = true
            };

            return await _mediator.Send(query, cancellationToken);
        }

        // Validation Methods
        public async Task<Result<bool>> CanUserEditGroupAsync(Guid groupId, Guid userId, CancellationToken cancellationToken = default)
        {
            var groupResult = await GetGroupByIdAsync(groupId, userId, cancellationToken);
            if (!groupResult.Succeeded)
            {
                return Result<bool>.Failure("Group not found");
            }

            var canEdit = groupResult.Data.Owner.Id == userId;
            return Result<bool>.Success(canEdit);
        }

        public async Task<Result<bool>> IsUserGroupMemberAsync(Guid groupId, Guid userId, CancellationToken cancellationToken = default)
        {
            var groupResult = await GetGroupByIdAsync(groupId, userId, cancellationToken);
            if (!groupResult.Succeeded)
            {
                return Result<bool>.Failure("Group not found");
            }

            var isMember = groupResult.Data.Members.Any(m => m.User.Id == userId);
            return Result<bool>.Success(isMember);
        }

        public async Task<Result<bool>> IsUserGroupAdminAsync(Guid groupId, Guid userId, CancellationToken cancellationToken = default)
        {
            var groupResult = await GetGroupByIdAsync(groupId, userId, cancellationToken);
            if (!groupResult.Succeeded)
            {
                return Result<bool>.Failure("Group not found");
            }

            var isAdmin = groupResult.Data.Owner.Id == userId || 
                         groupResult.Data.Members.Any(m => m.User.Id == userId && (m.Role == "Admin" || m.Role == "Moderator"));
            return Result<bool>.Success(isAdmin);
        }

        public async Task<Result<bool>> CanUserJoinGroupAsync(Guid groupId, Guid userId, CancellationToken cancellationToken = default)
        {
            var groupResult = await GetGroupByIdAsync(groupId, userId, cancellationToken);
            if (!groupResult.Succeeded)
            {
                return Result<bool>.Failure("Group not found");
            }

            var group = groupResult.Data;
            
            // Check if user is already a member
            if (group.Members.Any(m => m.User.Id == userId))
            {
                return Result<bool>.Success(false); // Already a member
            }

            // Check if group is active and public or user has permission
            var canJoin = group.IsActive && (group.IsPublic || group.Privacy == "Public");
            return Result<bool>.Success(canJoin);
        }
    }
}