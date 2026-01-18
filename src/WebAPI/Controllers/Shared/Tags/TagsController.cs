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
                // Mock implementation - in production this would integrate with tag service
                var tags = new List<SharedTagDto>
                {
                    new()
                    {
                        Id = Guid.NewGuid(),
                        Name = "engine",
                        Description = "Engine related questions and content",
                        ModuleType = "QA",
                        UsageCount = 245,
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow.AddDays(-30)
                    },
                    new()
                    {
                        Id = Guid.NewGuid(),
                        Name = "brake-pads",
                        Description = "Brake pads and brake system",
                        ModuleType = "Marketplace",
                        UsageCount = 156,
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow.AddDays(-25)
                    },
                    new()
                    {
                        Id = Guid.NewGuid(),
                        Name = "maintenance",
                        Description = "Car maintenance tips and guides",
                        ModuleType = "Community",
                        UsageCount = 189,
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow.AddDays(-20)
                    }
                };

                // Apply filters
                if (!string.IsNullOrWhiteSpace(moduleType))
                {
                    tags = tags.Where(t => t.ModuleType.Equals(moduleType, StringComparison.OrdinalIgnoreCase)).ToList();
                }

                if (!string.IsNullOrWhiteSpace(searchTerm))
                {
                    tags = tags.Where(t => t.Name.Contains(searchTerm, StringComparison.OrdinalIgnoreCase) ||
                                          t.Description.Contains(searchTerm, StringComparison.OrdinalIgnoreCase)).ToList();
                }

                // Apply sorting
                tags = sortBy.ToLower() switch
                {
                    "name" => sortDescending ? tags.OrderByDescending(t => t.Name).ToList() : tags.OrderBy(t => t.Name).ToList(),
                    "createdat" => sortDescending ? tags.OrderByDescending(t => t.CreatedAt).ToList() : tags.OrderBy(t => t.CreatedAt).ToList(),
                    "usagecount" => sortDescending ? tags.OrderByDescending(t => t.UsageCount).ToList() : tags.OrderBy(t => t.UsageCount).ToList(),
                    _ => tags.OrderByDescending(t => t.UsageCount).ToList()
                };

                var results = tags.Take(maxResults).ToList();

                return Success(results, "Tags retrieved successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving tags");
                return this.ApiBadRequest<List<SharedTagDto>>(
                    new[] { "Tags service temporarily unavailable" }, 
                    "Failed to retrieve tags");
            }
        }

        [HttpGet("{id}")]
        [AllowAnonymous]
        [OutputCache(Duration = 300, Tags = new[] { "SharedTags" })]
        public async Task<IActionResult> GetTag(Guid id)
        {
            try
            {
                // Mock implementation
                var tag = new SharedTagDto
                {
                    Id = id,
                    Name = "sample-tag",
                    Description = "Sample tag description",
                    ModuleType = "QA",
                    UsageCount = 42,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow.AddDays(-10),
                    Metadata = new Dictionary<string, object>
                    {
                        ["color"] = "#10B981",
                        ["category"] = "automotive"
                    }
                };

                return Success(tag, "Tag retrieved successfully");
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
                // Mock implementation
                var popularTags = new List<PopularTagDto>
                {
                    new()
                    {
                        Id = Guid.NewGuid(),
                        Name = "engine-repair",
                        ModuleType = "QA",
                        UsageCount = 156,
                        TrendingScore = 92.5,
                        GrowthRate = 12.3
                    },
                    new()
                    {
                        Id = Guid.NewGuid(),
                        Name = "oil-change",
                        ModuleType = "Community",
                        UsageCount = 134,
                        TrendingScore = 88.7,
                        GrowthRate = 8.9
                    },
                    new()
                    {
                        Id = Guid.NewGuid(),
                        Name = "brake-system",
                        ModuleType = "Marketplace",
                        UsageCount = 98,
                        TrendingScore = 85.2,
                        GrowthRate = 15.6
                    }
                };

                var results = popularTags.Take(maxResults).ToList();

                return Success(results, "Popular tags retrieved successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving popular tags");
                return this.ApiBadRequest<List<PopularTagDto>>(
                    new[] { "Popular tags service temporarily unavailable" }, 
                    "Failed to retrieve popular tags");
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
                    return this.ApiBadRequest<List<SharedTagDto>>(
                        new[] { "Search term is required" }, 
                        "Invalid search request");
                }

                // Mock implementation
                var searchResults = new List<SharedTagDto>();

                // Simple mock search logic
                var allTags = new[]
                {
                    "engine", "transmission", "brakes", "suspension", "electrical",
                    "oil", "filter", "spark-plugs", "battery", "tires",
                    "maintenance", "repair", "diagnostic", "performance", "tuning"
                };

                var matchingTags = exactMatch
                    ? allTags.Where(t => t.Equals(searchTerm, StringComparison.OrdinalIgnoreCase))
                    : allTags.Where(t => t.Contains(searchTerm, StringComparison.OrdinalIgnoreCase));

                searchResults = matchingTags
                    .Take(maxResults)
                    .Select(name => new SharedTagDto
                    {
                        Id = Guid.NewGuid(),
                        Name = name,
                        Description = $"{name} related content",
                        ModuleType = moduleType ?? "QA",
                        UsageCount = new Random().Next(10, 200),
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow.AddDays(-new Random().Next(1, 60))
                    })
                    .ToList();

                return Success(searchResults, "Tag search completed successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error searching tags with term: {SearchTerm}", searchTerm);
                return this.ApiBadRequest<List<SharedTagDto>>(
                    new[] { "Tag search service temporarily unavailable" }, 
                    "Tag search failed");
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
                    return this.ApiBadRequest<List<TagSuggestionDto>>(
                        new[] { "Content is required for tag suggestions" }, 
                        "Invalid request");
                }

                // Mock implementation - in production this would use ML/NLP
                var suggestions = new List<TagSuggestionDto>();

                // Simple keyword-based suggestions
                var keywords = ExtractKeywords(request.Content);
                foreach (var keyword in keywords.Take(request.MaxSuggestions))
                {
                    suggestions.Add(new TagSuggestionDto
                    {
                        TagName = keyword,
                        Confidence = new Random().NextDouble() * 0.4 + 0.6, // 0.6-1.0
                        Reason = $"Found keyword '{keyword}' in content"
                    });
                }

                return Success(suggestions, "Tag suggestions generated successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating tag suggestions");
                return this.ApiBadRequest<List<TagSuggestionDto>>(
                    new[] { "Tag suggestion service temporarily unavailable" }, 
                    "Failed to generate tag suggestions");
            }
        }

        private List<string> ExtractKeywords(string content)
        {
            if (string.IsNullOrWhiteSpace(content))
                return new List<string>();

            // Simple keyword extraction
            var words = content.ToLower()
                .Split(new[] { ' ', '\n', '\r', '\t', '.', ',', ';', ':', '!', '?' }, 
                       StringSplitOptions.RemoveEmptyEntries)
                .Where(w => w.Length > 3)
                .Where(w => !IsStopWord(w))
                .Distinct()
                .ToList();

            return words;
        }

        private bool IsStopWord(string word)
        {
            var stopWords = new HashSet<string> 
            { 
                "the", "and", "for", "are", "but", "not", "you", "all", "can", "had", 
                "her", "was", "one", "our", "out", "day", "get", "has", "him", "his", 
                "how", "its", "may", "new", "now", "old", "see", "two", "who", "boy", 
                "did", "she", "use", "her", "now", "air", "any", "may", "say", "she", 
                "try", "way", "this", "that", "with", "have", "from", "they", "know",
                "want", "been", "good", "much", "some", "time", "very", "when", "come",
                "here", "just", "like", "long", "make", "many", "over", "such", "take",
                "than", "them", "well", "were"
            };
            
            return stopWords.Contains(word);
        }
    }
}


