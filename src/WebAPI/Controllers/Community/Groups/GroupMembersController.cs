using Application.Features.Identity.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using Asp.Versioning;
using WebAPI.Extensions;

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
        public async Task<IActionResult> GetGroupMembers(Guid groupId, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            try
            {
                var members = new List<object>
                {
                    new { Id = Guid.NewGuid(), GroupId = groupId, UserId = Guid.NewGuid(), Role = "Member", JoinedAt = DateTime.UtcNow },
                    new { Id = Guid.NewGuid(), GroupId = groupId, UserId = Guid.NewGuid(), Role = "Moderator", JoinedAt = DateTime.UtcNow.AddDays(-5) }
                };

                return Success(members, "Group members retrieved successfully");
            }
            catch (Exception ex)
            {
                return BadRequest("Error occurred", new[] { "Failed to retrieve group members" });
            }
        }

        [HttpPost("invite")]
        [Authorize(Roles = "Admin,Moderator")]
        public async Task<IActionResult> InviteMember(Guid groupId, [FromBody] InviteMemberRequest request)
        {
            try
            {
                var invitation = new { GroupId = groupId, Email = request.Email, Role = request.Role, InvitedAt = DateTime.UtcNow };
                return Success(invitation, "Member invited successfully");
            }
            catch (Exception ex)
            {
                return BadRequest("Error occurred", new[] { "Failed to invite member" });
            }
        }

        [HttpDelete("{memberId}")]
        [Authorize(Roles = "Admin,Moderator")]
        public async Task<IActionResult> RemoveMember(Guid groupId, Guid memberId, [FromBody] RemoveMemberRequest request)
        {
            try
            {
                var result = new { GroupId = groupId, MemberId = memberId, RemovedAt = DateTime.UtcNow, Reason = request.Reason };
                return Success(result, "Member removed successfully");
            }
            catch (Exception ex)
            {
                return BadRequest("Error occurred", new[] { "Failed to remove member" });
            }
        }
    }

    // Mock DTOs
    public class InviteMemberRequest
    {
        public string Email { get; set; } = string.Empty;
        public string? Message { get; set; }
        public string Role { get; set; } = "Member";
    }

    public class RemoveMemberRequest
    {
        public string? Reason { get; set; }
    }
}


