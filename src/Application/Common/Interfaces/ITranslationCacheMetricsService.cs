namespace Application.Common.Interfaces;

public interface ITranslationCacheMetricsService
{
    void RecordCacheHit(string cacheLevel, string culture, string feature);
    void RecordCacheMiss(string cacheLevel, string culture, string feature);
    void RecordCacheLoadTime(string culture, string feature, TimeSpan loadTime);
    Task<TranslationCacheMetrics> GetMetricsAsync(CancellationToken cancellationToken = default);
    Task ResetMetricsAsync(CancellationToken cancellationToken = default);
}

public class TranslationCacheMetrics
{
    public DateTime StartTime { get; set; }
    public DateTime LastUpdated { get; set; }
    public long TotalRequests { get; set; }
    public long MemoryCacheHits { get; set; }
    public long DistributedCacheHits { get; set; }
    public long CacheMisses { get; set; }
    public double MemoryCacheHitRate => TotalRequests > 0 ? (double)MemoryCacheHits / TotalRequests * 100 : 0;
    public double DistributedCacheHitRate => TotalRequests > 0 ? (double)DistributedCacheHits / TotalRequests * 100 : 0;
    public double OverallCacheHitRate => TotalRequests > 0 ? (double)(MemoryCacheHits + DistributedCacheHits) / TotalRequests * 100 : 0;
    public TimeSpan AverageLoadTime { get; set; }
    public Dictionary<string, CultureMetrics> CultureMetrics { get; set; } = new();
    public Dictionary<string, FeatureMetrics> FeatureMetrics { get; set; } = new();
}

public class CultureMetrics
{
    public string Culture { get; set; } = string.Empty;
    public long Requests { get; set; }
    public long Hits { get; set; }
    public long Misses { get; set; }
    public double HitRate => Requests > 0 ? (double)Hits / Requests * 100 : 0;
    public TimeSpan AverageLoadTime { get; set; }
}

public class FeatureMetrics
{
    public string Feature { get; set; } = string.Empty;
    public long Requests { get; set; }
    public long Hits { get; set; }
    public long Misses { get; set; }
    public double HitRate => Requests > 0 ? (double)Hits / Requests * 100 : 0;
    public TimeSpan AverageLoadTime { get; set; }
}