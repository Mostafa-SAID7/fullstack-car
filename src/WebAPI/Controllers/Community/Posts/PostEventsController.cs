using Application.Common.Models;
using Application.Features.Community.Events.DTOs;
using Application.Features.Community.Shared.Queries;
using Domain.Enums.Common;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Asp.Versioning;

namespace WebAPI.Controllers.Community.Posts
{
    [Authorize]
    [ApiVersion("2.0")]
    [Route("api/v{version:apiVersion}/posts/{postId}/events")]
    public class PostEventsController : BaseController
    {
        [HttpGet]
        public async Task<IActionResult> GetPostEvents(
            Guid postId,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] bool upcomingOnly = true)
        {
            var query = new GetRelatedEventsQuery
            {
                ContentType = ContentType.Post,
                ContentId = postId,
                PageNumber = page,
                PageSize = pageSize,
                UpcomingOnly = upcomingOnly
            };

            var result = await Mediator.Send(query);
            return Success(result, "Post events retrieved successfully");
        }

        [HttpPost("{eventId}")]
        public async Task<IActionResult> LinkEvent(Guid postId, Guid eventId)
        {
            var result = await Mediator.Send(new LinkEventCommand { EventId = eventId, TargetContentType = ContentType.Post, TargetId = postId });
            return result.Succeeded ? Success(result.Data, "Event linked to post successfully") : BadRequest(result.Errors);
        }

        [HttpDelete("{eventId}")]
        public async Task<IActionResult> UnlinkEvent(Guid eventId)
        {
            var result = await Mediator.Send(new UnlinkEventCommand { EventId = eventId });
            return result.Succeeded ? Success(result.Data, "Event unlinked successfully") : BadRequest(result.Errors);
        }
    }
}
