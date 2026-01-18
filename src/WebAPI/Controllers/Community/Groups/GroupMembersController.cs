using Application.Features.Community.Groups.Commands;
using Application.Features.Community.Groups.DTOs;
using Application.Features.Community.Groups.Queries;
using Application.Features.Identity.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using Asp.Versioning;

namespace WebAPI.Controllers.Community.Groups
{
    [Authorize]
    [ApiVersion("2.0")]
    [Route("api/v{version:apiVersion}/groups/{groupId}/members")]
    public class GroupMembersController : BaseController
    {
        private readonly ICurrentUserService _currentUserService;

        public GroupMembersController(ICurrentUserService currentUserService)
        {
            _currentUserService = currentUserService;
        }

        [HttpGet]
        [AllowAnonymous]
        [OutputCache(Duration = 300, Tags = new[] { "Groups", "Members" })]
        public async Task<IActionResult> GetGroupMembers(
            Guid groupId, 
            [FromQuery] int page = 1, 
            [FromQuery] int pageSize = 20,
            [FromQuery] string? role = null,
            [FromQuery] string? searchTerm = null,
            [FromQuery] string? sortBy = "JoinedAt",
            [FromQuery] bool sortDescending = false)
        {
            var query = new GetGroupMembersQuery
            {
                GroupId = groupId,
                PageNumber = page,
                PageSize = pageSize,
                Role = role,
                SearchTerm = searchTerm,
                SortBy = sortBy,
                SortDescending = sortDescending
            };

            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "Group members retrieved successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Group not found");

            return BadRequest("Failed to retrieve group members", result.Errors);
        }

        [HttpGet("{memberId}")]
        [AllowAnonymous]
        [OutputCache(Duration = 300, Tags = new[] { "Groups", "Members" })]
        public async Task<IActionResult> GetGroupMember(Guid groupId, Guid memberId)
        {
            var query = new GetGroupMemberQuery
            {
                GroupId = groupId,
                MemberId = memberId
            };

            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "Group member retrieved successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Member not found in this group");

            return BadRequest("Failed to retrieve group member", result.Errors);
        }

        [HttpGet("roles")]
        [AllowAnonymous]
        [OutputCache(Duration = 3600, Tags = new[] { "Groups", "Roles" })]
        public async Task<IActionResult> GetGroupRoles(Guid groupId)
        {
            var query = new GetGroupRolesQuery { GroupId = groupId };
            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "Group roles retrieved successfully");

            return BadRequest("Failed to retrieve group roles", result.Errors);
        }

        [HttpGet("moderators")]
        [AllowAnonymous]
        [OutputCache(Duration = 600, Tags = new[] { "Groups", "Moderators" })]
        public async Task<IActionResult> GetGroupModerators(Guid groupId)
        {
            var query = new GetGroupModeratorsQuery { GroupId = groupId };
            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "Group moderators retrieved successfully");

            return BadRequest("Failed to retrieve group moderators", result.Errors);
        }

        [HttpGet("online")]
        [AllowAnonymous]
        [OutputCache(Duration = 60, Tags = new[] { "Groups", "OnlineMembers" })]
        public async Task<IActionResult> GetOnlineMembers(Guid groupId, [FromQuery] int pageSize = 20)
        {
            var query = new GetOnlineGroupMembersQuery
            {
                GroupId = groupId,
                PageSize = pageSize
            };

            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "Online members retrieved successfully");

            return BadRequest("Failed to retrieve online members", result.Errors);
        }

        [HttpPost("invite")]
        [Authorize(Roles = "Admin,Moderator")]
        public async Task<IActionResult> InviteMember(Guid groupId, [FromBody] InviteMemberRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new InviteMemberCommand
            {
                GroupId = groupId,
                InvitedBy = userGuid,
                Request = request
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Success(result.Data, "Member invited successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Group or user not found");

            if (result.Errors.Any(e => e.Contains("already member")))
                return BadRequest("User is already a member of this group", result.Errors);

            if (result.Errors.Any(e => e.Contains("already invited")))
                return BadRequest("User has already been invited to this group", result.Errors);

            if (result.Errors.Any(e => e.Contains("permission")))
                return Forbidden("You don't have permission to invite members to this group");

            return BadRequest("Failed to invite member", result.Errors);
        }

        [HttpPost("bulk-invite")]
        [Authorize(Roles = "Admin,Moderator")]
        public async Task<IActionResult> BulkInviteMembers(Guid groupId, [FromBody] BulkInviteMembersRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new BulkInviteMembersCommand
            {
                GroupId = groupId,
                InvitedBy = userGuid,
                Request = request
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Success(result.Data, "Bulk invitation completed successfully");

            return BadRequest("Failed to complete bulk invitation", result.Errors);
        }

        [HttpPut("{memberId}/role")]
        [Authorize(Roles = "Admin,Moderator")]
        public async Task<IActionResult> UpdateMemberRole(Guid groupId, Guid memberId, [FromBody] UpdateMemberRoleRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new UpdateMemberRoleCommand
            {
                GroupId = groupId,
                MemberId = memberId,
                UpdatedBy = userGuid,
                Request = request
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Success(result.Data, "Member role updated successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Group or member not found");

            if (result.Errors.Any(e => e.Contains("permission")))
                return Forbidden("You don't have permission to update member roles");

            if (result.Errors.Any(e => e.Contains("cannot change owner")))
                return BadRequest("Cannot change the role of the group owner", result.Errors);

            return BadRequest("Failed to update member role", result.Errors);
        }

        [HttpPost("{memberId}/promote")]
        [Authorize(Roles = "Admin,Moderator")]
        public async Task<IActionResult> PromoteMember(Guid groupId, Guid memberId, [FromBody] PromoteMemberRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new PromoteMemberCommand
            {
                GroupId = groupId,
                MemberId = memberId,
                PromotedBy = userGuid,
                Request = request
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Success(result.Data, "Member promoted successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Group or member not found");

            if (result.Errors.Any(e => e.Contains("permission")))
                return Forbidden("You don't have permission to promote members");

            return BadRequest("Failed to promote member", result.Errors);
        }

        [HttpPost("{memberId}/demote")]
        [Authorize(Roles = "Admin,Moderator")]
        public async Task<IActionResult> DemoteMember(Guid groupId, Guid memberId, [FromBody] DemoteMemberRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new DemoteMemberCommand
            {
                GroupId = groupId,
                MemberId = memberId,
                DemotedBy = userGuid,
                Request = request
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Success(result.Data, "Member demoted successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Group or member not found");

            if (result.Errors.Any(e => e.Contains("permission")))
                return Forbidden("You don't have permission to demote members");

            return BadRequest("Failed to demote member", result.Errors);
        }

        [HttpDelete("{memberId}")]
        [Authorize(Roles = "Admin,Moderator")]
        public async Task<IActionResult> RemoveMember(Guid groupId, Guid memberId, [FromBody] RemoveMemberRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new RemoveMemberCommand
            {
                GroupId = groupId,
                MemberId = memberId,
                RemovedBy = userGuid,
                Request = request
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Success("Member removed successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Group or member not found");

            if (result.Errors.Any(e => e.Contains("permission")))
                return Forbidden("You don't have permission to remove members");

            if (result.Errors.Any(e => e.Contains("cannot remove owner")))
                return BadRequest("Cannot remove the group owner", result.Errors);

            return BadRequest("Failed to remove member", result.Errors);
        }

        [HttpPost("{memberId}/ban")]
        [Authorize(Roles = "Admin,Moderator")]
        public async Task<IActionResult> BanMember(Guid groupId, Guid memberId, [FromBody] BanMemberRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new BanMemberCommand
            {
                GroupId = groupId,
                MemberId = memberId,
                BannedBy = userGuid,
                Request = request
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Success(result.Data, "Member banned successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Group or member not found");

            if (result.Errors.Any(e => e.Contains("permission")))
                return Forbidden("You don't have permission to ban members");

            if (result.Errors.Any(e => e.Contains("cannot ban owner")))
                return BadRequest("Cannot ban the group owner", result.Errors);

            return BadRequest("Failed to ban member", result.Errors);
        }

        [HttpDelete("{memberId}/unban")]
        [Authorize(Roles = "Admin,Moderator")]
        public async Task<IActionResult> UnbanMember(Guid groupId, Guid memberId)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new UnbanMemberCommand
            {
                GroupId = groupId,
                MemberId = memberId,
                UnbannedBy = userGuid
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Success("Member unbanned successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Group or ban record not found");

            if (result.Errors.Any(e => e.Contains("permission")))
                return Forbidden("You don't have permission to unban members");

            return BadRequest("Failed to unban member", result.Errors);
        }

        [HttpGet("banned")]
        [Authorize(Roles = "Admin,Moderator")]
        [OutputCache(Duration = 300, Tags = new[] { "Groups", "BannedMembers" })]
        public async Task<IActionResult> GetBannedMembers(
            Guid groupId,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20)
        {
            var query = new GetBannedMembersQuery
            {
                GroupId = groupId,
                PageNumber = page,
                PageSize = pageSize
            };

            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "Banned members retrieved successfully");

            return BadRequest("Failed to retrieve banned members", result.Errors);
        }

        [HttpGet("join-requests")]
        [Authorize(Roles = "Admin,Moderator")]
        [OutputCache(Duration = 60, Tags = new[] { "Groups", "JoinRequests" })]
        public async Task<IActionResult> GetJoinRequests(
            Guid groupId,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20,
            [FromQuery] string? status = "Pending")
        {
            var query = new GetGroupJoinRequestsQuery
            {
                GroupId = groupId,
                PageNumber = page,
                PageSize = pageSize,
                Status = status
            };

            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "Join requests retrieved successfully");

            return BadRequest("Failed to retrieve join requests", result.Errors);
        }

        [HttpPut("join-requests/{requestId}/approve")]
        [Authorize(Roles = "Admin,Moderator")]
        public async Task<IActionResult> ApproveJoinRequest(Guid groupId, Guid requestId, [FromBody] ApproveJoinRequestRequest? request = null)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new ApproveJoinRequestCommand
            {
                GroupId = groupId,
                RequestId = requestId,
                ApprovedBy = userGuid,
                WelcomeMessage = request?.WelcomeMessage
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Success(result.Data, "Join request approved successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Join request not found");

            return BadRequest("Failed to approve join request", result.Errors);
        }

        [HttpPut("join-requests/{requestId}/reject")]
        [Authorize(Roles = "Admin,Moderator")]
        public async Task<IActionResult> RejectJoinRequest(Guid groupId, Guid requestId, [FromBody] RejectJoinRequestRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new RejectJoinRequestCommand
            {
                GroupId = groupId,
                RequestId = requestId,
                RejectedBy = userGuid,
                Request = request
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Success("Join request rejected successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Join request not found");

            return BadRequest("Failed to reject join request", result.Errors);
        }

        [HttpGet("invitations")]
        [Authorize(Roles = "Admin,Moderator")]
        [OutputCache(Duration = 300, Tags = new[] { "Groups", "Invitations" })]
        public async Task<IActionResult> GetGroupInvitations(
            Guid groupId,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20,
            [FromQuery] string? status = "Pending")
        {
            var query = new GetGroupInvitationsQuery
            {
                GroupId = groupId,
                PageNumber = page,
                PageSize = pageSize,
                Status = status
            };

            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "Group invitations retrieved successfully");

            return BadRequest("Failed to retrieve group invitations", result.Errors);
        }

        [HttpGet("stats")]
        [Authorize(Roles = "Admin,Moderator")]
        [OutputCache(Duration = 600, Tags = new[] { "Groups", "MemberStats" })]
        public async Task<IActionResult> GetMembershipStats(Guid groupId)
        {
            var query = new GetGroupMembershipStatsQuery { GroupId = groupId };
            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "Membership statistics retrieved successfully");

            return BadRequest("Failed to retrieve membership statistics", result.Errors);
        }

        [HttpPost("transfer-ownership")]
        [Authorize(Roles = "Admin,Moderator")]
        public async Task<IActionResult> TransferOwnership(Guid groupId, [FromBody] TransferOwnershipRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new TransferGroupOwnershipCommand
            {
                GroupId = groupId,
                CurrentOwnerId = userGuid,
                Request = request
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Success(result.Data, "Group ownership transferred successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Group or new owner not found");

            if (result.Errors.Any(e => e.Contains("not owner")))
                return Forbidden("Only the group owner can transfer ownership");

            return BadRequest("Failed to transfer group ownership", result.Errors);
        }
    }
}


