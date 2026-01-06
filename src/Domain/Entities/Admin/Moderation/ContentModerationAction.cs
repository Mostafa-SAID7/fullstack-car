using Domain.Entities.Identity;

namespace Domain.Entities.Admin.Moderation;

public class ContentModerationAction : BaseEntity
{
    public Guid ModeratorId { get; set; }
    public ContentType ContentType { get; set; }
    public Guid ContentId { get; set; }
    public Guid? ContentAuthorId { get; set; }
    public ModerationActionType ActionType { get; set; }
    public string Reason { get; set; } = string.Empty;
    public string? Notes { get; set; }
    public DateTime ActionDate { get; set; } = DateTime.UtcNow;
    public bool IsReversed { get; set; } = false;
    public DateTime? ReversedDate { get; set; }
    public Guid? ReversedByUserId { get; set; }

    // Navigation properties
    public ApplicationUser Moderator { get; set; } = null!;
    public ApplicationUser? ContentAuthor { get; set; }
    public ApplicationUser? ReversedByUser { get; set; }
}
