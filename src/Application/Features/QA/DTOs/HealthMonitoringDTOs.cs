namespace Application.Features.QA.DTOs;

/// <summary>
/// System Health Status DTO
/// Provides comprehensive health information following existing monitoring patterns
/// </summary>
public class SystemHealthDto
{
    public string Status { get; set; } = string.Empty; // "Healthy", "Warning", "Critical"
    public DateTime Timestamp { get; set; }
    public long CheckDurationMs { get; set; }
    public string? Error { get; set; }
    public HealthMetricsDto? Metrics { get; set; }
    public DependencyHealthDto? Dependencies { get; set; }
}

/// <summary>
/// Health Metrics DTO
/// Contains key performance indicators for system health
/// </summary>
public class HealthMetricsDto
{
    public int TotalQuestions { get; set; }
    public int TotalAnswers { get; set; }
    public int ActiveUsers { get; set; }
    public int RecentQuestions24h { get; set; }
    public int RecentAnswers24h { get; set; }
    public int RecentVotes24h { get; set; }
    public double ResponseRate { get; set; } // Percentage of questions with answers
    public double AverageResponseTimeHours { get; set; }
    public int ActiveConnections { get; set; }
    public string ConnectionHealth { get; set; } = string.Empty;
}

/// <summary>
/// Dependency Health DTO
/// Tracks health of external dependencies
/// </summary>
public class DependencyHealthDto
{
    public string Database { get; set; } = string.Empty;
    public string SignalR { get; set; } = string.Empty;
    public string SearchIndex { get; set; } = string.Empty;
    public string Cache { get; set; } = string.Empty;
}

/// <summary>
/// Performance Metrics DTO
/// Detailed performance analytics for dashboard display
/// </summary>
public class PerformanceMetricsDto
{
    public DateTime Timestamp { get; set; }
    public List<MetricDataPointDto> QuestionTrends { get; set; } = new();
    public List<MetricDataPointDto> AnswerTrends { get; set; } = new();
    public List<MetricDataPointDto> VoteTrends { get; set; } = new();
    public double ExpertResponseRate { get; set; }
    public SearchPerformanceDto SearchPerformance { get; set; } = new();
    public SystemLoadDto SystemLoad { get; set; } = new();
}

/// <summary>
/// Metric Data Point DTO
/// Individual data point for trend charts
/// </summary>
public class MetricDataPointDto
{
    public DateTime Date { get; set; }
    public double Value { get; set; }
    public string? Label { get; set; }
    public Dictionary<string, object>? Metadata { get; set; }
}

/// <summary>
/// Search Performance DTO
/// Search system performance metrics
/// </summary>
public class SearchPerformanceDto
{
    public double AverageSearchTimeMs { get; set; }
    public int SearchesPerHour { get; set; }
    public double SearchSuccessRate { get; set; }
    public int IndexedQuestions { get; set; }
    public int IndexedAnswers { get; set; }
    public DateTime LastIndexUpdate { get; set; }
}

/// <summary>
/// System Load DTO
/// Current system resource utilization
/// </summary>
public class SystemLoadDto
{
    public double CpuUsagePercent { get; set; }
    public long MemoryUsageMB { get; set; }
    public int ActiveThreads { get; set; }
    public string DatabaseConnections { get; set; } = string.Empty;
    public int QueuedTasks { get; set; }
}

/// <summary>
/// System Alert DTO
/// System alerts and warnings for monitoring dashboard
/// </summary>
public class SystemAlertDto
{
    public Guid Id { get; set; }
    public string Type { get; set; } = string.Empty; // "Info", "Warning", "Error", "Critical"
    public string Title { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string Severity { get; set; } = string.Empty; // "Low", "Medium", "High", "Critical"
    public string Category { get; set; } = string.Empty; // "Performance", "Infrastructure", "Experts", "System"
    public DateTime CreatedAt { get; set; }
    public DateTime? ResolvedAt { get; set; }
    public bool IsActive { get; set; }
    public string? ResolvedBy { get; set; }
    public string? Resolution { get; set; }
    public Dictionary<string, object>? Metadata { get; set; }
}

/// <summary>
/// User Satisfaction DTO
/// User satisfaction metrics based on engagement and feedback
/// </summary>
public class UserSatisfactionDto
{
    public DateTime Timestamp { get; set; }
    public double OverallSatisfactionScore { get; set; } // 0-100 scale
    public double AnswerAcceptanceRate { get; set; } // Percentage of answers accepted
    public double UserEngagementRate { get; set; } // Percentage of users active in last 30 days
    public double AverageQuestionScore { get; set; } // Average vote score for questions
    public double AverageAnswerScore { get; set; } // Average vote score for answers
    public int ActiveUsers30Days { get; set; }
    public int TotalUsers { get; set; }
    public List<MetricDataPointDto> SatisfactionTrend { get; set; } = new();
    public FeedbackSummaryDto? FeedbackSummary { get; set; }
}

/// <summary>
/// Feedback Summary DTO
/// Summary of user feedback and satisfaction surveys
/// </summary>
public class FeedbackSummaryDto
{
    public int TotalResponses { get; set; }
    public double AverageRating { get; set; } // 1-5 scale
    public Dictionary<string, int> RatingDistribution { get; set; } = new();
    public List<string> CommonComplaints { get; set; } = new();
    public List<string> CommonPraises { get; set; } = new();
    public DateTime LastSurveyDate { get; set; }
}

/// <summary>
/// Health Dashboard DTO
/// Complete dashboard data combining all health metrics
/// </summary>
public class HealthDashboardDto
{
    public SystemHealthDto SystemHealth { get; set; } = new();
    public PerformanceMetricsDto PerformanceMetrics { get; set; } = new();
    public List<SystemAlertDto> ActiveAlerts { get; set; } = new();
    public UserSatisfactionDto UserSatisfaction { get; set; } = new();
    public ExpertHealthDto ExpertHealth { get; set; } = new();
    public DateTime LastUpdated { get; set; }
    public string OverallStatus { get; set; } = string.Empty;
}

/// <summary>
/// Expert Health DTO
/// Health metrics specific to expert system
/// </summary>
public class ExpertHealthDto
{
    public int TotalExperts { get; set; }
    public int ActiveExperts { get; set; }
    public double AverageExpertResponseRate { get; set; }
    public double ExpertRetentionRate { get; set; }
    public List<ExpertCategoryHealthDto> CategoryHealth { get; set; } = new();
    public List<MetricDataPointDto> ExpertActivityTrend { get; set; } = new();
}

/// <summary>
/// Expert Category Health DTO
/// Expert health metrics by category
/// </summary>
public class ExpertCategoryHealthDto
{
    public string CategoryName { get; set; } = string.Empty;
    public int ExpertCount { get; set; }
    public int ActiveExpertCount { get; set; }
    public double AverageResponseRate { get; set; }
    public int UnansweredQuestions { get; set; }
    public string HealthStatus { get; set; } = string.Empty; // "Healthy", "Warning", "Critical"
}

/// <summary>
/// Performance Alert Configuration DTO
/// Configuration for performance alerts and thresholds
/// </summary>
public class PerformanceAlertConfigDto
{
    public double ResponseRateWarningThreshold { get; set; } = 70.0;
    public double ResponseRateCriticalThreshold { get; set; } = 50.0;
    public double ResponseTimeWarningHours { get; set; } = 48.0;
    public double ResponseTimeCriticalHours { get; set; } = 72.0;
    public int MinimumActiveExperts { get; set; } = 5;
    public int CriticalActiveExperts { get; set; } = 3;
    public double SatisfactionWarningThreshold { get; set; } = 70.0;
    public double SatisfactionCriticalThreshold { get; set; } = 50.0;
    public bool EnableRealTimeAlerts { get; set; } = true;
    public bool EnableEmailNotifications { get; set; } = true;
    public List<string> AlertRecipients { get; set; } = new();
}
