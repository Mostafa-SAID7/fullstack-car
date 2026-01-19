using Application.Features.Community.QA.DTOs.Responses;

namespace Application.Features.Community.QA.Services;

public interface ICommunityService
{
    Task<List<QuestionSimilarityDto>> FindSimilarQuestionsAsync(string title, string content, Guid? excludeQuestionId = null);
    Task<bool> IsQuestionDuplicateAsync(string title, string content);
    Task<double> CalculateSimilarityScoreAsync(string text1, string text2);
    Task NotifyExpertsAsync(Guid questionId, string category);
    Task UpdateQuestionViewCountAsync(Guid questionId);
    Task<List<string>> ExtractTagsFromContentAsync(string content);
    Task<bool> ValidateContentQualityAsync(string content);
}