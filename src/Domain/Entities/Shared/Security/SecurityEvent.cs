namespace Domain.Entities.Shared.Security;

public class SecurityEvent : BaseEntity
{
    public string EventType { get; set; } = string.Empty; // Login, Logout, FailedLogin, etc.
    public string Description { get; set; } = string.Empty;
    public Guid? UserId { get; set; }
    public string? UserName { get; set; }
    public string IpAddress { get; set; } = string.Empty;
    public string? UserAgent { get; set; }
    public string? Location { get; set; }
    public bool IsSuccessful { get; set; } = true;
    public string? FailureReason { get; set; }
    public Priority Severity { get; set; } = Priority.Normal;
    public string? AdditionalData { get; set; } // JSON
    public DateTime EventTime { get; set; } = DateTime.UtcNow;
}