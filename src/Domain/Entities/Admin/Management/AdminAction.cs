using Domain.Entities.Identity;

namespace Domain.Entities.Admin.Management;

public class AdminAction : BaseEntity
{
    public Guid AdminUserId { get; set; }
    public AdminActionType ActionType { get; set; }
    public string Description { get; set; } = string.Empty;
    public Guid? TargetUserId { get; set; }
    public string? TargetEntityType { get; set; }
    public Guid? TargetEntityId { get; set; }
    public string? Reason { get; set; }
    public DateTime ActionDate { get; set; } = DateTime.UtcNow;
    public string? AdditionalData { get; set; }

    // Navigation properties
    public ApplicationUser AdminUser { get; set; } = null!;
    public ApplicationUser? TargetUser { get; set; }
}