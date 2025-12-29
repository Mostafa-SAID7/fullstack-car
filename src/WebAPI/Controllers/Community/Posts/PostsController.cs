using Application.Features.Community.Posts.Commands;
using Application.Features.Community.Posts.DTOs;
using Application.Features.Community.Posts.Queries;
using Application.Common.Interfaces.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers.Community.Posts
{
    [Authorize]
    [Route("api/community/posts")]
    public class PostsController : BaseController
    {
        private readonly ICurrentUserService _currentUserService;

        public PostsController(ICurrentUserService currentUserService)
        {
            _currentUserService = currentUserService;
        }

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
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized();
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
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
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized();
            }

            // Implementation for liking post
            return Ok(new { Message = "Post liked successfully" });
        }

        [HttpDelete("{id}/like")]
        public async Task<IActionResult> UnlikePost(Guid id)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
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
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized();
            }

            // Implementation for adding comment
            return Ok();
        }

        [HttpPost("{id}/report")]
        public async Task<IActionResult> ReportPost(Guid id, [FromBody] ReportPostRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized();
            }

            // Implementation for reporting post
            return Ok(new { Message = "Post reported successfully" });
        }
    }
}