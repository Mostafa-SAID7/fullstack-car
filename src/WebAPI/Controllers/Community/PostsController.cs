using Application.Features.Posts.Commands;
using Application.Features.Posts.DTOs;
using Application.Features.Posts.Queries;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace WebAPI.Controllers.Community
{
    [Authorize]
    [Route("api/community/[controller]")]
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
    }
}