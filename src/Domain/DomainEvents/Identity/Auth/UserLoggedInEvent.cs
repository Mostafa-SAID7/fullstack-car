namespace Domain.DomainEvents.Identity.Auth;

public class UserLoggedInEvent : BaseDomainEvent
{
    public Guid UserId { get; }
    public string UserName { get; }
    public string IpAddress { get; }
    public string? UserAgent { get; }
    public DateTime LoginTime { get; }

    public UserLoggedInEvent(Guid userId, string userName, string ipAddress, string? userAgent, DateTime loginTime)
    {
        UserId = userId;
        UserName = userName;
        IpAddress = ipAddress;
        UserAgent = userAgent;
        LoginTime = loginTime;
    }
}