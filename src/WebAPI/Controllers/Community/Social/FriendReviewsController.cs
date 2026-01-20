using Application.Common.Models;
using Application.Features.Community.Reviews.DTOs;
using Application.Features.Community.Shared.Queries;
using Domain.Enums.Common;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Asp.Versioning;

namespace WebAPI.Controllers.Community.Social
{
    [Authorize]
    [ApiVersion("2.0")]
    [Route("api/v{version:apiVersion}/social/friends/{friendId}/reviews")]
    public class FriendReviewsController : BaseController
    {
        [HttpGet]
        public async Task<IActionResult> GetFriendReviews(
            Guid friendId,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            var query = new GetRelatedReviewsQuery
            {
                ContentType = ContentType.User,
                ContentId = friendId,
                PageNumber = page,
                PageSize = pageSize
            };

            var result = await Mediator.Send(query);
            return Success(result, "Friend reviews retrieved successfully");
        }
    }
}
