namespace Application.Features.Shared.Notifications.Interfaces
{
    public interface INotificationHub
    {
        Task ReceiveNotification(object notification);
    }
}