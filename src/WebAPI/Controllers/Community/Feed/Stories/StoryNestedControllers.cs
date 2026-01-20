using Application.Common.Models;
using Application.Features.Community.Shared.Commands;
using Application.Features.Community.Shared.Queries;
using Domain.Enums.Common;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Asp.Versioning;

namespace WebAPI.Controllers.Community.Stories
{
    [Authorize]
    [ApiVersion("2.0")]
    [Route("api/v{version:apiVersion}/stories/{storyId}/groups")]
    public class StoryGroupsController : BaseController
    {
        [HttpGet]
        public async Task<IActionResult> GetStoryGroups(Guid storyId, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var query = new GetRelatedGroupsQuery { ContentType = ContentType.Story, ContentId = storyId, PageNumber = page, PageSize = pageSize };
            var result = await Mediator.Send(query);
            return Success(result, "Story groups retrieved successfully");
        }

        [HttpPost("{groupId}")]
        public async Task<IActionResult> LinkGroup(Guid storyId, Guid groupId)
        {
            var result = await Mediator.Send(new LinkGroupCommand { GroupId = groupId, TargetContentType = ContentType.Story, TargetId = storyId });
            return result.Succeeded ? Success(result.Data, "Group linked to story successfully") : BadRequest(result.Errors);
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
    [Route("api/v{version:apiVersion}/stories/{storyId}/reviews")]
    public class StoryReviewsController : BaseController
    {
        [HttpGet]
        public async Task<IActionResult> GetStoryReviews(Guid storyId, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var query = new GetRelatedReviewsQuery { ContentType = ContentType.Story, ContentId = storyId, PageNumber = page, PageSize = pageSize };
            var result = await Mediator.Send(query);
            return Success(result, "Story reviews retrieved successfully");
        }
    }

    [Authorize]
    [ApiVersion("2.0")]
    [Route("api/v{version:apiVersion}/stories/{storyId}/locations")]
    public class StoryLocationsController : BaseController
    {
        [HttpGet]
        public async Task<IActionResult> GetStoryLocations(Guid storyId, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var query = new GetRelatedLocationsQuery { ContentType = ContentType.Story, ContentId = storyId, PageNumber = page, PageSize = pageSize };
            var result = await Mediator.Send(query);
            return Success(result, "Story locations retrieved successfully");
        }

        [HttpPost("{locationId}")]
        public async Task<IActionResult> LinkLocation(Guid storyId, Guid locationId)
        {
            var result = await Mediator.Send(new LinkLocationCommand { LocationId = locationId, TargetContentType = ContentType.Story, TargetId = storyId });
            return result.Succeeded ? Success(result.Data, "Location linked to story successfully") : BadRequest(result.Errors);
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
    [Route("api/v{version:apiVersion}/stories/{storyId}/events")]
    public class StoryEventsController : BaseController
    {
        [HttpGet]
        public async Task<IActionResult> GetStoryEvents(Guid storyId, [FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] bool upcomingOnly = true)
        {
            var query = new GetRelatedEventsQuery { ContentType = ContentType.Story, ContentId = storyId, PageNumber = page, PageSize = pageSize, UpcomingOnly = upcomingOnly };
            var result = await Mediator.Send(query);
            return Success(result, "Story events retrieved successfully");
        }

        [HttpPost("{eventId}")]
        public async Task<IActionResult> LinkEvent(Guid storyId, Guid eventId)
        {
            var result = await Mediator.Send(new LinkEventCommand { EventId = eventId, TargetContentType = ContentType.Story, TargetId = storyId });
            return result.Succeeded ? Success(result.Data, "Event linked to story successfully") : BadRequest(result.Errors);
        }

        [HttpDelete("{eventId}")]
        public async Task<IActionResult> UnlinkEvent(Guid eventId)
        {
            var result = await Mediator.Send(new UnlinkEventCommand { EventId = eventId });
            return result.Succeeded ? Success(result.Data, "Event unlinked successfully") : BadRequest(result.Errors);
        }
    }
}
