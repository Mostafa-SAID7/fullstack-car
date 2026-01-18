namespace Application.Features.Shared.Notifications.DTOs;

public class CreateNotificationRequest
{
    public string? UserId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string Type { get; set; } = "info"; // info, warning, error, success
    public string? ActionUrl { get; set; }
    public Dictionary<string, object> Metadata { get; set; } = new();
}

public class MarketplaceNotificationRequest
{
    public string? UserId { get; set; }
    public string NotificationType { get; set; } = string.Empty; // order_update, payment_received, etc.
    public string Title { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public Guid? RelatedEntityId { get; set; }
    public string? ActionUrl { get; set; }
    public Dictionary<string, object> Metadata { get; set; } = new();
}

public class SystemBroadcastRequest
{
    public string Title { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string Priority { get; set; } = "normal"; // low, normal, high, urgent
    public List<string> TargetRoles { get; set; } = new();
    public DateTime? ScheduledFor { get; set; }
    public Dictionary<string, object> Metadata { get; set; } = new();
}

public class UpdatePreferencesRequest
{
    public List<PreferenceDto> Preferences { get; set; } = new();
}

public class PreferenceDto
{
    public string NotificationType { get; set; } = string.Empty;
    public bool IsEnabled { get; set; }
    public string DeliveryMethod { get; set; } = "push"; // push, email, sms
    public string Frequency { get; set; } = "immediate";
}

public class RegisterDeviceRequest
{
    public string DeviceToken { get; set; } = string.Empty;
    public string Platform { get; set; } = string.Empty; // ios, android, web
    public string? DeviceInfo { get; set; }
}