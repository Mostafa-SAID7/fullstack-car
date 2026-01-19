namespace Application.Features.Community.Reviews.DTOs;

public class ReviewAnalyticsDto
{
    public Guid ReviewId { get; set; }
    public int TotalViews { get; set; }
    public int HelpfulMarks { get; set; }
    public int UnhelpfulMarks { get; set; }
    public double HelpfulnessRatio { get; set; }
    public int CommentsCount { get; set; }
    public Dictionary<string, int> ViewsByDate { get; set; } = new();
    public Dictionary<string, int> HelpfulMarksByDate { get; set; } = new();
}
