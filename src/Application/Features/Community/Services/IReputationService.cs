using Application.Common.Models;

namespace Application.Features.Community.Services;

public interface IReputationService
{
    Task<Result<int>> GetUserReputationAsync(Guid userId);
    Task<Result<bool>> UpdateReputationAsync(Guid userId, int change, string reason);
    Task<Result<List<string>>> GetUserBadgesAsync(Guid userId);
    Task<Result<bool>> AwardBadgeAsync(Guid userId, string badgeName);
    Task<Result<Dictionary<string, int>>> GetReputationBreakdownAsync(Guid userId);
    
    // Additional methods needed by handlers
    Task<bool> HasSufficientReputationAsync(Guid userId, string action);
    Task<int> CalculateReputationChangeAsync(string activityType, Guid userId, Guid contentId);
    Task<bool> UpdateUserReputationAsync(Guid userId, int reputationChange, string reason = "", Guid? sourceId = null, string sourceType = "");
    Task<bool> AwardBadgeWithCategoryAsync(Guid userId, string badgeName, string category);
}