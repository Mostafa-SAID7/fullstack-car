using Application.Common.Attributes;
using Application.Common.DTOs;
using Application.Features.Community.Posts.Commands;
using Application.Features.Community.Posts.DTOs;
using Application.Features.Community.Posts.Queries;
using Application.Features.Identity.Core.Interfaces;
using Application.Features.Shared.Localization.Interfaces;
using Application.Features.Shared.Notifications.Interfaces;
using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;

namespace WebAPI.Controllers.Community.Posts
{
    /// <summary>
    /// Core CRUD operations for Posts
    /// </summary>
    [Authorize]
    [ApiVersion("2.0")]
    [Route("api/v{version:apiVersion}/posts")]
    public class PostsController : BaseController
    {
        private readonly ICurrentUserService _currentUserService;
        private readonly ILocalizationProvider _localizationProvider;
        private readonly INotificationService _notificationService;
        private readonly ILogger<PostsController> _logger;

        public PostsController(
            ICurrentUserService currentUserService,
            ILocalizationProvider localizationProvider,
            INotificationService notificationService,
            ILogger<PostsController> logger)
        {
            _currentUserService = currentUserService;
            _localizationProvider = localizationProvider;
            _notificationService = notificationService;
            _logger = logger;
        }

        [HttpGet]
        [AllowAnonymous]
        [Cache(Duration = 60, Tags = new[] { "Posts" }, VaryByParameters = new[] { "PageNumber", "PageSize", "UserId", "GroupId", "Status", "SortBy" })]
        [OutputCache(PolicyName = "ShortCache", VaryByQueryKeys = new[] { "PageNumber", "PageSize", "UserId", "GroupId", "Status", "SortBy", "SortDescending" })]
        public async Task<IActionResult> GetPosts([FromQuery] GetPostsQuery query)
        {
            _logger.LogInformation("Retrieving posts with query: {@Query}", query);
            var result = await Mediator.Send(query);
            
            if (result.Succeeded)
                return Success(result.Data, await _localizationProvider.GetTranslationAsync("en-US", "Posts.Retrieved"));

            _logger.LogWarning("Failed to retrieve posts: {Errors}", string.Join(", ", result.Errors));
            return BadRequest(await _localizationProvider.GetTranslationAsync("en-US", "Error"), result.Errors);
        }

        [HttpGet("{id}")]
        [AllowAnonymous]
        [Cache(Duration = 60, Tags = new[] { "Posts" })]
        [OutputCache(PolicyName = "ShortCache", VaryByRouteValueNames = new[] { "id" })]
        public async Task<IActionResult> GetPost(Guid id)
        {
            var result = await Mediator.Send(new GetPostByIdQuery { Id = id });
            
            if (result.Succeeded)
                return Success(result.Data, "Post retrieved successfully");

             if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Post not found");

            return BadRequest("Failed to retrieve post", result.Errors);
        }

        [HttpPost]
        public async Task<IActionResult> CreatePost([FromBody] CreatePostRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
                return Unauthorized("User authentication required");

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
                return Unauthorized("Invalid user context");

            _logger.LogInformation("Creating post for user {UserId}", userGuid);

            var command = new CreatePostCommand
            {
                Request = request,
                UserId = userGuid
            };

            var result = await Mediator.Send(command);
            
            if (result.Succeeded)
            {
                _logger.LogInformation("Post created successfully. Id: {PostId}", result.Data.Id);
                var location = Url.Action(nameof(GetPost), new { id = result.Data.Id });
                return Created(result.Data, location!, await _localizationProvider.GetTranslationAsync("en-US", "Posts.Created"));
            }

            _logger.LogWarning("Failed to create post. Errors: {Errors}", string.Join(", ", result.Errors));
            return BadRequest(await _localizationProvider.GetTranslationAsync("en-US", "Error"), result.Errors);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePost(Guid id, [FromBody] UpdatePostRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
                return Unauthorized("User authentication required");

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
                return Unauthorized("Invalid user context");

            var result = await Mediator.Send(new UpdatePostCommand
            {
                Id = id,
                UserId = userGuid,
                Request = request
            });

            if (result.Succeeded)
            {
                _logger.LogInformation("Post updated successfully. Id: {PostId}", id);
                return Success(result.Data, "Post updated successfully");
            }

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Post not found");

            if (result.Errors.Any(e => e.Contains("unauthorized") || e.Contains("permission")))
                return Forbidden("You don't have permission to update this post");

            return BadRequest("Failed to update post", result.Errors);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePost(Guid id)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
                return Unauthorized("User authentication required");

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
                return Unauthorized("Invalid user context");

            var result = await Mediator.Send(new DeletePostCommand
            {
                PostId = id,
                UserId = userGuid
            });

            if (result.Succeeded)
            {
                _logger.LogInformation("Post deleted successfully. Id: {PostId}", id);
                return Success("Post deleted successfully");
            }

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Post not found");

            if (result.Errors.Any(e => e.Contains("unauthorized") || e.Contains("permission")))
                return Forbidden("You don't have permission to delete this post");

            return BadRequest("Failed to delete post", result.Errors);
        }

        [HttpGet("{id}/comments")]
        [AllowAnonymous]
        [Cache(Duration = 30, Tags = new[] { "Posts", "Comments" }, VaryByParameters = new[] { "page", "pageSize" })]
        [OutputCache(PolicyName = "ShortCache", VaryByQueryKeys = new[] { "page", "pageSize" }, VaryByRouteValueNames = new[] { "id" })]
        public async Task<IActionResult> GetPostComments(Guid id, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var result = await Mediator.Send(new GetPostCommentsQuery
            {
                PostId = id,
                Page = page,
                PageSize = pageSize
            });

            if (result.Succeeded)
                return Success(result.Data, "Post comments retrieved successfully");

            return BadRequest("Failed to retrieve comments", result.Errors);
        }
    }
}
