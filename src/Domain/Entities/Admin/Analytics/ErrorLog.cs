using Domain.Entities.Identity;

namespace Domain.Entities.Admin.Analytics;

public class ApplicationErrorLog : BaseEntity
{
    public string ErrorType { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string? StackTrace { get; set; }
    public string Source { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; }
    public string Severity { get; set; } = string.Empty;
    public Guid? UserId { get; set; }

    // Navigation properties
    public ApplicationUser? User { get; set; }
}
