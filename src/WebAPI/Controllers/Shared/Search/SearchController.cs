using Application.Common.Models;
using Application.Features.Shared.Search.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using Asp.Versioning;
using WebAPI.Extensions;

namespace WebAPI.Controllers.Shared.Search
{

    [ApiController]
    [ApiVersion("4.0")]
    [Route("api/v{version:apiVersion}/search")]
    [Authorize]
    public class SearchController : BaseController
    {
        private readonly ILogger<SearchController> _logger;

        public SearchController(ILogger<SearchController> logger)
        {
            _logger = logger;
        }

        [HttpGet("global")]
        [AllowAnonymous]
        [OutputCache(Duration = 60, Tags = new[] { "GlobalSearch" })]
        public async Task<IActionResult> GlobalSearch(
            [FromQuery] string searchTerm,
            [FromQuery] string? contentTypes = null,
            [FromQuery] DateTime? fromDate = null,
            [FromQuery] DateTime? toDate = null,
            [FromQuery] string sortBy = "Relevance",
            [FromQuery] bool sortDescending = true,
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 20)
        {
            try
            {
                return Success(new GlobalSearchResultsDto { SearchTerm = searchTerm }, "Global search completed successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error performing global search for term: {SearchTerm}", searchTerm);
                return BadRequest("Search failed", new[] { "Search service temporarily unavailable" });
            }
        }

        [HttpGet("suggestions")]
        [AllowAnonymous]
        [OutputCache(Duration = 300, Tags = new[] { "SearchSuggestions" })]
        public async Task<IActionResult> GetSearchSuggestions(
            [FromQuery] string partialTerm,
            [FromQuery] string? contentTypes = null,
            [FromQuery] int maxSuggestions = 10)
        {
            try
            {
                return Success(new List<SearchSuggestionDto>(), "Search suggestions retrieved successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting search suggestions for term: {PartialTerm}", partialTerm);
                return BadRequest("Failed to get suggestions", new[] { "Suggestions service temporarily unavailable" });
            }
        }

        [HttpGet("trending")]
        [AllowAnonymous]
        [OutputCache(Duration = 900, Tags = new[] { "TrendingSearch" })]
        public async Task<IActionResult> GetTrendingSearches(
            [FromQuery] string timeframe = "day",
            [FromQuery] int maxResults = 10)
        {
            try
            {
                return Success(new List<TrendingSearchDto>(), "Trending searches retrieved successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting trending searches for timeframe: {Timeframe}", timeframe);
                return BadRequest("Failed to get trending searches", new[] { "Trending service temporarily unavailable" });
            }
        }

        [HttpPost("advanced")]
        [AllowAnonymous]
        [OutputCache(Duration = 60, Tags = new[] { "AdvancedSearch" })]
        public async Task<IActionResult> AdvancedSearch(
            [FromBody] AdvancedSearchRequest request)
        {
            try
            {
                return Success(new GlobalSearchResultsDto { SearchTerm = request.SearchTerm }, "Advanced search completed successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error performing advanced search");
                return BadRequest("Advanced search failed", new[] { "Advanced search service temporarily unavailable" });
            }
        }
    }
}


