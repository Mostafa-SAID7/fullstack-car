using Application.Features.Shared.Notifications.Interfaces;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using Infrastructure.Hubs;

namespace Infrastructure.Services.Notifications;

public class NotificationHubService : INotificationHubService
{
    private readonly IHubContext<NotificationHub> _hubContext;
    private readonly ILogger<NotificationHubService> _logger;

    public NotificationHubService(
        IHubContext<NotificationHub> hubContext,
        ILogger<NotificationHubService> logger)
    {
        _hubContext = hubContext;
        _logger = logger;
    }

    public async Task SendNotificationToUserAsync(string userId, object notification)
    {
        try
        {
            await _hubContext.Clients.Group($"user_{userId}")
                .SendAsync("ReceiveNotification", notification);
            
            _logger.LogInformation("Sent notification to user {UserId}", userId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send notification to user {UserId}", userId);
            throw;
        }
    }

    public async Task SendNotificationToGroupAsync(string groupName, object notification)
    {
        try
        {
            await _hubContext.Clients.Group(groupName)
                .SendAsync("ReceiveNotification", notification);
            
            _logger.LogInformation("Sent notification to group {GroupName}", groupName);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send notification to group {GroupName}", groupName);
            throw;
        }
    }

    public async Task SendSystemBroadcastAsync(string message)
    {
        try
        {
            await _hubContext.Clients.All
                .SendAsync("ReceiveSystemNotification", message);
            
            _logger.LogInformation("Sent system broadcast: {Message}", message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send system broadcast");
            throw;
        }
    }

    public async Task SendNotificationToAllAsync(object notification)
    {
        try
        {
            await _hubContext.Clients.All
                .SendAsync("ReceiveNotification", notification);
            
            _logger.LogInformation("Sent notification to all users");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send notification to all users");
            throw;
        }
    }
}