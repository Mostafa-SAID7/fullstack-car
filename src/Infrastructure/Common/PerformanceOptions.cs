namespace Infrastructure.Common;

public class PerformanceOptions
{
    public const string SectionName = "Performance";
    
    public int QueryTimeoutSeconds { get; set; } = 30;
    public int MaxConcurrentQueries { get; set; } = 100;
    public bool EnableQueryOptimization { get; set; } = true;
    public bool EnableConnectionPooling { get; set; } = true;
    public int ConnectionPoolSize { get; set; } = 50;
}