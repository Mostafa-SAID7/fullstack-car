using Application.Common.Models;
using Application.Features.Community.Shared.Commands;
using Application.Features.Community.Shared.Queries;
using Domain.Enums.Common;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Asp.Versioning;

namespace WebAPI.Controllers.Community.Pages
{
    [Authorize]
    [ApiVersion("2.0")]
    [Route("api/v{version:apiVersion}/pages/{pageId}/groups")]
    public class PageGroupsController : BaseController
    {
        [HttpGet]
        public async Task<IActionResult> GetPageGroups(Guid pageId, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var query = new GetRelatedGroupsQuery { ContentType = ContentType.Page, ContentId = pageId, PageNumber = page, PageSize = pageSize };
            var result = await Mediator.Send(query);
            return Success(result, "Page groups retrieved successfully");
        }

        [HttpPost("{groupId}")]
        public async Task<IActionResult> LinkGroup(Guid pageId, Guid groupId)
        {
            var result = await Mediator.Send(new LinkGroupCommand { GroupId = groupId, TargetContentType = ContentType.Page, TargetId = pageId });
            return result.Succeeded ? Success(result.Data, "Group linked to page successfully") : BadRequest(result.Errors);
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
    [Route("api/v{version:apiVersion}/pages/{pageId}/reviews")]
    public class PageReviewsController : BaseController
    {
        [HttpGet]
        public async Task<IActionResult> GetPageReviews(Guid pageId, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var query = new GetRelatedReviewsQuery { ContentType = ContentType.Page, ContentId = pageId, PageNumber = page, PageSize = pageSize };
            var result = await Mediator.Send(query);
            return Success(result, "Page reviews retrieved successfully");
        }
    }

    [Authorize]
    [ApiVersion("2.0")]
    [Route("api/v{version:apiVersion}/pages/{pageId}/locations")]
    public class PageLocationsController : BaseController
    {
        [HttpGet]
        public async Task<IActionResult> GetPageLocations(Guid pageId, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var query = new GetRelatedLocationsQuery { ContentType = ContentType.Page, ContentId = pageId, PageNumber = page, PageSize = pageSize };
            var result = await Mediator.Send(query);
            return Success(result, "Page locations retrieved successfully");
        }

        [HttpPost("{locationId}")]
        public async Task<IActionResult> LinkLocation(Guid pageId, Guid locationId)
        {
            var result = await Mediator.Send(new LinkLocationCommand { LocationId = locationId, TargetContentType = ContentType.Page, TargetId = pageId });
            return result.Succeeded ? Success(result.Data, "Location linked to page successfully") : BadRequest(result.Errors);
        }

        [HttpDelete("{locationId}")]
        public async Task<IActionResult> UnlinkLocation(Guid locationId)
        {
            var result = await Mediator.Send(new UnlinkLocationCommand { LocationId = locationId });
            return result.Succeeded ? Success(result.Data, "Location unlinked successfully") : BadRequest(result.Errors);
        }
    }

    [Authorize]
    [ApiVersion("2.0")]
    [Route("api/v{version:apiVersion}/pages/{pageId}/events")]
    public class PageEventsController : BaseController
    {
        [HttpGet]
        public async Task<IActionResult> GetPageEvents(Guid pageId, [FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] bool upcomingOnly = true)
        {
            var query = new GetRelatedEventsQuery { ContentType = ContentType.Page, ContentId = pageId, PageNumber = page, PageSize = pageSize, UpcomingOnly = upcomingOnly };
            var result = await Mediator.Send(query);
            return Success(result, "Page events retrieved successfully");
        }

        [HttpPost("{eventId}")]
        public async Task<IActionResult> LinkEvent(Guid pageId, Guid eventId)
        {
            var result = await Mediator.Send(new LinkEventCommand { EventId = eventId, TargetContentType = ContentType.Page, TargetId = pageId });
            return result.Succeeded ? Success(result.Data, "Event linked to page successfully") : BadRequest(result.Errors);
        }

        [HttpDelete("{eventId}")]
        public async Task<IActionResult> UnlinkEvent(Guid eventId)
        {
            var result = await Mediator.Send(new UnlinkEventCommand { EventId = eventId });
            return result.Succeeded ? Success(result.Data, "Event unlinked successfully") : BadRequest(result.Errors);
        }
    }
}
