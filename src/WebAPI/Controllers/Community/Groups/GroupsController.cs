using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using Application.Common.Interfaces.Identity;
using Application.Features.Community.Groups.Commands;
using Application.Features.Community.Groups.DTOs;
using Application.Features.Community.Groups.Queries;
using Application.Features.Community.Posts.Queries;

namespace WebAPI.Controllers.Community.Groups
{
    [Authorize]
    [Route("api/community/groups")]
    public class GroupsController : BaseController
    {
        private readonly ICurrentUserService _currentUserService;

        public GroupsController(ICurrentUserService currentUserService)
        {
            _currentUserService = currentUserService;
        }

        [HttpGet]
        [OutputCache(Duration = 60, Tags = new[] { "Groups" })]
        public async Task<IActionResult> GetGroups([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var result = await Mediator.Send(new GetGroupsQuery { PageNumber = page, PageSize = pageSize });

            if (result.Succeeded)
                return Ok(result.Data);

            return BadRequest(result.Errors);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetGroup(Guid id)
        {
            var result = await Mediator.Send(new GetGroupByIdQuery { Id = id });

            if (result.Succeeded)
                return Ok(result.Data);

            return BadRequest(result.Errors);
        }

        [HttpPost]
        public async Task<IActionResult> CreateGroup([FromBody] CreateGroupRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized();
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized();
            }

            var result = await Mediator.Send(new CreateGroupCommand
            {
                OwnerId = userGuid,
                Request = request
            });

            if (result.Succeeded)
                return CreatedAtAction(nameof(GetGroup), new { id = result.Data.Id }, result.Data);

            return BadRequest(result.Errors);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateGroup(Guid id, [FromBody] UpdateGroupRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized();
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized();
            }

            var result = await Mediator.Send(new UpdateGroupCommand
            {
                Id = id,
                UserId = userGuid,
                Request = request
            });

            if (result.Succeeded)
                return Ok(result.Data);

            return BadRequest(result.Errors);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteGroup(Guid id)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized();
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized();
            }

            var result = await Mediator.Send(new DeleteGroupCommand
            {
                Id = id,
                UserId = userGuid
            });

            if (result.Succeeded)
                return NoContent();

            return BadRequest(result.Errors);
        }

        [HttpPost("{id}/join")]
        public async Task<IActionResult> JoinGroup(Guid id)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized();
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized();
            }

            var result = await Mediator.Send(new JoinGroupCommand { GroupId = id, UserId = userGuid });

            if (result.Succeeded)
                return Ok(new { Message = "Successfully joined group" });

            return BadRequest(result.Errors);
        }

        [HttpPost("{id}/leave")]
        public async Task<IActionResult> LeaveGroup(Guid id)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized();
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized();
            }

            var result = await Mediator.Send(new LeaveGroupCommand { GroupId = id, UserId = userGuid });

            if (result.Succeeded)
                return Ok(new { Message = "Successfully left group" });

            return BadRequest(result.Errors);
        }

        [HttpGet("{id}/members")]
        public async Task<IActionResult> GetGroupMembers(Guid id, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var result = await Mediator.Send(new GetGroupMembersQuery
            {
                GroupId = id,
                PageNumber = page,
                PageSize = pageSize
            });

            if (result.Succeeded)
                return Ok(result.Data);

            return BadRequest(result.Errors);
        }

        [HttpGet("{id}/posts")]
        public async Task<IActionResult> GetGroupPosts(Guid id, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var result = await Mediator.Send(new GetPostsQuery
            {
                GroupId = id,
                PageNumber = page,
                PageSize = pageSize
            });

            if (result.Succeeded)
                return Ok(result.Data);

            return BadRequest(result.Errors);
        }

        [Authorize(Roles = "Admin,Moderator")]
        [HttpPut("{id}/moderate")]
        public IActionResult ModerateGroup(Guid id, [FromBody] ModerateGroupRequest request)
        {
            return Ok(new { Message = "Group moderated successfully" });
        }
    }

    public class ModerateGroupRequest
    {
        public string Action { get; set; } = string.Empty;
        public string Reason { get; set; } = string.Empty;
    }
}