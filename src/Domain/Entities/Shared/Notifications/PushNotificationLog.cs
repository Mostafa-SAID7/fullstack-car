using Domain.Entities.Identity;

namespace Domain.Entities.Shared.Notifications;

public class PushNotificationLog : BaseEntity
{
    public Guid UserId { get; set; }
    public string DeviceToken { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string Platform { get; set; } = string.Empty;
    public DateTime SentAt { get; set; }
    public DateTime? DeliveredAt { get; set; }
    public DateTime? ClickedAt { get; set; }

    // Navigation properties
    public ApplicationUser User { get; set; } = null!;
}
