using Application.Features.Community.QA.DTOs.Responses;

namespace Application.Features.Community.QA.Services;
public interface IContentQualityService
{
    Task<double> EvaluateQuestionQualityAsync(string title, string content);
    Task<double> EvaluateAnswerQualityAsync(string content);
    Task<bool> IsSpamAsync(string content);
    Task<List<string>> DetectInappropriateContentAsync(string content);
    Task<bool> ValidateContentQualityAsync(string content);
    Task<ContentQualityAssessmentDto> GetDetailedQualityAssessmentAsync(string content, string contentType);
}