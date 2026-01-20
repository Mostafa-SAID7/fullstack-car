using Application.Common.Models;
using Application.Features.Community.Shared.Commands;
using Application.Features.Community.Shared.Queries;
using Domain.Enums.Common;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Asp.Versioning;

namespace WebAPI.Controllers.Community.News
{
    [Authorize]
    [ApiVersion("2.0")]
    [Route("api/v{version:apiVersion}/news/{newsId}/groups")]
    public class NewsGroupsController : BaseController
    {
        [HttpGet]
        public async Task<IActionResult> GetNewsGroups(Guid newsId, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var query = new GetRelatedGroupsQuery { ContentType = ContentType.Article, ContentId = newsId, PageNumber = page, PageSize = pageSize };
            var result = await Mediator.Send(query);
            return Success(result, "News groups retrieved successfully");
        }

        [HttpPost("{groupId}")]
        public async Task<IActionResult> LinkGroup(Guid newsId, Guid groupId)
        {
            var result = await Mediator.Send(new LinkGroupCommand { GroupId = groupId, TargetContentType = ContentType.Article, TargetId = newsId });
            return result.Succeeded ? Success(result.Data, "Group linked to news successfully") : BadRequest(result.Errors);
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
    [Route("api/v{version:apiVersion}/news/{newsId}/reviews")]
    public class NewsReviewsController : BaseController
    {
        [HttpGet]
        public async Task<IActionResult> GetNewsReviews(Guid newsId, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var query = new GetRelatedReviewsQuery { ContentType = ContentType.Article, ContentId = newsId, PageNumber = page, PageSize = pageSize };
            var result = await Mediator.Send(query);
            return Success(result, "News reviews retrieved successfully");
        }
    }

    [Authorize]
    [ApiVersion("2.0")]
    [Route("api/v{version:apiVersion}/news/{newsId}/locations")]
    public class NewsLocationsController : BaseController
    {
        [HttpGet]
        public async Task<IActionResult> GetNewsLocations(Guid newsId, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var query = new GetRelatedLocationsQuery { ContentType = ContentType.Article, ContentId = newsId, PageNumber = page, PageSize = pageSize };
            var result = await Mediator.Send(query);
            return Success(result, "News locations retrieved successfully");
        }

        [HttpPost("{locationId}")]
        public async Task<IActionResult> LinkLocation(Guid newsId, Guid locationId)
        {
            var result = await Mediator.Send(new LinkLocationCommand { LocationId = locationId, TargetContentType = ContentType.Article, TargetId = newsId });
            return result.Succeeded ? Success(result.Data, "Location linked to news successfully") : BadRequest(result.Errors);
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
    [Route("api/v{version:apiVersion}/news/{newsId}/events")]
    public class NewsEventsController : BaseController
    {
        [HttpGet]
        public async Task<IActionResult> GetNewsEvents(Guid newsId, [FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] bool upcomingOnly = true)
        {
            var query = new GetRelatedEventsQuery { ContentType = ContentType.Article, ContentId = newsId, PageNumber = page, PageSize = pageSize, UpcomingOnly = upcomingOnly };
            var result = await Mediator.Send(query);
            return Success(result, "News events retrieved successfully");
        }

        [HttpPost("{eventId}")]
        public async Task<IActionResult> LinkEvent(Guid newsId, Guid eventId)
        {
            var result = await Mediator.Send(new LinkEventCommand { EventId = eventId, TargetContentType = ContentType.Article, TargetId = newsId });
            return result.Succeeded ? Success(result.Data, "Event linked to news successfully") : BadRequest(result.Errors);
        }

        [HttpDelete("{eventId}")]
        public async Task<IActionResult> UnlinkEvent(Guid eventId)
        {
            var result = await Mediator.Send(new UnlinkEventCommand { EventId = eventId });
            return result.Succeeded ? Success(result.Data, "Event unlinked successfully") : BadRequest(result.Errors);
        }
    }
}
