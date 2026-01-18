using Application.Features.Community.QA.DTOs.Requests;
using Application.Features.Community.QA.DTOs.Responses;
using Application.Features.Community.QA.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ApiVersion = Asp.Versioning.ApiVersion;

namespace WebAPI.Controllers.Community;

[ApiController]
[Asp.Versioning.ApiVersion("2.0")]
[Route("api/v{version:apiVersion}/qa/content-quality")]
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
        return Success(isValid, "Content validated");
    }

    [HttpPost("evaluate/question")]
    public async Task<IActionResult> EvaluateQuestionQuality([FromBody] EvaluateQuestionRequest request)
    {
        var score = await _contentQualityService.EvaluateQuestionQualityAsync(request.Title, request.Content);
        return Success(score, "Question quality evaluated");
    }

    [HttpPost("evaluate/answer")]
    public async Task<IActionResult> EvaluateAnswerQuality([FromBody] EvaluateAnswerRequest request)
    {
        var score = await _contentQualityService.EvaluateAnswerQualityAsync(request.Content);
        return Success(score, "Answer quality evaluated");
    }

    [HttpPost("spam-check")]
    public async Task<IActionResult> CheckSpam([FromBody] ValidateContentRequest request)
    {
        var isSpam = await _contentQualityService.IsSpamAsync(request.Content);
        return Success(isSpam, "Spam check completed");
    }

    [HttpPost("inappropriate-content")]
    public async Task<IActionResult> DetectInappropriateContent([FromBody] ValidateContentRequest request)
    {
        var issues = await _contentQualityService.DetectInappropriateContentAsync(request.Content);
        return Success(issues, "Content safety check completed");
    }

    [HttpPost("detailed-assessment")]
    public async Task<IActionResult> GetDetailedAssessment([FromBody] DetailedAssessmentRequest request)
    {
        var assessment = await _contentQualityService.GetDetailedQualityAssessmentAsync(request.Content, request.ContentType);
        return Success(assessment, "Detailed assessment completed");
    }
}


