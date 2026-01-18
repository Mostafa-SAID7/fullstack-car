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
    [Authorize]
    [ApiVersion("2.0")]
    [Route("api/v{version:apiVersion}/qa/tags")]
    public class TagsController : BaseController
    {
        private readonly ICurrentUserService _currentUserService;

        public TagsController(ICurrentUserService currentUserService)
        {
            _currentUserService = currentUserService;
        }
        [HttpGet]
        [OutputCache(Duration = 300, Tags = new[] { "Tags" })] // 5 minutes cache
        public async Task<IActionResult> GetTags([FromQuery] GetTagsQuery query)
        {
            var result = await Mediator.Send(query);

            return result.IsSuccess 
                ? Success(result.Data, "Tags retrieved successfully")
                : this.ApiBadRequest<List<TagDto>>(result.Errors, "Failed to retrieve tags");
        }
        [HttpGet("{id}")]
        [OutputCache(Duration = 300, Tags = new[] { "Tags" })]
        public async Task<IActionResult> GetTag(Guid id)
        {
            var query = new GetTagDetailQuery { TagId = id };
            var result = await Mediator.Send(query);

            return result.IsSuccess 
                ? Success(result.Data, "Tag retrieved successfully")
                : this.ApiBadRequest<TagDto>(result.Errors, "Failed to retrieve tag");
        }
        [HttpGet("popular")]
        [OutputCache(Duration = 600, Tags = new[] { "Tags" })] // 10 minutes cache
        public async Task<IActionResult> GetPopularTags([FromQuery] GetPopularTagsQuery query)
        {
            var result = await Mediator.Send(query);

            return result.IsSuccess 
                ? Success(result.Data, "Popular tags retrieved successfully")
                : this.ApiBadRequest<List<TagDto>>(result.Errors, "Failed to retrieve popular tags");
        }
        [HttpGet("search")]
        [OutputCache(Duration = 180, Tags = new[] { "Tags" })] // 3 minutes cache
        public async Task<IActionResult> SearchTags([FromQuery] SearchTagsQuery query)
        {
            var result = await Mediator.Send(query);

            return result.IsSuccess 
                ? Success(result.Data, "Tag search completed successfully")
                : this.ApiBadRequest<List<TagDto>>(result.Errors, "Failed to search tags");
        }
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
                ? Success(result.Data, "Category tags retrieved successfully")
                : this.ApiBadRequest<List<TagDto>>(result.Errors, "Failed to retrieve category tags");
        }
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

            return Success(uniqueTags, "Tag suggestions generated successfully");
        }
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
        private bool IsStopWord(string word)
        {
            var stopWords = new HashSet<string> 
            { 
                "the", "and", "for", "are", "but", "not", "you", "all", "can", "had", "her", "was", "one", "our", "out", "day", "get", "has", "him", "his", "how", "its", "may", "new", "now", "old", "see", "two", "who", "boy", "did", "she", "use", "her", "now", "air", "any", "may", "say", "she", "try", "way"
            };
            
            return stopWords.Contains(word);
        }
    }
    public class TagSuggestionRequest
    {
        public string Content { get; set; } = string.Empty;
        public Guid? CategoryId { get; set; }
    }
}


