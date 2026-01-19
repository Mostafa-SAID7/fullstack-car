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

        [HttpGet]
        [AllowAnonymous]
        [OutputCache(Duration = 300, Tags = new[] { "News" })]
        public async Task<IActionResult> GetArticles(
            [FromQuery] int page = 1, 
            [FromQuery] int pageSize = 10,
            [FromQuery] string? category = null,
            [FromQuery] string? searchTerm = null,
            [FromQuery] string? sortBy = "PublishedAt",
            [FromQuery] bool sortDescending = true,
            [FromQuery] bool? isFeatured = null)
        {
            var query = new GetArticlesQuery
            {
                PageNumber = page,
                PageSize = pageSize,
                Category = category,
                SearchTerm = searchTerm,
                SortBy = sortBy,
                SortDescending = sortDescending,
                IsFeatured = isFeatured
            };

            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "Articles retrieved successfully");

            return BadRequest("Failed to retrieve articles", result.Errors);
        }

        [HttpGet("trending")]
        [AllowAnonymous]
        [OutputCache(Duration = 600, Tags = new[] { "News", "Trending" })]
        public async Task<IActionResult> GetTrendingArticles([FromQuery] int pageSize = 10)
        {
            var query = new GetTrendingArticlesQuery
            {
                PageSize = pageSize,
                Days = 7
            };

            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "Trending articles retrieved successfully");

            return BadRequest("Failed to retrieve trending articles", result.Errors);
        }

        [HttpGet("featured")]
        [AllowAnonymous]
        [OutputCache(Duration = 1800, Tags = new[] { "News", "Featured" })]
        public async Task<IActionResult> GetFeaturedArticles([FromQuery] int pageSize = 5)
        {
            var query = new GetFeaturedArticlesQuery
            {
                PageSize = pageSize
            };

            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "Featured articles retrieved successfully");

            return BadRequest("Failed to retrieve featured articles", result.Errors);
        }

        [HttpGet("{id}")]
        [AllowAnonymous]
        [OutputCache(Duration = 300, Tags = new[] { "News" })]
        public async Task<IActionResult> GetArticle(Guid id)
        {
            var query = new GetArticleByIdQuery { ArticleId = id };
            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "Article retrieved successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Article not found");

            return BadRequest("Failed to retrieve article", result.Errors);
        }

        [HttpPost]
        [Authorize(Roles = "Admin,Moderator,Editor")]
        public async Task<IActionResult> CreateArticle([FromBody] CreateArticleRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new CreateArticleCommand
            {
                Request = request,
                AuthorId = userGuid
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
            {
                dynamic articleData = result.Data;
                var location = Url.Action(nameof(GetArticle), new { id = articleData.Id });
                return Created(result.Data, location!, "Article created successfully");
            }

            if (result.Errors.Any(e => e.Contains("duplicate")))
                return BadRequest("An article with this title already exists", result.Errors);

            return BadRequest("Failed to create article", result.Errors);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin,Moderator,Editor")]
        public async Task<IActionResult> UpdateArticle(Guid id, [FromBody] UpdateArticleRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new UpdateArticleCommand
            {
                ArticleId = id,
                Request = request,
                UserId = userGuid
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Success(result.Data, "Article updated successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Article not found");

            if (result.Errors.Any(e => e.Contains("unauthorized") || e.Contains("permission")))
                return Forbidden("You don't have permission to update this article");

            return BadRequest("Failed to update article", result.Errors);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin,Moderator")]
        public async Task<IActionResult> DeleteArticle(Guid id)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new DeleteArticleCommand
            {
                ArticleId = id,
                UserId = userGuid
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Success("Article deleted successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Article not found");

            if (result.Errors.Any(e => e.Contains("unauthorized") || e.Contains("permission")))
                return Forbidden("You don't have permission to delete this article");

            return BadRequest("Failed to delete article", result.Errors);
        }

        [HttpPost("{id}/publish")]
        [Authorize(Roles = "Admin,Moderator,Editor")]
        public async Task<IActionResult> PublishArticle(Guid id)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new PublishArticleCommand
            {
                ArticleId = id,
                UserId = userGuid
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Success("Article published successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Article not found");

            if (result.Errors.Any(e => e.Contains("already published")))
                return BadRequest("Article is already published", result.Errors);

            if (result.Errors.Any(e => e.Contains("unauthorized") || e.Contains("permission")))
                return Forbidden("You don't have permission to publish this article");

            return BadRequest("Failed to publish article", result.Errors);
        }

        [HttpPost("{id}/unpublish")]
        [Authorize(Roles = "Admin,Moderator")]
        public async Task<IActionResult> UnpublishArticle(Guid id)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new UnpublishArticleCommand
            {
                ArticleId = id,
                UserId = userGuid
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Success("Article unpublished successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Article not found");

            if (result.Errors.Any(e => e.Contains("not published")))
                return BadRequest("Article is not published", result.Errors);

            return BadRequest("Failed to unpublish article", result.Errors);
        }

        [HttpGet("categories")]
        [AllowAnonymous]
        [OutputCache(Duration = 3600, Tags = new[] { "News", "Categories" })]
        public async Task<IActionResult> GetCategories()
        {
            var query = new GetNewsCategoriesQuery();
            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "News categories retrieved successfully");

            return BadRequest("Failed to retrieve news categories", result.Errors);
        }

        [HttpGet("my-articles")]
        [Authorize(Roles = "Admin,Moderator,Editor")]
        [OutputCache(Duration = 60, Tags = new[] { "News", "MyArticles" })]
        public async Task<IActionResult> GetMyArticles(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var query = new GetUserArticlesQuery
            {
                AuthorId = userGuid,
                PageNumber = page,
                PageSize = pageSize
            };

            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "My articles retrieved successfully");

            return BadRequest("Failed to retrieve my articles", result.Errors);
        }

        [HttpGet("stats")]
        [AllowAnonymous]
        [OutputCache(Duration = 1800, Tags = new[] { "News", "Stats" })]
        public async Task<IActionResult> GetNewsStats()
        {
            var query = new GetNewsStatsQuery();
            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "News statistics retrieved successfully");

            return BadRequest("Failed to retrieve news statistics", result.Errors);
        }
    }
}


