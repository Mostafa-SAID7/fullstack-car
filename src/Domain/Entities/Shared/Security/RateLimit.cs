namespace Domain.Entities.Shared.Security;

public class RateLimit : BaseEntity
{
    public string Key { get; set; } = string.Empty; // IP, User, API Key, etc.
    public string Type { get; set; } = string.Empty; // IP, User, Global, etc.
    public int RequestCount { get; set; }
    public int MaxRequests { get; set; }
    public TimeSpan WindowDuration { get; set; }
    public DateTime WindowStart { get; set; }
    public DateTime? BlockedUntil { get; set; }
    public bool IsBlocked { get; set; } = false;
    public string? Endpoint { get; set; }
}
