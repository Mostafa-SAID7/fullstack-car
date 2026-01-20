using Application.Common.Models;
using Application.Features.Community.Events.DTOs;
using Application.Features.Community.Shared.Queries;
using Domain.Enums.Common;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Asp.Versioning;

namespace WebAPI.Controllers.Community.Guides
{
    [Authorize]
    [ApiVersion("2.0")]
    [Route("api/v{version:apiVersion}/guides/{guideId}/events")]
    public class GuideEventsController : BaseController
    {
        [HttpGet]
        public async Task<IActionResult> GetGuideEvents(
            Guid guideId,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] bool upcomingOnly = true)
        {
            var query = new GetRelatedEventsQuery
            {
                ContentType = ContentType.Guide,
                ContentId = guideId,
                PageNumber = page,
                PageSize = pageSize,
                UpcomingOnly = upcomingOnly
            };

            var result = await Mediator.Send(query);
            return Success(result, "Guide events retrieved successfully");
        }

        [HttpPost("{eventId}")]
        public async Task<IActionResult> LinkEvent(Guid guideId, Guid eventId)
        {
            var result = await Mediator.Send(new LinkEventCommand { EventId = eventId, TargetContentType = ContentType.Guide, TargetId = guideId });
            return result.Succeeded ? Success(result.Data, "Event linked to guide successfully") : BadRequest(result.Errors);
        }

        [HttpDelete("{eventId}")]
        public async Task<IActionResult> UnlinkEvent(Guid eventId)
        {
            var result = await Mediator.Send(new UnlinkEventCommand { EventId = eventId });
            return result.Succeeded ? Success(result.Data, "Event unlinked successfully") : BadRequest(result.Errors);
        }
    }
}
