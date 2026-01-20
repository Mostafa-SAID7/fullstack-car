using Application.Common.Models;
using Application.Features.Community.Groups.DTOs;
using Application.Features.Community.Shared.Queries;
using Domain.Enums.Common;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Asp.Versioning;

namespace WebAPI.Controllers.Community.Posts
{
    [Authorize]
    [ApiVersion("2.0")]
    [Route("api/v{version:apiVersion}/posts/{postId}/groups")]
    public class PostGroupsController : BaseController
    {
        [HttpGet]
        public async Task<IActionResult> GetPostGroups(
            Guid postId,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            var query = new GetRelatedGroupsQuery
            {
                ContentType = ContentType.Post,
                ContentId = postId,
                PageNumber = page,
                PageSize = pageSize
            };

            var result = await Mediator.Send(query);
            return Success(result, "Post groups retrieved successfully");
        }

        [HttpPost("{groupId}")]
        public async Task<IActionResult> LinkGroup(Guid postId, Guid groupId)
        {
            var result = await Mediator.Send(new LinkGroupCommand { GroupId = groupId, TargetContentType = ContentType.Post, TargetId = postId });
            return result.Succeeded ? Success(result.Data, "Group linked to post successfully") : BadRequest(result.Errors);
        }

        [HttpDelete("{groupId}")]
        public async Task<IActionResult> UnlinkGroup(Guid groupId)
        {
            var result = await Mediator.Send(new UnlinkGroupCommand { GroupId = groupId });
            return result.Succeeded ? Success(result.Data, "Group unlinked successfully") : BadRequest(result.Errors);
        }
    }
}
