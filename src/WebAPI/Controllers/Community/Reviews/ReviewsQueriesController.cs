using Application.Common.Attributes;
using Application.Features.Community.Reviews.Queries;
using Application.Features.Identity.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using Asp.Versioning;

namespace WebAPI.Controllers.Community.Reviews
{
    /// <summary>
    /// Discovery and query operations for Reviews
    /// </summary>
    [Authorize]
    [ApiVersion("2.0")]
    [Route("api/v{version:apiVersion}/reviews")]
    public class ReviewsQueriesController : BaseController
    {
        private readonly ICurrentUserService _currentUserService;

        public ReviewsQueriesController(ICurrentUserService currentUserService)
        {
            _currentUserService = currentUserService;
        }

        [HttpGet("trending")]
        [AllowAnonymous]
        [Cache(Duration = 600, Tags = new[] { "Reviews", "Trending" }, VaryByParameters = new[] { "pageSize" })]
        [OutputCache(PolicyName = "LongCache", VaryByQueryKeys = new[] { "pageSize" })]
        public async Task<IActionResult> GetTrendingReviews([FromQuery] int pageSize = 10)
        {
            var query = new GetTrendingReviewsQuery
            {
                PageSize = pageSize
            };

            var result = await Mediator.Send(query);
            
            if (result.Succeeded)
                return Success(result.Data, "Trending reviews retrieved successfully");

            return BadRequest("Failed to retrieve trending reviews", result.Errors);
        }

        [HttpGet("car/{brand}/{model}")]
        [AllowAnonymous]
        [Cache(Duration = 300, Tags = new[] { "Reviews", "CarReviews" }, VaryByParameters = new[] { "page", "pageSize", "sortBy" })]
        [OutputCache(PolicyName = "MediumCache", VaryByQueryKeys = new[] { "page", "pageSize", "sortBy", "sortDescending" }, VaryByRouteValueNames = new[] { "brand", "model" })]
        public async Task<IActionResult> GetCarReviews(
            string brand, 
            string model, 
            [FromQuery] int page = 1, 
            [FromQuery] int pageSize = 10,
            [FromQuery] string? sortBy = "CreatedAt",
            [FromQuery] bool sortDescending = true)
        {
            var query = new GetCarReviewsQuery
            {
                CarBrand = brand,
                CarModel = model,
                PageNumber = page,
                PageSize = pageSize,
                SortBy = sortBy,
                SortDescending = sortDescending
            };

            var result = await Mediator.Send(query);
            
            if (result.Succeeded)
                return Success(result.Data, $"{brand} {model} reviews retrieved successfully");

            return BadRequest("Failed to retrieve car reviews", result.Errors);
        }

        [HttpGet("user/{userId}")]
        [AllowAnonymous]
        [Cache(Duration = 300, Tags = new[] { "Reviews", "UserReviews" }, VaryByParameters = new[] { "page", "pageSize" })]
        [OutputCache(PolicyName = "MediumCache", VaryByQueryKeys = new[] { "page", "pageSize" }, VaryByRouteValueNames = new[] { "userId" })]
        public async Task<IActionResult> GetUserReviews(
            Guid userId, 
            [FromQuery] int page = 1, 
            [FromQuery] int pageSize = 10)
        {
            var query = new GetUserReviewsQuery
            {
                UserId = userId,
                PageNumber = page,
                PageSize = pageSize
            };

            var result = await Mediator.Send(query);
            
            if (result.Succeeded)
                return Success(result.Data, "User reviews retrieved successfully");

            return BadRequest("Failed to retrieve user reviews", result.Errors);
        }

        [HttpGet("my-reviews")]
        [Cache(Duration = 60, Tags = new[] { "Reviews", "MyReviews" }, VaryByParameters = new[] { "page", "pageSize" })]
        [OutputCache(PolicyName = "ShortCache", VaryByQueryKeys = new[] { "page", "pageSize" })]
        public async Task<IActionResult> GetMyReviews([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
                return Unauthorized("User authentication required");

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
                return Unauthorized("Invalid user context");

            var query = new GetUserReviewsQuery
            {
                UserId = userGuid,
                PageNumber = page,
                PageSize = pageSize
            };

            var result = await Mediator.Send(query);
            
            if (result.Succeeded)
                return Success(result.Data, "My reviews retrieved successfully");

            return BadRequest("Failed to retrieve my reviews", result.Errors);
        }

        [HttpGet("stats")]
        [AllowAnonymous]
        [Cache(Duration = 3600, Tags = new[] { "Reviews", "Stats" })]
        [OutputCache(PolicyName = "ExtraLongCache")]
        public async Task<IActionResult> GetReviewStats()
        {
            var query = new GetReviewStatsQuery();
            var result = await Mediator.Send(query);
            
            if (result.Succeeded)
                return Success(result.Data, "Review statistics retrieved successfully");

            return BadRequest("Failed to retrieve review statistics", result.Errors);
        }
    }
}
