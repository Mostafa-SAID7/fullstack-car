using Application.Features.Identity.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using Asp.Versioning;
using WebAPI.Extensions;
using Application.Features.Community.News.DTOs;

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
        public async Task<IActionResult> GetArticles([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            try
            {
                return Success(new List<ArticleDto>(), "Articles retrieved successfully");
            }
            catch (Exception ex)
            {
                return BadRequest("Error occurred", new[] { "Failed to retrieve articles" });
            }
        }

        [HttpGet("{id}")]
        [AllowAnonymous]
        [OutputCache(Duration = 300, Tags = new[] { "News" })]
        public async Task<IActionResult> GetArticle(Guid id)
        {
            try
            {
                return Success(new ArticleDto { Id = id }, "Article retrieved successfully");
            }
            catch (Exception ex)
            {
                return BadRequest("Error occurred", new[] { "Article not found" });
            }
        }

        [HttpPost]
        [Authorize(Roles = "Admin,Moderator,Editor")]
        public async Task<IActionResult> CreateArticle([FromBody] CreateArticleRequest request)
        {
            try
            {
                return Success(new ArticleDto { Title = request.Title }, "Article created successfully");
            }
            catch (Exception ex)
            {
                return BadRequest("Error occurred", new[] { "Failed to create article" });
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin,Moderator,Editor")]
        public async Task<IActionResult> UpdateArticle(Guid id, [FromBody] UpdateArticleRequest request)
        {
            try
            {
                return Success(new ArticleDto { Id = id, Title = request.Title }, "Article updated successfully");
            }
            catch (Exception ex)
            {
                return BadRequest("Error occurred", new[] { "Failed to update article" });
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin,Moderator")]
        public async Task<IActionResult> DeleteArticle(Guid id)
        {
            try
            {
                return Success(new { Id = id }, "Article deleted successfully");
            }
            catch (Exception ex)
            {
                return BadRequest("Error occurred", new[] { "Failed to delete article" });
            }
        }
    }
}


