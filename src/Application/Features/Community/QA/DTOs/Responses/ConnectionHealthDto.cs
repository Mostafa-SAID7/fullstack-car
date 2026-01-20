namespace Application.Features.Community.QA.DTOs.Responses;

public class ConnectionHealthDto
{
    public string Status { get; set; } = string.Empty;
    public int ActiveConnections { get; set; }
    public int StaleConnections { get; set; }
    public int TotalConnectionsToday { get; set; }
    public int TotalDisconnectionsToday { get; set; }
    public DateTime LastHealthCheck { get; set; }
    public TimeSpan AverageConnectionDuration { get; set; }
    public Dictionary<string, int> GroupCounts { get; set; } = new();
    public List<string> RecentEvents { get; set; } = new();
}