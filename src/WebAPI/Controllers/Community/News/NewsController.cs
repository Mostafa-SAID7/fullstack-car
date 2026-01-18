using Application.Features.Community.News.Commands;
using Application.Features.Community.News.DTOs;
using Application.Features.Community.News.Queries;
using Application.Features.Identity.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using Asp.Versioning;

namespace WebAPI.Controllers.Community.News
{
    [Authorize]
    [ApiVersion("2.0")]
    [Route("api/v{version:apiVersion}/news")]
    public class NewsController : BaseController
    {
        private readonly ICurrentUserService _currentUserService;

        public NewsController(ICurrentUserService currentUserService)
        {
            _currentUserService = currentUserService;
        }

        [HttpGet("articles")]
        [AllowAnonymous]
        [OutputCache(Duration = 300, Tags = new[] { "News", "Articles" })]
        public async Task<IActionResult> GetArticles([FromQuery] GetArticlesQuery query)
        {
            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Ok(result.Data);

            return BadRequest(result.Errors);
        }

        [HttpGet("articles/{id}")]
        [AllowAnonymous]
        [OutputCache(Duration = 300, Tags = new[] { "News", "Articles" })]
        public async Task<IActionResult> GetArticle(Guid id)
        {
            var result = await Mediator.Send(new GetArticleByIdQuery { Id = id });

            if (result.Succeeded)
                return Ok(result.Data);

            return BadRequest(result.Errors);
        }

        [HttpPost("articles")]
        [Authorize(Roles = "Admin,Editor,Author")]
        public async Task<IActionResult> CreateArticle([FromBody] CreateArticleRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized();
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized();
            }

            var command = new CreateArticleCommand
            {
                Request = request,
                UserId = userGuid
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return CreatedAtAction(nameof(GetArticle), new { id = result.Data.Id }, result.Data);

            return BadRequest(result.Errors);
        }

        [HttpPut("articles/{id}")]
        [Authorize(Roles = "Admin,Editor,Author")]
        public async Task<IActionResult> UpdateArticle(Guid id, [FromBody] UpdateArticleRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized();
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized();
            }

            var result = await Mediator.Send(new UpdateArticleCommand
            {
                Id = id,
                UserId = userGuid,
                Request = request
            });

            if (result.Succeeded)
                return Ok(result.Data);

            return BadRequest(result.Errors);
        }

        [HttpDelete("articles/{id}")]
        [Authorize(Roles = "Admin,Editor")]
        public async Task<IActionResult> DeleteArticle(Guid id)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized();
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized();
            }

            var result = await Mediator.Send(new DeleteArticleCommand
            {
                ArticleId = id,
                UserId = userGuid
            });

            if (result.Succeeded)
                return NoContent();

            return BadRequest(result.Errors);
        }

        [HttpPost("articles/{id}/publish")]
        [Authorize(Roles = "Admin,Editor")]
        public async Task<IActionResult> PublishArticle(Guid id)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized();
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized();
            }

            var result = await Mediator.Send(new PublishArticleCommand
            {
                ArticleId = id,
                UserId = userGuid
            });

            if (result.Succeeded)
                return Ok(new { Message = "Article published successfully" });

            return BadRequest(result.Errors);
        }

        [HttpPost("articles/{id}/unpublish")]
        [Authorize(Roles = "Admin,Editor")]
        public async Task<IActionResult> UnpublishArticle(Guid id)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized();
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized();
            }

            var result = await Mediator.Send(new UnpublishArticleCommand
            {
                ArticleId = id,
                UserId = userGuid
            });

            if (result.Succeeded)
                return Ok(new { Message = "Article unpublished successfully" });

            return BadRequest(result.Errors);
        }

        [HttpPost("articles/{id}/like")]
        public async Task<IActionResult> LikeArticle(Guid id)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized();
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized();
            }

            var result = await Mediator.Send(new LikeArticleCommand { ArticleId = id, UserId = userGuid });

            if (result.Succeeded)
                return Ok(new { Message = "Article liked successfully" });

            return BadRequest(result.Errors);
        }

        [HttpDelete("articles/{id}/like")]
        public async Task<IActionResult> UnlikeArticle(Guid id)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized();
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized();
            }

            var result = await Mediator.Send(new UnlikeArticleCommand { ArticleId = id, UserId = userGuid });

            if (result.Succeeded)
                return Ok(new { Message = "Article unliked successfully" });

            return BadRequest(result.Errors);
        }

        [HttpGet("articles/{id}/comments")]
        [AllowAnonymous]
        [OutputCache(Duration = 60, Tags = new[] { "News", "Comments" })]
        public async Task<IActionResult> GetArticleComments(Guid id, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var result = await Mediator.Send(new GetArticleCommentsQuery
            {
                ArticleId = id,
                PageNumber = page,
                PageSize = pageSize
            });

            if (result.Succeeded)
                return Ok(result.Data);

            return BadRequest(result.Errors);
        }

        [HttpPost("articles/{id}/comments")]
        public async Task<IActionResult> AddComment(Guid id, [FromBody] AddArticleCommentRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized();
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized();
            }

            var result = await Mediator.Send(new AddArticleCommentCommand
            {
                ArticleId = id,
                UserId = userGuid,
                Request = request
            });

            if (result.Succeeded)
                return Ok(new { Message = "Comment added successfully" });

            return BadRequest(result.Errors);
        }

        [HttpGet("categories")]
        [AllowAnonymous]
        [OutputCache(Duration = 3600, Tags = new[] { "News", "Categories" })]
        public async Task<IActionResult> GetNewsCategories()
        {
            var result = await Mediator.Send(new GetNewsCategoriesQuery());

            if (result.Succeeded)
                return Ok(result.Data);

            return BadRequest(result.Errors);
        }

        [HttpGet("search")]
        [AllowAnonymous]
        [OutputCache(Duration = 60, Tags = new[] { "News", "Search" })]
        public async Task<IActionResult> SearchArticles([FromQuery] SearchArticlesQuery query)
        {
            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Ok(result.Data);

            return BadRequest(result.Errors);
        }

        [HttpGet("trending")]
        [AllowAnonymous]
        [OutputCache(Duration = 300, Tags = new[] { "News", "Trending" })]
        public async Task<IActionResult> GetTrendingArticles([FromQuery] int count = 10)
        {
            var result = await Mediator.Send(new GetTrendingArticlesQuery { Count = count });

            if (result.Succeeded)
                return Ok(result.Data);

            return BadRequest(result.Errors);
        }

        [HttpGet("test")]
        [AllowAnonymous]
        public IActionResult Test()
        {
            return Ok(new { message = "News API is working", timestamp = DateTime.UtcNow });
        }
    }
}