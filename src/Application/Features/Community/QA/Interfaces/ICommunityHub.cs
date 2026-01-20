using Application.Features.Common.Votes.DTOs.Responses;
using Application.Features.Community.QA.DTOs.Responses;

namespace Application.Features.Community.QA.Interfaces;

/// <summary>
/// Strongly-typed SignalR Hub interface for QA system real-time communication
/// </summary>
public interface ICommunityHub
{
    // Question Updates
    Task ReceiveQuestionUpdate(QuestionDto question);
    Task ReceiveQuestionDeleted(Guid questionId);
    Task ReceiveQuestionClosed(QuestionClosedDto questionClosed);
    
    // Answer Updates
    Task ReceiveAnswerUpdate(AnswerDto answer);
    Task ReceiveAnswerDeleted(Guid answerId);
    Task ReceiveAnswerAccepted(AnswerAcceptedDto answerAccepted);
    
    // Vote Updates
    Task ReceiveVoteUpdate(VoteUpdateResponse voteUpdate);
    
    // Reputation Updates
    Task ReceiveReputationUpdate(ReputationUpdateDto reputationUpdate);
    
    // Expert Notifications
    Task ReceiveExpertNotification(ExpertNotificationDto notification);
    
    // View Updates
    Task ReceiveQuestionViewUpdate(QuestionViewUpdateDto viewUpdate);
    
    // New Question Notifications
    Task ReceiveNewQuestionNotification(NewQuestionNotificationDto notification);
    
    // Connection Management
    Task ReceiveConnectionStatus(ConnectionStatusDto status);
    
    // Typing Indicators
    Task ReceiveTypingIndicator(TypingIndicatorDto typingIndicator);
}