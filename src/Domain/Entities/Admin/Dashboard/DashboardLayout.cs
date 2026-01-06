using Domain.Entities.Identity;

namespace Domain.Entities.Admin.Dashboard;

public class DashboardLayout : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public bool IsDefault { get; set; }
    public bool IsPublic { get; set; }
    public Guid CreatedByUserId { get; set; }
    public string Configuration { get; set; } = string.Empty; // JSON layout configuration
    public int Columns { get; set; } = 12; // Grid columns
    public int Rows { get; set; } = 10; // Grid rows

    // Additional properties expected by Infrastructure
    public bool IsActive { get; set; } = true;
    public string? RequiredRole { get; set; }

    // Navigation properties
    public ApplicationUser CreatedByUser { get; set; } = null!;
    public ICollection<DashboardWidget> Widgets { get; set; } = new List<DashboardWidget>();
    public ICollection<DashboardPermission> Permissions { get; set; } = new List<DashboardPermission>();
}
