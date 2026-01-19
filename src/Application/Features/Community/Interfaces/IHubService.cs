using Application.Features.Community.QA.DTOs.Responses;

namespace Application.Features.Community.QA.Interfaces;
public interface IHubService
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
    
    // Methods used in QuestionsController
    Task NotifyQuestionCreated(QuestionDto question);
    Task NotifyQuestionUpdated(QuestionDto question);
    Task NotifyQuestionDeleted(Guid questionId);
}