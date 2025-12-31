using Domain.Entities.Identity;

namespace Domain.Entities.Shared.Notifications;

public class Notification : BaseEntity
{
    public Guid UserId { get; set; }
    public string Type { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public bool IsRead { get; set; }
    public string Priority { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public Guid? RelatedEntityId { get; set; }
    public string? RelatedEntityType { get; set; }
    public Guid? SourceUserId { get; set; }
    public string? TargetUrl { get; set; }
    public DateTime? ReadAt { get; set; }
    public DateTime? ExpiresAt { get; set; }

    // Navigation properties
    public ApplicationUser User { get; set; } = null!;
    public ApplicationUser? SourceUser { get; set; }
}
