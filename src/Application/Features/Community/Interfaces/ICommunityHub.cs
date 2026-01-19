using Application.Features.Community.DTOs.Responses;

namespace Application.Features.Community.Interfaces;

/// <summary>
/// SignalR hub interface for real-time QA system communication
/// Serves both Angular and React clients with unified real-time features
/// </summary>
public interface ICommunityHub
{
    /// <summary>
    /// Receive a new answer notification
    /// </summary>
    Task ReceiveNewAnswer(AnswerDto answer);

    /// <summary>
    /// Receive a vote update notification
    /// </summary>
    Task ReceiveVoteUpdate(VoteUpdateDto voteUpdate);

    /// <summary>
    /// Receive a question update notification
    /// </summary>
    Task ReceiveQuestionUpdate(QuestionDto question);

    /// <summary>
    /// Receive an answer acceptance notification
    /// </summary>
    Task ReceiveAnswerAccepted(AnswerAcceptedDto answerAccepted);

    /// <summary>
    /// Receive typing indicator for answer composition
    /// </summary>
    Task ReceiveTypingIndicator(TypingIndicatorDto typingIndicator);

    /// <summary>
    /// Receive reputation update notification
    /// </summary>
    Task ReceiveReputationUpdate(ReputationUpdateDto reputationUpdate);

    /// <summary>
    /// Receive question closed notification
    /// </summary>
    Task ReceiveQuestionClosed(QuestionClosedDto questionClosed);

    /// <summary>
    /// Receive expert notification for new questions in their expertise areas
    /// </summary>
    Task ReceiveExpertNotification(ExpertNotificationDto expertNotification);

    /// <summary>
    /// Receive connection status update
    /// </summary>
    Task ReceiveConnectionStatus(ConnectionStatusDto connectionStatus);

    /// <summary>
    /// Receive question deleted notification
    /// </summary>
    Task ReceiveQuestionDeleted(Guid questionId);
}
