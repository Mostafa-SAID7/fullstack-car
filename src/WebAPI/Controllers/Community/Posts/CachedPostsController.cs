using Application.Common.Attributes;
using Application.Features.Community.Posts.Commands;
using Application.Features.Community.Posts.Queries;
using Asp.Versioning;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;

namespace WebAPI.Controllers.Community.Posts
{

    [Route("api/v{version:apiVersion}/cached-posts")]
    [Authorize]
    public class CachedPostsController : BaseController
    {
        [HttpGet]
        [Cache(Duration = 300, Tags = new[] { "posts" }, VaryByParameters = new[] { "page", "size", "filter" })]
        [OutputCache(PolicyName = "MediumCache", VaryByQueryKeys = new[] { "page", "size", "filter", "sort" })]
        public async Task<IActionResult> GetPosts([FromQuery] GetPostsWithCacheQuery query)
        {
            var result = await Mediator.Send(query);
            return Ok(result);
        }

        [HttpGet("{id}")]
        [Cache(Duration = 600, Tags = new[] { "posts" })]
        [OutputCache(PolicyName = "LongCache", VaryByRouteValueNames = new[] { "id" })]
        public async Task<IActionResult> GetPost(Guid id)
        {
            // Implementation would go here
            return Ok();
        }

        [HttpPost]
        [CacheInvalidate(Tags = new[] { "posts", "community-feed" })]
        public async Task<IActionResult> CreatePost([FromBody] CreatePostWithCacheInvalidationCommand command)
        {
            var result = await Mediator.Send(command);
            return result.Succeeded ? Ok(result) : BadRequest(result.Errors);
        }

        [HttpPut("{id}")]
        [CacheInvalidate(Tags = new[] { "posts" }, Patterns = new[] { "post:*" })]
        public async Task<IActionResult> UpdatePost(Guid id, [FromBody] object updateCommand)
        {
            // Implementation would go here
            return Ok();
        }

        [HttpDelete("{id}")]
        [CacheInvalidate(Tags = new[] { "posts", "community-feed" }, Keys = new[] { "post:{id}" })]
        public async Task<IActionResult> DeletePost(Guid id)
        {
            // Implementation would go here
            return Ok();
        }
    }
}
