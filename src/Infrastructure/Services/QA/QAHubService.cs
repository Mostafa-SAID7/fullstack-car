using Application.Features.Community.QA.DTOs.Responses;
using Application.Features.Community.QA.Interfaces;
using Infrastructure.Hubs;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Services.QA;

/// <summary>
/// Service for sending real-time QA notifications through SignalR
/// Provides unified communication for both Angular and React clients
/// </summary>
public interface IQAHubService
{
    Task NotifyNewAnswerAsync(AnswerDto answer);
    Task NotifyVoteUpdateAsync(VoteUpdateDto voteUpdate);
    Task NotifyQuestionUpdateAsync(QuestionDto question);
    Task NotifyAnswerAcceptedAsync(AnswerAcceptedDto answerAccepted);
    Task NotifyReputationUpdateAsync(ReputationUpdateDto reputationUpdate);
    Task NotifyQuestionClosedAsync(QuestionClosedDto questionClosed);
    Task NotifyExpertsAsync(ExpertNotificationDto expertNotification);
    Task NotifyQuestionViewUpdateAsync(QuestionViewUpdateDto viewUpdate);
    Task NotifyNewQuestionToCategoryAsync(NewQuestionNotificationDto notification, string category);
    Task SendConnectionStatusAsync(ConnectionStatusDto connectionStatus);
}

public class QAHubService : IQAHubService
{
    private readonly IHubContext<QAHub, IQAHub> _hubContext;
    private readonly ILogger<QAHubService> _logger;

    public QAHubService(
        IHubContext<QAHub, IQAHub> hubContext,
        ILogger<QAHubService> logger)
    {
        _hubContext = hubContext;
        _logger = logger;
    }

    /// <summary>
    /// Notify all users viewing a question about a new answer
    /// </summary>
    public async Task NotifyNewAnswerAsync(AnswerDto answer)
    {
        try
        {
            // Notify users viewing the specific question
            await _hubContext.Clients.Group($"question_{answer.QuestionId}")
                .ReceiveNewAnswer(answer);

            // Notify the question author directly
            await _hubContext.Clients.Group($"user_{answer.UserId}")
                .ReceiveNewAnswer(answer);

            _logger.LogInformation("QA Hub: Sent new answer notification for question {QuestionId} by user {UserId}", 
                answer.QuestionId, answer.UserId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "QA Hub: Failed to send new answer notification for question {QuestionId}", 
                answer.QuestionId);
            throw;
        }
    }

    /// <summary>
    /// Notify users about vote updates on questions or answers
    /// </summary>
    public async Task NotifyVoteUpdateAsync(VoteUpdateDto voteUpdate)
    {
        try
        {
            if (voteUpdate.ContentType == "Question")
            {
                // Notify users viewing the question
                await _hubContext.Clients.Group($"question_{voteUpdate.ContentId}")
                    .ReceiveVoteUpdate(voteUpdate);
            }
            else if (voteUpdate.ContentType == "Answer")
            {
                // For answers, we need to notify users viewing the parent question
                // This would require the QuestionId to be included in the VoteUpdateDto
                // For now, we'll use a more general approach
                await _hubContext.Clients.All
                    .ReceiveVoteUpdate(voteUpdate);
            }

            _logger.LogInformation("QA Hub: Sent vote update notification for {ContentType} {ContentId}", 
                voteUpdate.ContentType, voteUpdate.ContentId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "QA Hub: Failed to send vote update notification for {ContentType} {ContentId}", 
                voteUpdate.ContentType, voteUpdate.ContentId);
            throw;
        }
    }

    /// <summary>
    /// Notify users about question updates (edits, status changes)
    /// </summary>
    public async Task NotifyQuestionUpdateAsync(QuestionDto question)
    {
        try
        {
            // Notify users viewing the specific question
            await _hubContext.Clients.Group($"question_{question.Id}")
                .ReceiveQuestionUpdate(question);

            // Notify users following the category
            var normalizedCategory = question.Category.Trim().ToLowerInvariant().Replace(" ", "_");
            await _hubContext.Clients.Group($"category_{normalizedCategory}")
                .ReceiveQuestionUpdate(question);

            _logger.LogInformation("QA Hub: Sent question update notification for question {QuestionId}", 
                question.Id);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "QA Hub: Failed to send question update notification for question {QuestionId}", 
                question.Id);
            throw;
        }
    }

    /// <summary>
    /// Notify relevant users when an answer is accepted
    /// </summary>
    public async Task NotifyAnswerAcceptedAsync(AnswerAcceptedDto answerAccepted)
    {
        try
        {
            // Notify users viewing the question
            await _hubContext.Clients.Group($"question_{answerAccepted.QuestionId}")
                .ReceiveAnswerAccepted(answerAccepted);

            // Notify the answer author directly
            await _hubContext.Clients.Group($"user_{answerAccepted.AnswerAuthorId}")
                .ReceiveAnswerAccepted(answerAccepted);

            _logger.LogInformation("QA Hub: Sent answer accepted notification for answer {AnswerId} on question {QuestionId}", 
                answerAccepted.AnswerId, answerAccepted.QuestionId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "QA Hub: Failed to send answer accepted notification for answer {AnswerId}", 
                answerAccepted.AnswerId);
            throw;
        }
    }

    /// <summary>
    /// Notify users about reputation changes
    /// </summary>
    public async Task NotifyReputationUpdateAsync(ReputationUpdateDto reputationUpdate)
    {
        try
        {
            // Notify the specific user about their reputation change
            await _hubContext.Clients.Group($"user_{reputationUpdate.UserId}")
                .ReceiveReputationUpdate(reputationUpdate);

            // If badges were earned, also notify moderators for potential recognition
            if (reputationUpdate.BadgesEarned.Any())
            {
                await _hubContext.Clients.Group("moderators")
                    .ReceiveReputationUpdate(reputationUpdate);
            }

            _logger.LogInformation("QA Hub: Sent reputation update notification for user {UserId}, change: {Change}", 
                reputationUpdate.UserId, reputationUpdate.Change);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "QA Hub: Failed to send reputation update notification for user {UserId}", 
                reputationUpdate.UserId);
            throw;
        }
    }

    /// <summary>
    /// Notify users when a question is closed
    /// </summary>
    public async Task NotifyQuestionClosedAsync(QuestionClosedDto questionClosed)
    {
        try
        {
            // Notify users viewing the question
            await _hubContext.Clients.Group($"question_{questionClosed.QuestionId}")
                .ReceiveQuestionClosed(questionClosed);

            // Notify the question author
            await _hubContext.Clients.Group($"user_{questionClosed.QuestionAuthorId}")
                .ReceiveQuestionClosed(questionClosed);

            // Notify moderators
            await _hubContext.Clients.Group("moderators")
                .ReceiveQuestionClosed(questionClosed);

            _logger.LogInformation("QA Hub: Sent question closed notification for question {QuestionId}", 
                questionClosed.QuestionId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "QA Hub: Failed to send question closed notification for question {QuestionId}", 
                questionClosed.QuestionId);
            throw;
        }
    }

    /// <summary>
    /// Notify experts about new questions in their expertise areas
    /// </summary>
    public async Task NotifyExpertsAsync(ExpertNotificationDto expertNotification)
    {
        try
        {
            // Notify specific experts
            foreach (var expertId in expertNotification.NotifiedExpertIds)
            {
                await _hubContext.Clients.Group($"user_{expertId}")
                    .ReceiveExpertNotification(expertNotification);
            }

            // Also notify the general experts group
            await _hubContext.Clients.Group("experts")
                .ReceiveExpertNotification(expertNotification);

            _logger.LogInformation("QA Hub: Sent expert notification for question {QuestionId} to {ExpertCount} experts", 
                expertNotification.QuestionId, expertNotification.NotifiedExpertIds.Count);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "QA Hub: Failed to send expert notification for question {QuestionId}", 
                expertNotification.QuestionId);
            throw;
        }
    }

    /// <summary>
    /// Notify users about question view count updates
    /// </summary>
    public async Task NotifyQuestionViewUpdateAsync(QuestionViewUpdateDto viewUpdate)
    {
        try
        {
            // Only send to users viewing the question (not the viewer themselves)
            await _hubContext.Clients.Group($"question_{viewUpdate.QuestionId}")
                .ReceiveQuestionUpdate(new QuestionDto { Id = viewUpdate.QuestionId, ViewCount = viewUpdate.NewViewCount });

            _logger.LogDebug("QA Hub: Sent question view update for question {QuestionId}, new count: {ViewCount}", 
                viewUpdate.QuestionId, viewUpdate.NewViewCount);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "QA Hub: Failed to send question view update for question {QuestionId}", 
                viewUpdate.QuestionId);
            throw;
        }
    }

    /// <summary>
    /// Notify users following a category about new questions
    /// </summary>
    public async Task NotifyNewQuestionToCategoryAsync(NewQuestionNotificationDto notification, string category)
    {
        try
        {
            var normalizedCategory = category.Trim().ToLowerInvariant().Replace(" ", "_");
            
            // Notify category followers
            await _hubContext.Clients.Group($"category_{normalizedCategory}")
                .ReceiveQuestionUpdate(notification.Question);

            // Notify experts in this category
            await _hubContext.Clients.Group("experts")
                .ReceiveQuestionUpdate(notification.Question);

            _logger.LogInformation("QA Hub: Sent new question notification to category {Category} for question {QuestionId}", 
                category, notification.Question.Id);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "QA Hub: Failed to send new question notification to category {Category}", category);
            throw;
        }
    }

    /// <summary>
    /// Send connection status updates to all clients
    /// </summary>
    public async Task SendConnectionStatusAsync(ConnectionStatusDto connectionStatus)
    {
        try
        {
            await _hubContext.Clients.All
                .ReceiveConnectionStatus(connectionStatus);

            _logger.LogDebug("QA Hub: Sent connection status update: {Status}", connectionStatus.Status);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "QA Hub: Failed to send connection status update");
            throw;
        }
    }
}