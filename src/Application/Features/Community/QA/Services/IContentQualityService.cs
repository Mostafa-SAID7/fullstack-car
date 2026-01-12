using Application.Features.Community.QA.DTOs.Responses;

namespace Application.Features.Community.QA.Services;

/// <summary>
/// Service for automated content quality assessment, spam detection, and inappropriate content filtering
/// </summary>
public interface IContentQualityService
{
    /// <summary>
    /// Evaluates the quality of a question based on title and content
    /// </summary>
    /// <param name="title">Question title</param>
    /// <param name="content">Question content</param>
    /// <returns>Quality score between 0.0 and 1.0</returns>
    Task<double> EvaluateQuestionQualityAsync(string title, string content);

    /// <summary>
    /// Evaluates the quality of an answer based on content
    /// </summary>
    /// <param name="content">Answer content</param>
    /// <returns>Quality score between 0.0 and 1.0</returns>
    Task<double> EvaluateAnswerQualityAsync(string content);

    /// <summary>
    /// Detects if content is spam using pattern matching and heuristics
    /// </summary>
    /// <param name="content">Content to analyze</param>
    /// <returns>True if content is likely spam</returns>
    Task<bool> IsSpamAsync(string content);

    /// <summary>
    /// Detects inappropriate content and returns list of issues found
    /// </summary>
    /// <param name="content">Content to analyze</param>
    /// <returns>List of inappropriate content categories detected</returns>
    Task<List<string>> DetectInappropriateContentAsync(string content);

    /// <summary>
    /// Validates content meets minimum quality standards
    /// </summary>
    /// <param name="content">Content to validate</param>
    /// <returns>True if content meets quality standards</returns>
    Task<bool> ValidateContentQualityAsync(string content);

    /// <summary>
    /// Gets detailed quality assessment with breakdown of scores
    /// </summary>
    /// <param name="content">Content to assess</param>
    /// <param name="contentType">Type of content (Question, Answer)</param>
    /// <returns>Detailed quality assessment</returns>
    Task<ContentQualityAssessmentDto> GetDetailedQualityAssessmentAsync(string content, string contentType);
}