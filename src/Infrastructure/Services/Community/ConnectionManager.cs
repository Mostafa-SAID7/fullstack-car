using Application.Features.Community.QA.DTOs.Responses;
using Application.Features.Community.QA.Interfaces;
using Infrastructure.Hubs;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System.Collections.Concurrent;

namespace Infrastructure.Services.QA;

/// <summary>
/// Unified connection management service for QA SignalR Hub
/// Provides automatic reconnection handling, connection monitoring, and health checks
/// Serves both Angular and React clients with common reliability features
/// </summary>
public interface IConnectionManager
{
    Task<ConnectionHealthDto> GetConnectionHealthAsync();
    Task<List<ActiveConnectionDto>> GetActiveConnectionsAsync();
    Task DisconnectUserAsync(Guid userId, string reason);
    Task BroadcastSystemMessageAsync(string message, string level = "info");
    Task<bool> IsUserConnectedAsync(Guid userId);
    Task<int> GetActiveConnectionCountAsync();
    Task<Dictionary<string, int>> GetConnectionStatsByGroupAsync();
    Task CleanupStaleConnectionsAsync();
    
    // Connection tracking methods used by CommunityHub
    void TrackConnection(string connectionId, Guid userId, string userName, string userAgent = "");
    void TrackDisconnection(string connectionId, string reason = "");
    void TrackGroupJoin(string connectionId, string groupName);
    void TrackGroupLeave(string connectionId, string groupName);
    void UpdateConnectionActivity(string connectionId);
}

public class ConnectionManager : BackgroundService, IConnectionManager
{
    private readonly IHubContext<CommunityHub, ICommunityHub> _hubContext;
    private readonly IHubService _hubService;
    private readonly ILogger<ConnectionManager> _logger;
    
    // Connection tracking
    private readonly ConcurrentDictionary<string, ActiveConnectionDto> _activeConnections = new();
    private readonly ConcurrentDictionary<Guid, HashSet<string>> _userConnections = new();
    private readonly ConcurrentDictionary<string, HashSet<string>> _groupConnections = new();
    
    // Health monitoring
    private readonly Timer _healthCheckTimer;
    private readonly Timer _cleanupTimer;
    private DateTime _lastHealthCheck = DateTime.UtcNow;
    private int _totalConnectionsToday = 0;
    private int _totalDisconnectionsToday = 0;
    private readonly ConcurrentQueue<ConnectionEventDto> _recentEvents = new();
 
    public ConnectionManager(
        IHubContext<CommunityHub, ICommunityHub> hubContext,
        IHubService hubService,
        ILogger<ConnectionManager> logger)
    {
        _hubContext = hubContext;
        _hubService = hubService;
        _logger = logger;
        
        // Initialize health check timer (every 30 seconds)
        _healthCheckTimer = new Timer(PerformHealthCheck, null, TimeSpan.FromSeconds(30), TimeSpan.FromSeconds(30));
        
        // Initialize cleanup timer (every 5 minutes)
        _cleanupTimer = new Timer(PerformCleanup, null, TimeSpan.FromMinutes(5), TimeSpan.FromMinutes(5));
    }

    #region Connection Tracking

    public void TrackConnection(string connectionId, Guid userId, string userName, string userAgent = "")
    {
        var connection = new ActiveConnectionDto
        {
            ConnectionId = connectionId,
            UserId = userId,
            UserName = userName,
            ConnectedAt = DateTime.UtcNow,
            LastActivity = DateTime.UtcNow,
            UserAgent = userAgent,
            Status = "Connected"
        };

        _activeConnections.TryAdd(connectionId, connection);
        
        // Track user connections
        _userConnections.AddOrUpdate(userId, 
            new HashSet<string> { connectionId },
            (key, existing) => { existing.Add(connectionId); return existing; });

        _totalConnectionsToday++;
        
        LogConnectionEvent("Connected", connectionId, userId, userName);
        
        _logger.LogInformation("Community Connection Manager: User {UserName} ({UserId}) connected with {ConnectionId}", 
            userName, userId, connectionId);
    }

    public void TrackDisconnection(string connectionId, string reason = "")
    {
        if (_activeConnections.TryRemove(connectionId, out var connection))
        {
            // Remove from user connections
            if (_userConnections.TryGetValue(connection.UserId, out var userConnections))
            {
                userConnections.Remove(connectionId);
                if (userConnections.Count == 0)
                {
                    _userConnections.TryRemove(connection.UserId, out _);
                }
            }

            // Remove from group connections
            foreach (var groupConnections in _groupConnections.Values)
            {
                groupConnections.Remove(connectionId);
            }

            _totalDisconnectionsToday++;
            
            LogConnectionEvent("Disconnected", connectionId, connection.UserId, connection.UserName, reason);
            
            _logger.LogInformation("Community Connection Manager: User {UserName} ({UserId}) disconnected from {ConnectionId}. Reason: {Reason}", 
                connection.UserName, connection.UserId, connectionId, reason);
        }
    }

    public void TrackGroupJoin(string connectionId, string groupName)
    {
        _groupConnections.AddOrUpdate(groupName,
            new HashSet<string> { connectionId },
            (key, existing) => { existing.Add(connectionId); return existing; });

        if (_activeConnections.TryGetValue(connectionId, out var connection))
        {
            connection.JoinedGroups.Add(groupName);
            connection.LastActivity = DateTime.UtcNow;
        }

        _logger.LogDebug("Community Connection Manager: Connection {ConnectionId} joined group {GroupName}", 
            connectionId, groupName);
    }

    public void TrackGroupLeave(string connectionId, string groupName)
    {
        if (_groupConnections.TryGetValue(groupName, out var connections))
        {
            connections.Remove(connectionId);
            if (connections.Count == 0)
            {
                _groupConnections.TryRemove(groupName, out _);
            }
        }

        if (_activeConnections.TryGetValue(connectionId, out var connection))
        {
            connection.JoinedGroups.Remove(groupName);
            connection.LastActivity = DateTime.UtcNow;
        }

        _logger.LogDebug("Community Connection Manager: Connection {ConnectionId} left group {GroupName}", 
            connectionId, groupName);
    }

    public void UpdateConnectionActivity(string connectionId)
    {
        if (_activeConnections.TryGetValue(connectionId, out var connection))
        {
            connection.LastActivity = DateTime.UtcNow;
        }
    }

    #endregion

    #region Public Interface

    public async Task<ConnectionHealthDto> GetConnectionHealthAsync()
    {
        var now = DateTime.UtcNow;
        var activeCount = _activeConnections.Count;
        var staleConnections = _activeConnections.Values
            .Count(c => now - c.LastActivity > TimeSpan.FromMinutes(10));

        var health = new ConnectionHealthDto
        {
            Status = activeCount > 0 ? "Healthy" : "No Connections",
            ActiveConnections = activeCount,
            StaleConnections = staleConnections,
            TotalConnectionsToday = _totalConnectionsToday,
            TotalDisconnectionsToday = _totalDisconnectionsToday,
            LastHealthCheck = _lastHealthCheck,
            AverageConnectionDuration = CalculateAverageConnectionDuration(),
            GroupCounts = _groupConnections.ToDictionary(
                kvp => kvp.Key, 
                kvp => kvp.Value.Count),
            RecentEvents = _recentEvents.TakeLast(10).ToList()
        };

        return await Task.FromResult(health);
    }

    public async Task<List<ActiveConnectionDto>> GetActiveConnectionsAsync()
    {
        return await Task.FromResult(_activeConnections.Values.ToList());
    }

    public async Task DisconnectUserAsync(Guid userId, string reason)
    {
        if (_userConnections.TryGetValue(userId, out var connectionIds))
        {
            foreach (var connectionId in connectionIds.ToList())
            {
                try
                {
                    await _hubContext.Clients.Client(connectionId)
                        .ReceiveConnectionStatus(new ConnectionStatusDto
                        {
                            Status = "Disconnected",
                            Message = reason,
                            Timestamp = DateTime.UtcNow
                        });

                    // Force disconnect
                    // Note: This would require access to the Hub context's connection manager
                    // For now, we'll just track the disconnection
                    TrackDisconnection(connectionId, reason);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Community Connection Manager: Failed to disconnect user {UserId} from connection {ConnectionId}", 
                        userId, connectionId);
                }
            }
        }

        _logger.LogInformation("Community Connection Manager: Disconnected user {UserId}. Reason: {Reason}", 
            userId, reason);
    }

    public async Task BroadcastSystemMessageAsync(string message, string level = "info")
    {
        try
        {
            var systemMessage = new ConnectionStatusDto
            {
                Status = "SystemMessage",
                Message = message,
                Timestamp = DateTime.UtcNow
            };

            await _hubContext.Clients.All.ReceiveConnectionStatus(systemMessage);
            
            _logger.LogInformation("Community Connection Manager: Broadcasted system message: {Message}", message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Community Connection Manager: Failed to broadcast system message");
            throw;
        }
    }

    public async Task<bool> IsUserConnectedAsync(Guid userId)
    {
        return await Task.FromResult(_userConnections.ContainsKey(userId));
    }

    public async Task<int> GetActiveConnectionCountAsync()
    {
        return await Task.FromResult(_activeConnections.Count);
    }

    public async Task<Dictionary<string, int>> GetConnectionStatsByGroupAsync()
    {
        return await Task.FromResult(_groupConnections.ToDictionary(
            kvp => kvp.Key, 
            kvp => kvp.Value.Count));
    }

    public async Task CleanupStaleConnectionsAsync()
    {
        var now = DateTime.UtcNow;
        var staleThreshold = TimeSpan.FromMinutes(15);
        var staleConnections = _activeConnections.Values
            .Where(c => now - c.LastActivity > staleThreshold)
            .ToList();

        foreach (var connection in staleConnections)
        {
            TrackDisconnection(connection.ConnectionId, "Stale connection cleanup");
        }

        if (staleConnections.Any())
        {
            _logger.LogInformation("Community Connection Manager: Cleaned up {Count} stale connections", 
                staleConnections.Count);
        }

        await Task.CompletedTask;
    }

    #endregion

    #region Background Service

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("Community Connection Manager background service started");

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                // Perform periodic health monitoring
                await MonitorConnectionHealthAsync();
                
                // Wait for 1 minute before next check
                await Task.Delay(TimeSpan.FromMinutes(1), stoppingToken);
            }
            catch (OperationCanceledException)
            {
                // Expected when cancellation is requested
                break;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Community Connection Manager: Error in background monitoring");
                await Task.Delay(TimeSpan.FromSeconds(30), stoppingToken);
            }
        }

        _logger.LogInformation("Community Connection Manager background service stopped");
    }

    private async Task MonitorConnectionHealthAsync()
    {
        var health = await GetConnectionHealthAsync();
        
        // Log health status
        _logger.LogDebug("Community Connection Manager Health: {ActiveConnections} active, {StaleConnections} stale", 
            health.ActiveConnections, health.StaleConnections);

        // Alert on high stale connection count
        if (health.StaleConnections > health.ActiveConnections * 0.2) // More than 20% stale
        {
            _logger.LogWarning("Community Connection Manager: High stale connection count detected: {StaleConnections}/{ActiveConnections}", 
                health.StaleConnections, health.ActiveConnections);
            
            await CleanupStaleConnectionsAsync();
        }

        // Broadcast health status to moderators
        if (health.ActiveConnections > 100) // Only for high-traffic scenarios
        {
            await _hubContext.Clients.Group("moderators")
                .ReceiveConnectionStatus(new ConnectionStatusDto
                {
                    Status = "HealthUpdate",
                    Message = $"Active connections: {health.ActiveConnections}",
                    ActiveConnections = health.ActiveConnections,
                    Timestamp = DateTime.UtcNow
                });
        }
    }

    #endregion

    #region Timer Callbacks

    private async void PerformHealthCheck(object? state)
    {
        try
        {
            _lastHealthCheck = DateTime.UtcNow;
            await MonitorConnectionHealthAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Community Connection Manager: Error during health check");
        }
    }

    private async void PerformCleanup(object? state)
    {
        try
        {
            await CleanupStaleConnectionsAsync();
            CleanupOldEvents();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Community Connection Manager: Error during cleanup");
        }
    }

    #endregion

    #region Helper Methods

    private void LogConnectionEvent(string eventType, string connectionId, Guid userId, string userName, string? details = null)
    {
        var connectionEvent = new ConnectionEventDto
        {
            EventType = eventType,
            ConnectionId = connectionId,
            UserId = userId,
            UserName = userName,
            Details = details,
            Timestamp = DateTime.UtcNow
        };

        _recentEvents.Enqueue(connectionEvent);
        
        // Keep only last 100 events
        while (_recentEvents.Count > 100)
        {
            _recentEvents.TryDequeue(out _);
        }
    }

    private TimeSpan CalculateAverageConnectionDuration()
    {
        var now = DateTime.UtcNow;
        var durations = _activeConnections.Values
            .Select(c => now - c.ConnectedAt)
            .ToList();

        if (!durations.Any())
            return TimeSpan.Zero;

        var totalTicks = durations.Sum(d => d.Ticks);
        return new TimeSpan(totalTicks / durations.Count);
    }

    private void CleanupOldEvents()
    {
        // Remove events older than 24 hours
        var cutoff = DateTime.UtcNow.AddHours(-24);
        var eventsToKeep = new Queue<ConnectionEventDto>();
        
        while (_recentEvents.TryDequeue(out var evt))
        {
            if (evt.Timestamp > cutoff)
            {
                eventsToKeep.Enqueue(evt);
            }
        }

        // Re-add the events we want to keep
        while (eventsToKeep.TryDequeue(out var evt))
        {
            _recentEvents.Enqueue(evt);
        }
    }

    #endregion

    #region Disposal

    public override void Dispose()
    {
        _healthCheckTimer?.Dispose();
        _cleanupTimer?.Dispose();
        base.Dispose();
    }

    #endregion
}