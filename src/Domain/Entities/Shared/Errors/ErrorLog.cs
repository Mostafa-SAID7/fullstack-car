namespace Domain.Entities.Shared.Errors;

public class ErrorLog : BaseEntity
{
    public string ErrorId { get; set; } = Guid.NewGuid().ToString();
    public string Message { get; set; } = string.Empty;
    public string? Exception { get; set; }
    public string? StackTrace { get; set; }
    public string? InnerException { get; set; }
    public string Source { get; set; } = string.Empty;
    public string? Method { get; set; }
    public string? RequestPath { get; set; }
    public string? RequestMethod { get; set; }
    public string? QueryString { get; set; }
    public string? RequestBody { get; set; }
    public string? UserAgent { get; set; }
    public string? IpAddress { get; set; }
    public Guid? UserId { get; set; }
    public string? UserName { get; set; }
    public string? SessionId { get; set; }
    public string? CorrelationId { get; set; }
    public Priority Severity { get; set; } = Priority.Normal;
    public string? Category { get; set; }
    public string? Environment { get; set; }
    public string? Version { get; set; }
    public bool IsResolved { get; set; } = false;
    public DateTime? ResolvedAt { get; set; }
    public string? Resolution { get; set; }
    public DateTime OccurredAt { get; set; } = DateTime.UtcNow;
}