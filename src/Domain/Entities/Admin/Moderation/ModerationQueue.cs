using Domain.Entities.Identity;
using Domain.Enums.Admin.Moderation;

namespace Domain.Entities.Admin.Moderation;

public class ModerationQueue : BaseEntity
{
    public ContentType ContentType { get; set; }
    public Guid ContentId { get; set; }
    public Guid? ContentAuthorId { get; set; }
    public ModerationStatus Status { get; set; } = ModerationStatus.Pending;
    public string Priority { get; set; } = "Normal"; // Low, Normal, High, Critical
    public string? ReportReason { get; set; }
    public Guid? ReportedByUserId { get; set; }
    public DateTime QueuedDate { get; set; } = DateTime.UtcNow;
    public Guid? AssignedModeratorId { get; set; }
    public DateTime? AssignedDate { get; set; }
    public DateTime? CompletedDate { get; set; }
    public string? ContentSnapshot { get; set; }

    // Additional properties expected by Infrastructure
    public DateTime SubmittedAt { get; set; } = DateTime.UtcNow; // Alias for QueuedDate
    public DateTime? ReviewedAt { get; set; } // Alias for CompletedDate
    public bool IsActive { get; set; } = true;

    // Navigation properties
    public ApplicationUser? ContentAuthor { get; set; }
    public ApplicationUser? ReportedByUser { get; set; }
    public ApplicationUser? AssignedModerator { get; set; }
}