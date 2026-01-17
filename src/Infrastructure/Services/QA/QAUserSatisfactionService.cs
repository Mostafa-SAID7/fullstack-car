using Application.Features.QA.DTOs;
using Domain.Entities.Community.QA;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Services.QA;
public interface IQAUserSatisfactionService
{
    Task<QAUserSatisfactionDto> GetSatisfactionMetricsAsync(DateTime? startDate = null, DateTime? endDate = null);
    Task RecordUserFeedbackAsync(Guid userId, string feedbackType, int rating, string? comment = null);
    Task RecordQuestionSatisfactionAsync(Guid questionId, Guid userId, bool wasSatisfied, string? reason = null);
    Task RecordAnswerHelpfulnessAsync(Guid answerId, Guid userId, bool wasHelpful, string? feedback = null);
    Task<QAFeedbackSummaryDto> GetFeedbackSummaryAsync(DateTime? startDate = null, DateTime? endDate = null);
    Task<List<QAUserFeedbackDto>> GetRecentFeedbackAsync(int count = 50);
    Task TriggerSatisfactionSurveyAsync(Guid userId);
}

public class QAUserSatisfactionService : IQAUserSatisfactionService
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<QAUserSatisfactionService> _logger;
    private readonly IQAAlertService _alertService;

    public QAUserSatisfactionService(
        ApplicationDbContext context,
        ILogger<QAUserSatisfactionService> logger,
        IQAAlertService alertService)
    {
        _context = context;
        _logger = logger;
        _alertService = alertService;
    }

    public async Task<QAUserSatisfactionDto> GetSatisfactionMetricsAsync(DateTime? startDate = null, DateTime? endDate = null)
    {
        try
        {
            var start = startDate ?? DateTime.UtcNow.AddDays(-30);
            var end = endDate ?? DateTime.UtcNow;

            _logger.LogInformation("Calculating QA user satisfaction metrics from {StartDate} to {EndDate}", start, end);

            // Get basic satisfaction metrics
            var totalAnswers = await _context.Answers
                .CountAsync(a => a.CreatedAt >= start && a.CreatedAt <= end && !a.IsDeleted);
            
            var acceptedAnswers = await _context.Answers
                .CountAsync(a => a.CreatedAt >= start && a.CreatedAt <= end && a.IsAccepted && !a.IsDeleted);

            var acceptanceRate = totalAnswers > 0 ? (double)acceptedAnswers / totalAnswers * 100 : 0;

            // Get user engagement metrics
            var activeUsers = await _context.QAUserActivities
                .Where(ua => ua.CreatedAt >= start && ua.CreatedAt <= end)
                .Select(ua => ua.UserId)
                .Distinct()
                .CountAsync();

            var totalUsers = await _context.UserReputations.CountAsync();
            var engagementRate = totalUsers > 0 ? (double)activeUsers / totalUsers * 100 : 0;

            // Get average scores as satisfaction indicators
            var avgQuestionScore = await _context.Questions
                .Where(q => q.CreatedAt >= start && q.CreatedAt <= end && !q.IsDeleted)
                .AverageAsync(q => (double?)(q.UpvotesCount - q.DownvotesCount)) ?? 0;

            var avgAnswerScore = await _context.Answers
                .Where(a => a.CreatedAt >= start && a.CreatedAt <= end && !a.IsDeleted)
                .AverageAsync(a => (double?)(a.UpvotesCount - a.DownvotesCount)) ?? 0;

            // Get feedback metrics if available
            var feedbackSummary = await GetFeedbackSummaryAsync(start, end);

            // Calculate overall satisfaction score (weighted average)
            var overallSatisfaction = CalculateOverallSatisfaction(
                acceptanceRate, 
                engagementRate, 
                avgQuestionScore, 
                avgAnswerScore, 
                feedbackSummary?.AverageRating ?? 0);

            // Get satisfaction trend
            var satisfactionTrend = await GetSatisfactionTrendAsync(start, end);

            var result = new QAUserSatisfactionDto
            {
                Timestamp = DateTime.UtcNow,
                OverallSatisfactionScore = overallSatisfaction,
                AnswerAcceptanceRate = acceptanceRate,
                UserEngagementRate = engagementRate,
                AverageQuestionScore = avgQuestionScore,
                AverageAnswerScore = avgAnswerScore,
                ActiveUsers30Days = activeUsers,
                TotalUsers = totalUsers,
                SatisfactionTrend = satisfactionTrend,
                FeedbackSummary = feedbackSummary
            };

            // Check if satisfaction is below threshold and alert if needed
            if (overallSatisfaction < 50) // Critical threshold
            {
                await _alertService.SendPerformanceAlertAsync(
                    "User Satisfaction", 
                    overallSatisfaction, 
                    50, 
                    "Critical");
            }
            else if (overallSatisfaction < 70) // Warning threshold
            {
                await _alertService.SendPerformanceAlertAsync(
                    "User Satisfaction", 
                    overallSatisfaction, 
                    70, 
                    "Warning");
            }

            return result;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error calculating QA user satisfaction metrics");
            throw;
        }
    }

    public async Task RecordUserFeedbackAsync(Guid userId, string feedbackType, int rating, string? comment = null)
    {
        try
        {
            if (rating < 1 || rating > 5)
            {
                throw new ArgumentException("Rating must be between 1 and 5", nameof(rating));
            }

            _logger.LogInformation("Recording QA user feedback: User {UserId}, Type {FeedbackType}, Rating {Rating}", 
                userId, feedbackType, rating);

            // Create feedback record (would need to create QAUserFeedback entity)
            var feedback = new QAUserFeedback
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                FeedbackType = feedbackType,
                Rating = rating,
                Comment = comment,
                CreatedAt = DateTime.UtcNow
            };

            _context.QAUserFeedback.Add(feedback);
            await _context.SaveChangesAsync();

            // Record activity
            var activity = new QAUserActivity
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                ActivityType = "FeedbackGiven",
                ContentId = feedback.Id,
                Category = feedbackType,
                ReputationChange = 0,
                CreatedAt = DateTime.UtcNow
            };

            _context.QAUserActivities.Add(activity);
            await _context.SaveChangesAsync();

            _logger.LogInformation("QA user feedback recorded successfully: {FeedbackId}", feedback.Id);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error recording QA user feedback for user {UserId}", userId);
            throw;
        }
    }

    public async Task RecordQuestionSatisfactionAsync(Guid questionId, Guid userId, bool wasSatisfied, string? reason = null)
    {
        try
        {
            _logger.LogInformation("Recording question satisfaction: Question {QuestionId}, User {UserId}, Satisfied {WasSatisfied}", 
                questionId, userId, wasSatisfied);

            // Record satisfaction feedback
            await RecordUserFeedbackAsync(
                userId, 
                "QuestionSatisfaction", 
                wasSatisfied ? 5 : 2, 
                reason);

            // Update question metadata if needed
            var question = await _context.Questions.FindAsync(questionId);
            if (question != null)
            {
                // Could add satisfaction tracking fields to Question entity
                _logger.LogDebug("Question satisfaction recorded for question {QuestionId}", questionId);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error recording question satisfaction for question {QuestionId}", questionId);
            throw;
        }
    }

    public async Task RecordAnswerHelpfulnessAsync(Guid answerId, Guid userId, bool wasHelpful, string? feedback = null)
    {
        try
        {
            _logger.LogInformation("Recording answer helpfulness: Answer {AnswerId}, User {UserId}, Helpful {WasHelpful}", 
                answerId, userId, wasHelpful);

            // Record helpfulness feedback
            await RecordUserFeedbackAsync(
                userId, 
                "AnswerHelpfulness", 
                wasHelpful ? 5 : 2, 
                feedback);

            // Update answer metadata if needed
            var answer = await _context.Answers.FindAsync(answerId);
            if (answer != null)
            {
                // Could add helpfulness tracking fields to Answer entity
                _logger.LogDebug("Answer helpfulness recorded for answer {AnswerId}", answerId);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error recording answer helpfulness for answer {AnswerId}", answerId);
            throw;
        }
    }

    public async Task<QAFeedbackSummaryDto> GetFeedbackSummaryAsync(DateTime? startDate = null, DateTime? endDate = null)
    {
        try
        {
            var start = startDate ?? DateTime.UtcNow.AddDays(-30);
            var end = endDate ?? DateTime.UtcNow;

            // Get feedback data (would need QAUserFeedback entity)
            var feedbackQuery = _context.QAUserFeedback
                .Where(f => f.CreatedAt >= start && f.CreatedAt <= end);

            var totalResponses = await feedbackQuery.CountAsync();
            
            if (totalResponses == 0)
            {
                return new QAFeedbackSummaryDto
                {
                    TotalResponses = 0,
                    AverageRating = 0,
                    RatingDistribution = new Dictionary<string, int>(),
                    CommonComplaints = new List<string>(),
                    CommonPraises = new List<string>(),
                    LastSurveyDate = DateTime.MinValue
                };
            }

            var averageRating = await feedbackQuery.AverageAsync(f => (double)f.Rating);

            // Get rating distribution
            var ratingDistribution = await feedbackQuery
                .GroupBy(f => f.Rating)
                .Select(g => new { Rating = g.Key, Count = g.Count() })
                .ToDictionaryAsync(x => x.Rating.ToString(), x => x.Count);

            // Analyze comments for common themes (simplified implementation)
            var comments = await feedbackQuery
                .Where(f => !string.IsNullOrEmpty(f.Comment))
                .Select(f => f.Comment!)
                .ToListAsync();

            var commonComplaints = ExtractCommonThemes(comments.Where(c => c.Contains("slow") || c.Contains("difficult") || c.Contains("confusing")).ToList());
            var commonPraises = ExtractCommonThemes(comments.Where(c => c.Contains("great") || c.Contains("helpful") || c.Contains("excellent")).ToList());

            var lastSurveyDate = await feedbackQuery.MaxAsync(f => (DateTime?)f.CreatedAt) ?? DateTime.MinValue;

            return new QAFeedbackSummaryDto
            {
                TotalResponses = totalResponses,
                AverageRating = averageRating,
                RatingDistribution = ratingDistribution,
                CommonComplaints = commonComplaints,
                CommonPraises = commonPraises,
                LastSurveyDate = lastSurveyDate
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting QA feedback summary");
            throw;
        }
    }

    public async Task<List<QAUserFeedbackDto>> GetRecentFeedbackAsync(int count = 50)
    {
        try
        {
            var feedback = await _context.QAUserFeedback
                .OrderByDescending(f => f.CreatedAt)
                .Take(count)
                .Select(f => new QAUserFeedbackDto
                {
                    Id = f.Id,
                    UserId = f.UserId,
                    FeedbackType = f.FeedbackType,
                    Rating = f.Rating,
                    Comment = f.Comment,
                    CreatedAt = f.CreatedAt
                })
                .ToListAsync();

            return feedback;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting recent QA feedback");
            throw;
        }
    }

    public async Task TriggerSatisfactionSurveyAsync(Guid userId)
    {
        try
        {
            _logger.LogInformation("Triggering satisfaction survey for user {UserId}", userId);

            // Check if user has been surveyed recently (within last 30 days)
            var recentSurvey = await _context.QAUserFeedback
                .Where(f => f.UserId == userId && f.FeedbackType == "SatisfactionSurvey")
                .Where(f => f.CreatedAt >= DateTime.UtcNow.AddDays(-30))
                .AnyAsync();

            if (recentSurvey)
            {
                _logger.LogDebug("User {UserId} was recently surveyed, skipping", userId);
                return;
            }

            // Create survey trigger record
            var surveyTrigger = new QAUserFeedback
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                FeedbackType = "SurveyTriggered",
                Rating = 0, // Not applicable for trigger
                Comment = "Satisfaction survey triggered",
                CreatedAt = DateTime.UtcNow
            };

            _context.QAUserFeedback.Add(surveyTrigger);
            await _context.SaveChangesAsync();

            // In a real implementation, this would trigger an email or in-app notification
            // For now, we'll just log it
            _logger.LogInformation("Satisfaction survey triggered for user {UserId}", userId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error triggering satisfaction survey for user {UserId}", userId);
            throw;
        }
    }

    #region Private Helper Methods

    private double CalculateOverallSatisfaction(
        double acceptanceRate, 
        double engagementRate, 
        double avgQuestionScore, 
        double avgAnswerScore, 
        double feedbackRating)
    {
        // Weighted calculation of overall satisfaction
        var weights = new
        {
            AcceptanceRate = 0.3,      // 30% - Most important indicator
            EngagementRate = 0.25,     // 25% - User activity level
            QuestionScore = 0.15,      // 15% - Question quality perception
            AnswerScore = 0.15,        // 15% - Answer quality perception
            FeedbackRating = 0.15      // 15% - Direct feedback
        };

        // Normalize scores to 0-100 scale
        var normalizedQuestionScore = Math.Max(0, (avgQuestionScore + 5) * 10); // Assuming -5 to +5 vote range
        var normalizedAnswerScore = Math.Max(0, (avgAnswerScore + 5) * 10);
        var normalizedFeedbackRating = feedbackRating * 20; // Convert 1-5 scale to 0-100

        var overallScore = 
            (acceptanceRate * weights.AcceptanceRate) +
            (engagementRate * weights.EngagementRate) +
            (normalizedQuestionScore * weights.QuestionScore) +
            (normalizedAnswerScore * weights.AnswerScore) +
            (normalizedFeedbackRating * weights.FeedbackRating);

        return Math.Min(100, Math.Max(0, overallScore));
    }

    private async Task<List<QAMetricDataPointDto>> GetSatisfactionTrendAsync(DateTime startDate, DateTime endDate)
    {
        try
        {
            var trends = new List<QAMetricDataPointDto>();
            var days = (int)(endDate - startDate).TotalDays;
            var interval = Math.Max(1, days / 7); // Show max 7 data points

            for (var date = startDate; date <= endDate; date = date.AddDays(interval))
            {
                var nextDate = date.AddDays(interval);
                
                var dayAnswers = await _context.Answers
                    .CountAsync(a => a.CreatedAt >= date && a.CreatedAt < nextDate && !a.IsDeleted);
                
                var dayAccepted = await _context.Answers
                    .CountAsync(a => a.CreatedAt >= date && a.CreatedAt < nextDate && a.IsAccepted && !a.IsDeleted);

                var dayAcceptanceRate = dayAnswers > 0 ? (double)dayAccepted / dayAnswers * 100 : 0;

                trends.Add(new QAMetricDataPointDto
                {
                    Date = date,
                    Value = dayAcceptanceRate,
                    Label = date.ToString("MMM dd")
                });
            }

            return trends;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error calculating satisfaction trend");
            return new List<QAMetricDataPointDto>();
        }
    }

    private List<string> ExtractCommonThemes(List<string> comments)
    {
        // Simplified theme extraction - in a real implementation, this would use NLP
        var themes = new Dictionary<string, int>();
        var commonWords = new[] { "slow", "fast", "difficult", "easy", "confusing", "clear", "helpful", "useless", "great", "terrible" };

        foreach (var comment in comments)
        {
            var lowerComment = comment.ToLower();
            foreach (var word in commonWords)
            {
                if (lowerComment.Contains(word))
                {
                    themes[word] = themes.GetValueOrDefault(word, 0) + 1;
                }
            }
        }

        return themes
            .Where(kvp => kvp.Value >= 2) // At least 2 mentions
            .OrderByDescending(kvp => kvp.Value)
            .Take(5)
            .Select(kvp => $"{kvp.Key} ({kvp.Value} mentions)")
            .ToList();
    }

    #endregion
}
public class QAUserFeedbackDto
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string FeedbackType { get; set; } = string.Empty;
    public int Rating { get; set; }
    public string? Comment { get; set; }
    public DateTime CreatedAt { get; set; }
}