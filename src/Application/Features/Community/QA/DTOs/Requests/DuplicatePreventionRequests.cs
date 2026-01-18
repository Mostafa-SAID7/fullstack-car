namespace Application.Features.Community.QA.DTOs.Requests;

public class ValidateQuestionRequest
{
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public List<string> Tags { get; set; } = new();
    public double? DuplicateThreshold { get; set; }
    public double? SimilarityThreshold { get; set; }
    public int? MaxSimilarQuestions { get; set; }
}

public class FindSimilarQuestionsRequest
{
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public List<string> Tags { get; set; } = new();
    public Guid? ExcludeQuestionId { get; set; }
    public int MaxResults { get; set; } = 5;
    public double MinSimilarityScore { get; set; } = 0.7;
}

public class DetectDuplicateRequest
{
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public List<string> Tags { get; set; } = new();
    public double? DuplicateThreshold { get; set; }
}

public class CalculateSimilarityRequest
{
    public string Text1 { get; set; } = string.Empty;
    public string Text2 { get; set; } = string.Empty;
}
