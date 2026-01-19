using Application.Common.Attributes;
using Application.Features.Community.Posts.Queries;
using Application.Features.Identity.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using Asp.Versioning;

namespace WebAPI.Controllers.Community.Posts
{
    /// <summary>
    /// Discovery and query operations for Posts
    /// </summary>
    [Authorize]
    [ApiVersion("2.0")]
    [Route("api/v{version:apiVersion}/posts")]
    public class PostsQueriesController : BaseController
    {
        private readonly ICurrentUserService _currentUserService;

        public PostsQueriesController(ICurrentUserService currentUserService)
        {
            _currentUserService = currentUserService;
        }

        [HttpGet("trending")]
        [AllowAnonymous]
        [Cache(Duration = 300, Tags = new[] { "Posts", "Trending" }, VaryByParameters = new[] { "count", "timeframe" })]
        [OutputCache(PolicyName = "MediumCache", VaryByQueryKeys = new[] { "count", "timeframe" })]
        public async Task<IActionResult> GetTrendingPosts([FromQuery] int count = 10, [FromQuery] string timeframe = "day")
        {
            var result = await Mediator.Send(new GetTrendingPostsQuery { Count = count, Timeframe = timeframe });
            
            if (result.Succeeded)
                return Success(result.Data, "Trending posts retrieved successfully");

            return BadRequest("Failed to retrieve trending posts", result.Errors);
        }

        [HttpGet("user/{userId}")]
        [AllowAnonymous]
        [Cache(Duration = 120, Tags = new[] { "Posts", "UserPosts" }, VaryByParameters = new[] { "page", "pageSize" })]
        [OutputCache(PolicyName = "MediumCache", VaryByQueryKeys = new[] { "page", "pageSize" }, VaryByRouteValueNames = new[] { "userId" })]
        public async Task<IActionResult> GetUserPosts(Guid userId, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var result = await Mediator.Send(new GetUserPostsQuery 
            { 
                UserId = userId, 
                PageNumber = page, 
                PageSize = pageSize 
            });
            
            if (result.Succeeded)
                return Success(result.Data, "User posts retrieved successfully");

            return BadRequest("Failed to retrieve user posts", result.Errors);
        }

        [HttpGet("my")]
        [Cache(Duration = 60, Tags = new[] { "Posts", "MyPosts" }, VaryByParameters = new[] { "page", "pageSize" })]
        [OutputCache(PolicyName = "ShortCache", VaryByQueryKeys = new[] { "page", "pageSize" })]
        public async Task<IActionResult> GetMyPosts([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
                return Unauthorized("User authentication required");

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
                return Unauthorized("Invalid user context");

            var result = await Mediator.Send(new GetUserPostsQuery 
            { 
                UserId = userGuid, 
                PageNumber = page, 
                PageSize = pageSize 
            });

            if (result.Succeeded)
                return Success(result.Data, "My posts retrieved successfully");

            return BadRequest("Failed to retrieve my posts", result.Errors);
        }
    }
}
