namespace Application.Features.Community.Services;
public interface IReputationService
{
    Task<int> CalculateReputationChangeAsync(string activityType, Guid userId, Guid contentId);
    Task UpdateUserReputationAsync(Guid userId, int reputationChange, string activityType, Guid contentId, string category);
    Task AwardBadgeAsync(Guid userId, string badgeName, string reason);
    Task<List<string>> CheckForNewBadgesAsync(Guid userId);
    Task<bool> HasSufficientReputationAsync(Guid userId, string action);
    Task RecalculateUserReputationAsync(Guid userId);
}
