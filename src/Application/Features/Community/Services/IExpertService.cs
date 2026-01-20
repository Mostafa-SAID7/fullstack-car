using Application.Common.Models;
using Application.Features.Community.QA.DTOs.Responses;

namespace Application.Features.Community.Services;

public interface IExpertService
{
    Task<Result<bool>> IsUserExpertAsync(Guid userId, string category);
    Task<Result<List<Guid>>> GetExpertsForCategoryAsync(string category);
    Task<Result<bool>> PromoteToExpertAsync(Guid userId, string category);
    Task<Result<List<string>>> GetUserExpertiseAreasAsync(Guid userId);
    Task<Result<Dictionary<string, int>>> GetExpertStatsAsync(Guid userId);
    
    // Additional methods needed by handlers
    Task<List<Guid>> GetExpertsByCategoryAsync(string category);
    Task<List<ExpertRankingDto>> GetRankedExpertsAsync(string category, int count);
    Task<bool> IsUserExpertInCategoryAsync(Guid userId, string category);
    Task<string> DetermineExpertiseLevelAsync(Guid userId, string category);
    Task<List<Guid>> GetNotifiableExpertsAsync(string category);
    Task<Dictionary<string, bool>> GetExpertNotificationPreferencesAsync(Guid userId);
    Task<List<string>> GetExpertBadgesAsync(Guid userId);
    Task<bool> HasExpertBadgeAsync(Guid userId, string category);
    Task<List<string>> GetUserExpertiseCategoriesAsync(Guid userId);
    Task<ExpertPreferencesDto> GetExpertPreferencesAsync(Guid userId);
    Task<ExpertAnalyticsDto> GetExpertAnalyticsAsync(Guid userId, string? category);
    Task<List<ExpertLeaderboardDto>> GetExpertLeaderboardAsync(string category, int count);
    Task<ExpertPerformanceDto> GetExpertPerformanceAsync(Guid userId, string category);
    Task<bool> UpdateExpertNotificationPreferencesAsync(Guid userId, string category, bool enabled);
    Task<bool> UpdateExpertPreferencesAsync(Guid userId, ExpertPreferencesDto preferences);
    Task<bool> AddExpertiseCategoryAsync(Guid userId, string category);
    Task<bool> RemoveExpertiseCategoryAsync(Guid userId, string category);
    Task<bool> NotifyExpertsForQuestionAsync(Guid questionId, string category);
    Task<bool> UpdateExpertStatsAsync(Guid userId, string category, string activityType);
    Task<List<string>> CheckAndAwardExpertBadgesAsync(Guid userId, string category);
}