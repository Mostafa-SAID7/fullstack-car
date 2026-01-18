using Application.Features.Shared.Notifications.Interfaces;
using Domain.Entities.Shared.Notifications;
using Domain.Interfaces;
using Microsoft.Extensions.Logging;

namespace Application.Features.Shared.Notifications.Services
{
    public class BaseNotificationService
    {
        protected readonly ILogger<BaseNotificationService> _logger;
        protected readonly IRepository<Notification> _notificationRepository;
        protected readonly INotificationHubService _hubService;

        public BaseNotificationService(
            ILogger<BaseNotificationService> logger,
            IRepository<Notification> notificationRepository,
            INotificationHubService hubService)
        {
            _logger = logger;
            _notificationRepository = notificationRepository;
            _hubService = hubService;
        }

        protected async Task SendEnhancedNotificationAsync(
            string userId, 
            string title, 
            string message, 
            string type, 
            string priority, 
            string category, 
            string? targetUrl = null, 
            Guid? relatedEntityId = null, 
            string? relatedEntityType = null, 
            Guid? sourceUserId = null)
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
            
            _logger.LogInformation("Sending {Category} notification to user {UserId}: {Title} (Priority: {Priority})", 
                category, userId, title, priority);

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

        protected async Task SendBulkNotificationAsync(
            IEnumerable<string> userIds, 
            string title, 
            string message, 
            string type = "Info", 
            string priority = "Medium", 
            string category = "System")
        {
            var tasks = userIds.Select(userId => SendEnhancedNotificationAsync(
                userId, title, message, type, priority, category));
            await Task.WhenAll(tasks);
        }
    }
}