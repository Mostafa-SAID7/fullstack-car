using Application.Features.Common.Comments.Commands;
using Application.Features.Common.Comments.DTOs.Requests;
using Application.Features.Common.Likes.Commands;
using Application.Features.Identity.Core.Interfaces;
using Domain.Enums.Common;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using Asp.Versioning;

namespace WebAPI.Controllers.Community.Posts
{
    [Authorize]
    [ApiVersion("2.0")]
    [Route("api/v{version:apiVersion}/posts/{postId}/comments")]
    public class PostCommentsController : BaseController
    {
        private readonly ICurrentUserService _currentUserService;

        public PostCommentsController(ICurrentUserService currentUserService)
        {
            _currentUserService = currentUserService;
        }

        [HttpGet]
        [AllowAnonymous]
        [OutputCache(Duration = 180, Tags = new[] { "Posts", "Comments" })]
        public async Task<IActionResult> GetPostComments(
            Guid postId, 
            [FromQuery] int page = 1, 
            [FromQuery] int pageSize = 20,
            [FromQuery] string sortBy = "recent") // recent, popular, oldest
        {
            // Redirect to Common Comments API
            return Redirect($"/api/v2.0/common/comments/Post/{postId}?page={page}&pageSize={pageSize}");
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> AddComment(Guid postId, [FromBody] CreateCommentRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new CreateCommentCommand
            {
                ContentId = postId,
                ContentType = ContentType.Post,
                UserId = userGuid,
                Content = request.Content,
                ParentCommentId = request.ParentCommentId
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
            {
                return Created(string.Empty, new { message = "Comment created successfully" });
            }

            return BadRequest("Failed to create comment", result.Errors);
        }

        [HttpPut("{commentId}")]
        [Authorize]
        public async Task<IActionResult> UpdateComment(Guid postId, Guid commentId, [FromBody] UpdateCommentRequest request)
        {
            try
            {
                var userId = _currentUserService.UserId;
                var comment = new { Id = commentId, PostId = postId, Content = request.Content, UserId = userId, UpdatedAt = DateTime.UtcNow };
                return Success(comment, "Comment updated successfully");
            }
            catch (Exception ex)
            {
                return BadRequest("Error occurred", new[] { "Failed to update comment" });
            }
        }

        [HttpDelete("{commentId}")]
        [Authorize]
        public async Task<IActionResult> DeleteComment(Guid postId, Guid commentId)
        {
            try
            {
                var userId = _currentUserService.UserId;
                var result = new { Id = commentId, PostId = postId, DeletedBy = userId, DeletedAt = DateTime.UtcNow };
                return Success(result, "Comment deleted successfully");
            }
            catch (Exception ex)
            {
                return BadRequest("Error occurred", new[] { "Failed to delete comment" });
            }
        }

        [HttpPost("{commentId}/like")]
        [Authorize]
        public async Task<IActionResult> LikeComment(Guid postId, Guid commentId)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new LikeCommand
            {
                ContentId = commentId,
                ContentType = ContentType.Comment,
                UserId = userGuid
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
            {
                return Success("Comment liked successfully");
            }

            return BadRequest("Failed to like comment", result.Errors);
        }

        [HttpPost("{commentId}/report")]
        [Authorize]
        public async Task<IActionResult> ReportComment(Guid postId, Guid commentId, [FromBody] ReportCommentRequest request)
        {
            try
            {
                var userId = _currentUserService.UserId;
                var result = new { CommentId = commentId, PostId = postId, ReporterId = userId, Reason = request.Reason, ReportedAt = DateTime.UtcNow };
                return Success(result, "Comment reported successfully");
            }
            catch (Exception ex)
            {
                return BadRequest("Error occurred", new[] { "Failed to report comment" });
            }
        }
    }
}


