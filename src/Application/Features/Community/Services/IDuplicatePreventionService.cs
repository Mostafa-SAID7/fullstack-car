using Application.Common.Models;
using Application.Features.Community.QA.DTOs.Responses;

namespace Application.Features.Community.QA.Services;
public interface IDuplicatePreventionService
{
    Task<Result<DuplicateDetectionResult>> DetectDuplicateQuestionAsync(
        string title,
        string content,
        string category,
        List<string> tags,
        double duplicateThreshold = 0.95,
        CancellationToken cancellationToken = default);
    Task<Result<List<SimilarQuestionResult>>> FindSimilarQuestionsAsync(
        string title,
        string content,
        string category,
        List<string> tags,
        Guid? excludeQuestionId = null,
        int maxResults = 5,
        double minSimilarityScore = 0.7,
        CancellationToken cancellationToken = default);
    Task<double> CalculateSemanticSimilarityAsync(
        string text1,
        string text2,
        CancellationToken cancellationToken = default);
    Task<double> CalculateQuestionSimilarityAsync(
        QuestionSimilarityInput question1,
        QuestionSimilarityInput question2,
        CancellationToken cancellationToken = default);
    Task<Result<QuestionValidationResult>> ValidateQuestionForDuplicatesAsync(
        string title,
        string content,
        string category,
        List<string> tags,
        CancellationToken cancellationToken = default);
    Task<Result<DuplicatePreventionAnalyticsDto>> GetDuplicatePreventionAnalyticsAsync(
        DateTime fromDate,
        DateTime toDate,
        CancellationToken cancellationToken = default);
}
public class QuestionSimilarityInput
{
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public List<string> Tags { get; set; } = new();
    public DateTime CreatedAt { get; set; }
    public int VoteScore { get; set; }
    public int ViewCount { get; set; }
}
public class DuplicateDetectionResult
{
    public bool IsDuplicate { get; set; }
    public Guid? DuplicateQuestionId { get; set; }
    public string? DuplicateQuestionTitle { get; set; }
    public double SimilarityScore { get; set; }
    public string DetectionMethod { get; set; } = string.Empty;
    public List<SimilarQuestionResult> SimilarQuestions { get; set; } = new();
    public string RedirectUrl { get; set; } = string.Empty;
    public string RecommendedAction { get; set; } = string.Empty;
    public Dictionary<string, object> Metadata { get; set; } = new();
}
public class SimilarQuestionResult
{
    public Guid QuestionId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public List<string> Tags { get; set; } = new();
    public double SimilarityScore { get; set; }
    public double TitleSimilarity { get; set; }
    public double ContentSimilarity { get; set; }
    public double CategorySimilarity { get; set; }
    public double TagSimilarity { get; set; }
    public int VoteScore { get; set; }
    public int AnswerCount { get; set; }
    public bool HasAcceptedAnswer { get; set; }
    public DateTime CreatedAt { get; set; }
    public string UserName { get; set; } = string.Empty;
    public int UserReputation { get; set; }
    public string SimilarityExplanation { get; set; } = string.Empty;
}
public class QuestionValidationResult
{
    public bool IsValid { get; set; }
    public string ValidationStatus { get; set; } = string.Empty; // "Valid", "Duplicate", "Similar", "Blocked"
    public List<string> ValidationMessages { get; set; } = new();
    public List<SimilarQuestionResult> SuggestedQuestions { get; set; } = new();
    public DuplicateDetectionResult? DuplicateInfo { get; set; }
    public Dictionary<string, object> Recommendations { get; set; } = new();
}
public class DuplicatePreventionAnalyticsDto
{
    public int TotalQuestionsAnalyzed { get; set; }
    public int DuplicatesDetected { get; set; }
    public int DuplicatesPrevented { get; set; }
    public double DuplicateDetectionRate { get; set; }
    public double AverageSimilarityScore { get; set; }
    public Dictionary<string, int> DetectionMethodCounts { get; set; } = new();
    public Dictionary<string, int> CategoryDuplicateCounts { get; set; } = new();
    public List<DuplicateTrendDto> DuplicateTrends { get; set; } = new();
    public Dictionary<string, double> SimilarityScoreDistribution { get; set; } = new();
    public int FalsePositives { get; set; }
    public int FalseNegatives { get; set; }
    public double SystemAccuracy { get; set; }
}
public class DuplicateTrendDto
{
    public DateTime Date { get; set; }
    public int QuestionsAnalyzed { get; set; }
    public int DuplicatesDetected { get; set; }
    public int DuplicatesPrevented { get; set; }
    public double AverageSimilarityScore { get; set; }
}