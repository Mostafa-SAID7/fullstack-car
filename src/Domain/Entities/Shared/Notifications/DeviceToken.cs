using Domain.Entities.Identity;

namespace Domain.Entities.Shared.Notifications;

public class DeviceToken : BaseEntity
{
    public Guid UserId { get; set; }
    public string Token { get; set; } = string.Empty;
    public string Platform { get; set; } = string.Empty; // iOS, Android, Web
    public bool IsActive { get; set; } = true;
    public DateTime LastUsedAt { get; set; }

    // Navigation properties
    public ApplicationUser User { get; set; } = null!;
}
