using Application.Features.Community.QA.DTOs.Responses;
using Application.Features.Community.QA.Queries;
using Application.Features.Identity.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using Asp.Versioning;
using WebAPI.Extensions;

namespace WebAPI.Controllers.Community.QA
{
    /// <summary>
    /// Unified Tags API controller serving both Angular and React frontends
    /// Provides comprehensive tag management with search and discovery features
    /// </summary>
    [Authorize]
    [ApiVersion("7.0")]
    [Route("api/v{version:apiVersion}/qa/tags")]
    public class TagsController : BaseController
    {
        private readonly ICurrentUserService _currentUserService;

        public TagsController(ICurrentUserService currentUserService)
        {
            _currentUserService = currentUserService;
        }

        /// <summary>
        /// Get tags with filtering and sorting
        /// Supports both Angular and React frontend requirements
        /// </summary>
        /// <param name="query">Query parameters for filtering and sorting</param>
        /// <returns>List of tags</returns>
        [HttpGet]
        [OutputCache(Duration = 300, Tags = new[] { "Tags" })] // 5 minutes cache
        public async Task<IActionResult> GetTags([FromQuery] GetTagsQuery query)
        {
            var result = await Mediator.Send(query);

            return result.IsSuccess 
                ? this.ApiSuccess(result.Data, "Tags retrieved successfully")
                : this.ApiBadRequest<List<TagDto>>(result.Errors, "Failed to retrieve tags");
        }

        /// <summary>
        /// Get tag details by ID
        /// Used by both Angular and React for tag-specific views
        /// </summary>
        /// <param name="id">Tag ID</param>
        /// <returns>Tag details</returns>
        [HttpGet("{id}")]
        [OutputCache(Duration = 300, Tags = new[] { "Tags" })]
        public async Task<IActionResult> GetTag(Guid id)
        {
            var query = new GetTagDetailQuery { TagId = id };
            var result = await Mediator.Send(query);

            return result.IsSuccess 
                ? this.ApiSuccess(result.Data, "Tag retrieved successfully")
                : this.ApiBadRequest<TagDto>(result.Errors, "Failed to retrieve tag");
        }

        /// <summary>
        /// Get popular tags based on usage and trending
        /// Used by both Angular and React for content discovery
        /// Supports requirement 6.5: Tag-based browsing and discovery
        /// </summary>
        /// <param name="query">Query parameters for popular tags</param>
        /// <returns>List of popular tags</returns>
        [HttpGet("popular")]
        [OutputCache(Duration = 600, Tags = new[] { "Tags" })] // 10 minutes cache
        public async Task<IActionResult> GetPopularTags([FromQuery] GetPopularTagsQuery query)
        {
            var result = await Mediator.Send(query);

            return result.IsSuccess 
                ? this.ApiSuccess(result.Data, "Popular tags retrieved successfully")
                : this.ApiBadRequest<List<TagDto>>(result.Errors, "Failed to retrieve popular tags");
        }

        /// <summary>
        /// Search tags by name or description
        /// Supports autocomplete and tag suggestion features for both frontends
        /// </summary>
        /// <param name="query">Search query parameters</param>
        /// <returns>List of matching tags</returns>
        [HttpGet("search")]
        [OutputCache(Duration = 180, Tags = new[] { "Tags" })] // 3 minutes cache
        public async Task<IActionResult> SearchTags([FromQuery] SearchTagsQuery query)
        {
            var result = await Mediator.Send(query);

            return result.IsSuccess 
                ? this.ApiSuccess(result.Data, "Tag search completed successfully")
                : this.ApiBadRequest<List<TagDto>>(result.Errors, "Failed to search tags");
        }

        /// <summary>
        /// Get tags for a specific category
        /// Used by both Angular and React for category-filtered tag selection
        /// </summary>
        /// <param name="categoryId">Category ID</param>
        /// <param name="maxResults">Maximum number of results</param>
        /// <returns>List of category tags</returns>
        [HttpGet("category/{categoryId}")]
        [OutputCache(Duration = 300, Tags = new[] { "Tags", "Categories" })]
        public async Task<IActionResult> GetTagsByCategory(Guid categoryId, [FromQuery] int maxResults = 20)
        {
            var query = new GetTagsQuery 
            { 
                CategoryId = categoryId,
                MaxResults = maxResults,
                SortBy = "UsageCount",
                SortDescending = true
            };
            
            var result = await Mediator.Send(query);

            return result.IsSuccess 
                ? this.ApiSuccess(result.Data, "Category tags retrieved successfully")
                : this.ApiBadRequest<List<TagDto>>(result.Errors, "Failed to retrieve category tags");
        }

        /// <summary>
        /// Get tag suggestions for question creation
        /// Supports intelligent tag suggestions based on question content
        /// Used by both Angular and React question creation forms
        /// </summary>
        /// <param name="request">Tag suggestion request</param>
        /// <returns>List of suggested tags</returns>
        [HttpPost("suggest")]
        [OutputCache(Duration = 60, Tags = new[] { "Tags" })] // 1 minute cache
        public async Task<IActionResult> SuggestTags([FromBody] TagSuggestionRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Content))
            {
                return this.ApiBadRequest<List<TagDto>>(new[] { "Content is required for tag suggestions" }, "Invalid request");
            }

            // Simple keyword-based tag suggestion
            // In a production system, this could use ML/NLP for better suggestions
            var searchTerms = ExtractKeywords(request.Content);
            var suggestedTags = new List<TagDto>();

            foreach (var term in searchTerms.Take(5)) // Limit to 5 search terms
            {
                var searchQuery = new SearchTagsQuery 
                { 
                    SearchTerm = term,
                    CategoryId = request.CategoryId,
                    MaxResults = 3
                };
                
                var searchResult = await Mediator.Send(searchQuery);
                if (searchResult.IsSuccess)
                {
                    suggestedTags.AddRange(searchResult.Data);
                }
            }

            // Remove duplicates and sort by usage count
            var uniqueTags = suggestedTags
                .GroupBy(t => t.Id)
                .Select(g => g.First())
                .OrderByDescending(t => t.UsageCount)
                .Take(10)
                .ToList();

            return this.ApiSuccess(uniqueTags, "Tag suggestions generated successfully");
        }

        /// <summary>
        /// Extract keywords from content for tag suggestions
        /// Simple implementation - could be enhanced with NLP
        /// </summary>
        private List<string> ExtractKeywords(string content)
        {
            if (string.IsNullOrWhiteSpace(content))
                return new List<string>();

            // Simple keyword extraction - split by common delimiters and filter
            var words = content.ToLower()
                .Split(new[] { ' ', '\n', '\r', '\t', '.', ',', ';', ':', '!', '?' }, 
                       StringSplitOptions.RemoveEmptyEntries)
                .Where(w => w.Length > 3) // Only words longer than 3 characters
                .Where(w => !IsStopWord(w)) // Filter out common stop words
                .Distinct()
                .ToList();

            return words;
        }

        /// <summary>
        /// Check if a word is a common stop word
        /// </summary>
        private bool IsStopWord(string word)
        {
            var stopWords = new HashSet<string> 
            { 
                "the", "and", "for", "are", "but", "not", "you", "all", "can", "had", "her", "was", "one", "our", "out", "day", "get", "has", "him", "his", "how", "its", "may", "new", "now", "old", "see", "two", "who", "boy", "did", "she", "use", "her", "now", "air", "any", "may", "say", "she", "try", "way"
            };
            
            return stopWords.Contains(word);
        }
    }

    /// <summary>
    /// Request model for tag suggestions
    /// </summary>
    public class TagSuggestionRequest
    {
        public string Content { get; set; } = string.Empty;
        public Guid? CategoryId { get; set; }
    }
}