using Application.Features.Posts.Commands;
using Application.Features.Posts.DTOs;
using Application.Features.Posts.Queries;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace WebAPI.Controllers.Community.Posts
{
    [Authorize]
    [Route("api/community/posts")]
    public class PostsController : BaseController
    {
        [HttpGet]
        public async Task<IActionResult> GetPosts([FromQuery] GetPostsQuery query)
        {
            var result = await Mediator.Send(query);
            
            if (result.Succeeded)
                return Ok(result.Data);
                
            return BadRequest(result.Errors);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetPost(Guid id)
        {
            // Implementation for getting single post
            return Ok();
        }

        [HttpPost]
        public async Task<IActionResult> CreatePost([FromBody] CreatePostRequest request)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId) || !Guid.TryParse(userId, out var userGuid))
            {
                return Unauthorized();
            }

            var command = new CreatePostCommand
            {
                Request = request,
                UserId = userGuid
            };

            var result = await Mediator.Send(command);
            
            if (result.Succeeded)
                return CreatedAtAction(nameof(GetPost), new { id = result.Data.Id }, result.Data);
                
            return BadRequest(result.Errors);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePost(Guid id, [FromBody] UpdatePostRequest request)
        {
            // Implementation for updating post
            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePost(Guid id)
        {
            // Implementation for deleting post
            return NoContent();
        }

        [HttpPost("{id}/like")]
        public async Task<IActionResult> LikePost(Guid id)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId) || !Guid.TryParse(userId, out var userGuid))
            {
                return Unauthorized();
            }

            // Implementation for liking post
            return Ok(new { Message = "Post liked successfully" });
        }

        [HttpDelete("{id}/like")]
        public async Task<IActionResult> UnlikePost(Guid id)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId) || !Guid.TryParse(userId, out var userGuid))
            {
                return Unauthorized();
            }

            // Implementation for unliking post
            return Ok(new { Message = "Post unliked successfully" });
        }

        [HttpGet("{id}/comments")]
        public async Task<IActionResult> GetPostComments(Guid id, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            // Implementation for getting post comments
            return Ok();
        }

        [HttpPost("{id}/comments")]
        public async Task<IActionResult> AddComment(Guid id, [FromBody] AddCommentRequest request)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId) || !Guid.TryParse(userId, out var userGuid))
            {
                return Unauthorized();
            }

            // Implementation for adding comment
            return Ok();
        }

        [HttpPost("{id}/report")]
        public async Task<IActionResult> ReportPost(Guid id, [FromBody] ReportPostRequest request)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId) || !Guid.TryParse(userId, out var userGuid))
            {
                return Unauthorized();
            }

            // Implementation for reporting post
            return Ok(new { Message = "Post reported successfully" });
        }

        // Admin functionality integrated into community controller
        [Authorize(Roles = "Admin,Moderator")]
        [HttpPut("{id}/approve")]
        public async Task<IActionResult> ApprovePost(Guid id)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            var command = new ApprovePostCommand
            {
                PostId = id,
                ApprovedBy = userId
            };

            var result = await Mediator.Send(command);
            
            if (result.Succeeded)
                return Ok(new { Message = "Post approved successfully" });
                
            return BadRequest(result.Errors);
        }

        [Authorize(Roles = "Admin,Moderator")]
        [HttpPut("{id}/reject")]
        public async Task<IActionResult> RejectPost(Guid id, [FromBody] RejectPostRequest request)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            var command = new RejectPostCommand
            {
                PostId = id,
                RejectedBy = userId,
                RejectionReason = request.Reason
            };

            var result = await Mediator.Send(command);
            
            if (result.Succeeded)
                return Ok(new { Message = "Post rejected successfully" });
                
            return BadRequest(result.Errors);
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("pending")]
        public async Task<IActionResult> GetPendingPosts([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            // Implementation for getting posts pending approval
            var query = new GetPostsQuery
            {
                PageNumber = page,
                PageSize = pageSize
                // Add filter for pending status
            };

            var result = await Mediator.Send(query);
            
            if (result.Succeeded)
                return Ok(result.Data);
                
            return BadRequest(result.Errors);
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("flagged")]
        public async Task<IActionResult> GetFlaggedPosts([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            // Implementation for getting flagged posts
            var query = new GetPostsQuery
            {
                PageNumber = page,
                PageSize = pageSize
                // Add filter for flagged status
            };

            var result = await Mediator.Send(query);
            
            if (result.Succeeded)
                return Ok(result.Data);
                
            return BadRequest(result.Errors);
        }
    }

    public class RejectPostRequest
    {
        public string Reason { get; set; } = string.Empty;
    }

    public class AddCommentRequest
    {
        public string Content { get; set; } = string.Empty;
        public Guid? ParentCommentId { get; set; }
    }

    public class ReportPostRequest
    {
        public string Reason { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
    }
}