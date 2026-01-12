using System.Text.RegularExpressions;
using Application.Features.Community.QA.DTOs.Responses;
using Application.Features.Community.QA.Services;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Services.QA;

/// <summary>
/// Comprehensive content quality service for automated assessment, spam detection, and content filtering
/// </summary>
public class ContentQualityService : IContentQualityService
{
    private readonly ILogger<ContentQualityService> _logger;

    // Quality thresholds
    private const double MinimumQualityThreshold = 0.5;
    private const double SpamThreshold = 0.3;
    private const int MinQuestionLength = 50;
    private const int MinAnswerLength = 20;
    private const int MinWordCount = 10;
    private const double MaxCapitalizationRatio = 0.7;
    private const double MinUniqueWordRatio = 0.3;

    // Spam detection patterns
    private static readonly string[] SpamPatterns = {
        @"(buy|purchase|order)\s+(now|today|here)",
        @"(click|visit)\s+(here|this\s+link)",
        @"(free|cheap|discount)\s+(offer|deal|price)",
        @"(earn|make)\s+\$?\d+\s+(daily|weekly|monthly)",
        @"(guaranteed|100%)\s+(success|money|profit)",
        @"(work\s+from\s+home|make\s+money\s+online)",
        @"(limited\s+time|act\s+now|hurry)",
        @"(no\s+experience\s+required|easy\s+money)"
    };

    // Inappropriate content patterns
    private static readonly string[] InappropriatePatterns = {
        @"\b(hack|hacking|crack|cracking)\s+(into|system|password|account)\b",
        @"\b(pirate|piracy|illegal\s+download|torrent)\b",
        @"\b(drug|drugs|marijuana|cocaine|heroin)\s+(buy|sell|dealer)\b",
        @"\b(violence|violent|kill|murder|bomb|terrorist)\b",
        @"\b(hate\s+speech|racist|discrimination)\b"
    };

    // Profanity patterns (basic set)
    private static readonly string[] ProfanityPatterns = {
        @"\b(damn|hell|crap|stupid|idiot|moron)\b",
        @"\b(f\*ck|sh\*t|b\*tch|a\*s)\b"
    };

    // Positive technical indicators
    private static readonly string[] TechnicalIndicators = {
        "```", "<code>", "function", "class", "interface", "algorithm",
        "implementation", "solution", "example", "documentation",
        "best practice", "performance", "optimization", "security"
    };

    public ContentQualityService(ILogger<ContentQualityService> logger)
    {
        _logger = logger;
    }

    public async Task<double> EvaluateQuestionQualityAsync(string title, string content)
    {
        try
        {
            double score = 1.0;

            // Title quality checks
            if (string.IsNullOrWhiteSpace(title))
            {
                score -= 0.5;
            }
            else
            {
                if (title.Length < 10) score -= 0.2;
                if (title.Length > 200) score -= 0.1;
                if (title.All(char.IsUpper)) score -= 0.3; // All caps title
                if (!title.Contains('?') && !title.Contains("how") && !title.Contains("what") && !title.Contains("why")) score -= 0.1;
            }

            // Content quality checks
            if (string.IsNullOrWhiteSpace(content))
            {
                score -= 0.6;
            }
            else
            {
                if (content.Length < MinQuestionLength) score -= 0.3;
                if (content.Length > 5000) score -= 0.1;

                var wordCount = GetWordCount(content);
                if (wordCount < MinWordCount) score -= 0.2;

                // Check for proper structure
                if (content.Contains("1.") || content.Contains("2.") || content.Contains("-")) score += 0.1;
                if (content.Contains("?")) score += 0.05;
            }

            // Apply common quality checks
            score = await ApplyCommonQualityChecksAsync(content, score);

            return Math.Max(0, Math.Min(1, score));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error evaluating question quality");
            return 0.5; // Default neutral score on error
        }
    }

    public async Task<double> EvaluateAnswerQualityAsync(string content)
    {
        try
        {
            double score = 1.0;

            if (string.IsNullOrWhiteSpace(content))
            {
                return 0.0;
            }

            // Length checks
            if (content.Length < MinAnswerLength) score -= 0.3;
            if (content.Length > 10000) score -= 0.1;

            var wordCount = GetWordCount(content);
            if (wordCount < MinWordCount) score -= 0.2;

            // Check for technical content indicators (positive)
            foreach (var indicator in TechnicalIndicators)
            {
                if (content.Contains(indicator, StringComparison.OrdinalIgnoreCase))
                {
                    score += 0.05;
                }
            }

            // Check for code examples (positive indicator)
            if (content.Contains("```") || content.Contains("<code>") || content.Contains("function") || content.Contains("class"))
            {
                score += 0.1;
            }

            // Check for external links (can be positive or negative)
            var linkCount = Regex.Matches(content, @"https?://").Count;
            if (linkCount > 0 && linkCount <= 3) score += 0.05;
            if (linkCount > 5) score -= 0.2;

            // Check for step-by-step explanations
            if (content.Contains("step") || content.Contains("first") || content.Contains("then") || content.Contains("finally"))
            {
                score += 0.05;
            }

            // Apply common quality checks
            score = await ApplyCommonQualityChecksAsync(content, score);

            return Math.Max(0, Math.Min(1, score));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error evaluating answer quality");
            return 0.5; // Default neutral score on error
        }
    }

    public async Task<bool> IsSpamAsync(string content)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(content))
                return false;

            var lowerContent = content.ToLower();

            // Check spam patterns
            foreach (var pattern in SpamPatterns)
            {
                if (Regex.IsMatch(lowerContent, pattern, RegexOptions.IgnoreCase))
                {
                    _logger.LogInformation("Spam pattern detected: {Pattern}", pattern);
                    return true;
                }
            }

            // Check for excessive repetition
            var words = lowerContent.Split(new[] { ' ', '\t', '\n', '\r' }, StringSplitOptions.RemoveEmptyEntries);
            if (words.Length > 0)
            {
                var wordGroups = words.GroupBy(w => w).Where(g => g.Count() > Math.Max(5, words.Length / 4));
                if (wordGroups.Any())
                {
                    _logger.LogInformation("Excessive word repetition detected");
                    return true;
                }
            }

            // Check for excessive links
            var linkCount = Regex.Matches(content, @"https?://").Count;
            if (linkCount > 10)
            {
                _logger.LogInformation("Excessive links detected: {LinkCount}", linkCount);
                return true;
            }

            // Check for promotional language density
            var promotionalWords = new[] { "buy", "sell", "cheap", "free", "discount", "offer", "deal", "promotion", "sale" };
            var promotionalCount = promotionalWords.Count(word => lowerContent.Contains(word));
            if (promotionalCount > 3)
            {
                _logger.LogInformation("High promotional language density detected");
                return true;
            }

            return false;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error detecting spam");
            return false; // Default to not spam on error
        }
    }

    public async Task<List<string>> DetectInappropriateContentAsync(string content)
    {
        var issues = new List<string>();

        try
        {
            if (string.IsNullOrWhiteSpace(content))
                return issues;

            var lowerContent = content.ToLower();

            // Check inappropriate content patterns
            foreach (var pattern in InappropriatePatterns)
            {
                if (Regex.IsMatch(lowerContent, pattern, RegexOptions.IgnoreCase))
                {
                    issues.Add("Potentially harmful or illegal content");
                    break;
                }
            }

            // Check profanity patterns
            foreach (var pattern in ProfanityPatterns)
            {
                if (Regex.IsMatch(lowerContent, pattern, RegexOptions.IgnoreCase))
                {
                    issues.Add("Inappropriate language");
                    break;
                }
            }

            // Check for excessive capitalization (shouting)
            var upperCaseCount = content.Count(char.IsUpper);
            var letterCount = content.Count(char.IsLetter);
            if (letterCount > 0 && (double)upperCaseCount / letterCount > MaxCapitalizationRatio)
            {
                issues.Add("Excessive capitalization");
            }

            // Check for personal attacks or harassment
            var harassmentPatterns = new[] { "you are stupid", "you're an idiot", "shut up", "go away" };
            if (harassmentPatterns.Any(pattern => lowerContent.Contains(pattern)))
            {
                issues.Add("Personal attack or harassment");
            }

            return issues;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error detecting inappropriate content");
            return issues;
        }
    }

    public async Task<bool> ValidateContentQualityAsync(string content)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(content))
                return false;

            // Basic length check
            if (content.Length < MinAnswerLength)
                return false;

            // Check minimum word count
            var wordCount = GetWordCount(content);
            if (wordCount < MinWordCount)
                return false;

            // Check for spam
            if (await IsSpamAsync(content))
                return false;

            // Check for inappropriate content
            var inappropriateContent = await DetectInappropriateContentAsync(content);
            if (inappropriateContent.Any())
                return false;

            // Check for excessive repetition
            var words = content.ToLower().Split(new[] { ' ', '\t', '\n', '\r' }, StringSplitOptions.RemoveEmptyEntries);
            if (words.Length > 0)
            {
                var uniqueWords = words.Distinct().Count();
                if ((double)uniqueWords / words.Length < MinUniqueWordRatio)
                    return false;
            }

            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error validating content quality");
            return false;
        }
    }

    public async Task<ContentQualityAssessmentDto> GetDetailedQualityAssessmentAsync(string content, string contentType)
    {
        var assessment = new ContentQualityAssessmentDto();

        try
        {
            if (string.IsNullOrWhiteSpace(content))
            {
                assessment.OverallScore = 0.0;
                assessment.MeetsQualityStandards = false;
                assessment.QualityIssues.Add("Content is empty");
                return assessment;
            }

            // Calculate individual scores
            assessment.QualityScores.LengthScore = CalculateLengthScore(content, contentType);
            assessment.QualityScores.ReadabilityScore = CalculateReadabilityScore(content);
            assessment.QualityScores.TechnicalScore = CalculateTechnicalScore(content);
            assessment.QualityScores.SpamScore = await CalculateSpamScore(content);
            assessment.QualityScores.AppropriatenessScore = await CalculateAppropriatenessScore(content);
            assessment.QualityScores.EngagementScore = CalculateEngagementScore(content);

            // Calculate overall score
            assessment.OverallScore = (
                assessment.QualityScores.LengthScore * 0.15 +
                assessment.QualityScores.ReadabilityScore * 0.20 +
                assessment.QualityScores.TechnicalScore * 0.15 +
                assessment.QualityScores.SpamScore * 0.25 +
                assessment.QualityScores.AppropriatenessScore * 0.20 +
                assessment.QualityScores.EngagementScore * 0.05
            );

            // Set flags
            assessment.IsSpam = await IsSpamAsync(content);
            assessment.InappropriateContentFlags = await DetectInappropriateContentAsync(content);
            assessment.MeetsQualityStandards = assessment.OverallScore >= MinimumQualityThreshold && 
                                               !assessment.IsSpam && 
                                               !assessment.InappropriateContentFlags.Any();

            // Generate recommendations and identify issues
            GenerateQualityFeedback(assessment, content, contentType);

            return assessment;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating detailed quality assessment");
            assessment.OverallScore = 0.5;
            assessment.QualityIssues.Add("Error occurred during quality assessment");
            return assessment;
        }
    }

    #region Private Helper Methods

    private async Task<double> ApplyCommonQualityChecksAsync(string content, double currentScore)
    {
        // Check for spam
        if (await IsSpamAsync(content))
        {
            currentScore -= 0.5;
        }

        // Check for inappropriate content
        var inappropriateContent = await DetectInappropriateContentAsync(content);
        if (inappropriateContent.Any())
        {
            currentScore -= 0.4;
        }

        // Check for excessive capitalization
        var upperCaseCount = content.Count(char.IsUpper);
        var letterCount = content.Count(char.IsLetter);
        if (letterCount > 0 && (double)upperCaseCount / letterCount > MaxCapitalizationRatio)
        {
            currentScore -= 0.2;
        }

        // Check for unique word ratio
        var words = content.ToLower().Split(new[] { ' ', '\t', '\n', '\r' }, StringSplitOptions.RemoveEmptyEntries);
        if (words.Length > 0)
        {
            var uniqueWords = words.Distinct().Count();
            if ((double)uniqueWords / words.Length < MinUniqueWordRatio)
            {
                currentScore -= 0.3;
            }
        }

        return currentScore;
    }

    private int GetWordCount(string content)
    {
        if (string.IsNullOrWhiteSpace(content))
            return 0;

        return content.Split(new[] { ' ', '\t', '\n', '\r' }, StringSplitOptions.RemoveEmptyEntries).Length;
    }

    private double CalculateLengthScore(string content, string contentType)
    {
        var length = content.Length;
        var wordCount = GetWordCount(content);

        if (contentType.Equals("Question", StringComparison.OrdinalIgnoreCase))
        {
            if (length < 30) return 0.2;
            if (length < MinQuestionLength) return 0.5;
            if (length > 5000) return 0.8;
            return 1.0;
        }
        else // Answer
        {
            if (length < MinAnswerLength) return 0.3;
            if (length < 50) return 0.6;
            if (length > 10000) return 0.8;
            return 1.0;
        }
    }

    private double CalculateReadabilityScore(string content)
    {
        var sentences = content.Split(new[] { '.', '!', '?' }, StringSplitOptions.RemoveEmptyEntries).Length;
        var words = GetWordCount(content);
        
        if (words == 0) return 0.0;

        // Simple readability heuristics
        var avgWordsPerSentence = (double)words / Math.Max(1, sentences);
        var score = 1.0;

        // Penalize very long or very short sentences
        if (avgWordsPerSentence > 30) score -= 0.2;
        if (avgWordsPerSentence < 5) score -= 0.1;

        // Check for proper punctuation
        if (!content.Contains('.') && !content.Contains('!') && !content.Contains('?'))
            score -= 0.2;

        return Math.Max(0, score);
    }

    private double CalculateTechnicalScore(string content)
    {
        var score = 0.5; // Base score

        // Check for technical indicators
        var technicalCount = TechnicalIndicators.Count(indicator => 
            content.Contains(indicator, StringComparison.OrdinalIgnoreCase));

        score += Math.Min(0.5, technicalCount * 0.1);

        return Math.Min(1.0, score);
    }

    private async Task<double> CalculateSpamScore(string content)
    {
        return await IsSpamAsync(content) ? 0.0 : 1.0;
    }

    private async Task<double> CalculateAppropriatenessScore(string content)
    {
        var issues = await DetectInappropriateContentAsync(content);
        return issues.Any() ? 0.0 : 1.0;
    }

    private double CalculateEngagementScore(string content)
    {
        var score = 0.5; // Base score

        // Check for engaging elements
        if (content.Contains("?")) score += 0.1;
        if (content.Contains("example") || content.Contains("for instance")) score += 0.1;
        if (content.Contains("```") || content.Contains("<code>")) score += 0.2;
        if (content.Contains("step") || content.Contains("first") || content.Contains("then")) score += 0.1;

        return Math.Min(1.0, score);
    }

    private void GenerateQualityFeedback(ContentQualityAssessmentDto assessment, string content, string contentType)
    {
        // Identify issues
        if (assessment.QualityScores.LengthScore < 0.5)
        {
            assessment.QualityIssues.Add($"Content is too short for a {contentType.ToLower()}");
            assessment.Recommendations.Add($"Expand your {contentType.ToLower()} with more details and examples");
        }

        if (assessment.QualityScores.ReadabilityScore < 0.5)
        {
            assessment.QualityIssues.Add("Content has readability issues");
            assessment.Recommendations.Add("Use proper punctuation and break up long sentences");
        }

        if (assessment.QualityScores.TechnicalScore < 0.5 && contentType.Equals("Answer", StringComparison.OrdinalIgnoreCase))
        {
            assessment.QualityIssues.Add("Answer lacks technical depth");
            assessment.Recommendations.Add("Include code examples, technical explanations, or references");
        }

        if (assessment.IsSpam)
        {
            assessment.QualityIssues.Add("Content appears to be spam");
            assessment.Recommendations.Add("Remove promotional language and focus on providing helpful information");
        }

        if (assessment.InappropriateContentFlags.Any())
        {
            assessment.QualityIssues.AddRange(assessment.InappropriateContentFlags);
            assessment.Recommendations.Add("Remove inappropriate content and maintain professional language");
        }

        // Identify positive indicators
        if (content.Contains("```") || content.Contains("<code>"))
        {
            assessment.PositiveIndicators.Add("Contains code examples");
        }

        if (content.Contains("step") || content.Contains("first") || content.Contains("then"))
        {
            assessment.PositiveIndicators.Add("Provides step-by-step guidance");
        }

        if (assessment.QualityScores.LengthScore > 0.8)
        {
            assessment.PositiveIndicators.Add("Good content length");
        }

        if (assessment.QualityScores.TechnicalScore > 0.7)
        {
            assessment.PositiveIndicators.Add("Strong technical content");
        }
    }

    #endregion
}