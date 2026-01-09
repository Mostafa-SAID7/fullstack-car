using Application.Features.Media.Discovery.Queries;
using Asp.Versioning;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers.Media;

[ApiController]
[ApiVersion("7.0")]
[Route("api/v{version:apiVersion}/media/discovery")]
public class DiscoveryController : BaseController
{
    private readonly ILogger<DiscoveryController> _logger;

    public DiscoveryController(ILogger<DiscoveryController> logger)
    {
        _logger = logger;
    }

    /// <summary>
    /// Search for videos and podcasts with advanced filters
    /// </summary>
    [HttpGet("search")]
    public async Task<IActionResult> Search([FromQuery] SearchMediaQuery query)
    {
        try
        {
            // Allow search without search term if other filters are provided
            if (string.IsNullOrWhiteSpace(query.SearchTerm) && 
                query.MediaType == null && 
                string.IsNullOrWhiteSpace(query.Category) && 
                string.IsNullOrWhiteSpace(query.Tags) &&
                query.CreatorId == null)
            {
                return BadRequest("At least one search parameter is required (searchTerm, mediaType, category, tags, or creatorId)");
            }

            var result = await Mediator.Send(query);
            
            return FromResult(result, "Search completed successfully");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error performing search with term: {SearchTerm}", query.SearchTerm);
            return InternalServerError("Search failed", ex.Message);
        }
    }

    /// <summary>
    /// Get trending content with configurable time window
    /// </summary>
    [HttpGet("trending")]
    public async Task<IActionResult> GetTrending([FromQuery] GetTrendingContentQuery query)
    {
        try
        {
            var result = await Mediator.Send(query);
            
            return FromResult(result, "Trending content retrieved successfully");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving trending content");
            return InternalServerError("Failed to retrieve trending content", ex.Message);
        }
    }

    /// <summary>
    /// Get featured content
    /// </summary>
    [HttpGet("featured")]
    public async Task<IActionResult> GetFeatured([FromQuery] GetFeaturedContentQuery query)
    {
        try
        {
            var result = await Mediator.Send(query);
            
            return FromResult(result, "Featured content retrieved successfully");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving featured content");
            return InternalServerError("Failed to retrieve featured content", ex.Message);
        }
    }

    /// <summary>
    /// Browse content by category
    /// </summary>
    [HttpGet("categories/{category}")]
    public async Task<IActionResult> BrowseByCategory(string category, [FromQuery] BrowseByCategoryQuery query)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(category))
            {
                return BadRequest("Category is required");
            }

            query.Category = category;
            var result = await Mediator.Send(query);
            
            return FromResult(result, $"Content for category '{category}' retrieved successfully");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error browsing content by category: {Category}", category);
            return InternalServerError("Failed to browse content by category", ex.Message);
        }
    }

    /// <summary>
    /// Get available categories
    /// </summary>
    [HttpGet("categories")]
    public async Task<IActionResult> GetCategories()
    {
        try
        {
            var query = new GetCategoriesQuery();
            var result = await Mediator.Send(query);
            
            return FromResult(result, "Categories retrieved successfully");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving categories");
            return InternalServerError("Failed to retrieve categories", ex.Message);
        }
    }

    /// <summary>
    /// Get search suggestions based on partial input
    /// </summary>
    [HttpGet("suggestions")]
    public async Task<IActionResult> GetSearchSuggestions([FromQuery] string query, [FromQuery] int limit = 10)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(query))
            {
                return BadRequest("Query parameter is required");
            }

            if (limit <= 0 || limit > 50)
            {
                return BadRequest("Limit must be between 1 and 50");
            }

            var suggestionQuery = new GetSearchSuggestionsQuery { Query = query, Limit = limit };
            var result = await Mediator.Send(suggestionQuery);
            
            return FromResult(result, "Search suggestions retrieved successfully");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving search suggestions for query: {Query}", query);
            return InternalServerError("Failed to retrieve search suggestions", ex.Message);
        }
    }

    /// <summary>
    /// Get personalized recommendations for authenticated users
    /// </summary>
    [HttpGet("recommendations")]
    public async Task<IActionResult> GetRecommendations([FromQuery] GetRecommendationsQuery query)
    {
        try
        {
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (!string.IsNullOrEmpty(userId) && Guid.TryParse(userId, out var userGuid))
            {
                query.UserId = userGuid;
            }

            var result = await Mediator.Send(query);
            
            return FromResult(result, "Recommendations retrieved successfully");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving recommendations");
            return InternalServerError("Failed to retrieve recommendations", ex.Message);
        }
    }
}