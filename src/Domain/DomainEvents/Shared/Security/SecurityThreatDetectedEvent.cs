namespace Domain.DomainEvents.Shared.Security;

public class SecurityThreatDetectedEvent : BaseDomainEvent
{
    public string ThreatType { get; }
    public string Description { get; }
    public string IpAddress { get; }
    public Guid? UserId { get; }
    public Priority Severity { get; }

    public SecurityThreatDetectedEvent(string threatType, string description, string ipAddress, 
        Guid? userId, Priority severity)
    {
        ThreatType = threatType;
        Description = description;
        IpAddress = ipAddress;
        UserId = userId;
        Severity = severity;
    }
}
