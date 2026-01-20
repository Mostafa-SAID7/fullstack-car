namespace Infrastructure.Common;

public class ConnectionOptions
{
    public const string SectionName = "Connection";
    
    public int MaxConnections { get; set; } = 1000;
    public int ConnectionTimeoutSeconds { get; set; } = 30;
    public int HeartbeatIntervalSeconds { get; set; } = 30;
    public int DisconnectTimeoutSeconds { get; set; } = 60;
    public bool EnableConnectionLogging { get; set; } = false;
}