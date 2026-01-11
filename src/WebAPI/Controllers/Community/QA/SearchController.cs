using Application.Common.Models;
using Application.Features.Community.QA.DTOs.Responses;
using Application.Features.Community.QA.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebAPI.Controllers;

namespace WebAPI.Controllers.Community.QA;

/// <summary>
/// Unified QA search controller providing comprehensive search functionality
/// for both Angular and React frontends
/// </summary>
[ApiController]
[Route("api/v7/qa/search")]
[Authorize]
public class SearchController : BaseController
{
    private readonly IQASearchService _searchService;

    public SearchController(IQASearchService searchService)
    {
        _searchService = searchService;
    }

    /// <summary>
    /// Search questions with advanced filtering and sorting
    /// </summary>
    /// <param name="searchTerm">Search term to match against title, content, and tags</param>
    /// <param name="category">Filter by category name</param>
    /// <param name="tags">Filter by tags (comma-separated)</param>
    /// <param name="fromDate">Filter questions created after this date</param>
    /// <param name="toDate">Filter questions created before this date</param>
    /// <param name="minVotes">Minimum vote score</param>
    /// <param name="maxVotes">Maximum vote score</param>
    /// <param name="hasAcceptedAnswer">Filter by accepted answer status</param>
    /// <param name="isClosed">Filter by closed status</param>
    /// <param name="sortBy">Sort field: Relevance, Recent, VoteScore, AnswerCount, ViewCount</param>
    /// <param name="sortDescending">Sort direction</param>
    /// <param name="pageNumber">Page number (1-based)</param>
    /// <param name="pageSize">Items per page</param>
    /// <returns>Paginated search results</returns>
    [HttpGet("questions")]
    [AllowAnonymous]
    public async Task<ActionResult<Result<PaginatedList<QuestionListDto>>>> SearchQuestions(
        [FromQuery] string searchTerm,
        [FromQuery] string? category = null,
        [FromQuery] string? tags = null,
        [FromQuery] DateTime? fromDate = null,
        [FromQuery] DateTime? toDate = null,
        [FromQuery] int? minVotes = null,
        [FromQuery] int? maxVotes = null,
        [FromQuery] bool? hasAcceptedAnswer = null,
        [FromQuery] bool? isClosed = null,
        [FromQuery] string sortBy = "Relevance",
        [FromQuery] bool sortDescending = true,
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 10)
    {
        var tagsList = !string.IsNullOrWhiteSpace(tags) 
            ? tags.Split(',', StringSplitOptions.RemoveEmptyEntries).Select(t => t.Trim()).ToList()
            : null;

        var result = await _searchService.SearchQuestionsAsync(
            searchTerm, category, tagsList, fromDate, toDate, minVotes, maxVotes,
            hasAcceptedAnswer, isClosed, sortBy, sortDescending, pageNumber, pageSize);

        return Ok(result);
    }

    /// <summary>
    /// Search answers with advanced filtering and sorting
    /// </summary>
    /// <param name="searchTerm">Search term to match against answer content</param>
    /// <param name="category">Filter by question category</param>
    /// <param name="tags">Filter by question tags (comma-separated)</param>
    /// <param name="fromDate">Filter answers created after this date</param>
    /// <param name="toDate">Filter answers created before this date</param>
    /// <param name="minVotes">Minimum vote score</param>
    /// <param name="maxVotes">Maximum vote score</param>
    /// <param name="isAccepted">Filter by accepted status</param>
    /// <param name="sortBy">Sort field: Relevance, Recent, VoteScore, Accepted</param>
    /// <param name="sortDescending">Sort direction</param>
    /// <param name="pageNumber">Page number (1-based)</param>
    /// <param name="pageSize">Items per page</param>
    /// <returns>Paginated search results</returns>
    [HttpGet("answers")]
    [AllowAnonymous]
    public async Task<ActionResult<Result<PaginatedList<AnswerDto>>>> SearchAnswers(
        [FromQuery] string searchTerm,
        [FromQuery] string? category = null,
        [FromQuery] string? tags = null,
        [FromQuery] DateTime? fromDate = null,
        [FromQuery] DateTime? toDate = null,
        [FromQuery] int? minVotes = null,
        [FromQuery] int? maxVotes = null,
        [FromQuery] bool? isAccepted = null,
        [FromQuery] string sortBy = "Relevance",
        [FromQuery] bool sortDescending = true,
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 10)
    {
        var tagsList = !string.IsNullOrWhiteSpace(tags) 
            ? tags.Split(',', StringSplitOptions.RemoveEmptyEntries).Select(t => t.Trim()).ToList()
            : null;

        var result = await _searchService.SearchAnswersAsync(
            searchTerm, category, tagsList, fromDate, toDate, minVotes, maxVotes,
            isAccepted, sortBy, sortDescending, pageNumber, pageSize);

        return Ok(result);
    }

    /// <summary>
    /// Find similar questions based on title and content
    /// </summary>
    /// <param name="title">Question title</param>
    /// <param name="content">Question content</param>
    /// <param name="excludeQuestionId">Question ID to exclude from results</param>
    /// <param name="maxResults">Maximum number of results</param>
    /// <param name="minSimilarityScore">Minimum similarity score (0.0-1.0)</param>
    /// <returns>List of similar questions with similarity scores</returns>
    [HttpPost("similar")]
    [AllowAnonymous]
    public async Task<ActionResult<Result<List<QuestionSimilarityDto>>>> FindSimilarQuestions(
        [FromBody] FindSimilarQuestionsRequest request)
    {
        var result = await _searchService.FindSimilarQuestionsAsync(
            request.Title, request.Content, request.ExcludeQuestionId,
            request.MaxResults, request.MinSimilarityScore);

        return Ok(result);
    }

    /// <summary>
    /// Check if a question is a duplicate
    /// </summary>
    /// <param name="request">Question details to check</param>
    /// <returns>True if duplicate found, false otherwise</returns>
    [HttpPost("duplicate-check")]
    [AllowAnonymous]
    public async Task<ActionResult<Result<bool>>> CheckDuplicate(
        [FromBody] CheckDuplicateRequest request)
    {
        var result = await _searchService.IsQuestionDuplicateAsync(
            request.Title, request.Content, request.DuplicateThreshold);

        return Ok(result);
    }

    /// <summary>
    /// Advanced search with multiple criteria and enhanced results
    /// </summary>
    /// <param name="request">Advanced search parameters</param>
    /// <returns>Comprehensive search results with metadata</returns>
    [HttpPost("advanced")]
    [AllowAnonymous]
    public async Task<ActionResult<Result<QASearchResultsDto>>> AdvancedSearch(
        [FromBody] QAAdvancedSearchRequest request)
    {
        var result = await _searchService.AdvancedSearchAsync(request);
        return Ok(result);
    }

    /// <summary>
    /// Get search suggestions for autocomplete
    /// </summary>
    /// <param name="partialTerm">Partial search term</param>
    /// <param name="searchType">Type of suggestions: all, questions, answers, tags, categories</param>
    /// <param name="maxSuggestions">Maximum number of suggestions</param>
    /// <returns>List of search suggestions</returns>
    [HttpGet("suggestions")]
    [AllowAnonymous]
    public async Task<ActionResult<Result<List<string>>>> GetSearchSuggestions(
        [FromQuery] string partialTerm,
        [FromQuery] string searchType = "all",
        [FromQuery] int maxSuggestions = 10)
    {
        var result = await _searchService.GetSearchSuggestionsAsync(partialTerm, searchType, maxSuggestions);
        return Ok(result);
    }

    /// <summary>
    /// Get questions by tags with flexible matching
    /// </summary>
    /// <param name="tags">Tags to search for (comma-separated)</param>
    /// <param name="combineMode">How to combine tags: any (OR) or all (AND)</param>
    /// <param name="maxResults">Maximum number of results</param>
    /// <returns>List of questions matching the tags</returns>
    [HttpGet("by-tags")]
    [AllowAnonymous]
    public async Task<ActionResult<Result<List<QuestionListDto>>>> GetQuestionsByTags(
        [FromQuery] string tags,
        [FromQuery] string combineMode = "any",
        [FromQuery] int maxResults = 20)
    {
        var tagsList = tags.Split(',', StringSplitOptions.RemoveEmptyEntries)
            .Select(t => t.Trim())
            .ToList();

        var result = await _searchService.GetQuestionsByTagsAsync(tagsList, combineMode, maxResults);
        return Ok(result);
    }

    /// <summary>
    /// Get questions by category with sorting options
    /// </summary>
    /// <param name="category">Category name</param>
    /// <param name="sortBy">Sort field: Recent, VoteScore, AnswerCount, ViewCount</param>
    /// <param name="sortDescending">Sort direction</param>
    /// <param name="pageNumber">Page number (1-based)</param>
    /// <param name="pageSize">Items per page</param>
    /// <returns>Paginated questions in the category</returns>
    [HttpGet("by-category/{category}")]
    [AllowAnonymous]
    public async Task<ActionResult<Result<PaginatedList<QuestionListDto>>>> GetQuestionsByCategory(
        string category,
        [FromQuery] string sortBy = "Recent",
        [FromQuery] bool sortDescending = true,
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 10)
    {
        var result = await _searchService.GetQuestionsByCategoryAsync(
            category, sortBy, sortDescending, pageNumber, pageSize);

        return Ok(result);
    }

    /// <summary>
    /// Calculate relevance score for search ranking
    /// </summary>
    /// <param name="request">Relevance calculation parameters</param>
    /// <returns>Relevance score (0.0-1.0)</returns>
    [HttpPost("relevance-score")]
    [Authorize(Roles = "Admin,Moderator")]
    public async Task<ActionResult<double>> CalculateRelevanceScore(
        [FromBody] CalculateRelevanceRequest request)
    {
        var score = await _searchService.CalculateRelevanceScoreAsync(
            request.SearchTerm, request.Title, request.Content, request.Tags,
            request.VoteScore, request.ViewCount, request.CreatedAt);

        return Ok(score);
    }

    /// <summary>
    /// Calculate semantic similarity between two texts
    /// </summary>
    /// <param name="request">Similarity calculation parameters</param>
    /// <returns>Similarity score (0.0-1.0)</returns>
    [HttpPost("similarity-score")]
    [Authorize(Roles = "Admin,Moderator")]
    public async Task<ActionResult<double>> CalculateSemanticSimilarity(
        [FromBody] CalculateSimilarityRequest request)
    {
        var score = await _searchService.CalculateSemanticSimilarityAsync(request.Text1, request.Text2);
        return Ok(score);
    }

    /// <summary>
    /// Get search analytics and insights
    /// </summary>
    /// <param name="fromDate">Start date for analytics</param>
    /// <param name="toDate">End date for analytics</param>
    /// <returns>Search analytics data</returns>
    [HttpGet("analytics")]
    [Authorize(Roles = "Admin,Moderator")]
    public async Task<ActionResult<Result<QASearchAnalyticsDto>>> GetSearchAnalytics(
        [FromQuery] DateTime fromDate,
        [FromQuery] DateTime toDate)
    {
        var result = await _searchService.GetSearchAnalyticsAsync(fromDate, toDate);
        return Ok(result);
    }

    /// <summary>
    /// Update search index for specific content
    /// </summary>
    /// <param name="contentId">Content ID to update</param>
    /// <param name="contentType">Content type: Question or Answer</param>
    /// <returns>Success result</returns>
    [HttpPost("index/update")]
    [Authorize(Roles = "Admin,Moderator")]
    public async Task<ActionResult<Result>> UpdateSearchIndex(
        [FromQuery] Guid contentId,
        [FromQuery] string contentType)
    {
        var result = await _searchService.UpdateSearchIndexAsync(contentId, contentType);
        return Ok(result);
    }

    /// <summary>
    /// Rebuild the entire search index
    /// </summary>
    /// <returns>Success result</returns>
    [HttpPost("index/rebuild")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<Result>> RebuildSearchIndex()
    {
        var result = await _searchService.RebuildSearchIndexAsync();
        return Ok(result);
    }
}

// Request DTOs for search endpoints
public class FindSimilarQuestionsRequest
{
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public Guid? ExcludeQuestionId { get; set; }
    public int MaxResults { get; set; } = 5;
    public double MinSimilarityScore { get; set; } = 0.7;
}

public class CheckDuplicateRequest
{
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public double DuplicateThreshold { get; set; } = 0.95;
}

public class CalculateRelevanceRequest
{
    public string SearchTerm { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public List<string> Tags { get; set; } = new();
    public int VoteScore { get; set; }
    public int ViewCount { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CalculateSimilarityRequest
{
    public string Text1 { get; set; } = string.Empty;
    public string Text2 { get; set; } = string.Empty;
}