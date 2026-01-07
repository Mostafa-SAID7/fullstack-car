namespace Application.Features.Shared.Notifications.Interfaces;

public interface INotificationHubService
{
    Task SendNotificationToUserAsync(string userId, object notification);
    Task SendNotificationToGroupAsync(string groupName, object notification);
    Task SendSystemBroadcastAsync(string message);
    Task SendNotificationToAllAsync(object notification);
}