using Application.Features.Common.Votes.DTOs.Responses;
using Application.Features.Community.QA.DTOs.Responses;

namespace Application.Features.Community.QA.Interfaces;

public interface IHubService
{
    Task NotifyQuestionUpdated(QuestionDto question);
    Task NotifyAnswerUpdated(AnswerDto answer);
    Task NotifyVoteUpdated(VoteUpdateResponse voteUpdate);
    Task NotifyAnswerAccepted(AnswerAcceptedDto answerAccepted);
    Task NotifyReputationUpdated(ReputationUpdateDto reputationUpdate);
    Task NotifyQuestionClosed(QuestionClosedDto questionClosed);
    Task NotifyExpertsOfNewQuestion(ExpertNotificationDto notification);
    Task NotifyQuestionViewUpdated(QuestionViewUpdateDto viewUpdate);
    Task NotifyNewQuestion(NewQuestionNotificationDto notification);
    Task SendConnectionStatus(string connectionId, ConnectionStatusDto status);
}