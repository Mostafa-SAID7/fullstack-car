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
    [Route("api/v{version:apiVersion}/posts")]
    public class PostsController : BaseController
    {
        private readonly ICurrentUserService _currentUserService;

        public PostsController(ICurrentUserService currentUserService)
        {
            _currentUserService = currentUserService;
        }

        [HttpGet]
        [AllowAnonymous] // Temporarily allow anonymous access for testing
        [OutputCache(Duration = 60, Tags = new[] { "Posts" })]
        public async Task<IActionResult> GetPosts([FromQuery] GetPostsQuery query)
        {
            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Ok(result.Data);

            return BadRequest(result.Errors);
        }

        [HttpGet("test")]
        [AllowAnonymous]
        public IActionResult Test()
        {
            return Ok(new { message = "Posts API is working", timestamp = DateTime.UtcNow });
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetPost(Guid id)
        {
            var result = await Mediator.Send(new GetPostByIdQuery { Id = id });

            if (result.Succeeded)
                return Ok(result.Data);

            return BadRequest(result.Errors);
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
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized();
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized();
            }

            var result = await Mediator.Send(new UpdatePostCommand
            {
                Id = id,
                UserId = userGuid,
                Request = request
            });

            if (result.Succeeded)
                return Ok(result.Data);

            return BadRequest(result.Errors);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePost(Guid id)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized();
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized();
            }

            var result = await Mediator.Send(new DeletePostCommand
            {
                PostId = id,
                UserId = userGuid
            });

            if (result.Succeeded)
                return NoContent();

            return BadRequest(result.Errors);
        }

        [HttpPost("{id}/like")]
        public async Task<IActionResult> LikePost(Guid id)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized();
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized();
            }

            var result = await Mediator.Send(new LikePostCommand { PostId = id, UserId = userGuid });

            if (result.Succeeded)
                return Ok(new { Message = "Post liked successfully" });

            return BadRequest(result.Errors);
        }

        [HttpDelete("{id}/like")]
        public async Task<IActionResult> UnlikePost(Guid id)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized();
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized();
            }

            var result = await Mediator.Send(new UnlikePostCommand { PostId = id, UserId = userGuid });

            if (result.Succeeded)
                return Ok(new { Message = "Post unliked successfully" });

            return BadRequest(result.Errors);
        }

        [HttpGet("{id}/comments")]
        public async Task<IActionResult> GetPostComments(Guid id, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var result = await Mediator.Send(new GetPostCommentsQuery
            {
                PostId = id,
                PageNumber = page,
                PageSize = pageSize
            });

            if (result.Succeeded)
                return Ok(result.Data);

            return BadRequest(result.Errors);
        }

        [HttpPost("{id}/comments")]
        public async Task<IActionResult> AddComment(Guid id, [FromBody] Application.Features.Community.Posts.DTOs.AddCommentRequest request)
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
                PostId = id,
                UserId = userGuid,
                Request = request
            });

            if (result.Succeeded)
                return Ok(new { Message = "Comment added successfully" });

            return BadRequest(result.Errors);
        }

        [HttpPost("{id}/report")]
        public async Task<IActionResult> ReportPost(Guid id, [FromBody] ReportPostRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized();
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized();
            }

            var result = await Mediator.Send(new ReportPostCommand
            {
                PostId = id,
                UserId = userGuid,
                Request = request
            });

            if (result.Succeeded)
                return Ok(new { Message = "Post reported successfully" });

            return BadRequest(result.Errors);
        }
    }
}


