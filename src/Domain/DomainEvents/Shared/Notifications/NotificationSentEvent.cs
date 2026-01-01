namespace Domain.DomainEvents.Shared.Notifications;

public class NotificationSentEvent : BaseDomainEvent
{
    public Guid NotificationId { get; }
    public Guid UserId { get; }
    public string Title { get; }
    public string Message { get; }
    public NotificationChannel Channel { get; }
    public bool IsSuccessful { get; }

    public NotificationSentEvent(Guid notificationId, Guid userId, string title, string message, 
        NotificationChannel channel, bool isSuccessful)
    {
        NotificationId = notificationId;
        UserId = userId;
        Title = title;
        Message = message;
        Channel = channel;
        IsSuccessful = isSuccessful;
    }
}