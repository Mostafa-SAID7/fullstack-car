using Domain.Entities.Identity;

namespace Domain.Entities.Admin.Management.Users;

public class RoleAssignment : BaseEntity
{
    public Guid UserId { get; set; }
    public Guid RoleId { get; set; }
    public Guid AssignedByUserId { get; set; }
    public DateTime AssignedDate { get; set; } = DateTime.UtcNow;
    public DateTime? ExpiryDate { get; set; }
    public string? Reason { get; set; }
    public bool IsActive { get; set; } = true;

    // Navigation properties
    public ApplicationUser User { get; set; } = null!;
    public ApplicationRole Role { get; set; } = null!;
    public ApplicationUser AssignedByUser { get; set; } = null!;
}