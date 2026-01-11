using Application.Common.Models;
using Application.Features.Community.QA.DTOs.Responses;

namespace Application.Features.Community.QA.Services;

/// <summary>
/// Unified QA search service interface providing comprehensive search functionality
/// for both Angular and React frontends
/// </summary>
public interface IQASearchService
{
    // Full-text search with advanced filtering
    Task<Result<PaginatedList<QuestionListDto>>> SearchQuestionsAsync(
        string searchTerm,
        string? category = null,
        List<string>? tags = null,
        DateTime? fromDate = null,
        DateTime? toDate = null,
        int? minVotes = null,
        int? maxVotes = null,
        bool? hasAcceptedAnswer = null,
        bool? isClosed = null,
        string sortBy = "Relevance",
        bool sortDescending = true,
        int pageNumber = 1,
        int pageSize = 10,
        CancellationToken cancellationToken = default);

    Task<Result<PaginatedList<AnswerDto>>> SearchAnswersAsync(
        string searchTerm,
        string? category = null,
        List<string>? tags = null,
        DateTime? fromDate = null,
        DateTime? toDate = null,
        int? minVotes = null,
        int? maxVotes = null,
        bool? isAccepted = null,
        string sortBy = "Relevance",
        bool sortDescending = true,
        int pageNumber = 1,
        int pageSize = 10,
        CancellationToken cancellationToken = default);

    // Similar question detection with configurable thresholds
    Task<Result<List<QuestionSimilarityDto>>> FindSimilarQuestionsAsync(
        string title,
        string content,
        Guid? excludeQuestionId = null,
        int maxResults = 5,
        double minSimilarityScore = 0.7,
        CancellationToken cancellationToken = default);

    // Duplicate prevention with semantic analysis
    Task<Result<bool>> IsQuestionDuplicateAsync(
        string title,
        string content,
        double duplicateThreshold = 0.95,
        CancellationToken cancellationToken = default);

    // Advanced search with multiple criteria
    Task<Result<QASearchResultsDto>> AdvancedSearchAsync(
        QAAdvancedSearchRequest request,
        CancellationToken cancellationToken = default);

    // Search suggestions and autocomplete
    Task<Result<List<string>>> GetSearchSuggestionsAsync(
        string partialTerm,
        string searchType = "all", // "questions", "answers", "tags", "categories", "all"
        int maxSuggestions = 10,
        CancellationToken cancellationToken = default);

    // Tag-based search and discovery
    Task<Result<List<QuestionListDto>>> GetQuestionsByTagsAsync(
        List<string> tags,
        string combineMode = "any", // "any", "all"
        int maxResults = 20,
        CancellationToken cancellationToken = default);

    // Category-based search
    Task<Result<PaginatedList<QuestionListDto>>> GetQuestionsByCategoryAsync(
        string category,
        string sortBy = "Recent",
        bool sortDescending = true,
        int pageNumber = 1,
        int pageSize = 10,
        CancellationToken cancellationToken = default);

    // Search result ranking and relevance scoring
    Task<double> CalculateRelevanceScoreAsync(
        string searchTerm,
        string title,
        string content,
        List<string> tags,
        int voteScore,
        int viewCount,
        DateTime createdAt,
        CancellationToken cancellationToken = default);

    // Semantic similarity calculation
    Task<double> CalculateSemanticSimilarityAsync(
        string text1,
        string text2,
        CancellationToken cancellationToken = default);

    // Search analytics and insights
    Task<Result<QASearchAnalyticsDto>> GetSearchAnalyticsAsync(
        DateTime fromDate,
        DateTime toDate,
        CancellationToken cancellationToken = default);

    // Search index management
    Task<Result> UpdateSearchIndexAsync(
        Guid contentId,
        string contentType, // "Question", "Answer"
        CancellationToken cancellationToken = default);

    Task<Result> RebuildSearchIndexAsync(CancellationToken cancellationToken = default);
}

// DTOs for advanced search functionality
public class QAAdvancedSearchRequest
{
    public string SearchTerm { get; set; } = string.Empty;
    public List<string> Categories { get; set; } = new();
    public List<string> Tags { get; set; } = new();
    public string TagCombineMode { get; set; } = "any"; // "any", "all"
    public DateTime? FromDate { get; set; }
    public DateTime? ToDate { get; set; }
    public int? MinVotes { get; set; }
    public int? MaxVotes { get; set; }
    public int? MinAnswers { get; set; }
    public int? MaxAnswers { get; set; }
    public bool? HasAcceptedAnswer { get; set; }
    public bool? IsClosed { get; set; }
    public List<Guid>? UserIds { get; set; }
    public string SortBy { get; set; } = "Relevance";
    public bool SortDescending { get; set; } = true;
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public bool IncludeAnswers { get; set; } = false;
    public bool HighlightMatches { get; set; } = true;
}

public class QASearchResultsDto
{
    public PaginatedList<QuestionSearchResultDto> Questions { get; set; } = new(new List<QuestionSearchResultDto>(), 0, 1, 10);
    public List<AnswerSearchResultDto> Answers { get; set; } = new();
    public List<string> SearchSuggestions { get; set; } = new();
    public Dictionary<string, int> CategoryCounts { get; set; } = new();
    public Dictionary<string, int> TagCounts { get; set; } = new();
    public QASearchMetadataDto Metadata { get; set; } = new();
}

public class QuestionSearchResultDto : QuestionListDto
{
    public double RelevanceScore { get; set; }
    public List<string> HighlightedSnippets { get; set; } = new();
    public Dictionary<string, List<string>> MatchedFields { get; set; } = new();
}

public class AnswerSearchResultDto : AnswerDto
{
    public double RelevanceScore { get; set; }
    public List<string> HighlightedSnippets { get; set; } = new();
    public string QuestionTitle { get; set; } = string.Empty;
    public new Guid QuestionId { get; set; }
}

public class QASearchMetadataDto
{
    public int TotalResults { get; set; }
    public double SearchDurationMs { get; set; }
    public string SearchId { get; set; } = Guid.NewGuid().ToString();
    public DateTime SearchTimestamp { get; set; } = DateTime.UtcNow;
    public Dictionary<string, object> SearchParameters { get; set; } = new();
}

public class QASearchAnalyticsDto
{
    public int TotalSearches { get; set; }
    public int UniqueUsers { get; set; }
    public Dictionary<string, int> TopSearchTerms { get; set; } = new();
    public Dictionary<string, int> TopCategories { get; set; } = new();
    public Dictionary<string, int> TopTags { get; set; } = new();
    public double AverageResultsPerSearch { get; set; }
    public double AverageSearchDuration { get; set; }
    public List<QASearchTrendDto> SearchTrends { get; set; } = new();
}

public class QASearchTrendDto
{
    public DateTime Date { get; set; }
    public int SearchCount { get; set; }
    public int ResultCount { get; set; }
    public double AverageDuration { get; set; }
}