using Application.Features.Community.QA.Commands;
using Application.Features.Community.QA.DTOs.Requests;
using Application.Features.Community.QA.Queries;
using Application.Features.Community.QA.Services;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebAPI.Common;
using WebAPI.Controllers;
using Asp.Versioning;

namespace WebAPI.Controllers.Community;

[ApiController]
[ApiVersion("2.0")]
[Route("api/v{version:apiVersion}/qa/duplicate-prevention")]
[Authorize]
public class DuplicatePreventionController : BaseController
{
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
            return BadRequest(result.ErrorMessage ?? "Validation failed");
        }

        return Success(result.Data, "Question validation completed");
    }

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
            return BadRequest(result.ErrorMessage ?? "Similar questions search failed");
        }

        return Success(result.Data, $"Found {result.Data.Count} similar questions");
    }

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
            return BadRequest(result.ErrorMessage ?? "Duplicate detection failed");
        }

        return Success(result.Data, 
            result.Data.IsDuplicate ? "Duplicate question detected" : "No duplicate found");
    }

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

        return Success(similarity, "Similarity calculation completed");
    }

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
            return BadRequest(result.ErrorMessage ?? "Analytics retrieval failed");
        }

        return Success(result.Data, "Analytics retrieved successfully");
    }
}


