using Application.Common.Interfaces.Communication;
using Domain.Entities.Shared;
using Domain.Interfaces;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using WebAPI.Hubs;

namespace WebAPI.Services.Communication
{
    public class NotificationService : INotificationService
    {
        private readonly ILogger<NotificationService> _logger;
        private readonly IRepository<Notification> _notificationRepository;
        private readonly IHubContext<NotificationHub, INotificationHub> _hubContext;

        public NotificationService(
            ILogger<NotificationService> logger,
            IRepository<Notification> notificationRepository,
            IHubContext<NotificationHub, INotificationHub> hubContext)
        {
            _logger = logger;
            _notificationRepository = notificationRepository;
            _hubContext = hubContext;
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
                CreatedAt = DateTime.UtcNow,
                IsRead = false
            };

            await _notificationRepository.AddAsync(notification, cancellationToken);
            
            _logger.LogInformation("Sending real-time notification to user {UserId}: {Title}", userId, title);

            await _hubContext.Clients.User(userId).ReceiveNotification(new
            {
                notification.Id,
                notification.Title,
                notification.Message,
                notification.CreatedAt,
                notification.IsRead,
                notification.TargetUrl,
                notification.SourceUserId
            });
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
                                   n.Id,
                                   n.Title,
                                   n.Message,
                                   n.CreatedAt,
                                   n.IsRead,
                                   n.TargetUrl
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
            if (notification != null)
            {
                notification.IsRead = true;
                await _notificationRepository.UpdateAsync(notification, cancellationToken);
            }
        }
    }
}
