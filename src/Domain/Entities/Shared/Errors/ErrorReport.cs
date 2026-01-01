namespace Domain.Entities.Shared.Errors;

public class ErrorReport : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? StepsToReproduce { get; set; }
    public string? ExpectedBehavior { get; set; }
    public string? ActualBehavior { get; set; }
    public string? Environment { get; set; }
    public string? BrowserInfo { get; set; }
    public string? DeviceInfo { get; set; }
    public string? Screenshots { get; set; } // JSON array of file paths
    public Guid? ReportedByUserId { get; set; }
    public string? ReporterEmail { get; set; }
    public Priority Priority { get; set; } = Priority.Normal;
    public Status Status { get; set; } = Status.Pending;
    public string? Category { get; set; }
    public string? AssignedTo { get; set; }
    public DateTime? ResolvedAt { get; set; }
    public string? Resolution { get; set; }
}