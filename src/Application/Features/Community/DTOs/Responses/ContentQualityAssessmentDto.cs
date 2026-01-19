namespace Application.Features.Community.DTOs.Responses;

/// <summary>
/// Detailed content quality assessment with breakdown of scores and issues
/// </summary>
public class ContentQualityAssessmentDto
{
    /// <summary>
    /// Overall quality score (0.0 to 1.0)
    /// </summary>
    public double OverallScore { get; set; }

    /// <summary>
    /// Whether content meets minimum quality standards
    /// </summary>
    public bool MeetsQualityStandards { get; set; }

    /// <summary>
    /// Whether content is flagged as spam
    /// </summary>
    public bool IsSpam { get; set; }

    /// <summary>
    /// List of inappropriate content categories detected
    /// </summary>
    public List<string> InappropriateContentFlags { get; set; } = new();

    /// <summary>
    /// Breakdown of quality scores by category
    /// </summary>
    public ContentQualityScoresDto QualityScores { get; set; } = new();

    /// <summary>
    /// List of quality issues found
    /// </summary>
    public List<string> QualityIssues { get; set; } = new();

    /// <summary>
    /// List of positive quality indicators found
    /// </summary>
    public List<string> PositiveIndicators { get; set; } = new();

    /// <summary>
    /// Recommendations for improving content quality
    /// </summary>
    public List<string> Recommendations { get; set; } = new();
}

/// <summary>
/// Breakdown of quality scores by different assessment categories
/// </summary>
public class ContentQualityScoresDto
{
    /// <summary>
    /// Length and structure score (0.0 to 1.0)
    /// </summary>
    public double LengthScore { get; set; }

    /// <summary>
    /// Grammar and readability score (0.0 to 1.0)
    /// </summary>
    public double ReadabilityScore { get; set; }

    /// <summary>
    /// Technical content quality score (0.0 to 1.0)
    /// </summary>
    public double TechnicalScore { get; set; }

    /// <summary>
    /// Spam detection score (0.0 = likely spam, 1.0 = not spam)
    /// </summary>
    public double SpamScore { get; set; }

    /// <summary>
    /// Appropriateness score (0.0 = inappropriate, 1.0 = appropriate)
    /// </summary>
    public double AppropriatenessScore { get; set; }

    /// <summary>
    /// Engagement potential score (0.0 to 1.0)
    /// </summary>
    public double EngagementScore { get; set; }
}
