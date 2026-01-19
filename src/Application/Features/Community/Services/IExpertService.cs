using Application.Features.Community.QA.Services;

namespace Application.Features.Community.QA.Services;
public interface IExpertService
{
    #region Expert Detection and Ranking
    Task<List<Guid>> GetExpertsByCategoryAsync(string category);
    Task<List<ExpertRankingDto>> GetRankedExpertsAsync(string category, int count = 10);
    Task UpdateExpertStatsAsync(Guid userId, string category, string activityType);
    Task<bool> IsUserExpertInCategoryAsync(Guid userId, string category);
    Task PromoteToExpertAsync(Guid userId, string category);
    Task<string> DetermineExpertiseLevelAsync(Guid userId, string category);
    
    #endregion

    #region Expert Notification System
    Task NotifyExpertsForQuestionAsync(Guid questionId, string category);
    Task<List<Guid>> GetNotifiableExpertsAsync(string category);
    Task UpdateExpertNotificationPreferencesAsync(Guid userId, string category, bool enabled);
    Task<Dictionary<string, bool>> GetExpertNotificationPreferencesAsync(Guid userId);
    
    #endregion

    #region Expert Badge and Recognition
    Task CheckAndAwardExpertBadgesAsync(Guid userId, string category);
    Task<List<string>> GetExpertBadgesAsync(Guid userId);
    Task<bool> HasExpertBadgeAsync(Guid userId, string category);
    
    #endregion

    #region Expert Preference Management
    Task<List<string>> GetUserExpertiseCategoriesAsync(Guid userId);
    Task AddExpertiseCategoryAsync(Guid userId, string category);
    Task RemoveExpertiseCategoryAsync(Guid userId, string category);
    Task UpdateExpertPreferencesAsync(Guid userId, ExpertPreferencesDto preferences);
    Task<ExpertPreferencesDto> GetExpertPreferencesAsync(Guid userId);
    
    #endregion

    #region Expert Analytics
    Task<ExpertAnalyticsDto> GetExpertAnalyticsAsync(Guid userId, string? category = null);
    Task<List<ExpertLeaderboardDto>> GetExpertLeaderboardAsync(string category, int count = 10);
    Task<ExpertPerformanceDto> GetExpertPerformanceAsync(Guid userId, string category);
    
    #endregion
}

#region DTOs
public class ExpertRankingDto
{
    public Guid UserId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public string ExpertiseLevel { get; set; } = string.Empty;
    public int AnswerCount { get; set; }
    public int AcceptedAnswerCount { get; set; }
    public decimal AverageRating { get; set; }
    public decimal ResponseRate { get; set; }
    public int ReputationScore { get; set; }
    public List<string> Badges { get; set; } = new();
}
public class ExpertPreferencesDto
{
    public Guid UserId { get; set; }
    public Dictionary<string, bool> CategoryNotifications { get; set; } = new();
    public bool EmailNotifications { get; set; } = true;
    public bool PushNotifications { get; set; } = true;
    public int MaxQuestionsPerDay { get; set; } = 10;
    public List<string> PreferredTags { get; set; } = new();
    public string TimeZone { get; set; } = "UTC";
    public bool QuietHoursEnabled { get; set; } = false;
    public TimeSpan QuietHoursStart { get; set; } = TimeSpan.FromHours(22);
    public TimeSpan QuietHoursEnd { get; set; } = TimeSpan.FromHours(8);
}
public class ExpertAnalyticsDto
{
    public Guid UserId { get; set; }
    public int TotalAnswers { get; set; }
    public int AcceptedAnswers { get; set; }
    public decimal AcceptanceRate { get; set; }
    public decimal AverageRating { get; set; }
    public int TotalUpvotes { get; set; }
    public int TotalDownvotes { get; set; }
    public Dictionary<string, int> AnswersByCategory { get; set; } = new();
    public Dictionary<string, string> ExpertiseLevels { get; set; } = new();
    public List<string> EarnedBadges { get; set; } = new();
    public DateTime LastActivity { get; set; }
    public int ReputationScore { get; set; }
}
public class ExpertLeaderboardDto
{
    public Guid UserId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public string ExpertiseLevel { get; set; } = string.Empty;
    public int AcceptedAnswers { get; set; }
    public decimal AverageRating { get; set; }
    public int ReputationScore { get; set; }
    public int Rank { get; set; }
}
public class ExpertPerformanceDto
{
    public Guid UserId { get; set; }
    public string Category { get; set; } = string.Empty;
    public string ExpertiseLevel { get; set; } = string.Empty;
    public int AnswerCount { get; set; }
    public int AcceptedAnswerCount { get; set; }
    public decimal AcceptanceRate { get; set; }
    public decimal AverageRating { get; set; }
    public decimal ResponseRate { get; set; }
    public DateTime LastActivity { get; set; }
    public List<string> RecentBadges { get; set; } = new();
}

#endregion