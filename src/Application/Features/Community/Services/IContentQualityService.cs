using Application.Common.Models;

namespace Application.Features.Community.Services;

public interface IContentQualityService
{
    Task<Result<bool>> ValidateQuestionQualityAsync(string title, string content, string tags);
    Task<Result<bool>> ValidateAnswerQualityAsync(string content);
    Task<Result<double>> CalculateContentScoreAsync(string content);
    Task<Result<List<string>>> GetContentSuggestionsAsync(string content);
    Task<Result<bool>> CheckForSpamAsync(string content, Guid userId);
    
    // Additional methods needed by handlers
    Task<double> EvaluateQuestionQualityAsync(string title, string content);
    Task<double> EvaluateAnswerQualityAsync(string content);
    Task<Application.Features.Community.DTOs.Responses.ContentQualityAssessmentDto> GetDetailedQualityAssessmentAsync(string content, string contentType = "question");
    Task<bool> IsSpamAsync(string content);
    Task<List<string>> DetectInappropriateContentAsync(string content);
}