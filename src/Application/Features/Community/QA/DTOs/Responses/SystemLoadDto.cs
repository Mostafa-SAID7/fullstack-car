namespace Application.Features.Community.QA.DTOs.Responses;

public class SystemLoadDto
{
    public double CpuUsagePercent { get; set; }
    public double MemoryUsagePercent { get; set; }
    public long MemoryUsageMB { get; set; }
    public int ActiveConnections { get; set; }
    public double DatabaseResponseTime { get; set; }
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    
    // Additional properties referenced in services
    public int ActiveThreads { get; set; }
    public int DatabaseConnections { get; set; }
    public int QueuedTasks { get; set; }
}