namespace Domain.Entities.Shared.Errors;

public class ErrorPattern : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Pattern { get; set; } = string.Empty; // Regex pattern to match errors
    public string? Description { get; set; }
    public string? Category { get; set; }
    public Priority Severity { get; set; } = Priority.Normal;
    public string? AutoResolution { get; set; }
    public bool IsActive { get; set; } = true;
    public int MatchCount { get; set; } = 0;
    public DateTime? LastMatched { get; set; }
    public string? NotificationRules { get; set; } // JSON rules for notifications
}
