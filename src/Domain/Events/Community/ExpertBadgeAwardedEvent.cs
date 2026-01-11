using Domain.DomainEvents;

namespace Domain.Events.Community;

/// <summary>
/// Domain event raised when an expert badge is awarded
/// </summary>
public class ExpertBadgeAwardedEvent : BaseDomainEvent
{
    public Guid UserId { get; }
    public string BadgeName { get; }
    public string Category { get; }
    public string Reason { get; }
    public DateTime AwardedAt { get; }

    public ExpertBadgeAwardedEvent(Guid userId, string badgeName, string category, string reason)
    {
        UserId = userId;
        BadgeName = badgeName;
        Category = category;
        Reason = reason;
        AwardedAt = DateTime.UtcNow;
    }
}