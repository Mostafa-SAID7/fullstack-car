using Application.Common.Models;
using Application.Features.Community.Shared.Queries;
using Domain.Enums.Common;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Asp.Versioning;

namespace WebAPI.Controllers.Community.Posts
{
    [Authorize]
    [ApiVersion("2.0")]
    [Route("api/v{version:apiVersion}/posts/{postId}/locations")]
    public class PostLocationsController : BaseController
    {
        [HttpGet]
        public async Task<IActionResult> GetPostLocations(
            Guid postId,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            var query = new GetRelatedLocationsQuery
            {
                ContentType = ContentType.Post,
                ContentId = postId,
                PageNumber = page,
                PageSize = pageSize
            };

            var result = await Mediator.Send(query);
            return Success(result, "Post locations retrieved successfully");
        }

        [HttpPost("{locationId}")]
        public async Task<IActionResult> LinkLocation(Guid postId, Guid locationId)
        {
            var result = await Mediator.Send(new LinkLocationCommand { LocationId = locationId, TargetContentType = ContentType.Post, TargetId = postId });
            return result.Succeeded ? Success(result.Data, "Location linked to post successfully") : BadRequest(result.Errors);
        }

        [HttpDelete("{locationId}")]
        public async Task<IActionResult> UnlinkLocation(Guid locationId)
        {
            var result = await Mediator.Send(new UnlinkLocationCommand { LocationId = locationId });
            return result.Succeeded ? Success(result.Data, "Location unlinked successfully") : BadRequest(result.Errors);
        }
    }
}
