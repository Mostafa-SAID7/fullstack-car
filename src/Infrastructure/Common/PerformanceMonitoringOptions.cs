namespace Infrastructure.Common;

public class PerformanceMonitoringOptions
{
    public const string SectionName = "PerformanceMonitoring";
    
    public bool EnableMonitoring { get; set; } = true;
    public int MetricsCollectionIntervalSeconds { get; set; } = 60;
    public int MetricsRetentionDays { get; set; } = 30;
    public bool EnableAlerts { get; set; } = true;
    public double CpuThreshold { get; set; } = 80.0;
    public double MemoryThreshold { get; set; } = 85.0;
}