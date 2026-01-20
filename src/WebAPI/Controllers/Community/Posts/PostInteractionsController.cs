using Application.Features.Common.Likes.Commands;
using Application.Features.Community.Posts.Commands;
using Application.Features.Community.Posts.DTOs;
using Application.Features.Identity.Core.Interfaces;
using Domain.Enums.Common;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Asp.Versioning;

namespace WebAPI.Controllers.Community.Posts
{
    /// <summary>
    /// User interaction operations for Posts (like, unlike, report)
    /// </summary>
    [Authorize]
    [ApiVersion("2.0")]
    [Route("api/v{version:apiVersion}/posts")]
    public class PostInteractionsController : BaseController
    {
        private readonly ICurrentUserService _currentUserService;

        public PostInteractionsController(ICurrentUserService currentUserService)
        {
            _currentUserService = currentUserService;
        }

        [HttpPost("{id}/like")]
        public async Task<IActionResult> LikePost(Guid id)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
                return Unauthorized("User authentication required");

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
                return Unauthorized("Invalid user context");

            var command = new LikeCommand
            {
                ContentId = id,
                ContentType = ContentType.Post,
                UserId = userGuid
            };

            var result = await Mediator.Send(command);
            
            if (result.Succeeded)
                return Success("Post liked successfully");

            return BadRequest("Failed to like post", result.Errors);
        }

        [HttpDelete("{id}/like")]
        public async Task<IActionResult> UnlikePost(Guid id)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
                return Unauthorized("User authentication required");

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
                return Unauthorized("Invalid user context");

            var command = new UnlikeCommand
            {
                ContentId = id,
                ContentType = ContentType.Post,
                UserId = userGuid
            };

            var result = await Mediator.Send(command);
            
            if (result.Succeeded)
                return Success("Post unliked successfully");

            return BadRequest("Failed to unlike post", result.Errors);
        }

        [HttpPost("{id}/report")]
        public async Task<IActionResult> ReportPost(Guid id, [FromBody] ReportPostRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
                return Unauthorized("User authentication required");

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
                return Unauthorized("Invalid user context");

            var result = await Mediator.Send(new ReportPostCommand
            {
                PostId = id,
                UserId = userGuid,
                Request = request
            });

            if (result.Succeeded)
                return Success("Post reported successfully");

            return BadRequest("Failed to report post", result.Errors);
        }
    }
}
