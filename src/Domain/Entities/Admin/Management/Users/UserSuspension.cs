using Domain.Entities.Identity;

namespace Domain.Entities.Admin.Management.Users;

public class UserSuspension : BaseEntity
{
    public Guid UserId { get; set; }
    public Guid SuspendedByUserId { get; set; }
    public SuspensionReason Reason { get; set; }
    public DateTime SuspensionStart { get; set; }
    public DateTime? SuspensionEnd { get; set; }
    public bool IsPermanent { get; set; }
    public bool IsActive { get; set; } = true;
    public string? Notes { get; set; }

    // Navigation properties
    public ApplicationUser User { get; set; } = null!;
    public ApplicationUser SuspendedByUser { get; set; } = null!;
}