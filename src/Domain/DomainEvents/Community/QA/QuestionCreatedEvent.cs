using Domain.DomainEvents;

namespace Domain.DomainEvents.Community.QA
{
    public class QuestionCreatedEvent : BaseDomainEvent
    {
        public Guid QuestionId { get; set; }
        public Guid UserId { get; set; }
        public string Title { get; set; } = string.Empty;
        public Guid? CategoryId { get; set; }
        public Guid? GroupId { get; set; }

        public QuestionCreatedEvent(Guid questionId, Guid userId, string title, Guid? categoryId = null, Guid? groupId = null)
        {
            QuestionId = questionId;
            UserId = userId;
            Title = title;
            CategoryId = categoryId;
            GroupId = groupId;
        }
    }
}