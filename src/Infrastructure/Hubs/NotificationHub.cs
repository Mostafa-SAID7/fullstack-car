using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using System.Security.Claims;

namespace Infrastructure.Hubs;

/// <summary>
/// SignalR Hub for real-time notification delivery
/// </summary>
public class NotificationHub : Hub
{
    private readonly ILogger<NotificationHub> _logger;

    public NotificationHub(ILogger<NotificationHub> logger)
    {
        _logger = logger;
    }

    /// <summary>
    /// Join a user-specific group for receiving notifications
    /// </summary>
    [Authorize]
    public async Task JoinUserGroup(string userId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, $"user_{userId}");
        _logger.LogInformation("User {UserId} joined notification group (Connection: {ConnectionId})", userId, Context.ConnectionId);
    }

    /// <summary>
    /// Leave a user-specific group
    /// </summary>
    [Authorize]
    public async Task LeaveUserGroup(string userId)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"user_{userId}");
        _logger.LogInformation("User {UserId} left notification group (Connection: {ConnectionId})", userId, Context.ConnectionId);
    }

    /// <summary>
    /// Join a priority-based group for high-priority notifications
    /// </summary>
    [Authorize]
    public async Task JoinPriorityGroup(string priority)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, $"priority_{priority.ToLower()}");
        _logger.LogInformation("Connection {ConnectionId} joined priority group: {Priority}", Context.ConnectionId, priority);
    }

    /// <summary>
    /// Leave a priority-based group
    /// </summary>
    [Authorize]
    public async Task LeavePriorityGroup(string priority)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"priority_{priority.ToLower()}");
        _logger.LogInformation("Connection {ConnectionId} left priority group: {Priority}", Context.ConnectionId, priority);
    }

    /// <summary>
    /// Send notification acknowledgment from client
    /// </summary>
    [Authorize]
    public async Task AcknowledgeNotification(string notificationId)
    {
        var userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        _logger.LogInformation("User {UserId} acknowledged notification {NotificationId}", userId, notificationId);
        
        // Notify other clients of the same user that notification was acknowledged
        if (!string.IsNullOrEmpty(userId))
        {
            await Clients.OthersInGroup($"user_{userId}").SendAsync("NotificationAcknowledged", notificationId);
        }
    }

    /// <summary>
    /// Called when a client connects
    /// </summary>
    public override async Task OnConnectedAsync()
    {
        var userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        
        if (!string.IsNullOrEmpty(userId))
        {
            // Automatically join user's personal group
            await Groups.AddToGroupAsync(Context.ConnectionId, $"user_{userId}");
            _logger.LogInformation("User {UserId} connected to NotificationHub (Connection: {ConnectionId})", userId, Context.ConnectionId);
            
            // Notify user of successful connection
            await Clients.Caller.SendAsync("Connected", new { userId, connectionId = Context.ConnectionId });
        }
        else
        {
            _logger.LogWarning("Anonymous connection to NotificationHub (Connection: {ConnectionId})", Context.ConnectionId);
        }

        await base.OnConnectedAsync();
    }

    /// <summary>
    /// Called when a client disconnects
    /// </summary>
    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        
        if (!string.IsNullOrEmpty(userId))
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"user_{userId}");
            
            if (exception != null)
            {
                _logger.LogWarning(exception, "User {UserId} disconnected from NotificationHub with error (Connection: {ConnectionId})", userId, Context.ConnectionId);
            }
            else
            {
                _logger.LogInformation("User {UserId} disconnected from NotificationHub (Connection: {ConnectionId})", userId, Context.ConnectionId);
            }
        }

        await base.OnDisconnectedAsync(exception);
    }

    /// <summary>
    /// Ping method for connection health check
    /// </summary>
    public async Task Ping()
    {
        await Clients.Caller.SendAsync("Pong", DateTime.UtcNow);
    }
}
