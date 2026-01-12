using Application.Features.Community.QA.DTOs.Responses;

namespace Application.Features.Community.QA.Interfaces;

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