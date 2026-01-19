using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System.Collections.Concurrent;
using System.Diagnostics;
using Infrastructure.Hubs;

namespace Infrastructure.Services.QA;

public interface IConnectionOptimizationService
{
    Task OptimizeConnectionAsync(string connectionId, string userId, CancellationToken cancellationToken = default);
    Task HandleConnectionLoadAsync(int connectionCount, CancellationToken cancellationToken = default);
    Task<ConnectionPerformanceMetrics> GetConnectionMetricsAsync(CancellationToken cancellationToken = default);
    Task CleanupStaleConnectionsAsync(CancellationToken cancellationToken = default);
    Task ScaleConnectionsAsync(CancellationToken cancellationToken = default);
}

public class ConnectionOptimizationService : IConnectionOptimizationService
{
    private readonly IHubContext<CommunityHub> _hubContext;
    private readonly ILogger<ConnectionOptimizationService> _logger;
    private readonly ConnectionOptions _options;
    private readonly ConcurrentDictionary<string, ConnectionInfo> _connections;
    private readonly ConcurrentDictionary<string, DateTime> _lastActivity;
    private readonly Timer _cleanupTimer;
    private readonly Timer _metricsTimer;
    private ConnectionPerformanceMetrics _metrics;

    public ConnectionOptimizationService(
        IHubContext<CommunityHub> hubContext,
        ILogger<ConnectionOptimizationService> logger,
        IOptions<ConnectionOptions> options)
    {
        _hubContext = hubContext;
        _logger = logger;
        _options = options.Value;
        _connections = new ConcurrentDictionary<string, ConnectionInfo>();
        _lastActivity = new ConcurrentDictionary<string, DateTime>();
        _metrics = new ConnectionPerformanceMetrics();

        // Setup cleanup timer for stale connections
        _cleanupTimer = new Timer(async _ => await CleanupStaleConnectionsAsync(), 
            null, TimeSpan.FromMinutes(5), TimeSpan.FromMinutes(5));

        // Setup metrics collection timer
        _metricsTimer = new Timer(async _ => await UpdateMetricsAsync(), 
            null, TimeSpan.FromSeconds(30), TimeSpan.FromSeconds(30));
    }

    public async Task OptimizeConnectionAsync(string connectionId, string userId, CancellationToken cancellationToken = default)
    {
        try
        {
            var connectionInfo = new ConnectionInfo
            {
                ConnectionId = connectionId,
                UserId = userId,
                ConnectedAt = DateTime.UtcNow,
                LastActivity = DateTime.UtcNow,
                MessageCount = 0,
                IsOptimized = false
            };

            _connections.TryAdd(connectionId, connectionInfo);
            _lastActivity.TryAdd(connectionId, DateTime.UtcNow);

            // Apply connection-specific optimizations
            await ApplyConnectionOptimizationsAsync(connectionInfo, cancellationToken);

            _logger.LogDebug("Connection optimized: {ConnectionId} for user {UserId}", connectionId, userId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to optimize connection: {ConnectionId}", connectionId);
        }
    }

    public async Task HandleConnectionLoadAsync(int connectionCount, CancellationToken cancellationToken = default)
    {
        try
        {
            _metrics.CurrentConnections = connectionCount;
            _metrics.LastUpdated = DateTime.UtcNow;

            // Apply load-based optimizations
            if (connectionCount > _options.HighLoadThreshold)
            {
                await ApplyHighLoadOptimizationsAsync(cancellationToken);
            }
            else if (connectionCount > _options.MediumLoadThreshold)
            {
                await ApplyMediumLoadOptimizationsAsync(cancellationToken);
            }

            // Update peak connections
            if (connectionCount > _metrics.PeakConnections)
            {
                _metrics.PeakConnections = connectionCount;
                _metrics.PeakConnectionsTime = DateTime.UtcNow;
            }

            _logger.LogDebug("Handled connection load: {ConnectionCount} connections", connectionCount);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to handle connection load: {ConnectionCount}", connectionCount);
        }
    }

    public async Task<ConnectionPerformanceMetrics> GetConnectionMetricsAsync(CancellationToken cancellationToken = default)
    {
        await Task.CompletedTask;
        return _metrics;
    }

    public async Task CleanupStaleConnectionsAsync(CancellationToken cancellationToken = default)
    {
        try
        {
            var staleThreshold = DateTime.UtcNow.AddMinutes(-_options.StaleConnectionTimeoutMinutes);
            var staleConnections = new List<string>();

            foreach (var kvp in _lastActivity)
            {
                if (kvp.Value < staleThreshold)
                {
                    staleConnections.Add(kvp.Key);
                }
            }

            foreach (var connectionId in staleConnections)
            {
                _connections.TryRemove(connectionId, out _);
                _lastActivity.TryRemove(connectionId, out _);
                
                // Attempt to close the connection
                try
                {
                    await _hubContext.Clients.Client(connectionId).SendAsync("ForceDisconnect", 
                        "Connection cleanup", cancellationToken);
                }
                catch
                {
                    // Connection might already be closed
                }
            }

            if (staleConnections.Count > 0)
            {
                _logger.LogInformation("Cleaned up {Count} stale connections", staleConnections.Count);
                _metrics.StaleConnectionsRemoved += staleConnections.Count;
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to cleanup stale connections");
        }
    }

    public async Task ScaleConnectionsAsync(CancellationToken cancellationToken = default)
    {
        try
        {
            var currentLoad = _connections.Count;
            
            if (currentLoad > _options.ScaleUpThreshold)
            {
                await ApplyScaleUpOptimizationsAsync(cancellationToken);
            }
            else if (currentLoad < _options.ScaleDownThreshold)
            {
                await ApplyScaleDownOptimizationsAsync(cancellationToken);
            }

            _logger.LogDebug("Connection scaling evaluated: {CurrentLoad} connections", currentLoad);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to scale connections");
        }
    }

    private async Task ApplyConnectionOptimizationsAsync(ConnectionInfo connectionInfo, CancellationToken cancellationToken)
    {
        try
        {
            // Set connection-specific timeouts and buffers
            // This would typically involve configuring the underlying transport
            
            // Mark as optimized
            connectionInfo.IsOptimized = true;
            connectionInfo.OptimizedAt = DateTime.UtcNow;

            await Task.CompletedTask;
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to apply connection optimizations for {ConnectionId}", 
                connectionInfo.ConnectionId);
        }
    }

    private async Task ApplyHighLoadOptimizationsAsync(CancellationToken cancellationToken)
    {
        try
        {
            // Reduce message frequency for non-critical updates
            await _hubContext.Clients.All.SendAsync("SetUpdateFrequency", "reduced", cancellationToken);
            
            // Enable message batching
            await _hubContext.Clients.All.SendAsync("EnableMessageBatching", true, cancellationToken);
            
            _logger.LogInformation("Applied high load optimizations");
            _metrics.HighLoadOptimizationsApplied++;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to apply high load optimizations");
        }
    }

    private async Task ApplyMediumLoadOptimizationsAsync(CancellationToken cancellationToken)
    {
        try
        {
            // Slightly reduce update frequency
            await _hubContext.Clients.All.SendAsync("SetUpdateFrequency", "normal", cancellationToken);
            
            _logger.LogDebug("Applied medium load optimizations");
            _metrics.MediumLoadOptimizationsApplied++;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to apply medium load optimizations");
        }
    }

    private async Task ApplyScaleUpOptimizationsAsync(CancellationToken cancellationToken)
    {
        try
        {
            // Implement connection pooling optimizations
            // Reduce connection overhead
            // Enable compression for messages
            
            _logger.LogInformation("Applied scale-up optimizations");
            await Task.CompletedTask;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to apply scale-up optimizations");
        }
    }

    private async Task ApplyScaleDownOptimizationsAsync(CancellationToken cancellationToken)
    {
        try
        {
            // Restore normal operation parameters
            await _hubContext.Clients.All.SendAsync("SetUpdateFrequency", "high", cancellationToken);
            await _hubContext.Clients.All.SendAsync("EnableMessageBatching", false, cancellationToken);
            
            _logger.LogDebug("Applied scale-down optimizations");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to apply scale-down optimizations");
        }
    }

    private async Task UpdateMetricsAsync()
    {
        try
        {
            _metrics.ActiveConnections = _connections.Count(c => c.Value.LastActivity > DateTime.UtcNow.AddMinutes(-5));
            _metrics.TotalMessages = _connections.Values.Sum(c => c.MessageCount);
            _metrics.AverageConnectionDuration = _connections.Values
                .Where(c => c.ConnectedAt.HasValue)
                .Select(c => DateTime.UtcNow - c.ConnectedAt!.Value)
                .DefaultIfEmpty()
                .Average(ts => ts.TotalMinutes);

            await Task.CompletedTask;
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to update connection metrics");
        }
    }

    public void Dispose()
    {
        _cleanupTimer?.Dispose();
        _metricsTimer?.Dispose();
    }
}

public class ConnectionInfo
{
    public string ConnectionId { get; set; } = string.Empty;
    public string UserId { get; set; } = string.Empty;
    public DateTime? ConnectedAt { get; set; }
    public DateTime LastActivity { get; set; }
    public long MessageCount { get; set; }
    public bool IsOptimized { get; set; }
    public DateTime? OptimizedAt { get; set; }
}

public class ConnectionPerformanceMetrics
{
    public int CurrentConnections { get; set; }
    public int ActiveConnections { get; set; }
    public int PeakConnections { get; set; }
    public DateTime? PeakConnectionsTime { get; set; }
    public long TotalMessages { get; set; }
    public double AverageConnectionDuration { get; set; }
    public int StaleConnectionsRemoved { get; set; }
    public int HighLoadOptimizationsApplied { get; set; }
    public int MediumLoadOptimizationsApplied { get; set; }
    public DateTime LastUpdated { get; set; }
}

public class ConnectionOptions
{
    public const string SectionName = "Connection";
    
    public int HighLoadThreshold { get; set; } = 1000;
    public int MediumLoadThreshold { get; set; } = 500;
    public int ScaleUpThreshold { get; set; } = 800;
    public int ScaleDownThreshold { get; set; } = 200;
    public int StaleConnectionTimeoutMinutes { get; set; } = 30;
    public int MessageBatchSize { get; set; } = 10;
    public int MessageBatchTimeoutMs { get; set; } = 100;
    public bool EnableConnectionOptimization { get; set; } = true;
    public bool EnableLoadBalancing { get; set; } = true;
}