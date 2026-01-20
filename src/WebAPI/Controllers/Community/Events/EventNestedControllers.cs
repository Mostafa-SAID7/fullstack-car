using Application.Common.Models;
using Application.Features.Community.Shared.Commands;
using Application.Features.Community.Shared.Queries;
using Domain.Enums.Common;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Asp.Versioning;

namespace WebAPI.Controllers.Community.Events
{
    [Authorize]
    [ApiVersion("2.0")]
    [Route("api/v{version:apiVersion}/events/{eventId}/groups")]
    public class EventGroupsController : BaseController
    {
        [HttpGet]
        public async Task<IActionResult> GetEventGroups(Guid eventId, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var query = new GetRelatedGroupsQuery { ContentType = ContentType.Event, ContentId = eventId, PageNumber = page, PageSize = pageSize };
            var result = await Mediator.Send(query);
            return Success(result, "Event groups retrieved successfully");
        }

        [HttpPost("{groupId}")]
        public async Task<IActionResult> LinkGroup(Guid eventId, Guid groupId)
        {
            var result = await Mediator.Send(new LinkGroupCommand { GroupId = groupId, TargetContentType = ContentType.Event, TargetId = eventId });
            return result.Succeeded ? Success(result.Data, "Group linked to event successfully") : BadRequest(result.Errors);
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
    [Route("api/v{version:apiVersion}/events/{eventId}/reviews")]
    public class EventReviewsController : BaseController
    {
        [HttpGet]
        public async Task<IActionResult> GetEventReviews(Guid eventId, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var query = new GetRelatedReviewsQuery { ContentType = ContentType.Event, ContentId = eventId, PageNumber = page, PageSize = pageSize };
            var result = await Mediator.Send(query);
            return Success(result, "Event reviews retrieved successfully");
        }
    }

    [Authorize]
    [ApiVersion("2.0")]
    [Route("api/v{version:apiVersion}/events/{eventId}/locations")]
    public class EventLocationsController : BaseController
    {
        [HttpGet]
        public async Task<IActionResult> GetEventLocations(Guid eventId, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var query = new GetRelatedLocationsQuery { ContentType = ContentType.Event, ContentId = eventId, PageNumber = page, PageSize = pageSize };
            var result = await Mediator.Send(query);
            return Success(result, "Event locations retrieved successfully");
        }

        [HttpPost("{locationId}")]
        public async Task<IActionResult> LinkLocation(Guid eventId, Guid locationId)
        {
            var result = await Mediator.Send(new LinkLocationCommand { LocationId = locationId, TargetContentType = ContentType.Event, TargetId = eventId });
            return result.Succeeded ? Success(result.Data, "Location linked to event successfully") : BadRequest(result.Errors);
        }

        [HttpDelete("{locationId}")]
        public async Task<IActionResult> UnlinkLocation(Guid locationId)
        {
            var result = await Mediator.Send(new UnlinkLocationCommand { LocationId = locationId });
            return result.Succeeded ? Success(result.Data, "Location unlinked successfully") : BadRequest(result.Errors);
        }
    }
}
