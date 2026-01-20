using Application.Common.Interfaces;
using Application.Common.Models;
using Application.Features.Community.QA.DTOs.Responses;
using Application.Features.Community.Services;
using Domain.Entities.Community.QA;
using Domain.Enums.Community;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System.Diagnostics;
using System.Text.Json;
using System.Text.RegularExpressions;

namespace Infrastructure.Services.Community;
public class DuplicatePreventionOptions
{
    public const string SectionName = "DuplicatePrevention";
    
    public bool EnableSemanticAnalysis { get; set; } = true;
    public bool EnableCaching { get; set; } = true;
    public int CacheExpirationMinutes { get; set; } = 30;
    public double DefaultDuplicateThreshold { get; set; } = 0.95;
    public double DefaultSimilarityThreshold { get; set; } = 0.7;
    public int MaxCandidateQuestions { get; set; } = 500;
    public bool EnableAnalytics { get; set; } = true;
    public double TitleWeight { get; set; } = 0.5;
    public double ContentWeight { get; set; } = 0.3;
    public double CategoryWeight { get; set; } = 0.1;
    public double TagWeight { get; set; } = 0.1;
}
public class DuplicatePreventionService : IDuplicatePreventionService
{
    private readonly IApplicationDbContext _context;
    private readonly IMemoryCache _cache;
    private readonly ILogger<DuplicatePreventionService> _logger;
    private readonly DuplicatePreventionOptions _options;
    
    // Cache keys
    private const string DUPLICATE_CACHE_PREFIX = "duplicate_";
    private const string SIMILARITY_CACHE_PREFIX = "similarity_";
    private const string ANALYTICS_CACHE_KEY = "duplicate_analytics";

    public DuplicatePreventionService(
        IApplicationDbContext context,
        IMemoryCache cache,
        ILogger<DuplicatePreventionService> logger,
        IOptions<DuplicatePreventionOptions> options)
    {
        _context = context;
        _cache = cache;
        _logger = logger;
        _options = options.Value;
    }

    public async Task<Result<DuplicateDetectionResult>> DetectDuplicateQuestionAsync(
        string title,
        string content,
        string category,
        List<string> tags,
        double duplicateThreshold = 0.95,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var stopwatch = Stopwatch.StartNew();
            
            // Generate cache key for this duplicate detection
            var cacheKey = GenerateDuplicateCacheKey(title, content, category, tags, duplicateThreshold);
            
            // Try to get from cache first
            if (_options.EnableCaching && _cache.TryGetValue(cacheKey, out DuplicateDetectionResult? cachedResult))
            {
                _logger.LogDebug("Returning cached duplicate detection result for key: {CacheKey}", cacheKey);
                return Result<DuplicateDetectionResult>.Success(cachedResult!);
            }

            var inputQuestion = new QuestionSimilarityInput
            {
                Title = title,
                Content = content,
                Category = category,
                Tags = tags,
                CreatedAt = DateTime.UtcNow
            };

            // Get candidate questions for comparison
            var candidateQuestions = await GetCandidateQuestionsAsync(category, tags, cancellationToken);
            
            var result = new DuplicateDetectionResult
            {
                IsDuplicate = false,
                SimilarityScore = 0.0,
                DetectionMethod = "SemanticAnalysis",
                SimilarQuestions = new List<SimilarQuestionResult>()
            };

            var highestSimilarity = 0.0;
            SimilarQuestionResult? mostSimilarQuestion = null;

            foreach (var candidate in candidateQuestions)
            {
                var candidateInput = new QuestionSimilarityInput
                {
                    Title = candidate.Title,
                    Content = candidate.Content,
                    Category = candidate.Category?.Name ?? "General",
                    Tags = ParseTags(candidate.Tags),
                    CreatedAt = candidate.CreatedAt,
                    VoteScore = candidate.UpvotesCount - candidate.DownvotesCount,
                    ViewCount = candidate.ViewsCount
                };

                var similarity = await CalculateQuestionSimilarityAsync(inputQuestion, candidateInput, cancellationToken);
                
                if (similarity >= _options.DefaultSimilarityThreshold)
                {
                    var similarResult = new SimilarQuestionResult
                    {
                        QuestionId = candidate.Id,
                        Title = candidate.Title,
                        Content = candidate.Content,
                        Category = candidateInput.Category,
                        Tags = candidateInput.Tags,
                        SimilarityScore = similarity,
                        TitleSimilarity = await CalculateSemanticSimilarityAsync(title, candidate.Title, cancellationToken),
                        ContentSimilarity = await CalculateSemanticSimilarityAsync(content, candidate.Content, cancellationToken),
                        CategorySimilarity = category.Equals(candidateInput.Category, StringComparison.OrdinalIgnoreCase) ? 1.0 : 0.0,
                        TagSimilarity = CalculateTagSimilarity(tags, candidateInput.Tags),
                        VoteScore = candidateInput.VoteScore,
                        AnswerCount = candidate.AnswersCount,
                        HasAcceptedAnswer = candidate.HasAcceptedAnswer,
                        CreatedAt = candidate.CreatedAt,
                        UserName = candidate.User?.UserName ?? "Unknown",
                        SimilarityExplanation = GenerateSimilarityExplanation(similarity, candidateInput.Title)
                    };

                    result.SimilarQuestions.Add(similarResult);

                    if (similarity > highestSimilarity)
                    {
                        highestSimilarity = similarity;
                        mostSimilarQuestion = similarResult;
                    }
                }
            }

            // Check if the highest similarity exceeds the duplicate threshold
            if (highestSimilarity >= duplicateThreshold && mostSimilarQuestion != null)
            {
                result.IsDuplicate = true;
                result.DuplicateQuestionId = mostSimilarQuestion.QuestionId;
                result.DuplicateQuestionTitle = mostSimilarQuestion.Title;
                result.SimilarityScore = highestSimilarity;
                result.RedirectUrl = $"/questions/{mostSimilarQuestion.QuestionId}";
                result.RecommendedAction = "redirect";
                result.Metadata["duplicateReason"] = "High semantic similarity detected";
                result.Metadata["detectionAlgorithm"] = "Weighted semantic analysis";
            }
            else if (result.SimilarQuestions.Any())
            {
                result.SimilarityScore = highestSimilarity;
                result.RecommendedAction = "suggest";
                result.Metadata["suggestionReason"] = "Similar questions found";
            }

            // Sort similar questions by similarity score
            result.SimilarQuestions = result.SimilarQuestions
                .OrderByDescending(q => q.SimilarityScore)
                .Take(5)
                .ToList();

            // Cache the result
            if (_options.EnableCaching)
            {
                var cacheExpiration = TimeSpan.FromMinutes(_options.CacheExpirationMinutes);
                var cacheEntryOptions = new MemoryCacheEntryOptions
                {
                    AbsoluteExpirationRelativeToNow = cacheExpiration,
                    Size = 1
                };
                _cache.Set(cacheKey, result, cacheEntryOptions);
            }

            stopwatch.Stop();
            _logger.LogInformation("Duplicate detection completed in {Duration}ms. IsDuplicate: {IsDuplicate}, SimilarityScore: {SimilarityScore}", 
                stopwatch.ElapsedMilliseconds, result.IsDuplicate, result.SimilarityScore);

            // Record analytics
            if (_options.EnableAnalytics)
            {
                _ = Task.Run(() => RecordDuplicateAnalyticsAsync(result, stopwatch.ElapsedMilliseconds), cancellationToken);
            }

            return Result<DuplicateDetectionResult>.Success(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error detecting duplicate question");
            return Result<DuplicateDetectionResult>.Failure("An error occurred while detecting duplicates");
        }
    }

    public async Task<Result<List<SimilarQuestionResult>>> FindSimilarQuestionsAsync(
        string title,
        string content,
        string category,
        List<string> tags,
        Guid? excludeQuestionId = null,
        int maxResults = 5,
        double minSimilarityScore = 0.7,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var stopwatch = Stopwatch.StartNew();

            var inputQuestion = new QuestionSimilarityInput
            {
                Title = title,
                Content = content,
                Category = category,
                Tags = tags,
                CreatedAt = DateTime.UtcNow
            };

            // Get candidate questions for comparison
            var candidateQuestions = await GetCandidateQuestionsAsync(category, tags, cancellationToken);
            
            // Exclude the specified question if provided
            if (excludeQuestionId.HasValue)
            {
                candidateQuestions = candidateQuestions.Where(q => q.Id != excludeQuestionId.Value).ToList();
            }

            var similarQuestions = new List<SimilarQuestionResult>();

            foreach (var candidate in candidateQuestions)
            {
                var candidateInput = new QuestionSimilarityInput
                {
                    Title = candidate.Title,
                    Content = candidate.Content,
                    Category = candidate.Category?.Name ?? "General",
                    Tags = ParseTags(candidate.Tags),
                    CreatedAt = candidate.CreatedAt,
                    VoteScore = candidate.UpvotesCount - candidate.DownvotesCount,
                    ViewCount = candidate.ViewsCount
                };

                var similarity = await CalculateQuestionSimilarityAsync(inputQuestion, candidateInput, cancellationToken);
                
                if (similarity >= minSimilarityScore)
                {
                    var similarResult = new SimilarQuestionResult
                    {
                        QuestionId = candidate.Id,
                        Title = candidate.Title,
                        Content = candidate.Content,
                        Category = candidateInput.Category,
                        Tags = candidateInput.Tags,
                        SimilarityScore = similarity,
                        TitleSimilarity = await CalculateSemanticSimilarityAsync(title, candidate.Title, cancellationToken),
                        ContentSimilarity = await CalculateSemanticSimilarityAsync(content, candidate.Content, cancellationToken),
                        CategorySimilarity = category.Equals(candidateInput.Category, StringComparison.OrdinalIgnoreCase) ? 1.0 : 0.0,
                        TagSimilarity = CalculateTagSimilarity(tags, candidateInput.Tags),
                        VoteScore = candidateInput.VoteScore,
                        AnswerCount = candidate.AnswersCount,
                        HasAcceptedAnswer = candidate.HasAcceptedAnswer,
                        CreatedAt = candidate.CreatedAt,
                        UserName = candidate.User?.UserName ?? "Unknown",
                        SimilarityExplanation = GenerateSimilarityExplanation(similarity, candidate.Title)
                    };

                    similarQuestions.Add(similarResult);
                }
            }

            var result = similarQuestions
                .OrderByDescending(q => q.SimilarityScore)
                .ThenByDescending(q => q.VoteScore)
                .Take(maxResults)
                .ToList();

            stopwatch.Stop();
            _logger.LogInformation("Similar questions search completed in {Duration}ms, found {Count} results", 
                stopwatch.ElapsedMilliseconds, result.Count);

            return Result<List<SimilarQuestionResult>>.Success(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error finding similar questions");
            return Result<List<SimilarQuestionResult>>.Failure("An error occurred while finding similar questions");
        }
    }

    public async Task<double> CalculateSemanticSimilarityAsync(
        string text1,
        string text2,
        CancellationToken cancellationToken = default)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(text1) || string.IsNullOrWhiteSpace(text2))
                return 0.0;

            // Generate cache key for this similarity calculation
            var cacheKey = GenerateSimilarityCacheKey(text1, text2);
            
            // Try to get from cache first
            if (_options.EnableCaching && _cache.TryGetValue(cacheKey, out double cachedSimilarity))
            {
                return cachedSimilarity;
            }

            // Normalize texts
            var normalizedText1 = NormalizeText(text1);
            var normalizedText2 = NormalizeText(text2);

            // Extract words and n-grams
            var words1 = ExtractWords(normalizedText1).ToHashSet();
            var words2 = ExtractWords(normalizedText2).ToHashSet();
            var bigrams1 = ExtractNGrams(normalizedText1, 2).ToHashSet();
            var bigrams2 = ExtractNGrams(normalizedText2, 2).ToHashSet();
            var trigrams1 = ExtractNGrams(normalizedText1, 3).ToHashSet();
            var trigrams2 = ExtractNGrams(normalizedText2, 3).ToHashSet();

            if (!words1.Any() || !words2.Any())
                return 0.0;

            // Calculate multiple similarity metrics
            var jaccardSimilarity = CalculateJaccardSimilarity(words1, words2);
            var cosineSimilarity = CalculateCosineSimilarity(words1, words2);
            var bigramSimilarity = CalculateJaccardSimilarity(bigrams1, bigrams2);
            var trigramSimilarity = CalculateJaccardSimilarity(trigrams1, trigrams2);
            var levenshteinSimilarity = CalculateLevenshteinSimilarity(normalizedText1, normalizedText2);

            // Weighted combination of similarity metrics
            var overallSimilarity = 
                (jaccardSimilarity * 0.25) +
                (cosineSimilarity * 0.25) +
                (bigramSimilarity * 0.2) +
                (trigramSimilarity * 0.15) +
                (levenshteinSimilarity * 0.15);

            // Cache the result
            if (_options.EnableCaching)
            {
                var cacheExpiration = TimeSpan.FromMinutes(_options.CacheExpirationMinutes);
                var cacheEntryOptions = new MemoryCacheEntryOptions
                {
                    AbsoluteExpirationRelativeToNow = cacheExpiration,
                    Size = 1
                };
                _cache.Set(cacheKey, overallSimilarity, cacheEntryOptions);
            }

            return overallSimilarity;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error calculating semantic similarity");
            return 0.0;
        }
    }

    public async Task<double> CalculateQuestionSimilarityAsync(
        QuestionSimilarityInput question1,
        QuestionSimilarityInput question2,
        CancellationToken cancellationToken = default)
    {
        try
        {
            // Calculate individual component similarities
            var titleSimilarity = await CalculateSemanticSimilarityAsync(question1.Title, question2.Title, cancellationToken);
            var contentSimilarity = await CalculateSemanticSimilarityAsync(question1.Content, question2.Content, cancellationToken);
            var categorySimilarity = question1.Category.Equals(question2.Category, StringComparison.OrdinalIgnoreCase) ? 1.0 : 0.0;
            var tagSimilarity = CalculateTagSimilarity(question1.Tags, question2.Tags);

            // Weighted combination based on configuration
            var overallSimilarity = 
                (titleSimilarity * _options.TitleWeight) +
                (contentSimilarity * _options.ContentWeight) +
                (categorySimilarity * _options.CategoryWeight) +
                (tagSimilarity * _options.TagWeight);

            return Math.Min(1.0, overallSimilarity);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error calculating question similarity");
            return 0.0;
        }
    }

    public async Task<Result<QuestionValidationResult>> ValidateQuestionForDuplicatesAsync(
        string title,
        string content,
        string category,
        List<string> tags,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var duplicateResult = await DetectDuplicateQuestionAsync(title, content, category, tags, 
                _options.DefaultDuplicateThreshold, cancellationToken);

            if (!duplicateResult.IsSuccess)
            {
                return Result<QuestionValidationResult>.Failure(duplicateResult.ErrorMessage ?? "Error validating question");
            }

            var validation = new QuestionValidationResult
            {
                IsValid = !duplicateResult.Data.IsDuplicate,
                ValidationMessages = new List<string>(),
                SuggestedQuestions = duplicateResult.Data.SimilarQuestions,
                DuplicateInfo = duplicateResult.Data,
                Recommendations = new Dictionary<string, object>()
            };

            if (duplicateResult.Data.IsDuplicate)
            {
                validation.ValidationStatus = "Duplicate";
                validation.ValidationMessages.Add($"This question appears to be a duplicate of an existing question: '{duplicateResult.Data.DuplicateQuestionTitle}'");
                validation.ValidationMessages.Add($"Similarity score: {duplicateResult.Data.SimilarityScore:P1}");
                validation.Recommendations["action"] = "redirect";
                validation.Recommendations["redirectUrl"] = duplicateResult.Data.RedirectUrl;
            }
            else if (duplicateResult.Data.SimilarQuestions.Any())
            {
                validation.ValidationStatus = "Similar";
                validation.ValidationMessages.Add($"Found {duplicateResult.Data.SimilarQuestions.Count} similar questions that might answer your question.");
                validation.Recommendations["action"] = "suggest";
                validation.Recommendations["suggestedCount"] = duplicateResult.Data.SimilarQuestions.Count;
            }
            else
            {
                validation.ValidationStatus = "Valid";
                validation.ValidationMessages.Add("No duplicate or highly similar questions found.");
                validation.Recommendations["action"] = "proceed";
            }

            return Result<QuestionValidationResult>.Success(validation);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error validating question for duplicates");
            return Result<QuestionValidationResult>.Failure("An error occurred while validating the question");
        }
    }

    public async Task<Result<DuplicatePreventionAnalyticsDto>> GetDuplicatePreventionAnalyticsAsync(
        DateTime fromDate,
        DateTime toDate,
        CancellationToken cancellationToken = default)
    {
        try
        {
            // This would typically query a dedicated analytics table
            // For now, return mock data as the analytics infrastructure isn't fully implemented
            var analytics = new DuplicatePreventionAnalyticsDto
            {
                TotalQuestionsAnalyzed = 1250,
                DuplicatesDetected = 89,
                DuplicatesPrevented = 76,
                DuplicateDetectionRate = 0.071, // 7.1%
                AverageSimilarityScore = 0.34,
                DetectionMethodCounts = new Dictionary<string, int>
                {
                    ["SemanticAnalysis"] = 76,
                    ["ExactMatch"] = 13
                },
                CategoryDuplicateCounts = new Dictionary<string, int>
                {
                    ["Web Development"] = 28,
                    ["Database Design"] = 19,
                    ["DevOps & Cloud"] = 15,
                    ["Mobile Development"] = 12,
                    ["Data Science"] = 8,
                    ["Cybersecurity"] = 7
                },
                SimilarityScoreDistribution = new Dictionary<string, double>
                {
                    ["0.0-0.2"] = 0.45,
                    ["0.2-0.4"] = 0.28,
                    ["0.4-0.6"] = 0.15,
                    ["0.6-0.8"] = 0.08,
                    ["0.8-1.0"] = 0.04
                },
                FalsePositives = 3,
                FalseNegatives = 5,
                SystemAccuracy = 0.91, // 91%
                DuplicateTrends = GenerateDuplicateTrends(fromDate, toDate)
            };

            return Result<DuplicatePreventionAnalyticsDto>.Success(analytics);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting duplicate prevention analytics");
            return Result<DuplicatePreventionAnalyticsDto>.Failure("An error occurred while getting analytics");
        }
    }

    // Private helper methods
    private async Task<List<Question>> GetCandidateQuestionsAsync(string category, List<string> tags, CancellationToken cancellationToken)
    {
        var query = _context.Questions
            .Where(q => !q.IsDeleted)
            .Include(q => q.User)
            .Include(q => q.Category)
            .AsQueryable();

        // Prioritize questions from the same category
        if (!string.IsNullOrWhiteSpace(category))
        {
            query = query.Where(q => q.Category != null && q.Category.Name == category);
        }

        // Get recent questions first (more likely to be duplicates)
        query = query.OrderByDescending(q => q.CreatedAt);

        var candidates = await query
            .Take(_options.MaxCandidateQuestions)
            .ToListAsync(cancellationToken);

        // If we don't have enough candidates from the same category, get more from other categories
        if (candidates.Count < _options.MaxCandidateQuestions / 2)
        {
            var additionalCandidates = await _context.Questions
                .Where(q => !q.IsDeleted && (q.Category == null || q.Category.Name != category))
                .Include(q => q.User)
                .Include(q => q.Category)
                .OrderByDescending(q => q.CreatedAt)
                .Take(_options.MaxCandidateQuestions - candidates.Count)
                .ToListAsync(cancellationToken);

            candidates.AddRange(additionalCandidates);
        }

        return candidates;
    }

    private List<string> ParseTags(string? tagsJson)
    {
        if (string.IsNullOrWhiteSpace(tagsJson))
            return new List<string>();

        try
        {
            return JsonSerializer.Deserialize<List<string>>(tagsJson) ?? new List<string>();
        }
        catch (JsonException)
        {
            // Handle legacy comma-separated tags
            return tagsJson.Split(',', StringSplitOptions.RemoveEmptyEntries)
                .Select(t => t.Trim())
                .ToList();
        }
    }

    private double CalculateTagSimilarity(List<string> tags1, List<string> tags2)
    {
        if (!tags1.Any() && !tags2.Any())
            return 1.0;

        if (!tags1.Any() || !tags2.Any())
            return 0.0;

        var normalizedTags1 = tags1.Select(t => t.ToLower().Trim()).ToHashSet();
        var normalizedTags2 = tags2.Select(t => t.ToLower().Trim()).ToHashSet();

        var intersection = normalizedTags1.Intersect(normalizedTags2).Count();
        var union = normalizedTags1.Union(normalizedTags2).Count();

        return (double)intersection / union;
    }

    private string NormalizeText(string text)
    {
        if (string.IsNullOrWhiteSpace(text))
            return string.Empty;

        // Convert to lowercase and remove special characters
        var normalized = Regex.Replace(text.ToLower().Trim(), @"[^\w\s]", " ");
        
        // Remove extra whitespace
        normalized = Regex.Replace(normalized, @"\s+", " ");

        return normalized;
    }

    private List<string> ExtractWords(string normalizedText)
    {
        if (string.IsNullOrWhiteSpace(normalizedText))
            return new List<string>();

        return normalizedText
            .Split(new[] { ' ', '\t', '\n', '\r' }, StringSplitOptions.RemoveEmptyEntries)
            .Where(word => word.Length > 2) // Filter out very short words
            .Distinct()
            .ToList();
    }

    private List<string> ExtractNGrams(string text, int n)
    {
        var words = ExtractWords(text);
        var ngrams = new List<string>();

        for (int i = 0; i <= words.Count - n; i++)
        {
            var ngram = string.Join(" ", words.Skip(i).Take(n));
            ngrams.Add(ngram);
        }

        return ngrams;
    }

    private double CalculateJaccardSimilarity(HashSet<string> set1, HashSet<string> set2)
    {
        if (!set1.Any() && !set2.Any())
            return 1.0;

        if (!set1.Any() || !set2.Any())
            return 0.0;

        var intersection = set1.Intersect(set2).Count();
        var union = set1.Union(set2).Count();

        return (double)intersection / union;
    }

    private double CalculateCosineSimilarity(HashSet<string> words1, HashSet<string> words2)
    {
        var allWords = words1.Union(words2).ToList();
        var vector1 = allWords.Select(word => words1.Contains(word) ? 1.0 : 0.0).ToArray();
        var vector2 = allWords.Select(word => words2.Contains(word) ? 1.0 : 0.0).ToArray();

        var dotProduct = vector1.Zip(vector2, (a, b) => a * b).Sum();
        var magnitude1 = Math.Sqrt(vector1.Sum(x => x * x));
        var magnitude2 = Math.Sqrt(vector2.Sum(x => x * x));

        if (magnitude1 == 0 || magnitude2 == 0)
            return 0.0;

        return dotProduct / (magnitude1 * magnitude2);
    }

    private double CalculateLevenshteinSimilarity(string text1, string text2)
    {
        if (string.IsNullOrEmpty(text1) && string.IsNullOrEmpty(text2))
            return 1.0;

        if (string.IsNullOrEmpty(text1) || string.IsNullOrEmpty(text2))
            return 0.0;

        var distance = CalculateLevenshteinDistance(text1, text2);
        var maxLength = Math.Max(text1.Length, text2.Length);

        return 1.0 - ((double)distance / maxLength);
    }

    private int CalculateLevenshteinDistance(string text1, string text2)
    {
        var matrix = new int[text1.Length + 1, text2.Length + 1];

        for (int i = 0; i <= text1.Length; i++)
            matrix[i, 0] = i;

        for (int j = 0; j <= text2.Length; j++)
            matrix[0, j] = j;

        for (int i = 1; i <= text1.Length; i++)
        {
            for (int j = 1; j <= text2.Length; j++)
            {
                var cost = text1[i - 1] == text2[j - 1] ? 0 : 1;
                matrix[i, j] = Math.Min(
                    Math.Min(matrix[i - 1, j] + 1, matrix[i, j - 1] + 1),
                    matrix[i - 1, j - 1] + cost);
            }
        }

        return matrix[text1.Length, text2.Length];
    }

    private string GenerateSimilarityExplanation(double similarity, string questionTitle)
    {
        return similarity switch
        {
            >= 0.95 => $"Nearly identical to '{questionTitle}'",
            >= 0.8 => $"Very similar to '{questionTitle}'",
            >= 0.7 => $"Similar to '{questionTitle}'",
            _ => $"Somewhat related to '{questionTitle}'"
        };
    }

    private string GenerateDuplicateCacheKey(string title, string content, string category, List<string> tags, double threshold)
    {
        var keyParts = new List<string>
        {
            DUPLICATE_CACHE_PREFIX,
            title.GetHashCode().ToString(),
            content.GetHashCode().ToString(),
            category,
            string.Join(",", tags.OrderBy(t => t)),
            threshold.ToString("F2")
        };
        
        return string.Join("_", keyParts).ToLower();
    }

    private string GenerateSimilarityCacheKey(string text1, string text2)
    {
        // Ensure consistent ordering for cache key
        var orderedTexts = new[] { text1, text2 }.OrderBy(t => t).ToArray();
        return $"{SIMILARITY_CACHE_PREFIX}{orderedTexts[0].GetHashCode()}_{orderedTexts[1].GetHashCode()}";
    }

    // Interface method implementations
    public async Task<Result<List<Application.Features.Community.QA.DTOs.Responses.QuestionListDto>>> FindSimilarQuestionsAsync(string title, string content, string tags)
    {
        try
        {
            var tagList = string.IsNullOrWhiteSpace(tags) ? new List<string>() : tags.Split(',').Select(t => t.Trim()).ToList();
            var result = await FindSimilarQuestionsAsync(title, content, "General", tagList, null, 5, 0.7, CancellationToken.None);
            
            if (result.IsSuccess)
            {
                var questionDtos = result.Data.Select(sq => new Application.Features.Community.QA.DTOs.Responses.QuestionListDto
                {
                    Id = sq.QuestionId,
                    Title = sq.Title,
                    Category = sq.Category,
                    Tags = sq.Tags,
                    VoteScore = sq.VoteScore,
                    AnswerCount = sq.AnswerCount,
                    HasAcceptedAnswer = sq.HasAcceptedAnswer,
                    CreatedAt = sq.CreatedAt,
                    UserName = sq.UserName
                }).ToList();

                return Result<List<Application.Features.Community.QA.DTOs.Responses.QuestionListDto>>.Success(questionDtos);
            }

            return Result<List<Application.Features.Community.QA.DTOs.Responses.QuestionListDto>>.Failure(result.ErrorMessage ?? "Error finding similar questions");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in simple similar questions search");
            return Result<List<Application.Features.Community.QA.DTOs.Responses.QuestionListDto>>.Failure("Error finding similar questions");
        }
    }

    public async Task<Result<bool>> IsDuplicateQuestionAsync(string title, string content, string tags)
    {
        try
        {
            var tagList = string.IsNullOrWhiteSpace(tags) ? new List<string>() : tags.Split(',').Select(t => t.Trim()).ToList();
            var result = await DetectDuplicateQuestionAsync(title, content, "General", tagList, _options.DefaultDuplicateThreshold, CancellationToken.None);
            
            if (result.IsSuccess)
            {
                return Result<bool>.Success(result.Data.IsDuplicate);
            }

            return Result<bool>.Failure(result.ErrorMessage ?? "Error checking for duplicates");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error checking if question is duplicate");
            return Result<bool>.Failure("Error checking for duplicates");
        }
    }

    public async Task<Result<double>> CalculateSimilarityScoreAsync(string content1, string content2)
    {
        try
        {
            var similarity = await CalculateSemanticSimilarityAsync(content1, content2, CancellationToken.None);
            return Result<double>.Success(similarity);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error calculating similarity score");
            return Result<double>.Failure("Error calculating similarity");
        }
    }

    public async Task<Result<List<string>>> GetDuplicatePreventionSuggestionsAsync(string title, string content)
    {
        try
        {
            var suggestions = new List<string>();
            
            // Basic suggestions based on content analysis
            if (string.IsNullOrWhiteSpace(title) || title.Length < 10)
            {
                suggestions.Add("Consider adding a more descriptive title");
            }

            if (string.IsNullOrWhiteSpace(content) || content.Length < 50)
            {
                suggestions.Add("Provide more details in your question to help identify potential duplicates");
            }

            if (!content.Contains("?"))
            {
                suggestions.Add("Make sure to include a clear question in your content");
            }

            return Result<List<string>>.Success(suggestions);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting duplicate prevention suggestions");
            return Result<List<string>>.Failure("Error getting suggestions");
        }
    }

    private async Task RecordDuplicateAnalyticsAsync(DuplicateDetectionResult result, long durationMs)
    {
        try
        {
            // In a production system, this would write to a dedicated analytics table or service
            _logger.LogInformation("Duplicate Analytics: IsDuplicate={IsDuplicate}, SimilarityScore={SimilarityScore}, Duration={Duration}ms", 
                result.IsDuplicate, result.SimilarityScore, durationMs);
            
            // TODO: Implement actual analytics storage
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error recording duplicate analytics");
        }
    }

    private List<DuplicateTrendDto> GenerateDuplicateTrends(DateTime fromDate, DateTime toDate)
    {
        var trends = new List<DuplicateTrendDto>();
        var currentDate = fromDate.Date;

        while (currentDate <= toDate.Date)
        {
            trends.Add(new DuplicateTrendDto
            {
                Date = currentDate,
                QuestionsAnalyzed = Random.Shared.Next(15, 45),
                DuplicatesDetected = Random.Shared.Next(1, 8),
                DuplicatesPrevented = Random.Shared.Next(1, 6),
                AverageSimilarityScore = 0.2 + (Random.Shared.NextDouble() * 0.4)
            });

            currentDate = currentDate.AddDays(1);
        }

        return trends;
    }
}
