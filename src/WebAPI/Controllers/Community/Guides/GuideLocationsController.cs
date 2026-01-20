using Application.Common.Models;
using Application.Features.Community.Shared.Queries;
using Domain.Enums.Common;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Asp.Versioning;

namespace WebAPI.Controllers.Community.Guides
{
    [Authorize]
    [ApiVersion("2.0")]
    [Route("api/v{version:apiVersion}/guides/{guideId}/locations")]
    public class GuideLocationsController : BaseController
    {
        [HttpGet]
        public async Task<IActionResult> GetGuideLocations(
            Guid guideId,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            var query = new GetRelatedLocationsQuery
            {
                ContentType = ContentType.Guide,
                ContentId = guideId,
                PageNumber = page,
                PageSize = pageSize
            };

            var result = await Mediator.Send(query);
            return Success(result, "Guide locations retrieved successfully");
        }

        [HttpPost("{locationId}")]
        public async Task<IActionResult> LinkLocation(Guid guideId, Guid locationId)
        {
            var result = await Mediator.Send(new LinkLocationCommand { LocationId = locationId, TargetContentType = ContentType.Guide, TargetId = guideId });
            return result.Succeeded ? Success(result.Data, "Location linked to guide successfully") : BadRequest(result.Errors);
        }

        [HttpDelete("{locationId}")]
        public async Task<IActionResult> UnlinkLocation(Guid locationId)
        {
            var result = await Mediator.Send(new UnlinkLocationCommand { LocationId = locationId });
            return result.Succeeded ? Success(result.Data, "Location unlinked successfully") : BadRequest(result.Errors);
        }
    }
}
