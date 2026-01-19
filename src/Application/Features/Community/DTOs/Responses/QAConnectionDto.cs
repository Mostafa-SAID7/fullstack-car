namespace Application.Features.Community.QA.DTOs.Responses;

/// <summary>
/// DTO for active connection information
/// </summary>
public class ActiveConnectionDto
{
    public string ConnectionId { get; set; } = string.Empty;
    public Guid UserId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public DateTime ConnectedAt { get; set; }
    public DateTime LastActivity { get; set; }
    public string UserAgent { get; set; } = string.Empty;
    public string Status { get; set; } = "Connected"; // "Connected", "Reconnecting", "Disconnected"
    public List<string> JoinedGroups { get; set; } = new();
    public int MessagesSent { get; set; } = 0;
    public int MessagesReceived { get; set; } = 0;
}

/// <summary>
/// DTO for connection health monitoring
/// </summary>
public class ConnectionHealthDto
{
    public string Status { get; set; } = string.Empty; // "Healthy", "Warning", "Critical", "No Connections"
    public int ActiveConnections { get; set; }
    public int StaleConnections { get; set; }
    public int TotalConnectionsToday { get; set; }
    public int TotalDisconnectionsToday { get; set; }
    public DateTime LastHealthCheck { get; set; }
    public TimeSpan AverageConnectionDuration { get; set; }
    public Dictionary<string, int> GroupCounts { get; set; } = new();
    public List<ConnectionEventDto> RecentEvents { get; set; } = new();
}

/// <summary>
/// DTO for connection events (connect, disconnect, errors)
/// </summary>
public class ConnectionEventDto
{
    public string EventType { get; set; } = string.Empty; // "Connected", "Disconnected", "Error", "Reconnected"
    public string ConnectionId { get; set; } = string.Empty;
    public Guid UserId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public string? Details { get; set; }
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
}

/// <summary>
/// DTO for connection reliability metrics
/// </summary>
public class ConnectionReliabilityDto
{
    public double ConnectionSuccessRate { get; set; } // Percentage of successful connections
    public double ReconnectionSuccessRate { get; set; } // Percentage of successful reconnections
    public TimeSpan AverageReconnectionTime { get; set; }
    public int TotalReconnectionAttempts { get; set; }
    public int FailedReconnectionAttempts { get; set; }
    public List<string> CommonDisconnectionReasons { get; set; } = new();
    public DateTime LastCalculated { get; set; } = DateTime.UtcNow;
}

/// <summary>
/// DTO for connection error information
/// </summary>
public class ConnectionErrorDto
{
    public string ErrorType { get; set; } = string.Empty; // "ConnectionFailed", "ReconnectionFailed", "Timeout"
    public string ErrorMessage { get; set; } = string.Empty;
    public string? StackTrace { get; set; }
    public Guid? UserId { get; set; }
    public string? ConnectionId { get; set; }
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    public int RetryAttempt { get; set; } = 0;
    public bool IsRecoverable { get; set; } = true;
}

/// <summary>
/// DTO for fallback mechanism status
/// </summary>
public class FallbackStatusDto
{
    public bool IsActive { get; set; }
    public string FallbackType { get; set; } = string.Empty; // "Polling", "WebSocket", "None"
    public string Reason { get; set; } = string.Empty;
    public DateTime ActivatedAt { get; set; }
    public int FallbackAttempts { get; set; }
    public bool CanReturnToSignalR { get; set; }
}