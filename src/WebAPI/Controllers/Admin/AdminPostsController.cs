using Application.Features.Posts.Queries;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers.Admin
{
    [Authorize(Roles = "Admin")]
    [Route("api/admin/[controller]")]
    public class AdminPostsController : BaseController
    {
        [HttpGet]
        public async Task<IActionResult> GetAllPosts([FromQuery] GetPostsQuery query)
        {
            var result = await Mediator.Send(query);
            
            if (result.Succeeded)
                return Ok(result.Data);
                
            return BadRequest(result.Errors);
        }

        [HttpPut("{id}/approve")]
        public async Task<IActionResult> ApprovePost(Guid id)
        {
            // Implementation for approving post
            return Ok();
        }

        [HttpPut("{id}/reject")]
        public async Task<IActionResult> RejectPost(Guid id)
        {
            // Implementation for rejecting post
            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePost(Guid id)
        {
            // Implementation for admin deleting post
            return NoContent();
        }
    }
}