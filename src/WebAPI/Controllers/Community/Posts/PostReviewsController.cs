using Application.Common.Models;
using Application.Features.Community.Reviews.DTOs;
using Application.Features.Community.Shared.Queries;
using Domain.Enums.Common;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Asp.Versioning;

namespace WebAPI.Controllers.Community.Posts
{
    [Authorize]
    [ApiVersion("2.0")]
    [Route("api/v{version:apiVersion}/posts/{postId}/reviews")]
    public class PostReviewsController : BaseController
    {
        [HttpGet]
        public async Task<IActionResult> GetPostReviews(
            Guid postId,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            var query = new GetRelatedReviewsQuery
            {
                ContentType = ContentType.Post,
                ContentId = postId,
                PageNumber = page,
                PageSize = pageSize
            };

            var result = await Mediator.Send(query);
            return Success(result, "Post reviews retrieved successfully");
        }
    }
}
