namespace Application.Common.Interfaces.Communication
{
    public interface INotificationService
    {
        Task SendNotificationAsync(string userId, string title, string message, string? targetUrl = null, Guid? sourceUserId = null);
        Task SendNotificationAsync(string userId, string title, string message, string? targetUrl, Guid? sourceUserId, CancellationToken cancellationToken);
        Task SendBulkNotificationAsync(IEnumerable<string> userIds, string title, string message);
        Task SendBulkNotificationAsync(IEnumerable<string> userIds, string title, string message, CancellationToken cancellationToken);
        Task<IEnumerable<object>> GetUserNotificationsAsync(string userId);
        Task<IEnumerable<object>> GetUserNotificationsAsync(string userId, CancellationToken cancellationToken);
        Task MarkAsReadAsync(string notificationId);
        Task MarkAsReadAsync(string notificationId, CancellationToken cancellationToken);
    }
}