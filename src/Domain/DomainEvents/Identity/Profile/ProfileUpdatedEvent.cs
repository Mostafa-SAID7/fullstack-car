namespace Domain.DomainEvents.Identity.Profile;

public class ProfileUpdatedEvent : BaseDomainEvent
{
    public Guid UserId { get; }
    public string UserName { get; }
    public Dictionary<string, object> Changes { get; }

    public ProfileUpdatedEvent(Guid userId, string userName, Dictionary<string, object> changes)
    {
        UserId = userId;
        UserName = userName;
        Changes = changes;
    }
}