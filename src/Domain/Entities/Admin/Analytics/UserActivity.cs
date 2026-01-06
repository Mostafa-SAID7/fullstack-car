using Domain.Entities.Identity;

namespace Domain.Entities.Admin.Analytics;

public class UserActivity : BaseEntity
{
    public Guid UserId { get; set; }
    public string ActivityType { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; }
    public string IpAddress { get; set; } = string.Empty;
    public string UserAgent { get; set; } = string.Empty;
    public string? AdditionalData { get; set; }

    // Navigation properties
    public ApplicationUser User { get; set; } = null!;
}
