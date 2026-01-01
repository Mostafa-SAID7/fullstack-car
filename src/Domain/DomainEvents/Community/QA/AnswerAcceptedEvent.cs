using Domain.DomainEvents;

namespace Domain.DomainEvents.Community.QA
{
    public class AnswerAcceptedEvent : BaseDomainEvent
    {
        public Guid AnswerId { get; set; }
        public Guid QuestionId { get; set; }
        public Guid AnswerUserId { get; set; }
        public Guid QuestionUserId { get; set; }

        public AnswerAcceptedEvent(Guid answerId, Guid questionId, Guid answerUserId, Guid questionUserId)
        {
            AnswerId = answerId;
            QuestionId = questionId;
            AnswerUserId = answerUserId;
            QuestionUserId = questionUserId;
        }
    }
}