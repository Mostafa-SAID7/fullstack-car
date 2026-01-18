using Application.Features.Community.Posts.Commands;
using Application.Features.Community.Posts.DTOs;
using Application.Features.Community.Posts.Queries;
using Application.Features.Identity.Core.Interfaces;
using Application.Common.DTOs;
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
        [AllowAnonymous]
        [OutputCache(Duration = 60, Tags = new[] { "Posts" })]
        public async Task<IActionResult> GetPosts([FromQuery] GetPostsQuery query)
        {
            var result = await Mediator.Send(query);
            return result.Succeeded ? Ok(result.Data) : BadRequest(result.Errors);
        }

        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetPost(Guid id)
        {
            var result = await Mediator.Send(new GetPostByIdQuery { Id = id });
            return result.Succeeded ? Ok(result.Data) : BadRequest(result.Errors);
        }

        [HttpPost]
        public async Task<IActionResult> CreatePost([FromBody] CreatePostRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
                return Unauthorized();

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
                return Unauthorized();

            var command = new CreatePostCommand
            {
                Request = request,
                UserId = userGuid
            };

            var result = await Mediator.Send(command);
            return result.Succeeded 
                ? CreatedAtAction(nameof(GetPost), new { id = result.Data.Id }, result.Data)
                : BadRequest(result.Errors);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePost(Guid id, [FromBody] UpdatePostRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
                return Unauthorized();

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
                return Unauthorized();

            var result = await Mediator.Send(new UpdatePostCommand
            {
                Id = id,
                UserId = userGuid,
                Request = request
            });

            return result.Succeeded ? Ok(result.Data) : BadRequest(result.Errors);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePost(Guid id)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
                return Unauthorized();

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
                return Unauthorized();

            var result = await Mediator.Send(new DeletePostCommand
            {
                PostId = id,
                UserId = userGuid
            });

            return result.Succeeded ? NoContent() : BadRequest(result.Errors);
        }

        [HttpPost("{id}/like")]
        public async Task<IActionResult> LikePost(Guid id)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
                return Unauthorized();

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
                return Unauthorized();

            var result = await Mediator.Send(new LikePostCommand { PostId = id, UserId = userGuid });
            return result.Succeeded ? Ok(new { Message = "Post liked successfully" }) : BadRequest(result.Errors);
        }

        [HttpDelete("{id}/like")]
        public async Task<IActionResult> UnlikePost(Guid id)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
                return Unauthorized();

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
                return Unauthorized();

            var result = await Mediator.Send(new UnlikePostCommand { PostId = id, UserId = userGuid });
            return result.Succeeded ? Ok(new { Message = "Post unliked successfully" }) : BadRequest(result.Errors);
        }

        [HttpGet("{id}/comments")]
        [AllowAnonymous]
        public async Task<IActionResult> GetPostComments(Guid id, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var result = await Mediator.Send(new GetPostCommentsQuery
            {
                PostId = id,
                PageNumber = page,
                PageSize = pageSize
            });

            return result.Succeeded ? Ok(result.Data) : BadRequest(result.Errors);
        }

        [HttpPost("{id}/comments")]
        public async Task<IActionResult> AddComment(Guid id, [FromBody] Application.Features.Community.Posts.DTOs.AddCommentRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
                return Unauthorized();

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
                return Unauthorized();

            var result = await Mediator.Send(new AddCommentCommand
            {
                PostId = id,
                UserId = userGuid,
                Request = request
            });

            return result.Succeeded ? Ok(new { Message = "Comment added successfully" }) : BadRequest(result.Errors);
        }

        [HttpPost("{id}/report")]
        public async Task<IActionResult> ReportPost(Guid id, [FromBody] ReportPostRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
                return Unauthorized();

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
                return Unauthorized();

            var result = await Mediator.Send(new ReportPostCommand
            {
                PostId = id,
                UserId = userGuid,
                Request = request
            });

            return result.Succeeded ? Ok(new { Message = "Post reported successfully" }) : BadRequest(result.Errors);
        }

        [HttpGet("trending")]
        [AllowAnonymous]
        [OutputCache(Duration = 300, Tags = new[] { "Posts", "Trending" })]
        public async Task<IActionResult> GetTrendingPosts([FromQuery] int count = 10, [FromQuery] string timeframe = "day")
        {
            var result = await Mediator.Send(new GetTrendingPostsQuery { Count = count, Timeframe = timeframe });
            return result.Succeeded ? Ok(result.Data) : BadRequest(result.Errors);
        }

        [HttpGet("user/{userId}")]
        [AllowAnonymous]
        [OutputCache(Duration = 120, Tags = new[] { "Posts", "UserPosts" })]
        public async Task<IActionResult> GetUserPosts(Guid userId, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var result = await Mediator.Send(new GetUserPostsQuery 
            { 
                UserId = userId, 
                PageNumber = page, 
                PageSize = pageSize 
            });
            return result.Succeeded ? Ok(result.Data) : BadRequest(result.Errors);
        }
    }
}


