namespace Application.Features.Community.QA.DTOs;

public class NotifyExpertsRequest
{
    public Guid QuestionId { get; set; }
    public List<string> ExpertTags { get; set; } = new();
    public string? CustomMessage { get; set; }
}

public class FindSimilarQuestionsRequest
{
    public string Title { get; set; } = string.Empty;
    public string? Content { get; set; }
    public List<string> Tags { get; set; } = new();
    public int MaxResults { get; set; } = 10;
}

public class CheckDuplicateRequest
{
    public string Title { get; set; } = string.Empty;
    public string? Content { get; set; }
    public double SimilarityThreshold { get; set; } = 0.8;
}

public class CalculateRelevanceRequest
{
    public string SearchTerm { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public List<string> Tags { get; set; } = new();
    public Dictionary<string, double> Weights { get; set; } = new();
}

public class CalculateSimilarityRequest
{
    public string Text1 { get; set; } = string.Empty;
    public string Text2 { get; set; } = string.Empty;
    public string Algorithm { get; set; } = "cosine"; // cosine, jaccard, levenshtein
}

public class ValidateQuestionRequest
{
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public List<string> Tags { get; set; } = new();
    public bool CheckDuplicates { get; set; } = true;
}

public class DetectDuplicateRequest
{
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public List<string> Tags { get; set; } = new();
    public double Threshold { get; set; } = 0.8;
}

public class TagSuggestionRequest
{
    public string Content { get; set; } = string.Empty;
    public string? Title { get; set; }
    public int MaxSuggestions { get; set; } = 10;
}