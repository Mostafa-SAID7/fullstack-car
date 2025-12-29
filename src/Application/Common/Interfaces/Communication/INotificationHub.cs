namespace Application.Common.Interfaces.Communication
{
    public interface INotificationHub
    {
        Task ReceiveNotification(object notification);
    }
}
