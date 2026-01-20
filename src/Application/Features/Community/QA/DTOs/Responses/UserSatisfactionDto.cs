namespace Application.Features.Community.QA.DTOs.Responses;

public class UserSatisfactionDto
{
    public Guid UserId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public double SatisfactionScore { get; set; }
    public string FeedbackCategory { get; set; } = string.Empty;
    public string? Comments { get; set; }
    public DateTime SubmittedAt { get; set; }
    
    // Additional properties referenced in services
    public DateTime Timestamp { get; set; }
    public double OverallSatisfactionScore { get; set; }
    public double AnswerAcceptanceRate { get; set; }
    public double UserEngagementRate { get; set; }
    public double AverageQuestionScore { get; set; }
    public double AverageAnswerScore { get; set; }
    public int ActiveUsers30Days { get; set; }
    public int TotalUsers { get; set; }
    public string SatisfactionTrend { get; set; } = string.Empty;
    public FeedbackSummaryDto? FeedbackSummary { get; set; }
}