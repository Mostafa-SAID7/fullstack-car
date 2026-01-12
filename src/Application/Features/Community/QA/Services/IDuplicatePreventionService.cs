using Application.Common.Models;
using Application.Features.Community.QA.DTOs.Responses;

namespace Application.Features.Community.QA.Services;

/// <summary>
/// Unified duplicate prevention service interface providing semantic similarity detection
/// and identical question prevention for both Angular and React frontends
/// </summary>
public interface IDuplicatePreventionService
{
    /// <summary>
    /// Detects if a question is an exact duplicate of an existing question
    /// </summary>
    /// <param name="title">Question title</param>
    /// <param name="content">Question content</param>
    /// <param name="category">Question category</param>
    /// <param name="tags">Question tags</param>
    /// <param name="duplicateThreshold">Threshold for considering questions identical (default: 0.95)</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Result containing duplicate detection information</returns>
    Task<Result<DuplicateDetectionResult>> DetectDuplicateQuestionAsync(
        string title,
        string content,
        string category,
        List<string> tags,
        double duplicateThreshold = 0.95,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Finds semantically similar questions using advanced similarity algorithms
    /// </summary>
    /// <param name="title">Question title</param>
    /// <param name="content">Question content</param>
    /// <param name="category">Question category</param>
    /// <param name="tags">Question tags</param>
    /// <param name="excludeQuestionId">Question ID to exclude from results</param>
    /// <param name="maxResults">Maximum number of similar questions to return</param>
    /// <param name="minSimilarityScore">Minimum similarity score threshold (default: 0.7)</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Result containing list of similar questions with similarity scores</returns>
    Task<Result<List<SimilarQuestionResult>>> FindSimilarQuestionsAsync(
        string title,
        string content,
        string category,
        List<string> tags,
        Guid? excludeQuestionId = null,
        int maxResults = 5,
        double minSimilarityScore = 0.7,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Calculates semantic similarity between two text strings using multiple algorithms
    /// </summary>
    /// <param name="text1">First text string</param>
    /// <param name="text2">Second text string</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Similarity score between 0.0 and 1.0</returns>
    Task<double> CalculateSemanticSimilarityAsync(
        string text1,
        string text2,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Calculates comprehensive similarity score between two questions
    /// considering title, content, category, and tags
    /// </summary>
    /// <param name="question1">First question data</param>
    /// <param name="question2">Second question data</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Overall similarity score between 0.0 and 1.0</returns>
    Task<double> CalculateQuestionSimilarityAsync(
        QuestionSimilarityInput question1,
        QuestionSimilarityInput question2,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Validates if a question should be allowed based on duplicate prevention rules
    /// </summary>
    /// <param name="title">Question title</param>
    /// <param name="content">Question content</param>
    /// <param name="category">Question category</param>
    /// <param name="tags">Question tags</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Result containing validation outcome and suggestions</returns>
    Task<Result<QuestionValidationResult>> ValidateQuestionForDuplicatesAsync(
        string title,
        string content,
        string category,
        List<string> tags,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets duplicate prevention statistics and analytics
    /// </summary>
    /// <param name="fromDate">Start date for analytics</param>
    /// <param name="toDate">End date for analytics</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Result containing duplicate prevention analytics</returns>
    Task<Result<DuplicatePreventionAnalyticsDto>> GetDuplicatePreventionAnalyticsAsync(
        DateTime fromDate,
        DateTime toDate,
        CancellationToken cancellationToken = default);
}

/// <summary>
/// Input data for question similarity calculation
/// </summary>
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

/// <summary>
/// Result of duplicate detection operation
/// </summary>
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

/// <summary>
/// Result of similar question search
/// </summary>
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

/// <summary>
/// Result of question validation for duplicates
/// </summary>
public class QuestionValidationResult
{
    public bool IsValid { get; set; }
    public string ValidationStatus { get; set; } = string.Empty; // "Valid", "Duplicate", "Similar", "Blocked"
    public List<string> ValidationMessages { get; set; } = new();
    public List<SimilarQuestionResult> SuggestedQuestions { get; set; } = new();
    public DuplicateDetectionResult? DuplicateInfo { get; set; }
    public Dictionary<string, object> Recommendations { get; set; } = new();
}

/// <summary>
/// Analytics data for duplicate prevention system
/// </summary>
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

/// <summary>
/// Duplicate detection trend data
/// </summary>
public class DuplicateTrendDto
{
    public DateTime Date { get; set; }
    public int QuestionsAnalyzed { get; set; }
    public int DuplicatesDetected { get; set; }
    public int DuplicatesPrevented { get; set; }
    public double AverageSimilarityScore { get; set; }
}