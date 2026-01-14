using Domain.Base;
using Domain.Entities.Identity;
using Domain.Enums.Admin.Management;

namespace Domain.Entities.Admin.Management.Users;

public class UserActivity : BaseEntity
{
    public Guid UserId { get; set; }
    public UserActivityType ActivityType { get; set; }
    public string Description { get; set; } = string.Empty;
    public string? IpAddress { get; set; }
    public string? UserAgent { get; set; }
    public string? Metadata { get; set; }
    public new DateTime CreatedAt { get; set; }

    // Navigation Properties
    public ApplicationUser User { get; set; } = null!;
}
