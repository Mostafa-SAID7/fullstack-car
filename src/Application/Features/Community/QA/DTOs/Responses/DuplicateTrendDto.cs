namespace Application.Features.Community.QA.DTOs.Responses;

public class DuplicateTrendDto
{
    public DateTime Date { get; set; }
    public int QuestionsAnalyzed { get; set; }
    public int DuplicatesDetected { get; set; }
    public int DuplicatesPrevented { get; set; }
    public double AverageSimilarityScore { get; set; }
}