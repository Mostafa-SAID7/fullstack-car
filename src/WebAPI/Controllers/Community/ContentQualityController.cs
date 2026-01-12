using Application.Features.Community.QA.DTOs.Responses;
using Application.Features.Community.QA.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebAPI.Common;

namespace WebAPI.Controllers.Community;

/// <summary>
/// Controller for content quality assessment and validation
/// </summary>
[ApiController]
[Route("api/v7/qa/content-quality")]
[Authorize]
public class ContentQualityController : BaseController
{
    private readonly IContentQualityService _contentQualityService;

    public ContentQualityController(IContentQualityService contentQualityService)
    {
        _contentQualityService = contentQualityService;
    }

    /// <summary>
    /// Validates if content meets minimum quality standards
    /// </summary>
    /// <param name="request">Content validation request</param>
    /// <returns>Validation result</returns>
    [HttpPost("validate")]
    public async Task<IActionResult> ValidateContent([FromBody] ValidateContentRequest request)
    {
        var isValid = await _contentQualityService.ValidateContentQualityAsync(request.Content);
        return ApiResponseWrapper.Success(isValid);
    }

    /// <summary>
    /// Evaluates question quality score
    /// </summary>
    /// <param name="request">Question quality evaluation request</param>
    /// <returns>Quality score between 0.0 and 1.0</returns>
    [HttpPost("evaluate/question")]
    public async Task<IActionResult> EvaluateQuestionQuality([FromBody] EvaluateQuestionRequest request)
    {
        var score = await _contentQualityService.EvaluateQuestionQualityAsync(request.Title, request.Content);
        return ApiResponseWrapper.Success(score);
    }

    /// <summary>
    /// Evaluates answer quality score
    /// </summary>
    /// <param name="request">Answer quality evaluation request</param>
    /// <returns>Quality score between 0.0 and 1.0</returns>
    [HttpPost("evaluate/answer")]
    public async Task<IActionResult> EvaluateAnswerQuality([FromBody] EvaluateAnswerRequest request)
    {
        var score = await _contentQualityService.EvaluateAnswerQualityAsync(request.Content);
        return ApiResponseWrapper.Success(score);
    }

    /// <summary>
    /// Checks if content is spam
    /// </summary>
    /// <param name="request">Spam detection request</param>
    /// <returns>True if content is likely spam</returns>
    [HttpPost("spam-check")]
    public async Task<IActionResult> CheckSpam([FromBody] ValidateContentRequest request)
    {
        var isSpam = await _contentQualityService.IsSpamAsync(request.Content);
        return ApiResponseWrapper.Success(isSpam);
    }

    /// <summary>
    /// Detects inappropriate content
    /// </summary>
    /// <param name="request">Inappropriate content detection request</param>
    /// <returns>List of inappropriate content categories detected</returns>
    [HttpPost("inappropriate-content")]
    public async Task<IActionResult> DetectInappropriateContent([FromBody] ValidateContentRequest request)
    {
        var issues = await _contentQualityService.DetectInappropriateContentAsync(request.Content);
        return ApiResponseWrapper.Success(issues);
    }

    /// <summary>
    /// Gets detailed quality assessment with breakdown
    /// </summary>
    /// <param name="request">Detailed assessment request</param>
    /// <returns>Comprehensive quality assessment</returns>
    [HttpPost("detailed-assessment")]
    public async Task<IActionResult> GetDetailedAssessment([FromBody] DetailedAssessmentRequest request)
    {
        var assessment = await _contentQualityService.GetDetailedQualityAssessmentAsync(request.Content, request.ContentType);
        return ApiResponseWrapper.Success(assessment);
    }
}

/// <summary>
/// Request model for content validation
/// </summary>
public class ValidateContentRequest
{
    /// <summary>
    /// Content to validate
    /// </summary>
    public string Content { get; set; } = string.Empty;
}

/// <summary>
/// Request model for question quality evaluation
/// </summary>
public class EvaluateQuestionRequest
{
    /// <summary>
    /// Question title
    /// </summary>
    public string Title { get; set; } = string.Empty;

    /// <summary>
    /// Question content
    /// </summary>
    public string Content { get; set; } = string.Empty;
}

/// <summary>
/// Request model for answer quality evaluation
/// </summary>
public class EvaluateAnswerRequest
{
    /// <summary>
    /// Answer content
    /// </summary>
    public string Content { get; set; } = string.Empty;
}

/// <summary>
/// Request model for detailed quality assessment
/// </summary>
public class DetailedAssessmentRequest
{
    /// <summary>
    /// Content to assess
    /// </summary>
    public string Content { get; set; } = string.Empty;

    /// <summary>
    /// Type of content (Question, Answer)
    /// </summary>
    public string ContentType { get; set; } = "Answer";
}