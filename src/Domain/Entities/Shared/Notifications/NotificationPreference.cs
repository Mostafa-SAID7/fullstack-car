using Domain.Entities.Identity;

namespace Domain.Entities.Shared.Notifications;

public class NotificationPreference : BaseEntity
{
    public Guid UserId { get; set; }
    public string NotificationType { get; set; } = string.Empty;
    public bool EmailEnabled { get; set; }
    public bool PushEnabled { get; set; }
    public bool SmsEnabled { get; set; }
    public bool InAppEnabled { get; set; }
    public string Frequency { get; set; } = string.Empty;

    // Navigation properties
    public ApplicationUser User { get; set; } = null!;
}
