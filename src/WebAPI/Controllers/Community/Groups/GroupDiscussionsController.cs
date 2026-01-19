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
    [Route("api/v{version:apiVersion}/groups/{groupId}/discussions")]
    public class GroupDiscussionsController : BaseController
    {
        private readonly ICurrentUserService _currentUserService;

        public GroupDiscussionsController(ICurrentUserService currentUserService)
        {
            _currentUserService = currentUserService;
        }

        [HttpGet]
        [AllowAnonymous]
        [OutputCache(Duration = 180, Tags = new[] { "Groups", "Discussions" })]
        public async Task<IActionResult> GetGroupDiscussions(
            Guid groupId,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? category = null,
            [FromQuery] string? sortBy = "LastActivity",
            [FromQuery] bool sortDescending = true,
            [FromQuery] bool? isPinned = null)
        {
            var query = new GetGroupDiscussionsQuery
            {
                GroupId = groupId,
                PageNumber = page,
                PageSize = pageSize,
                Category = category,
                SortBy = sortBy,
                SortDescending = sortDescending,
                IsPinned = isPinned
            };

            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "Group discussions retrieved successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Group not found");

            return BadRequest("Failed to retrieve group discussions", result.Errors);
        }

        [HttpGet("{discussionId}")]
        [AllowAnonymous]
        [OutputCache(Duration = 300, Tags = new[] { "Groups", "Discussions" })]
        public async Task<IActionResult> GetGroupDiscussion(Guid groupId, Guid discussionId)
        {
            var userId = _currentUserService.IsAuthenticated && Guid.TryParse(_currentUserService.UserId, out var userGuid) 
                ? userGuid : (Guid?)null;

            var query = new GetGroupDiscussionQuery
            {
                GroupId = groupId,
                DiscussionId = discussionId,
                UserId = userId
            };

            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "Group discussion retrieved successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Discussion not found");

            return BadRequest("Failed to retrieve group discussion", result.Errors);
        }

        [HttpPost]
        public async Task<IActionResult> CreateGroupDiscussion(Guid groupId, [FromBody] CreateGroupDiscussionRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new CreateGroupDiscussionCommand
            {
                GroupId = groupId,
                CreatedBy = userGuid,
                Request = request
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
            {
                dynamic discussionData = result.Data;
                var location = Url.Action(nameof(GetGroupDiscussion), new { groupId, discussionId = discussionData.Id });
                return Created(result.Data, location!, "Group discussion created successfully");
            }

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Group not found");

            if (result.Errors.Any(e => e.Contains("not member")))
                return BadRequest("You must be a group member to create discussions", result.Errors);

            return BadRequest("Failed to create group discussion", result.Errors);
        }

        [HttpPut("{discussionId}")]
        public async Task<IActionResult> UpdateGroupDiscussion(Guid groupId, Guid discussionId, [FromBody] UpdateGroupDiscussionRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new UpdateGroupDiscussionCommand
            {
                GroupId = groupId,
                DiscussionId = discussionId,
                UpdatedBy = userGuid,
                Request = request
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Success(result.Data, "Group discussion updated successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Discussion not found");

            if (result.Errors.Any(e => e.Contains("permission")))
                return Forbidden("You don't have permission to update this discussion");

            return BadRequest("Failed to update group discussion", result.Errors);
        }

        [HttpDelete("{discussionId}")]
        public async Task<IActionResult> DeleteGroupDiscussion(Guid groupId, Guid discussionId)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new DeleteGroupDiscussionCommand
            {
                GroupId = groupId,
                DiscussionId = discussionId,
                DeletedBy = userGuid
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Success("Group discussion deleted successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Discussion not found");

            if (result.Errors.Any(e => e.Contains("permission")))
                return Forbidden("You don't have permission to delete this discussion");

            return BadRequest("Failed to delete group discussion", result.Errors);
        }

        [HttpPost("{discussionId}/pin")]
        [Authorize(Roles = "Admin,Moderator")]
        public async Task<IActionResult> PinDiscussion(Guid groupId, Guid discussionId)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new PinGroupDiscussionCommand
            {
                GroupId = groupId,
                DiscussionId = discussionId,
                PinnedBy = userGuid
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Success("Discussion pinned successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Discussion not found");

            if (result.Errors.Any(e => e.Contains("already pinned")))
                return BadRequest("Discussion is already pinned", result.Errors);

            return BadRequest("Failed to pin discussion", result.Errors);
        }

        [HttpDelete("{discussionId}/pin")]
        [Authorize(Roles = "Admin,Moderator")]
        public async Task<IActionResult> UnpinDiscussion(Guid groupId, Guid discussionId)
        {
            var command = new UnpinGroupDiscussionCommand
            {
                GroupId = groupId,
                DiscussionId = discussionId
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Success("Discussion unpinned successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Discussion not found");

            return BadRequest("Failed to unpin discussion", result.Errors);
        }

        [HttpPost("{discussionId}/lock")]
        [Authorize(Roles = "Admin,Moderator")]
        public async Task<IActionResult> LockDiscussion(Guid groupId, Guid discussionId, [FromBody] LockDiscussionRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new LockGroupDiscussionCommand
            {
                GroupId = groupId,
                DiscussionId = discussionId,
                LockedBy = userGuid,
                Request = request
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Success("Discussion locked successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Discussion not found");

            return BadRequest("Failed to lock discussion", result.Errors);
        }

        [HttpDelete("{discussionId}/lock")]
        [Authorize(Roles = "Admin,Moderator")]
        public async Task<IActionResult> UnlockDiscussion(Guid groupId, Guid discussionId)
        {
            var command = new UnlockGroupDiscussionCommand
            {
                GroupId = groupId,
                DiscussionId = discussionId
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Success("Discussion unlocked successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Discussion not found");

            return BadRequest("Failed to unlock discussion", result.Errors);
        }

        [HttpGet("{discussionId}/replies")]
        [AllowAnonymous]
        [OutputCache(Duration = 180, Tags = new[] { "Groups", "DiscussionReplies" })]
        public async Task<IActionResult> GetDiscussionReplies(
            Guid groupId,
            Guid discussionId,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20,
            [FromQuery] string? sortBy = "CreatedAt",
            [FromQuery] bool sortDescending = false)
        {
            var query = new GetDiscussionRepliesQuery
            {
                GroupId = groupId,
                DiscussionId = discussionId,
                PageNumber = page,
                PageSize = pageSize,
                SortBy = sortBy,
                SortDescending = sortDescending
            };

            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "Discussion replies retrieved successfully");

            return BadRequest("Failed to retrieve discussion replies", result.Errors);
        }

        [HttpPost("{discussionId}/replies")]
        public async Task<IActionResult> ReplyToDiscussion(Guid groupId, Guid discussionId, [FromBody] CreateDiscussionReplyRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new CreateDiscussionReplyCommand
            {
                GroupId = groupId,
                DiscussionId = discussionId,
                CreatedBy = userGuid,
                Request = request
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Success(result.Data, "Reply created successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Discussion not found");

            if (result.Errors.Any(e => e.Contains("locked")))
                return BadRequest("Cannot reply to a locked discussion", result.Errors);

            if (result.Errors.Any(e => e.Contains("not member")))
                return BadRequest("You must be a group member to reply", result.Errors);

            return BadRequest("Failed to create reply", result.Errors);
        }

        [HttpGet("categories")]
        [AllowAnonymous]
        [OutputCache(Duration = 3600, Tags = new[] { "Groups", "DiscussionCategories" })]
        public async Task<IActionResult> GetDiscussionCategories(Guid groupId)
        {
            var query = new GetGroupDiscussionCategoriesQuery { GroupId = groupId };
            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "Discussion categories retrieved successfully");

            return BadRequest("Failed to retrieve discussion categories", result.Errors);
        }

        [HttpGet("search")]
        [AllowAnonymous]
        [OutputCache(Duration = 180, Tags = new[] { "Groups", "DiscussionSearch" })]
        public async Task<IActionResult> SearchDiscussions(
            Guid groupId,
            [FromQuery] string query,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? category = null)
        {
            var searchQuery = new SearchGroupDiscussionsQuery
            {
                GroupId = groupId,
                SearchTerm = query,
                PageNumber = page,
                PageSize = pageSize,
                Category = category
            };

            var result = await Mediator.Send(searchQuery);

            if (result.Succeeded)
                return Success(result.Data, "Discussion search completed successfully");

            return BadRequest("Failed to search discussions", result.Errors);
        }
    }
}