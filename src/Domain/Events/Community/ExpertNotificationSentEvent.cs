using Domain.DomainEvents;

namespace Domain.Events.Community;

/// <summary>
/// Domain event raised when experts are notified about a new question
/// </summary>
public class ExpertNotificationSentEvent : BaseDomainEvent
{
    public Guid QuestionId { get; }
    public string Category { get; }
    public List<Guid> NotifiedExpertIds { get; }
    public DateTime NotifiedAt { get; }

    public ExpertNotificationSentEvent(Guid questionId, string category, List<Guid> notifiedExpertIds)
    {
        QuestionId = questionId;
        Category = category;
        NotifiedExpertIds = notifiedExpertIds;
        NotifiedAt = DateTime.UtcNow;
    }
}