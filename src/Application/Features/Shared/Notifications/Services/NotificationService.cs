using Application.Features.Shared.Notifications.Interfaces;
using Domain.Entities.Shared.Notifications;
using Domain.Interfaces;
using Microsoft.Extensions.Logging;

namespace Application.Features.Shared.Notifications.Services
{
    public class NotificationService : INotificationService
    {
        private readonly ILogger<NotificationService> _logger;
        private readonly IRepository<Notification> _notificationRepository;
        private readonly INotificationHubService _hubService;

        public NotificationService(
            ILogger<NotificationService> logger,
            IRepository<Notification> notificationRepository,
            INotificationHubService hubService)
        {
            _logger = logger;
            _notificationRepository = notificationRepository;
            _hubService = hubService;
        }

        public async Task SendNotificationAsync(string userId, string title, string message, string? targetUrl = null, Guid? sourceUserId = null)
        {
            await SendNotificationAsync(userId, title, message, targetUrl, sourceUserId, CancellationToken.None);
        }

        public async Task SendNotificationAsync(string userId, string title, string message, string? targetUrl, Guid? sourceUserId, CancellationToken cancellationToken)
        {
            if (!Guid.TryParse(userId, out var userGuid)) return;

            var notification = new Notification
            {
                UserId = userGuid,
                Title = title,
                Message = message,
                TargetUrl = targetUrl,
                SourceUserId = sourceUserId,
                Type = "Info",
                Priority = "Medium",
                Category = "System",
                CreatedAt = DateTime.UtcNow,
                IsRead = false
            };

            await _notificationRepository.AddAsync(notification, cancellationToken);
            
            _logger.LogInformation("Sending real-time notification to user {UserId}: {Title}", userId, title);

            // Send real-time notification via SignalR
            try
            {
                await _hubService.SendNotificationToUserAsync(userId, new
                {
                    id = notification.Id.ToString(),
                    title = notification.Title,
                    message = notification.Message,
                    type = notification.Type,
                    priority = notification.Priority,
                    category = notification.Category,
                    createdAt = notification.CreatedAt,
                    isRead = notification.IsRead,
                    targetUrl = notification.TargetUrl,
                    sourceUserId = notification.SourceUserId?.ToString()
                });
                
                _logger.LogInformation("Real-time notification sent successfully to user {UserId}", userId);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to send real-time notification to user {UserId}, but notification was saved", userId);
            }
        }

        public async Task SendBulkNotificationAsync(IEnumerable<string> userIds, string title, string message)
        {
            await SendBulkNotificationAsync(userIds, title, message, CancellationToken.None);
        }

        public async Task SendBulkNotificationAsync(IEnumerable<string> userIds, string title, string message, CancellationToken cancellationToken)
        {
            foreach (var userId in userIds)
            {
                await SendNotificationAsync(userId, title, message, null, null, cancellationToken);
            }
        }

        public async Task<IEnumerable<object>> GetUserNotificationsAsync(string userId)
        {
            return await GetUserNotificationsAsync(userId, CancellationToken.None);
        }

        public async Task<IEnumerable<object>> GetUserNotificationsAsync(string userId, CancellationToken cancellationToken)
        {
            if (!Guid.TryParse(userId, out var userGuid)) return Enumerable.Empty<object>();

            var notifications = await _notificationRepository.ListAllAsync(cancellationToken);
            return notifications.Where(n => n.UserId == userGuid && !n.IsDeleted)
                               .OrderByDescending(n => n.CreatedAt)
                               .Select(n => new
                               {
                                   id = n.Id.ToString(),
                                   title = n.Title,
                                   message = n.Message,
                                   type = n.Type,
                                   priority = n.Priority,
                                   category = n.Category,
                                   read = n.IsRead,
                                   createdAt = n.CreatedAt,
                                   readAt = n.ReadAt,
                                   targetUrl = n.TargetUrl,
                                   relatedEntityId = n.RelatedEntityId?.ToString(),
                                   relatedEntityType = n.RelatedEntityType,
                                   sourceUserId = n.SourceUserId?.ToString()
                               });
        }

        public async Task MarkAsReadAsync(string notificationId)
        {
            await MarkAsReadAsync(notificationId, CancellationToken.None);
        }

        public async Task MarkAsReadAsync(string notificationId, CancellationToken cancellationToken)
        {
            if (!Guid.TryParse(notificationId, out var idGuid)) return;

            var notification = await _notificationRepository.GetByIdAsync(idGuid, cancellationToken);
            if (notification != null && !notification.IsRead)
            {
                notification.IsRead = true;
                notification.ReadAt = DateTime.UtcNow;
                await _notificationRepository.UpdateAsync(notification, cancellationToken);
            }
        }

        public async Task MarkAllAsReadAsync(string userId)
        {
            await MarkAllAsReadAsync(userId, CancellationToken.None);
        }

        public async Task MarkAllAsReadAsync(string userId, CancellationToken cancellationToken)
        {
            if (!Guid.TryParse(userId, out var userGuid)) return;

            var notifications = await _notificationRepository.ListAllAsync(cancellationToken);
            var unreadNotifications = notifications.Where(n => n.UserId == userGuid && !n.IsRead && !n.IsDeleted).ToList();

            foreach (var notification in unreadNotifications)
            {
                notification.IsRead = true;
                notification.ReadAt = DateTime.UtcNow;
                await _notificationRepository.UpdateAsync(notification, cancellationToken);
            }
        }

        public async Task DeleteNotificationAsync(string notificationId)
        {
            await DeleteNotificationAsync(notificationId, CancellationToken.None);
        }

        public async Task DeleteNotificationAsync(string notificationId, CancellationToken cancellationToken)
        {
            if (!Guid.TryParse(notificationId, out var idGuid)) return;

            var notification = await _notificationRepository.GetByIdAsync(idGuid, cancellationToken);
            if (notification != null)
            {
                await _notificationRepository.DeleteAsync(notification, cancellationToken);
            }
        }

        public async Task<int> GetUnreadCountAsync(string userId)
        {
            return await GetUnreadCountAsync(userId, CancellationToken.None);
        }

        public async Task<int> GetUnreadCountAsync(string userId, CancellationToken cancellationToken)
        {
            if (!Guid.TryParse(userId, out var userGuid)) return 0;

            var notifications = await _notificationRepository.ListAllAsync(cancellationToken);
            return notifications.Count(n => n.UserId == userGuid && !n.IsRead && !n.IsDeleted);
        }

        // Enhanced notification methods
        public async Task SendMarketplaceNotificationAsync(string userId, string title, string message, string notificationType = "Info", string priority = "Medium", string? targetUrl = null, Guid? relatedEntityId = null, string? relatedEntityType = null)
        {
            await SendEnhancedNotificationAsync(userId, title, message, notificationType, priority, "Marketplace", targetUrl, relatedEntityId, relatedEntityType);
        }

        public async Task SendSystemNotificationAsync(string userId, string title, string message, string priority = "Medium", string? targetUrl = null)
        {
            await SendEnhancedNotificationAsync(userId, title, message, "Info", priority, "System", targetUrl);
        }

        public async Task SendSecurityNotificationAsync(string userId, string title, string message, string? targetUrl = null)
        {
            await SendEnhancedNotificationAsync(userId, title, message, "Warning", "High", "Security", targetUrl);
        }

        public async Task SendPromotionNotificationAsync(string userId, string title, string message, string? targetUrl = null, Guid? promotionId = null)
        {
            await SendEnhancedNotificationAsync(userId, title, message, "Success", "Medium", "Promotion", targetUrl, promotionId, "Promotion");
        }

        private async Task SendEnhancedNotificationAsync(string userId, string title, string message, string type, string priority, string category, string? targetUrl = null, Guid? relatedEntityId = null, string? relatedEntityType = null, Guid? sourceUserId = null)
        {
            if (!Guid.TryParse(userId, out var userGuid)) return;

            var notification = new Notification
            {
                UserId = userGuid,
                Title = title,
                Message = message,
                Type = type,
                Priority = priority,
                Category = category,
                TargetUrl = targetUrl,
                RelatedEntityId = relatedEntityId,
                RelatedEntityType = relatedEntityType,
                SourceUserId = sourceUserId,
                CreatedAt = DateTime.UtcNow,
                IsRead = false
            };

            await _notificationRepository.AddAsync(notification);
            
            _logger.LogInformation("Sending {Category} notification to user {UserId}: {Title} (Priority: {Priority})", category, userId, title, priority);

            // Send real-time notification via SignalR
            try
            {
                var notificationData = new
                {
                    id = notification.Id.ToString(),
                    title = notification.Title,
                    message = notification.Message,
                    type = notification.Type,
                    priority = notification.Priority,
                    category = notification.Category,
                    createdAt = notification.CreatedAt,
                    isRead = notification.IsRead,
                    targetUrl = notification.TargetUrl,
                    relatedEntityId = notification.RelatedEntityId?.ToString(),
                    relatedEntityType = notification.RelatedEntityType,
                    sourceUserId = notification.SourceUserId?.ToString()
                };

                await _hubService.SendNotificationToUserAsync(userId, notificationData);
                
                // Also send to specific notification type groups if needed
                if (priority == "High" || priority == "Critical")
                {
                    await _hubService.SendNotificationToGroupAsync($"priority_{priority.ToLower()}", notificationData);
                }
                
                _logger.LogInformation("Real-time notification sent successfully to user {UserId}", userId);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to send real-time notification to user {UserId}, but notification was saved", userId);
            }
        }

        public async Task SendBulkMarketplaceNotificationAsync(IEnumerable<string> userIds, string title, string message, string type = "Info", string priority = "Medium", string? targetUrl = null)
        {
            var tasks = userIds.Select(userId => SendMarketplaceNotificationAsync(userId, title, message, type, priority, targetUrl));
            await Task.WhenAll(tasks);
        }

        public async Task SendSystemBroadcastAsync(string title, string message, string priority = "Medium")
        {
            try
            {
                var broadcastData = new
                {
                    id = Guid.NewGuid().ToString(),
                    title = title,
                    message = message,
                    type = "Info",
                    priority = priority,
                    category = "System",
                    createdAt = DateTime.UtcNow,
                    isRead = false,
                    isBroadcast = true
                };

                await _hubService.SendSystemBroadcastAsync(message);
                _logger.LogInformation("System broadcast sent: {Title}", title);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send system broadcast: {Title}", title);
            }
        }

        public async Task<IEnumerable<object>> GetNotificationsByTypeAsync(string userId, string type, int limit = 10)
        {
            if (!Guid.TryParse(userId, out var userGuid)) return Enumerable.Empty<object>();

            var notifications = await _notificationRepository.ListAllAsync();
            return notifications.Where(n => n.UserId == userGuid && n.Type == type && !n.IsDeleted)
                               .OrderByDescending(n => n.CreatedAt)
                               .Take(limit)
                               .Select(n => new
                               {
                                   id = n.Id.ToString(),
                                   title = n.Title,
                                   message = n.Message,
                                   type = n.Type,
                                   priority = n.Priority,
                                   category = n.Category,
                                   read = n.IsRead,
                                   createdAt = n.CreatedAt,
                                   readAt = n.ReadAt,
                                   targetUrl = n.TargetUrl,
                                   relatedEntityId = n.RelatedEntityId?.ToString(),
                                   relatedEntityType = n.RelatedEntityType,
                                   sourceUserId = n.SourceUserId?.ToString()
                               });
        }

        public async Task<IEnumerable<object>> GetNotificationsByCategoryAsync(string userId, string category, int limit = 10)
        {
            if (!Guid.TryParse(userId, out var userGuid)) return Enumerable.Empty<object>();

            var notifications = await _notificationRepository.ListAllAsync();
            return notifications.Where(n => n.UserId == userGuid && n.Category == category && !n.IsDeleted)
                               .OrderByDescending(n => n.CreatedAt)
                               .Take(limit)
                               .Select(n => new
                               {
                                   id = n.Id.ToString(),
                                   title = n.Title,
                                   message = n.Message,
                                   type = n.Type,
                                   priority = n.Priority,
                                   category = n.Category,
                                   read = n.IsRead,
                                   createdAt = n.CreatedAt,
                                   readAt = n.ReadAt,
                                   targetUrl = n.TargetUrl,
                                   relatedEntityId = n.RelatedEntityId?.ToString(),
                                   relatedEntityType = n.RelatedEntityType,
                                   sourceUserId = n.SourceUserId?.ToString()
                               });
        }
    }
}
