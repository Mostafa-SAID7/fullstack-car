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
        [OutputCache(Duration = 120, Tags = new[] { "Groups", "Members" })]
        public async Task<IActionResult> GetMembers(Guid groupId, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            var result = await Mediator.Send(new GetGroupMembersQuery
            {
                GroupId = groupId,
                PageNumber = page,
                PageSize = pageSize
            });

            if (result.Succeeded)
                return Ok(result.Data);

            return BadRequest(result.Errors);
        }

        [HttpGet("{memberId}")]
        public async Task<IActionResult> GetMember(Guid groupId, Guid memberId)
        {
            var result = await Mediator.Send(new GetGroupMemberQuery
            {
                GroupId = groupId,
                MemberId = memberId
            });

            if (result.Succeeded)
                return Ok(result.Data);

            return BadRequest(result.Errors);
        }

        [HttpPost("invite")]
        [Authorize(Roles = "Admin,Moderator")]
        public async Task<IActionResult> InviteMember(Guid groupId, [FromBody] InviteMemberRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized();
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized();
            }

            var result = await Mediator.Send(new InviteGroupMemberCommand
            {
                GroupId = groupId,
                InvitedUserId = request.UserId,
                InvitedByUserId = userGuid,
                Message = request.Message
            });

            if (result.Succeeded)
                return Ok(new { Message = "Member invited successfully" });

            return BadRequest(result.Errors);
        }

        [HttpPost("join-request")]
        public async Task<IActionResult> RequestToJoin(Guid groupId, [FromBody] JoinRequestRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized();
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized();
            }

            var result = await Mediator.Send(new RequestToJoinGroupCommand
            {
                GroupId = groupId,
                UserId = userGuid,
                Message = request.Message
            });

            if (result.Succeeded)
                return Ok(new { Message = "Join request sent successfully" });

            return BadRequest(result.Errors);
        }

        [HttpPut("{memberId}/role")]
        [Authorize(Roles = "Admin,Moderator")]
        public async Task<IActionResult> UpdateMemberRole(Guid groupId, Guid memberId, [FromBody] UpdateMemberRoleRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized();
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized();
            }

            var result = await Mediator.Send(new UpdateGroupMemberRoleCommand
            {
                GroupId = groupId,
                MemberId = memberId,
                UpdatedByUserId = userGuid,
                NewRole = request.Role
            });

            if (result.Succeeded)
                return Ok(new { Message = "Member role updated successfully" });

            return BadRequest(result.Errors);
        }

        [HttpDelete("{memberId}")]
        [Authorize(Roles = "Admin,Moderator")]
        public async Task<IActionResult> RemoveMember(Guid groupId, Guid memberId, [FromBody] RemoveMemberRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized();
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized();
            }

            var result = await Mediator.Send(new RemoveGroupMemberCommand
            {
                GroupId = groupId,
                MemberId = memberId,
                RemovedByUserId = userGuid,
                Reason = request.Reason
            });

            if (result.Succeeded)
                return NoContent();

            return BadRequest(result.Errors);
        }

        [HttpPost("{memberId}/ban")]
        [Authorize(Roles = "Admin,Moderator")]
        public async Task<IActionResult> BanMember(Guid groupId, Guid memberId, [FromBody] BanMemberRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized();
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized();
            }

            var result = await Mediator.Send(new BanGroupMemberCommand
            {
                GroupId = groupId,
                MemberId = memberId,
                BannedByUserId = userGuid,
                Reason = request.Reason,
                BanDuration = request.BanDuration
            });

            if (result.Succeeded)
                return Ok(new { Message = "Member banned successfully" });

            return BadRequest(result.Errors);
        }

        [HttpDelete("{memberId}/ban")]
        [Authorize(Roles = "Admin,Moderator")]
        public async Task<IActionResult> UnbanMember(Guid groupId, Guid memberId)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized();
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized();
            }

            var result = await Mediator.Send(new UnbanGroupMemberCommand
            {
                GroupId = groupId,
                MemberId = memberId,
                UnbannedByUserId = userGuid
            });

            if (result.Succeeded)
                return Ok(new { Message = "Member unbanned successfully" });

            return BadRequest(result.Errors);
        }

        [HttpGet("requests")]
        [Authorize(Roles = "Admin,Moderator")]
        [OutputCache(Duration = 30, Tags = new[] { "Groups", "JoinRequests" })]
        public async Task<IActionResult> GetJoinRequests(Guid groupId, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var result = await Mediator.Send(new GetGroupJoinRequestsQuery
            {
                GroupId = groupId,
                PageNumber = page,
                PageSize = pageSize
            });

            if (result.Succeeded)
                return Ok(result.Data);

            return BadRequest(result.Errors);
        }

        [HttpPut("requests/{requestId}/approve")]
        [Authorize(Roles = "Admin,Moderator")]
        public async Task<IActionResult> ApproveJoinRequest(Guid groupId, Guid requestId)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized();
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized();
            }

            var result = await Mediator.Send(new ApproveJoinRequestCommand
            {
                GroupId = groupId,
                RequestId = requestId,
                ApprovedByUserId = userGuid
            });

            if (result.Succeeded)
                return Ok(new { Message = "Join request approved successfully" });

            return BadRequest(result.Errors);
        }

        [HttpPut("requests/{requestId}/reject")]
        [Authorize(Roles = "Admin,Moderator")]
        public async Task<IActionResult> RejectJoinRequest(Guid groupId, Guid requestId, [FromBody] RejectJoinRequestRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized();
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized();
            }

            var result = await Mediator.Send(new RejectJoinRequestCommand
            {
                GroupId = groupId,
                RequestId = requestId,
                RejectedByUserId = userGuid,
                Reason = request.Reason
            });

            if (result.Succeeded)
                return Ok(new { Message = "Join request rejected successfully" });

            return BadRequest(result.Errors);
        }

        [HttpGet("test")]
        [AllowAnonymous]
        public IActionResult Test()
        {
            return Ok(new { message = "Group Members API is working", timestamp = DateTime.UtcNow });
        }
    }
}