using Application.Features.Community.QA.Commands;
using Application.Features.Community.QA.Queries;
using Application.Features.Community.QA.Services;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebAPI.Common;
using WebAPI.Controllers;

namespace WebAPI.Controllers.Community;

/// <summary>
/// Unified duplicate prevention controller serving both Angular and React frontends
/// Provides semantic similarity detection and identical question prevention
/// </summary>
[ApiController]
[Route("api/v7/qa/duplicate-prevention")]
[Authorize]
public class DuplicatePreventionController : BaseController
{

    /// <summary>
    /// Validates a question for duplicates before creation
    /// </summary>
    /// <param name="request">Question validation request</param>
    /// <returns>Validation result with duplicate detection information</returns>
    [HttpPost("validate")]
    [ProducesResponseType(typeof(QuestionValidationResult), 200)]
    [ProducesResponseType(400)]
    public async Task<IActionResult> ValidateQuestion(
        [FromBody] ValidateQuestionRequest request)
    {
        var command = new ValidateQuestionForDuplicatesCommand
        {
            Title = request.Title,
            Content = request.Content,
            Category = request.Category,
            Tags = request.Tags,
            DuplicateThreshold = request.DuplicateThreshold,
            SimilarityThreshold = request.SimilarityThreshold,
            MaxSimilarQuestions = request.MaxSimilarQuestions
        };

        var result = await Mediator.Send(command);
        
        if (!result.IsSuccess)
        {
            return ApiResponseWrapper.BadRequest(result.ErrorMessage ?? "Validation failed");
        }

        return ApiResponseWrapper.Success(result.Data, "Question validation completed");
    }

    /// <summary>
    /// Finds similar questions using semantic analysis
    /// </summary>
    /// <param name="request">Similar questions search request</param>
    /// <returns>List of similar questions with similarity scores</returns>
    [HttpPost("similar")]
    [ProducesResponseType(typeof(List<SimilarQuestionResult>), 200)]
    [ProducesResponseType(400)]
    public async Task<IActionResult> FindSimilarQuestions(
        [FromBody] FindSimilarQuestionsRequest request)
    {
        var query = new FindSimilarQuestionsQuery
        {
            Title = request.Title,
            Content = request.Content,
            Category = request.Category,
            Tags = request.Tags,
            ExcludeQuestionId = request.ExcludeQuestionId,
            MaxResults = request.MaxResults,
            MinSimilarityScore = request.MinSimilarityScore
        };

        var result = await Mediator.Send(query);
        
        if (!result.IsSuccess)
        {
            return ApiResponseWrapper.BadRequest(result.ErrorMessage ?? "Similar questions search failed");
        }

        return ApiResponseWrapper.Success(result.Data, $"Found {result.Data.Count} similar questions");
    }

    /// <summary>
    /// Detects if a question is a duplicate of an existing question
    /// </summary>
    /// <param name="request">Duplicate detection request</param>
    /// <returns>Duplicate detection result with similarity information</returns>
    [HttpPost("detect")]
    [ProducesResponseType(typeof(DuplicateDetectionResult), 200)]
    [ProducesResponseType(400)]
    public async Task<IActionResult> DetectDuplicate(
        [FromBody] DetectDuplicateRequest request)
    {
        // Use the duplicate prevention service directly for this specialized endpoint
        var duplicatePreventionService = HttpContext.RequestServices.GetRequiredService<IDuplicatePreventionService>();
        
        var result = await duplicatePreventionService.DetectDuplicateQuestionAsync(
            request.Title,
            request.Content,
            request.Category,
            request.Tags,
            request.DuplicateThreshold ?? 0.95);
        
        if (!result.IsSuccess)
        {
            return ApiResponseWrapper.BadRequest(result.ErrorMessage ?? "Duplicate detection failed");
        }

        return ApiResponseWrapper.Success(result.Data, 
            result.Data.IsDuplicate ? "Duplicate question detected" : "No duplicate found");
    }

    /// <summary>
    /// Calculates semantic similarity between two text strings
    /// </summary>
    /// <param name="request">Similarity calculation request</param>
    /// <returns>Similarity score between 0.0 and 1.0</returns>
    [HttpPost("similarity")]
    [ProducesResponseType(typeof(double), 200)]
    [ProducesResponseType(400)]
    public async Task<IActionResult> CalculateSimilarity(
        [FromBody] CalculateSimilarityRequest request)
    {
        var duplicatePreventionService = HttpContext.RequestServices.GetRequiredService<IDuplicatePreventionService>();
        
        var similarity = await duplicatePreventionService.CalculateSemanticSimilarityAsync(
            request.Text1,
            request.Text2);

        return ApiResponseWrapper.Success(similarity, "Similarity calculation completed");
    }

    /// <summary>
    /// Gets duplicate prevention analytics and statistics
    /// </summary>
    /// <param name="fromDate">Start date for analytics (optional)</param>
    /// <param name="toDate">End date for analytics (optional)</param>
    /// <returns>Duplicate prevention analytics data</returns>
    [HttpGet("analytics")]
    [ProducesResponseType(typeof(DuplicatePreventionAnalyticsDto), 200)]
    [ProducesResponseType(400)]
    public async Task<IActionResult> GetAnalytics(
        [FromQuery] DateTime? fromDate = null,
        [FromQuery] DateTime? toDate = null)
    {
        var duplicatePreventionService = HttpContext.RequestServices.GetRequiredService<IDuplicatePreventionService>();
        
        var from = fromDate ?? DateTime.UtcNow.AddDays(-30);
        var to = toDate ?? DateTime.UtcNow;
        
        var result = await duplicatePreventionService.GetDuplicatePreventionAnalyticsAsync(from, to);
        
        if (!result.IsSuccess)
        {
            return ApiResponseWrapper.BadRequest(result.ErrorMessage ?? "Analytics retrieval failed");
        }

        return ApiResponseWrapper.Success(result.Data, "Analytics retrieved successfully");
    }
}

/// <summary>
/// Request models for duplicate prevention endpoints
/// </summary>
public class ValidateQuestionRequest
{
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public List<string> Tags { get; set; } = new();
    public double? DuplicateThreshold { get; set; }
    public double? SimilarityThreshold { get; set; }
    public int? MaxSimilarQuestions { get; set; }
}

public class FindSimilarQuestionsRequest
{
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public List<string> Tags { get; set; } = new();
    public Guid? ExcludeQuestionId { get; set; }
    public int MaxResults { get; set; } = 5;
    public double MinSimilarityScore { get; set; } = 0.7;
}

public class DetectDuplicateRequest
{
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public List<string> Tags { get; set; } = new();
    public double? DuplicateThreshold { get; set; }
}

public class CalculateSimilarityRequest
{
    public string Text1 { get; set; } = string.Empty;
    public string Text2 { get; set; } = string.Empty;
}