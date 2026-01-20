using Application.Common.Models;
using Application.Features.Community.Shared.Commands;
using Application.Features.Community.Shared.Queries;
using Domain.Enums.Common;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Asp.Versioning;

namespace WebAPI.Controllers.Community.Maps
{
    [Authorize]
    [ApiVersion("2.0")]
    [Route("api/v{version:apiVersion}/maps/{locationId}/groups")]
    public class LocationGroupsController : BaseController
    {
        [HttpGet]
        public async Task<IActionResult> GetLocationGroups(Guid locationId, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var query = new GetRelatedGroupsQuery { ContentType = ContentType.Location, ContentId = locationId, PageNumber = page, PageSize = pageSize };
            var result = await Mediator.Send(query);
            return Success(result, "Location groups retrieved successfully");
        }

        [HttpPost("{groupId}")]
        public async Task<IActionResult> LinkGroup(Guid locationId, Guid groupId)
        {
            var result = await Mediator.Send(new LinkGroupCommand { GroupId = groupId, TargetContentType = ContentType.Location, TargetId = locationId });
            return result.Succeeded ? Success(result.Data, "Group linked to location successfully") : BadRequest(result.Errors);
        }

        [HttpDelete("{groupId}")]
        public async Task<IActionResult> UnlinkGroup(Guid groupId)
        {
            var result = await Mediator.Send(new UnlinkGroupCommand { GroupId = groupId });
            return result.Succeeded ? Success(result.Data, "Group unlinked successfully") : BadRequest(result.Errors);
        }
    }

    [Authorize]
    [ApiVersion("2.0")]
    [Route("api/v{version:apiVersion}/maps/{locationId}/events")]
    public class LocationEventsController : BaseController
    {
        [HttpGet]
        public async Task<IActionResult> GetLocationEvents(Guid locationId, [FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] bool upcomingOnly = true)
        {
            var query = new GetRelatedEventsQuery { ContentType = ContentType.Location, ContentId = locationId, PageNumber = page, PageSize = pageSize, UpcomingOnly = upcomingOnly };
            var result = await Mediator.Send(query);
            return Success(result, "Location events retrieved successfully");
        }

        [HttpPost("{eventId}")]
        public async Task<IActionResult> LinkEvent(Guid locationId, Guid eventId)
        {
            var result = await Mediator.Send(new LinkEventCommand { EventId = eventId, TargetContentType = ContentType.Location, TargetId = locationId });
            return result.Succeeded ? Success(result.Data, "Event linked to location successfully") : BadRequest(result.Errors);
        }

        [HttpDelete("{eventId}")]
        public async Task<IActionResult> UnlinkEvent(Guid eventId)
        {
            var result = await Mediator.Send(new UnlinkEventCommand { EventId = eventId });
            return result.Succeeded ? Success(result.Data, "Event unlinked successfully") : BadRequest(result.Errors);
        }
    }
}
