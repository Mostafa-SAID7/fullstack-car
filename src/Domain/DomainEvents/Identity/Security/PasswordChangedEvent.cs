namespace Domain.DomainEvents.Identity.Security;

public class PasswordChangedEvent : BaseDomainEvent
{
    public Guid UserId { get; }
    public string UserName { get; }
    public string IpAddress { get; }
    public DateTime ChangedAt { get; }

    public PasswordChangedEvent(Guid userId, string userName, string ipAddress, DateTime changedAt)
    {
        UserId = userId;
        UserName = userName;
        IpAddress = ipAddress;
        ChangedAt = changedAt;
    }
}
