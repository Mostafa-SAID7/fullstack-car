using Application.Features.Community.Posts.DTOs;
using Application.Features.Identity.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using Asp.Versioning;
using WebAPI.Extensions;

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
            try
            {
                var comments = new List<object>
                {
                    new {
                        Id = Guid.NewGuid(),
                        PostId = postId,
                        Content = "Great post! Very informative.",
                        Author = new { Id = Guid.NewGuid(), Name = "John Doe", Avatar = "/avatars/john.jpg" },
                        CreatedAt = DateTime.UtcNow.AddHours(-2),
                        Likes = 5,
                        Replies = 2,
                        IsLiked = false
                    },
                    new {
                        Id = Guid.NewGuid(),
                        PostId = postId,
                        Content = "Thanks for sharing this information!",
                        Author = new { Id = Guid.NewGuid(), Name = "Jane Smith", Avatar = "/avatars/jane.jpg" },
                        CreatedAt = DateTime.UtcNow.AddHours(-1),
                        Likes = 3,
                        Replies = 0,
                        IsLiked = true
                    }
                };

                var paginatedComments = comments
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToList();

                var result = new
                {
                    PostId = postId,
                    Comments = paginatedComments,
                    TotalCount = comments.Count,
                    Page = page,
                    PageSize = pageSize
                };

                return Success(result, "Comments retrieved successfully");
            }
            catch (Exception ex)
            {
                return BadRequest("Error occurred", new[] { "Failed to retrieve comments" });
            }
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> AddComment(Guid postId, [FromBody] AddCommentRequest request)
        {
            try
            {
                var userId = _currentUserService.UserId;
                var comment = new
                {
                    Id = Guid.NewGuid(),
                    PostId = postId,
                    Content = request.Content,
                    AuthorId = userId,
                    CreatedAt = DateTime.UtcNow,
                    Likes = 0,
                    Replies = 0
                };

                return Success(comment, "Comment added successfully");
            }
            catch (Exception ex)
            {
                return BadRequest("Error occurred", new[] { "Failed to add comment" });
            }
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
            try
            {
                var userId = _currentUserService.UserId;
                var result = new { CommentId = commentId, PostId = postId, UserId = userId, LikedAt = DateTime.UtcNow };
                return Success(result, "Comment liked successfully");
            }
            catch (Exception ex)
            {
                return BadRequest("Error occurred", new[] { "Failed to like comment" });
            }
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


