namespace Application.Features.Community.QA.DTOs.Responses;

public class SystemHealthDto
{
    public string Status { get; set; } = string.Empty;
    public double CpuUsage { get; set; }
    public double MemoryUsage { get; set; }
    public double DiskUsage { get; set; }
    public int ActiveConnections { get; set; }
    public TimeSpan Uptime { get; set; }
    public DateTime LastChecked { get; set; }
    public List<string> Warnings { get; set; } = new();
    
    // Additional properties referenced in services
    public DateTime Timestamp { get; set; }
    public long CheckDurationMs { get; set; }
    public HealthMetricsDto? Metrics { get; set; }
    public List<DependencyHealthDto> Dependencies { get; set; } = new();
    public string? Error { get; set; }
}

public class HealthMetricsDto
{
    public double CpuUsage { get; set; }
    public double MemoryUsage { get; set; }
    public double DiskUsage { get; set; }
    public int ActiveConnections { get; set; }
    public int DatabaseConnections { get; set; }
    public double ResponseTime { get; set; }
    public int ErrorRate { get; set; }
}

public class DependencyHealthDto
{
    public string Name { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public double ResponseTime { get; set; }
    public string? Error { get; set; }
}