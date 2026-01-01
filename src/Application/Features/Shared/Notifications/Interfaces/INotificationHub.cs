namespace Application.Features.Shared.Notifications.Interfaces;

public interface INotificationHub
{
    Task ReceiveNotification(object notification);
    Task ReceiveSystemNotification(string message);
    Task ReceiveUserNotification(string userId, object notification);
}