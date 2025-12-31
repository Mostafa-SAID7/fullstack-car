namespace Infrastructure.Common
{
    public class CacheSettings
    {
        public bool Enabled { get; set; } = true;
        public string RedisConnectionString { get; set; } = string.Empty;
        public int DefaultExpirationMinutes { get; set; } = 60;
        public bool UseRedis { get; set; } = false;
        
        // Advanced caching settings
        public bool EnableResponseCaching { get; set; } = true;
        public bool EnableOutputCaching { get; set; } = true;
        public bool EnableMemoryCache { get; set; } = true;
        public bool EnableDistributedCache { get; set; } = true;
        
        // Cache invalidation settings
        public bool EnableTagBasedInvalidation { get; set; } = true;
        public int TagExpirationMinutes { get; set; } = 1440; // 24 hours
        
        // Performance settings
        public int MaxMemoryCacheSize { get; set; } = 100; // MB
        public int CompactionPercentage { get; set; } = 25;
        public int ScanFrequencySeconds { get; set; } = 60;
        
        // Redis specific settings
        public int RedisDatabase { get; set; } = 0;
        public string RedisKeyPrefix { get; set; } = "CommunityCarApp:";
        public int RedisConnectTimeout { get; set; } = 5000;
        public int RedisCommandTimeout { get; set; } = 5000;
        
        // Response caching settings
        public int ResponseCacheMaxAge { get; set; } = 300; // 5 minutes
        public bool ResponseCacheVaryByQueryKeys { get; set; } = true;
        public string[] ResponseCacheVaryByHeaders { get; set; } = { "Accept-Language", "Authorization" };
        
        // Output caching settings
        public int OutputCacheDefaultExpiration { get; set; } = 60; // 1 minute
        public bool OutputCacheVaryByUser { get; set; } = true;
        public bool OutputCacheVaryByRole { get; set; } = true;
    }
}
