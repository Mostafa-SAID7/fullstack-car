using Application.Common.Models;
using Application.Features.Community.Reviews.DTOs;
using Application.Features.Community.Shared.Queries;
using Domain.Enums.Common;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Asp.Versioning;

namespace WebAPI.Controllers.Community.Guides
{
    [Authorize]
    [ApiVersion("2.0")]
    [Route("api/v{version:apiVersion}/guides/{guideId}/reviews")]
    public class GuideReviewsController : BaseController
    {
        [HttpGet]
        public async Task<IActionResult> GetGuideReviews(
            Guid guideId,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            var query = new GetRelatedReviewsQuery
            {
                ContentType = ContentType.Guide,
                ContentId = guideId,
                PageNumber = page,
                PageSize = pageSize
            };

            var result = await Mediator.Send(query);
            return Success(result, "Guide reviews retrieved successfully");
        }
    }
}
