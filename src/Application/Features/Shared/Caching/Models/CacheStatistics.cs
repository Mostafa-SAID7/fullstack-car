namespace Application.Features.Shared.Caching.Models
{
    public class CacheStatistics
    {
        public long TotalRequests { get; set; }
        public long CacheHits { get; set; }
        public long CacheMisses { get; set; }
        public double HitRatio => TotalRequests > 0 ? (double)CacheHits / TotalRequests : 0;
        public long MemoryCacheSize { get; set; }
        public long DistributedCacheSize { get; set; }
        public DateTime LastUpdated { get; set; } = DateTime.UtcNow;
    }
}
