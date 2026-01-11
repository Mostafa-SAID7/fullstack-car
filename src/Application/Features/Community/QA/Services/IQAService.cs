using Application.Features.Community.QA.DTOs.Responses;

namespace Application.Features.Community.QA.Services;

public interface IQAService
{
    Task<List<QuestionSimilarityDto>> FindSimilarQuestionsAsync(string title, string content, Guid? excludeQuestionId = null);
    Task<bool> IsQuestionDuplicateAsync(string title, string content);
    Task<double> CalculateSimilarityScoreAsync(string text1, string text2);
    Task NotifyExpertsAsync(Guid questionId, string category);
    Task UpdateQuestionViewCountAsync(Guid questionId);
    Task<List<string>> ExtractTagsFromContentAsync(string content);
    Task<bool> ValidateContentQualityAsync(string content);
}

public interface IReputationService
{
    Task<int> CalculateReputationChangeAsync(string activityType, Guid userId, Guid contentId);
    Task UpdateUserReputationAsync(Guid userId, int reputationChange, string activityType, Guid contentId, string category);
    Task AwardBadgeAsync(Guid userId, string badgeName, string reason);
    Task<List<string>> CheckForNewBadgesAsync(Guid userId);
    Task<bool> HasSufficientReputationAsync(Guid userId, string action);
    Task RecalculateUserReputationAsync(Guid userId);
}

public interface IExpertService
{
    Task<List<Guid>> GetExpertsByCategoryAsync(string category);
    Task UpdateExpertStatsAsync(Guid userId, string category, string activityType);
    Task<bool> IsUserExpertInCategoryAsync(Guid userId, string category);
    Task PromoteToExpertAsync(Guid userId, string category);
    Task<string> DetermineExpertiseLevelAsync(Guid userId, string category);
}