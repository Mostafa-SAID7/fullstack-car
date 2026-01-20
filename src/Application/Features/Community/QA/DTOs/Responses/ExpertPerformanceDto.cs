namespace Application.Features.Community.QA.DTOs.Responses;

public class ExpertPerformanceDto
{
    public Guid UserId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public DateTime PeriodStart { get; set; }
    public DateTime PeriodEnd { get; set; }
    public int QuestionsAnswered { get; set; }
    public int BestAnswers { get; set; }
    public double AverageRating { get; set; }
    public TimeSpan AverageResponseTime { get; set; }
    public int HelpfulVotes { get; set; }
    public double ExpertiseGrowth { get; set; }
    public List<string> Achievements { get; set; } = new();
    public Dictionary<string, double> CategoryScores { get; set; } = new();
}