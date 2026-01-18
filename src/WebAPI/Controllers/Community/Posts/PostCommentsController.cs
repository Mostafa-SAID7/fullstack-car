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
        [OutputCache(Duration = 60, Tags = new[] { "Posts", "Comments" })]
        public async Task<IActionResult> GetComments(Guid postId, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var result = await Mediator.Send(new GetPostCommentsQuery
            {
                PostId = postId,
                PageNumber = page,
                PageSize = pageSize
            });

            if (result.Succeeded)
                return Ok(result.Data);

            return BadRequest(result.Errors);
        }

        [HttpGet("{commentId}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetComment(Guid postId, Guid commentId)
        {
            var result = await Mediator.Send(new GetCommentByIdQuery 
            { 
                PostId = postId,
                CommentId = commentId 
            });

            if (result.Succeeded)
                return Ok(result.Data);

            return BadRequest(result.Errors);
        }

        [HttpPost]
        public async Task<IActionResult> CreateComment(Guid postId, [FromBody] AddCommentRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized();
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized();
            }

            var result = await Mediator.Send(new AddCommentCommand
            {
                PostId = postId,
                UserId = userGuid,
                Request = request
            });

            if (result.Succeeded)
                return CreatedAtAction(nameof(GetComment), new { postId, commentId = result.Data.Id }, result.Data);

            return BadRequest(result.Errors);
        }

        [HttpPut("{commentId}")]
        public async Task<IActionResult> UpdateComment(Guid postId, Guid commentId, [FromBody] UpdateCommentRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized();
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized();
            }

            var result = await Mediator.Send(new UpdateCommentCommand
            {
                PostId = postId,
                CommentId = commentId,
                UserId = userGuid,
                Request = request
            });

            if (result.Succeeded)
                return Ok(result.Data);

            return BadRequest(result.Errors);
        }

        [HttpDelete("{commentId}")]
        public async Task<IActionResult> DeleteComment(Guid postId, Guid commentId)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized();
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized();
            }

            var result = await Mediator.Send(new DeleteCommentCommand
            {
                PostId = postId,
                CommentId = commentId,
                UserId = userGuid
            });

            if (result.Succeeded)
                return NoContent();

            return BadRequest(result.Errors);
        }

        [HttpPost("{commentId}/like")]
        public async Task<IActionResult> LikeComment(Guid postId, Guid commentId)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized();
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized();
            }

            var result = await Mediator.Send(new LikeCommentCommand 
            { 
                PostId = postId,
                CommentId = commentId, 
                UserId = userGuid 
            });

            if (result.Succeeded)
                return Ok(new { Message = "Comment liked successfully" });

            return BadRequest(result.Errors);
        }

        [HttpDelete("{commentId}/like")]
        public async Task<IActionResult> UnlikeComment(Guid postId, Guid commentId)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized();
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized();
            }

            var result = await Mediator.Send(new UnlikeCommentCommand 
            { 
                PostId = postId,
                CommentId = commentId, 
                UserId = userGuid 
            });

            if (result.Succeeded)
                return Ok(new { Message = "Comment unliked successfully" });

            return BadRequest(result.Errors);
        }

        [HttpPost("{commentId}/report")]
        public async Task<IActionResult> ReportComment(Guid postId, Guid commentId, [FromBody] ReportCommentRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized();
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized();
            }

            var result = await Mediator.Send(new ReportCommentCommand
            {
                PostId = postId,
                CommentId = commentId,
                UserId = userGuid,
                Request = request
            });

            if (result.Succeeded)
                return Ok(new { Message = "Comment reported successfully" });

            return BadRequest(result.Errors);
        }

        [HttpGet("test")]
        [AllowAnonymous]
        public IActionResult Test()
        {
            return Ok(new { message = "Post Comments API is working", timestamp = DateTime.UtcNow });
        }
    }
}