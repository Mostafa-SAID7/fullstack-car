using Application.Common.Models;
using Application.Features.Community.Groups.DTOs;
using Application.Features.Community.Shared.Queries;
using Domain.Enums.Common;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Asp.Versioning;

namespace WebAPI.Controllers.Community.Social
{
    [Authorize]
    [ApiVersion("2.0")]
    [Route("api/v{version:apiVersion}/social/friends/{friendId}/groups")]
    public class FriendGroupsController : BaseController
    {
        [HttpGet]
        public async Task<IActionResult> GetFriendGroups(
            Guid friendId,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            var query = new GetRelatedGroupsQuery
            {
                ContentType = ContentType.User,
                ContentId = friendId,
                PageNumber = page,
                PageSize = pageSize
            };

            var result = await Mediator.Send(query);
            return Success(result, "Friend groups retrieved successfully");
        }

        [HttpPost("{groupId}")]
        public async Task<IActionResult> LinkGroup(Guid friendId, Guid groupId)
        {
            var result = await Mediator.Send(new LinkGroupCommand { GroupId = groupId, TargetContentType = ContentType.User, TargetId = friendId });
            return result.Succeeded ? Success(result.Data, "Group linked to friend successfully") : BadRequest(result.Errors);
        }

        [HttpDelete("{groupId}")]
        public async Task<IActionResult> UnlinkGroup(Guid groupId)
        {
            var result = await Mediator.Send(new UnlinkGroupCommand { GroupId = groupId });
            return result.Succeeded ? Success(result.Data, "Group unlinked successfully") : BadRequest(result.Errors);
        }
    }
}
