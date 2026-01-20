namespace Infrastructure.Common;

public class SearchPerformanceOptions
{
    public const string SectionName = "SearchPerformance";
    
    public int IndexUpdateIntervalMinutes { get; set; } = 60;
    public int SearchCacheExpirationMinutes { get; set; } = 15;
    public bool EnableSearchOptimization { get; set; } = true;
    public int MaxSearchThreads { get; set; } = 10;
    public double SearchTimeoutSeconds { get; set; } = 5.0;
}