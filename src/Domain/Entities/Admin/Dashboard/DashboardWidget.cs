using Domain.Entities.Identity;

namespace Domain.Entities.Admin.Dashboard;

public class DashboardWidget : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public WidgetType Type { get; set; }
    public string Configuration { get; set; } = string.Empty; // JSON configuration
    public int Position { get; set; }
    public int Width { get; set; } = 1;
    public int Height { get; set; } = 1;
    public bool IsVisible { get; set; } = true;
    public Guid CreatedByUserId { get; set; }
    public Guid? DashboardLayoutId { get; set; }
    public string? DataSource { get; set; }
    public int RefreshIntervalSeconds { get; set; } = 300; // 5 minutes default

    // Navigation properties
    public ApplicationUser CreatedByUser { get; set; } = null!;
    public DashboardLayout? DashboardLayout { get; set; }
}