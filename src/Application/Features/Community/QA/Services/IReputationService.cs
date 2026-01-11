namespace Application.Features.Community.QA.Services;

/// <summary>
/// Application layer interface for reputation service
/// </summary>
public interface IReputationService
{
    /// <summary>
    /// Calculate reputation change for an activity
    /// </summary>
    Task<int> CalculateReputationChangeAsync(string activityType, Guid userId, Guid contentId);
    
    /// <summary>
    /// Update user reputation with points and reason
    /// </summary>
    Task UpdateUserReputationAsync(Guid userId, int reputationChange, string activityType, Guid contentId, string category);
    
    /// <summary>
    /// Award a badge to a user
    /// </summary>
    Task AwardBadgeAsync(Guid userId, string badgeName, string reason);
    
    /// <summary>
    /// Check for new badges for a user
    /// </summary>
    Task<List<string>> CheckForNewBadgesAsync(Guid userId);
    
    /// <summary>
    /// Check if user has sufficient reputation for an action
    /// </summary>
    Task<bool> HasSufficientReputationAsync(Guid userId, string action);
    
    /// <summary>
    /// Recalculate user's total reputation
    /// </summary>
    Task RecalculateUserReputationAsync(Guid userId);
}