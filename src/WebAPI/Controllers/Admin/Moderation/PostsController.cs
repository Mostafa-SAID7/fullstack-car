using Application.Features.Community.Posts.Commands;
using Application.Features.Community.Posts.DTOs;
using Application.Features.Community.Posts.Queries;
using Application.Common.Interfaces.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers.Admin.Moderation
{
    [Authorize(Roles = "Admin,Moderator")]
    [Route("api/admin/moderation/posts")]
    public class PostsController : BaseController
    {
        private readonly ICurrentUserService _currentUserService;

        public PostsController(ICurrentUserService currentUserService)
        {
            _currentUserService = currentUserService;
        }

        [HttpPut("{id}/approve")]
        public async Task<IActionResult> ApprovePost(Guid id)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized();
            }

            var command = new ApprovePostCommand
            {
                PostId = id,
                ApprovedBy = _currentUserService.UserId
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Ok(new { Message = "Post approved successfully" });

            return BadRequest(result.Errors);
        }

        [HttpPut("{id}/reject")]
        public async Task<IActionResult> RejectPost(Guid id, [FromBody] RejectPostRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized();
            }

            var command = new RejectPostCommand
            {
                PostId = id,
                RejectedBy = _currentUserService.UserId,
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

        [HttpGet("all")]
        public async Task<IActionResult> GetAllPostsForAdmin([FromQuery] GetAllPostsForAdminQuery query)
        {
            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Ok(result.Data);

            return BadRequest(result.Errors);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePost(Guid id)
        {
            var userGuid = Guid.Parse(_currentUserService.UserId!);
            var command = new DeletePostCommand
            {
                PostId = id,
                UserId = userGuid
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return NoContent();

            return BadRequest(result.Errors);
        }
    }
}