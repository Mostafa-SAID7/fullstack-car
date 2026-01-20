using Application.Common.Models;
using Application.Features.Community.Shared.Queries;
using Domain.Enums.Common;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Asp.Versioning;

namespace WebAPI.Controllers.Community.Social
{
    [Authorize]
    [ApiVersion("2.0")]
    [Route("api/v{version:apiVersion}/social/friends/{friendId}/locations")]
    public class FriendLocationsController : BaseController
    {
        [HttpGet]
        public async Task<IActionResult> GetFriendLocations(
            Guid friendId,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            var query = new GetRelatedLocationsQuery
            {
                ContentType = ContentType.User,
                ContentId = friendId,
                PageNumber = page,
                PageSize = pageSize
            };

            var result = await Mediator.Send(query);
            return Success(result, "Friend locations retrieved successfully");
        }

        [HttpPost("{locationId}")]
        public async Task<IActionResult> LinkLocation(Guid friendId, Guid locationId)
        {
            var result = await Mediator.Send(new LinkLocationCommand { LocationId = locationId, TargetContentType = ContentType.User, TargetId = friendId });
            return result.Succeeded ? Success(result.Data, "Location linked to friend successfully") : BadRequest(result.Errors);
        }

        [HttpDelete("{locationId}")]
        public async Task<IActionResult> UnlinkLocation(Guid locationId)
        {
            var result = await Mediator.Send(new UnlinkLocationCommand { LocationId = locationId });
            return result.Succeeded ? Success(result.Data, "Location unlinked successfully") : BadRequest(result.Errors);
        }
    }
}
