namespace Domain.Entities.Admin.Analytics;

public class PerformanceLog : BaseEntity
{
    public string Operation { get; set; } = string.Empty;
    public long ExecutionTimeMs { get; set; }
    public long MemoryUsageMb { get; set; }
    public int CpuUsagePercent { get; set; }
    public DateTime Timestamp { get; set; }
    public string? AdditionalMetrics { get; set; }
}