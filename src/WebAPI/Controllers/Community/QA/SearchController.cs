using Application.Common.Models;
using Application.Features.Community.QA.DTOs.Responses;
using Application.Features.Community.QA.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebAPI.Controllers;

namespace WebAPI.Controllers.Community.QA;
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
    [HttpPost("duplicate-check")]
    [AllowAnonymous]
    public async Task<ActionResult<Result<bool>>> CheckDuplicate(
        [FromBody] CheckDuplicateRequest request)
    {
        var result = await _searchService.IsQuestionDuplicateAsync(
            request.Title, request.Content, request.DuplicateThreshold);

        return Ok(result);
    }
    [HttpPost("advanced")]
    [AllowAnonymous]
    public async Task<ActionResult<Result<QASearchResultsDto>>> AdvancedSearch(
        [FromBody] QAAdvancedSearchRequest request)
    {
        var result = await _searchService.AdvancedSearchAsync(request);
        return Ok(result);
    }
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
    [HttpPost("similarity-score")]
    [Authorize(Roles = "Admin,Moderator")]
    public async Task<ActionResult<double>> CalculateSemanticSimilarity(
        [FromBody] CalculateSimilarityRequest request)
    {
        var score = await _searchService.CalculateSemanticSimilarityAsync(request.Text1, request.Text2);
        return Ok(score);
    }
    [HttpGet("analytics")]
    [Authorize(Roles = "Admin,Moderator")]
    public async Task<ActionResult<Result<QASearchAnalyticsDto>>> GetSearchAnalytics(
        [FromQuery] DateTime fromDate,
        [FromQuery] DateTime toDate)
    {
        var result = await _searchService.GetSearchAnalyticsAsync(fromDate, toDate);
        return Ok(result);
    }
    [HttpPost("index/update")]
    [Authorize(Roles = "Admin,Moderator")]
    public async Task<ActionResult<Result>> UpdateSearchIndex(
        [FromQuery] Guid contentId,
        [FromQuery] string contentType)
    {
        var result = await _searchService.UpdateSearchIndexAsync(contentId, contentType);
        return Ok(result);
    }
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