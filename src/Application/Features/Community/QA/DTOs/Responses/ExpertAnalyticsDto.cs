namespace Application.Features.Community.QA.DTOs.Responses;

public class ExpertAnalyticsDto
{
    public Guid UserId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public DateTime AnalyticsPeriodStart { get; set; }
    public DateTime AnalyticsPeriodEnd { get; set; }
    public int QuestionsAnswered { get; set; }
    public int AnswersAccepted { get; set; }
    public double AverageResponseTime { get; set; }
    public int UpvotesReceived { get; set; }
    public int DownvotesReceived { get; set; }
    public double EngagementScore { get; set; }
    public List<string> TopCategories { get; set; } = new();
    public Dictionary<string, int> CategoryBreakdown { get; set; } = new();
}