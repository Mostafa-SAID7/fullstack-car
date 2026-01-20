using Application.Features.Common.Votes.DTOs.Responses;
using Application.Features.Community.QA.DTOs.Responses;
using Application.Features.Community.QA.Interfaces;
using Infrastructure.Hubs;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Services.Community;
public class HubService : IHubService
{
    private readonly IHubContext<CommunityHub, ICommunityHub> _hubContext;
    private readonly ILogger<HubService> _logger;

    public HubService(
        IHubContext<CommunityHub, ICommunityHub> hubContext,
        ILogger<HubService> logger)
    {
        _hubContext = hubContext;
        _logger = logger;
    }
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

            _logger.LogInformation("Community Hub: Sent new answer notification for question {QuestionId} by user {UserId}", 
                answer.QuestionId, answer.UserId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Community Hub: Failed to send new answer notification for question {QuestionId}", 
                answer.QuestionId);
            throw;
        }
    }
    public async Task NotifyVoteUpdateAsync(VoteUpdateResponse voteUpdate)
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
                // This would require the QuestionId to be included in the VoteUpdateResponse
                // For now, we'll use a more general approach
                await _hubContext.Clients.All
                    .ReceiveVoteUpdate(voteUpdate);
            }

            _logger.LogInformation("Community Hub: Sent vote update notification for {ContentType} {ContentId}", 
                voteUpdate.ContentType, voteUpdate.ContentId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Community Hub: Failed to send vote update notification for {ContentType} {ContentId}", 
                voteUpdate.ContentType, voteUpdate.ContentId);
            throw;
        }
    }
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

            _logger.LogInformation("Community Hub: Sent question update notification for question {QuestionId}", 
                question.Id);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Community Hub: Failed to send question update notification for question {QuestionId}", 
                question.Id);
            throw;
        }
    }
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

            _logger.LogInformation("Community Hub: Sent answer accepted notification for answer {AnswerId} on question {QuestionId}", 
                answerAccepted.AnswerId, answerAccepted.QuestionId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Community Hub: Failed to send answer accepted notification for answer {AnswerId}", 
                answerAccepted.AnswerId);
            throw;
        }
    }
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

            _logger.LogInformation("Community Hub: Sent reputation update notification for user {UserId}, change: {Change}", 
                reputationUpdate.UserId, reputationUpdate.Change);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Community Hub: Failed to send reputation update notification for user {UserId}", 
                reputationUpdate.UserId);
            throw;
        }
    }
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

            _logger.LogInformation("Community Hub: Sent question closed notification for question {QuestionId}", 
                questionClosed.QuestionId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Community Hub: Failed to send question closed notification for question {QuestionId}", 
                questionClosed.QuestionId);
            throw;
        }
    }
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

            _logger.LogInformation("Community Hub: Sent expert notification for question {QuestionId} to {ExpertCount} experts", 
                expertNotification.QuestionId, expertNotification.NotifiedExpertIds.Count);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Community Hub: Failed to send expert notification for question {QuestionId}", 
                expertNotification.QuestionId);
            throw;
        }
    }
    public async Task NotifyQuestionViewUpdateAsync(QuestionViewUpdateDto viewUpdate)
    {
        try
        {
            // Only send to users viewing the question (not the viewer themselves)
            await _hubContext.Clients.Group($"question_{viewUpdate.QuestionId}")
                .ReceiveQuestionUpdate(new QuestionDto { Id = viewUpdate.QuestionId, ViewCount = viewUpdate.NewViewCount });

            _logger.LogDebug("Community Hub: Sent question view update for question {QuestionId}, new count: {ViewCount}", 
                viewUpdate.QuestionId, viewUpdate.NewViewCount);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Community Hub: Failed to send question view update for question {QuestionId}", 
                viewUpdate.QuestionId);
            throw;
        }
    }
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

            _logger.LogInformation("Community Hub: Sent new question notification to category {Category} for question {QuestionId}", 
                category, notification.Question.Id);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Community Hub: Failed to send new question notification to category {Category}", category);
            throw;
        }
    }
    public async Task SendConnectionStatusAsync(ConnectionStatusDto connectionStatus)
    {
        try
        {
            await _hubContext.Clients.All
                .ReceiveConnectionStatus(connectionStatus);

            _logger.LogDebug("Community Hub: Sent connection status update: {Status}", connectionStatus.Status);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Community Hub: Failed to send connection status update");
            throw;
        }
    }

    // Methods used in QuestionsController
    public async Task NotifyQuestionCreated(QuestionDto question)
    {
        try
        {
            // Notify users following the category
            var normalizedCategory = question.Category.Trim().ToLowerInvariant().Replace(" ", "_");
            await _hubContext.Clients.Group($"category_{normalizedCategory}")
                .ReceiveQuestionUpdate(question);

            // Notify experts
            await _hubContext.Clients.Group("experts")
                .ReceiveQuestionUpdate(question);

            _logger.LogInformation("Community Hub: Sent question created notification for question {QuestionId}", 
                question.Id);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Community Hub: Failed to send question created notification for question {QuestionId}", 
                question.Id);
            throw;
        }
    }

    public async Task NotifyQuestionUpdated(QuestionDto question)
    {
        await NotifyQuestionUpdateAsync(question);
    }

    public async Task NotifyQuestionDeleted(Guid questionId)
    {
        try
        {
            // Notify users viewing the specific question
            await _hubContext.Clients.Group($"question_{questionId}")
                .ReceiveQuestionDeleted(questionId);

            _logger.LogInformation("Community Hub: Sent question deleted notification for question {QuestionId}", 
                questionId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Community Hub: Failed to send question deleted notification for question {QuestionId}", 
                questionId);
            throw;
        }
    }

    // QA Interface Methods
    public async Task NotifyAnswerUpdated(AnswerDto answer)
    {
        await NotifyNewAnswerAsync(answer);
    }

    public async Task NotifyVoteUpdated(VoteUpdateResponse voteUpdate)
    {
        await NotifyVoteUpdateAsync(voteUpdate);
    }

    public async Task NotifyAnswerAccepted(AnswerAcceptedDto answerAccepted)
    {
        await NotifyAnswerAcceptedAsync(answerAccepted);
    }

    public async Task NotifyReputationUpdated(ReputationUpdateDto reputationUpdate)
    {
        await NotifyReputationUpdateAsync(reputationUpdate);
    }

    public async Task NotifyQuestionClosed(QuestionClosedDto questionClosed)
    {
        await NotifyQuestionClosedAsync(questionClosed);
    }

    public async Task NotifyExpertsOfNewQuestion(ExpertNotificationDto notification)
    {
        await NotifyExpertsAsync(notification);
    }

    public async Task NotifyQuestionViewUpdated(QuestionViewUpdateDto viewUpdate)
    {
        await NotifyQuestionViewUpdateAsync(viewUpdate);
    }

    public async Task NotifyNewQuestion(NewQuestionNotificationDto notification)
    {
        await NotifyNewQuestionToCategoryAsync(notification, "");
    }

    public async Task SendConnectionStatus(string connectionId, ConnectionStatusDto status)
    {
        await _hubContext.Clients.Client(connectionId).ReceiveConnectionStatus(status);
    }
}
