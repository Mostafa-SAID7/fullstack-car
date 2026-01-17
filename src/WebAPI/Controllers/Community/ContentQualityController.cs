using Application.Features.Community.QA.DTOs.Responses;
using Application.Features.Community.QA.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebAPI.Common;

namespace WebAPI.Controllers.Community;
[ApiController]
[Route("api/v2.0/qa/content-quality")]
[Authorize]
public class ContentQualityController : BaseController
{
    private readonly IContentQualityService _contentQualityService;

    public ContentQualityController(IContentQualityService contentQualityService)
    {
        _contentQualityService = contentQualityService;
    }
    [HttpPost("validate")]
    public async Task<IActionResult> ValidateContent([FromBody] ValidateContentRequest request)
    {
        var isValid = await _contentQualityService.ValidateContentQualityAsync(request.Content);
        return ApiResponseWrapper.Success(isValid);
    }
    [HttpPost("evaluate/question")]
    public async Task<IActionResult> EvaluateQuestionQuality([FromBody] EvaluateQuestionRequest request)
    {
        var score = await _contentQualityService.EvaluateQuestionQualityAsync(request.Title, request.Content);
        return ApiResponseWrapper.Success(score);
    }
    [HttpPost("evaluate/answer")]
    public async Task<IActionResult> EvaluateAnswerQuality([FromBody] EvaluateAnswerRequest request)
    {
        var score = await _contentQualityService.EvaluateAnswerQualityAsync(request.Content);
        return ApiResponseWrapper.Success(score);
    }
    [HttpPost("spam-check")]
    public async Task<IActionResult> CheckSpam([FromBody] ValidateContentRequest request)
    {
        var isSpam = await _contentQualityService.IsSpamAsync(request.Content);
        return ApiResponseWrapper.Success(isSpam);
    }
    [HttpPost("inappropriate-content")]
    public async Task<IActionResult> DetectInappropriateContent([FromBody] ValidateContentRequest request)
    {
        var issues = await _contentQualityService.DetectInappropriateContentAsync(request.Content);
        return ApiResponseWrapper.Success(issues);
    }
    [HttpPost("detailed-assessment")]
    public async Task<IActionResult> GetDetailedAssessment([FromBody] DetailedAssessmentRequest request)
    {
        var assessment = await _contentQualityService.GetDetailedQualityAssessmentAsync(request.Content, request.ContentType);
        return ApiResponseWrapper.Success(assessment);
    }
}
public class ValidateContentRequest
{
    public string Content { get; set; } = string.Empty;
}
public class EvaluateQuestionRequest
{
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
}
public class EvaluateAnswerRequest
{
    public string Content { get; set; } = string.Empty;
}
public class DetailedAssessmentRequest
{
    public string Content { get; set; } = string.Empty;
    public string ContentType { get; set; } = "Answer";
}