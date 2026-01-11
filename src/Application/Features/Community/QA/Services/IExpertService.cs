using Application.Features.Community.QA.Services;

namespace Application.Features.Community.QA.Services;

/// <summary>
/// Interface for expert identification and management service
/// </summary>
public interface IExpertService
{
    #region Expert Detection and Ranking
    
    /// <summary>
    /// Get experts by category
    /// </summary>
    Task<List<Guid>> GetExpertsByCategoryAsync(string category);
    
    /// <summary>
    /// Get ranked experts in a category
    /// </summary>
    Task<List<ExpertRankingDto>> GetRankedExpertsAsync(string category, int count = 10);
    
    /// <summary>
    /// Update expert statistics after activity
    /// </summary>
    Task UpdateExpertStatsAsync(Guid userId, string category, string activityType);
    
    /// <summary>
    /// Check if user is expert in category
    /// </summary>
    Task<bool> IsUserExpertInCategoryAsync(Guid userId, string category);
    
    /// <summary>
    /// Promote user to expert status
    /// </summary>
    Task PromoteToExpertAsync(Guid userId, string category);
    
    /// <summary>
    /// Determine user's expertise level in category
    /// </summary>
    Task<string> DetermineExpertiseLevelAsync(Guid userId, string category);
    
    #endregion

    #region Expert Notification System
    
    /// <summary>
    /// Notify experts about a new question
    /// </summary>
    Task NotifyExpertsForQuestionAsync(Guid questionId, string category);
    
    /// <summary>
    /// Get notifiable experts for a category
    /// </summary>
    Task<List<Guid>> GetNotifiableExpertsAsync(string category);
    
    /// <summary>
    /// Update expert notification preferences
    /// </summary>
    Task UpdateExpertNotificationPreferencesAsync(Guid userId, string category, bool enabled);
    
    /// <summary>
    /// Get expert notification preferences
    /// </summary>
    Task<Dictionary<string, bool>> GetExpertNotificationPreferencesAsync(Guid userId);
    
    #endregion

    #region Expert Badge and Recognition
    
    /// <summary>
    /// Check and award expert badges
    /// </summary>
    Task CheckAndAwardExpertBadgesAsync(Guid userId, string category);
    
    /// <summary>
    /// Get expert badges for a user
    /// </summary>
    Task<List<string>> GetExpertBadgesAsync(Guid userId);
    
    /// <summary>
    /// Check if user has expert badge in category
    /// </summary>
    Task<bool> HasExpertBadgeAsync(Guid userId, string category);
    
    #endregion

    #region Expert Preference Management
    
    /// <summary>
    /// Get user's expertise categories
    /// </summary>
    Task<List<string>> GetUserExpertiseCategoriesAsync(Guid userId);
    
    /// <summary>
    /// Add expertise category for user
    /// </summary>
    Task AddExpertiseCategoryAsync(Guid userId, string category);
    
    /// <summary>
    /// Remove expertise category for user
    /// </summary>
    Task RemoveExpertiseCategoryAsync(Guid userId, string category);
    
    /// <summary>
    /// Update expert preferences
    /// </summary>
    Task UpdateExpertPreferencesAsync(Guid userId, ExpertPreferencesDto preferences);
    
    /// <summary>
    /// Get expert preferences
    /// </summary>
    Task<ExpertPreferencesDto> GetExpertPreferencesAsync(Guid userId);
    
    #endregion

    #region Expert Analytics
    
    /// <summary>
    /// Get expert analytics
    /// </summary>
    Task<ExpertAnalyticsDto> GetExpertAnalyticsAsync(Guid userId, string? category = null);
    
    /// <summary>
    /// Get expert leaderboard
    /// </summary>
    Task<List<ExpertLeaderboardDto>> GetExpertLeaderboardAsync(string category, int count = 10);
    
    /// <summary>
    /// Get expert performance metrics
    /// </summary>
    Task<ExpertPerformanceDto> GetExpertPerformanceAsync(Guid userId, string category);
    
    #endregion
}

#region DTOs

/// <summary>
/// Expert ranking data transfer object
/// </summary>
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

/// <summary>
/// Expert preferences data transfer object
/// </summary>
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

/// <summary>
/// Expert analytics data transfer object
/// </summary>
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

/// <summary>
/// Expert leaderboard data transfer object
/// </summary>
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

/// <summary>
/// Expert performance data transfer object
/// </summary>
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