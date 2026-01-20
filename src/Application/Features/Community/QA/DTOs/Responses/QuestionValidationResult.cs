namespace Application.Features.Community.QA.DTOs.Responses;

public class QuestionValidationResult
{
    public bool IsValid { get; set; }
    public bool HasDuplicates { get; set; }
    public List<QuestionListDto> SimilarQuestions { get; set; } = new();
    public List<string> ValidationErrors { get; set; } = new();
    public List<string> Suggestions { get; set; } = new();
    public double QualityScore { get; set; }
    public string RecommendedAction { get; set; } = string.Empty;
}