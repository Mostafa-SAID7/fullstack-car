using Application.Common.Attributes;
using Application.Features.Community.Posts.Commands;
using Application.Features.Community.Posts.DTOs;
using Application.Features.Community.Posts.Queries;
using Application.Features.Identity.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using Asp.Versioning;

namespace WebAPI.Controllers.Community.Posts
{
    /// <summary>
    /// Admin and moderator operations for Posts
    /// </summary>
    [Authorize(Roles = "Admin,Moderator")]
    [ApiVersion("2.0")]
    [Route("api/v{version:apiVersion}/posts")]
    public class PostsAdminController : BaseController
    {
        private readonly ICurrentUserService _currentUserService;
        private readonly ILogger<PostsAdminController> _logger;

        public PostsAdminController(
            ICurrentUserService currentUserService,
            ILogger<PostsAdminController> logger)
        {
            _currentUserService = currentUserService;
            _logger = logger;
        }

        [HttpPut("{id}/moderate")]
        public async Task<IActionResult> ModeratePost(Guid id, [FromBody] ModeratePostRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
                return Unauthorized("User authentication required");

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
                return Unauthorized("Invalid user context");

            _logger.LogInformation("Moderating post {PostId} by user {ModeratorId}. Action: {Action}", id, userGuid, request.Action);

            var command = new ModeratePostCommand
            {
                PostId = id,
                ModeratorId = userGuid,
                Action = request.Action,
                Reason = request.Reason
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Success("Post moderated successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Post not found");

            return BadRequest("Failed to moderate post", result.Errors);
        }

        [HttpGet("{id}/analytics")]
        [Cache(Duration = 300, Tags = new[] { "Posts", "Analytics" })]
        [OutputCache(PolicyName = "MediumCache", VaryByRouteValueNames = new[] { "id" })]
        public async Task<IActionResult> GetPostAnalytics(Guid id)
        {
            var result = await Mediator.Send(new GetPostAnalyticsQuery { PostId = id });

            if (result.Succeeded)
                return Success(result.Data, "Post analytics retrieved successfully");

            return BadRequest("Failed to retrieve post analytics", result.Errors);
        }
    }
}
