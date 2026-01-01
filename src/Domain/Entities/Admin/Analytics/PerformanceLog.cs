namespace Domain.Entities.Admin.Analytics;

public class PerformanceLog : BaseEntity
{
    public string Operation { get; set; } = string.Empty;
    public long ExecutionTimeMs { get; set; }
    public long MemoryUsageMb { get; set; }
    public int CpuUsagePercent { get; set; }
    public DateTime Timestamp { get; set; }
    public string? AdditionalMetrics { get; set; }

    // Additional properties expected by Infrastructure
    public long Duration { get; set; } // Alias for ExecutionTimeMs
    public string RequestPath { get; set; } = string.Empty;
    public int StatusCode { get; set; } = 200;
    public long MemoryUsage { get; set; } // Alias for MemoryUsageMb
    public double CpuUsage { get; set; } // Alias for CpuUsagePercent as double
}