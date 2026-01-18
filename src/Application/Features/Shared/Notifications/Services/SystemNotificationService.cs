using Application.Features.Shared.Notifications.Interfaces;
using Domain.Entities.Shared.Notifications;
using Domain.Interfaces;
using Microsoft.Extensions.Logging;

namespace Application.Features.Shared.Notifications.Services
{
    public class SystemNotificationService : BaseNotificationService, ISystemNotificationService
    {
        public SystemNotificationService(
            ILogger<BaseNotificationService> logger,
            IRepository<Notification> notificationRepository,
            INotificationHubService hubService)
            : base(logger, notificationRepository, hubService)
        {
        }

        public async Task SendSystemNotificationAsync(string userId, string title, string message, string priority = "Medium", string? targetUrl = null)
        {
            await SendEnhancedNotificationAsync(userId, title, message, "Info", priority, "System", targetUrl);
        }

        public async Task SendSecurityNotificationAsync(string userId, string title, string message, string? targetUrl = null)
        {
            await SendEnhancedNotificationAsync(userId, title, message, "Warning", "High", "Security", targetUrl);
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

        public async Task NotifySystemMaintenanceAsync(DateTime maintenanceTime, string message)
        {
            var notificationMessage = $"System maintenance scheduled for {maintenanceTime:MMM dd, yyyy 'at' HH:mm UTC}. {message}";

            try
            {
                await _hubService.SendSystemBroadcastAsync(notificationMessage);
                _logger.LogInformation("System maintenance notification sent");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send system maintenance notification");
            }
        }

        public async Task NotifySystemUpdateAsync(string version, string updateNotes)
        {
            var message = $"System has been updated to version {version}. {updateNotes}";

            try
            {
                await _hubService.SendSystemBroadcastAsync(message);
                _logger.LogInformation("System update notification sent for version {Version}", version);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send system update notification for version {Version}", version);
            }
        }
    }
}