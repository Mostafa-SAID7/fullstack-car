namespace Application.Features.Shared.Notifications.Interfaces
{
    public interface INotificationService
    {
        // Basic notification methods
        Task SendNotificationAsync(string userId, string title, string message, string? targetUrl = null, Guid? sourceUserId = null);
        Task SendNotificationAsync(string userId, string title, string message, string? targetUrl, Guid? sourceUserId, CancellationToken cancellationToken);
        Task SendBulkNotificationAsync(IEnumerable<string> userIds, string title, string message);
        Task SendBulkNotificationAsync(IEnumerable<string> userIds, string title, string message, CancellationToken cancellationToken);
        
        // Enhanced notification methods
        Task SendMarketplaceNotificationAsync(string userId, string title, string message, string notificationType = "Info", string priority = "Medium", string? targetUrl = null, Guid? relatedEntityId = null, string? relatedEntityType = null);
        Task SendSystemNotificationAsync(string userId, string title, string message, string priority = "Medium", string? targetUrl = null);
        Task SendSecurityNotificationAsync(string userId, string title, string message, string? targetUrl = null);
        Task SendPromotionNotificationAsync(string userId, string title, string message, string? targetUrl = null, Guid? promotionId = null);
        Task SendBulkMarketplaceNotificationAsync(IEnumerable<string> userIds, string title, string message, string type = "Info", string priority = "Medium", string? targetUrl = null);
        Task SendSystemBroadcastAsync(string title, string message, string priority = "Medium");
        
        // Retrieval methods
        Task<IEnumerable<object>> GetUserNotificationsAsync(string userId);
        Task<IEnumerable<object>> GetUserNotificationsAsync(string userId, CancellationToken cancellationToken);
        Task<IEnumerable<object>> GetNotificationsByTypeAsync(string userId, string type, int limit = 10);
        Task<IEnumerable<object>> GetNotificationsByCategoryAsync(string userId, string category, int limit = 10);
        
        // Management methods
        Task MarkAsReadAsync(string notificationId);
        Task MarkAsReadAsync(string notificationId, CancellationToken cancellationToken);
        Task MarkAllAsReadAsync(string userId);
        Task MarkAllAsReadAsync(string userId, CancellationToken cancellationToken);
        Task DeleteNotificationAsync(string notificationId);
        Task DeleteNotificationAsync(string notificationId, CancellationToken cancellationToken);
        Task<int> GetUnreadCountAsync(string userId);
        Task<int> GetUnreadCountAsync(string userId, CancellationToken cancellationToken);
    }
}
