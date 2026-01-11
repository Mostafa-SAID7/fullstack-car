using Domain.DomainEvents;

namespace Domain.Events.Community;

/// <summary>
/// Domain event raised when a user is promoted to expert status
/// </summary>
public class ExpertPromotedEvent : BaseDomainEvent
{
    public Guid UserId { get; }
    public string Category { get; }
    public string ExpertiseLevel { get; }
    public string Reason { get; }
    public DateTime PromotedAt { get; }

    public ExpertPromotedEvent(Guid userId, string category, string expertiseLevel, string reason)
    {
        UserId = userId;
        Category = category;
        ExpertiseLevel = expertiseLevel;
        Reason = reason;
        PromotedAt = DateTime.UtcNow;
    }
}