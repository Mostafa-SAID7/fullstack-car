namespace Application.Features.Community.QA.DTOs.Responses;

public class FeedbackSummaryDto
{
    public double AverageSatisfaction { get; set; }
    public int TotalFeedbacks { get; set; }
    public Dictionary<string, int> CategoryBreakdown { get; set; } = new();
    public List<string> CommonIssues { get; set; } = new();
    public List<string> Suggestions { get; set; } = new();
    public DateTime GeneratedAt { get; set; }
    
    // Additional properties referenced in services
    public int TotalResponses { get; set; }
    public double AverageRating { get; set; }
    public Dictionary<int, int> RatingDistribution { get; set; } = new();
    public List<string> CommonComplaints { get; set; } = new();
    public List<string> CommonPraises { get; set; } = new();
    public DateTime? LastSurveyDate { get; set; }
}