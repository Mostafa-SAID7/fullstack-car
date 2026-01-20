using Application.Common.Models;
using Application.Features.Community.Shared.Commands;
using Application.Features.Community.Shared.Queries;
using Domain.Enums.Common;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Asp.Versioning;

namespace WebAPI.Controllers.Community.Groups
{
    [Authorize]
    [ApiVersion("2.0")]
    [Route("api/v{version:apiVersion}/groups/{groupId}/reviews")]
    public class GroupReviewsController : BaseController
    {
        [HttpGet]
        public async Task<IActionResult> GetGroupReviews(Guid groupId, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var query = new GetRelatedReviewsQuery { ContentType = ContentType.Group, ContentId = groupId, PageNumber = page, PageSize = pageSize };
            var result = await Mediator.Send(query);
            return Success(result, "Group reviews retrieved successfully");
        }
    }

    [Authorize]
    [ApiVersion("2.0")]
    [Route("api/v{version:apiVersion}/groups/{groupId}/locations")]
    public class GroupLocationsController : BaseController
    {
        [HttpGet]
        public async Task<IActionResult> GetGroupLocations(Guid groupId, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var query = new GetRelatedLocationsQuery { ContentType = ContentType.Group, ContentId = groupId, PageNumber = page, PageSize = pageSize };
            var result = await Mediator.Send(query);
            return Success(result, "Group locations retrieved successfully");
        }

        [HttpPost("{locationId}")]
        public async Task<IActionResult> LinkLocation(Guid groupId, Guid locationId)
        {
            var result = await Mediator.Send(new LinkLocationCommand { LocationId = locationId, TargetContentType = ContentType.Group, TargetId = groupId });
            return result.Succeeded ? Success(result.Data, "Location linked to group successfully") : BadRequest(result.Errors);
        }

        [HttpDelete("{locationId}")]
        public async Task<IActionResult> UnlinkLocation(Guid locationId)
        {
            var result = await Mediator.Send(new UnlinkLocationCommand { LocationId = locationId });
            return result.Succeeded ? Success(result.Data, "Location unlinked successfully") : BadRequest(result.Errors);
        }
    }
}
