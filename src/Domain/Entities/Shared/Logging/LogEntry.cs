namespace Domain.Entities.Shared.Logging;

public class LogEntry : BaseEntity
{
    public string Level { get; set; } = string.Empty; // Debug, Info, Warning, Error, Critical
    public string Message { get; set; } = string.Empty;
    public string? Exception { get; set; }
    public string? StackTrace { get; set; }
    public string? Source { get; set; }
    public string? Category { get; set; }
    public Guid? UserId { get; set; }
    public string? UserName { get; set; }
    public string? IpAddress { get; set; }
    public string? UserAgent { get; set; }
    public string? RequestId { get; set; }
    public string? CorrelationId { get; set; }
    public string? Properties { get; set; } // JSON
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
}
