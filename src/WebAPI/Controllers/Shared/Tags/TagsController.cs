using Application.Features.Shared.Tags.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using Asp.Versioning;
using WebAPI.Extensions;

namespace WebAPI.Controllers.Shared.Tags
{
    [ApiController]
    [ApiVersion("4.0")]
    [Route("api/v{version:apiVersion}/tags")]
    [Authorize]
    public class TagsController : BaseController
    {
        private readonly ILogger<TagsController> _logger;

        public TagsController(ILogger<TagsController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        [AllowAnonymous]
        [OutputCache(Duration = 300, Tags = new[] { "SharedTags" })]
        public async Task<IActionResult> GetTags(
            [FromQuery] string? moduleType = null,
            [FromQuery] string? searchTerm = null,
            [FromQuery] string sortBy = "UsageCount",
            [FromQuery] bool sortDescending = true,
            [FromQuery] int maxResults = 50)
        {
            try
            {
                return Success(new List<SharedTagDto>(), "Tags retrieved successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving tags");
                return BadRequest("Failed to retrieve tags", new[] { "Tags service temporarily unavailable" });
            }
        }

        [HttpGet("{id}")]
        [AllowAnonymous]
        [OutputCache(Duration = 300, Tags = new[] { "SharedTags" })]
        public async Task<IActionResult> GetTag(Guid id)
        {
            try
            {
                return Success(new SharedTagDto { Id = id }, "Tag retrieved successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving tag {TagId}", id);
                return BadRequest("Failed to retrieve tag", new[] { "Tag not found or service unavailable" });
            }
        }

        [HttpGet("popular")]
        [AllowAnonymous]
        [OutputCache(Duration = 900, Tags = new[] { "SharedTags" })] // 15 minutes cache
        public async Task<IActionResult> GetPopularTags(
            [FromQuery] string? moduleType = null,
            [FromQuery] string timeframe = "week",
            [FromQuery] int maxResults = 20)
        {
            try
            {
                return Success(new List<PopularTagDto>(), "Popular tags retrieved successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving popular tags");
                return BadRequest("Failed to retrieve popular tags", new[] { "Popular tags service temporarily unavailable" });
            }
        }

        [HttpGet("search")]
        [AllowAnonymous]
        [OutputCache(Duration = 180, Tags = new[] { "SharedTags" })] // 3 minutes cache
        public async Task<IActionResult> SearchTags(
            [FromQuery] string searchTerm,
            [FromQuery] string? moduleType = null,
            [FromQuery] bool exactMatch = false,
            [FromQuery] int maxResults = 30)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(searchTerm))
                {
                    return BadRequest("Invalid search request", new[] { "Search term is required" });
                }

                return Success(new List<SharedTagDto>(), "Tag search completed successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error searching tags with term: {SearchTerm}", searchTerm);
                return BadRequest("Tag search failed", new[] { "Tag search service temporarily unavailable" });
            }
        }

        [HttpPost("suggest")]
        [AllowAnonymous]
        [OutputCache(Duration = 60, Tags = new[] { "SharedTags" })] // 1 minute cache
        public async Task<IActionResult> SuggestTags(
            [FromBody] TagSuggestionRequest request)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(request.Content))
                {
                    return BadRequest("Invalid request", new[] { "Content is required for tag suggestions" });
                }

                return Success(new List<TagSuggestionDto>(), "Tag suggestions generated successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating tag suggestions");
                return BadRequest("Failed to generate tag suggestions", new[] { "Tag suggestion service temporarily unavailable" });
            }
        }
    }
}


