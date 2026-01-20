namespace Application.Features.Community.QA.DTOs.Responses;

public class DuplicatePreventionAnalyticsDto
{
    public int TotalQuestionsAnalyzed { get; set; }
    public int DuplicatesDetected { get; set; }
    public int DuplicatesPrevented { get; set; }
    public double DuplicateDetectionRate { get; set; }
    public double AverageSimilarityScore { get; set; }
    public Dictionary<string, int> DetectionMethodCounts { get; set; } = new();
    public Dictionary<string, int> CategoryDuplicateCounts { get; set; } = new();
    public Dictionary<string, double> SimilarityScoreDistribution { get; set; } = new();
    public int FalsePositives { get; set; }
    public int FalseNegatives { get; set; }
    public double SystemAccuracy { get; set; }
    public List<DuplicateTrendDto> DuplicateTrends { get; set; } = new();
}