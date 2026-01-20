namespace Application.Features.Community.QA.DTOs.Responses;

public class DuplicateDetectionResult
{
    public bool IsDuplicate { get; set; }
    public double SimilarityScore { get; set; }
    public string DetectionMethod { get; set; } = string.Empty;
    public Guid? DuplicateQuestionId { get; set; }
    public string? DuplicateQuestionTitle { get; set; }
    public string? RedirectUrl { get; set; }
    public string RecommendedAction { get; set; } = string.Empty;
    public List<SimilarQuestionResult> SimilarQuestions { get; set; } = new();
    public Dictionary<string, object> Metadata { get; set; } = new();
}