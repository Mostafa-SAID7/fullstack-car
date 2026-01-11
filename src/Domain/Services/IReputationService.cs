using Domain.Entities.Community.QA;
using Domain.Enums.Community.QA;
using Domain.ValueObjects.Community;

namespace Domain.Services
{
    public interface IReputationService
    {
        // Reputation Calculation
        Task<int> CalculateReputationChangeAsync(
            ActivityType activityType, 
            Guid userId, 
            Guid? contentId = null, 
            string? category = null, 
            CancellationToken cancellationToken = default);

        Task<UserReputation> UpdateUserReputationAsync(
            Guid userId, 
            ReputationChange reputationChange, 
            CancellationToken cancellationToken = default);

        Task<UserReputation> RecalculateUserReputationAsync(
            Guid userId, 
            CancellationToken cancellationToken = default);

        // Badge Management
        Task<IEnumerable<Badge>> CheckForNewBadgesAsync(
            Guid userId, 
            CancellationToken cancellationToken = default);

        Task<UserReputation> AwardBadgeAsync(
            Guid userId, 
            Badge badge, 
            CancellationToken cancellationToken = default);

        Task<bool> HasBadgeAsync(
            Guid userId, 
            BadgeType badgeType, 
            string? category = null, 
            CancellationToken cancellationToken = default);

        Task<IEnumerable<Badge>> GetUserBadgesAsync(
            Guid userId, 
            CancellationToken cancellationToken = default);

        // Reputation History
        Task<QAUserActivity> RecordActivityAsync(
            Guid userId, 
            ActivityType activityType, 
            Guid contentId, 
            string? category = null, 
            int reputationChange = 0, 
            CancellationToken cancellationToken = default);

        Task<IEnumerable<QAUserActivity>> GetReputationHistoryAsync(
            Guid userId, 
            DateTime? fromDate = null, 
            DateTime? toDate = null, 
            CancellationToken cancellationToken = default);

        Task<Dictionary<string, int>> GetReputationBreakdownAsync(
            Guid userId, 
            CancellationToken cancellationToken = default);

        // Expertise Area Management
        Task<UserReputation> AddExpertiseAreaAsync(
            Guid userId, 
            ExpertiseArea expertiseArea, 
            CancellationToken cancellationToken = default);

        Task<UserReputation> UpdateExpertiseAreaAsync(
            Guid userId, 
            string category, 
            int answerCount, 
            int acceptedAnswerCount, 
            decimal averageRating, 
            decimal responseRate, 
            CancellationToken cancellationToken = default);

        Task<UserReputation> RemoveExpertiseAreaAsync(
            Guid userId, 
            string category, 
            CancellationToken cancellationToken = default);

        Task<IEnumerable<ExpertiseArea>> GetUserExpertiseAreasAsync(
            Guid userId, 
            CancellationToken cancellationToken = default);

        Task<bool> IsUserExpertInCategoryAsync(
            Guid userId, 
            string category, 
            CancellationToken cancellationToken = default);

        // Privilege Management
        Task<bool> CanUserDownvoteAsync(
            Guid userId, 
            CancellationToken cancellationToken = default);

        Task<bool> CanUserModerateAsync(
            Guid userId, 
            CancellationToken cancellationToken = default);

        Task<bool> CanUserEditOthersContentAsync(
            Guid userId, 
            CancellationToken cancellationToken = default);

        Task<bool> CanUserCloseQuestionsAsync(
            Guid userId, 
            CancellationToken cancellationToken = default);

        Task<int> GetRequiredReputationForPrivilegeAsync(
            string privilegeName, 
            CancellationToken cancellationToken = default);

        // Analytics and Insights
        Task<Dictionary<string, object>> GetReputationAnalyticsAsync(
            Guid userId, 
            CancellationToken cancellationToken = default);

        Task<IEnumerable<UserReputation>> GetTopUsersAsync(
            int count = 10, 
            string? category = null, 
            CancellationToken cancellationToken = default);

        Task<IEnumerable<UserReputation>> GetExpertsInCategoryAsync(
            string category, 
            int count = 10, 
            CancellationToken cancellationToken = default);

        Task<decimal> GetUserReputationPercentileAsync(
            Guid userId, 
            CancellationToken cancellationToken = default);
    }
}