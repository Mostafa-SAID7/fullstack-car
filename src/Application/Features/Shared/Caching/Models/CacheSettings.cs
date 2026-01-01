namespace Application.Features.Shared.Caching.Models;

public class CacheSettings
{
    public int DefaultExpirationMinutes { get; set; } = 30;
    public int MaxCacheSize { get; set; } = 1000;
    public bool EnableDistributedCache { get; set; } = true;
    public bool EnableMemoryCache { get; set; } = true;
    public string RedisConnectionString { get; set; } = string.Empty;
    public bool EnableCacheStatistics { get; set; } = true;
    public int StatisticsRetentionDays { get; set; } = 7;
    
    // Additional properties needed by cache services
    public bool Enabled { get; set; } = true;
    public bool UseRedis { get; set; } = false;
    public bool EnableTagBasedInvalidation { get; set; } = true;
    public int TagExpirationMinutes { get; set; } = 60;
    public bool CacheRequestsWithQueryParams { get; set; } = false;
    public bool CacheAuthenticatedRequests { get; set; } = false;
    
    // Additional properties expected by Infrastructure
    public int MaxMemoryCacheSize { get; set; } = 100; // MB
    public double CompactionPercentage { get; set; } = 25.0;
    public int ScanFrequencySeconds { get; set; } = 60;
    public string RedisKeyPrefix { get; set; } = "app:";
    public int RedisConnectTimeout { get; set; } = 5000; // milliseconds
}