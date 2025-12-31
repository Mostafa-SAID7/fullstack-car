using Domain.Entities.Identity;

namespace Domain.Entities.Admin.Dashboard;

public class DashboardPermission : BaseEntity
{
    public Guid DashboardLayoutId { get; set; }
    public Guid? UserId { get; set; }
    public Guid? RoleId { get; set; }
    public bool CanView { get; set; } = true;
    public bool CanEdit { get; set; }
    public bool CanDelete { get; set; }
    public bool CanShare { get; set; }

    // Navigation properties
    public DashboardLayout DashboardLayout { get; set; } = null!;
    public ApplicationUser? User { get; set; }
    public ApplicationRole? Role { get; set; }
}