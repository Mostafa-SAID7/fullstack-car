using Application.Common.Interfaces;
using System.Collections.Concurrent;

namespace Infrastructure.Services;

public class TranslationCacheMetricsService : ITranslationCacheMetricsService
{
    private readonly object _lock = new();
    private DateTime _startTime = DateTime.UtcNow;
    private long _totalRequests = 0;
    private long _memoryCacheHits = 0;
    private long _distributedCacheHits = 0;
    private long _cacheMisses = 0;
    private readonly ConcurrentDictionary<string, CultureMetrics> _cultureMetrics = new();
    private readonly ConcurrentDictionary<string, FeatureMetrics> _featureMetrics = new();
    private readonly ConcurrentQueue<TimeSpan> _loadTimes = new();
    private const int MaxLoadTimeSamples = 1000;

    public void RecordCacheHit(string cacheLevel, string culture, string feature)
    {
        lock (_lock)
        {
            Interlocked.Increment(ref _totalRequests);
            
            switch (cacheLevel.ToLowerInvariant())
            {
                case "memory":
                    Interlocked.Increment(ref _memoryCacheHits);
                    break;
                case "distributed":
                case "redis":
                    Interlocked.Increment(ref _distributedCacheHits);
                    break;
            }

            UpdateCultureMetrics(culture, true);
            UpdateFeatureMetrics(feature, true);
        }
    }

    public void RecordCacheMiss(string cacheLevel, string culture, string feature)
    {
        lock (_lock)
        {
            Interlocked.Increment(ref _totalRequests);
            Interlocked.Increment(ref _cacheMisses);

            UpdateCultureMetrics(culture, false);
            UpdateFeatureMetrics(feature, false);
        }
    }

    public void RecordCacheLoadTime(string culture, string feature, TimeSpan loadTime)
    {
        _loadTimes.Enqueue(loadTime);
        
        // Keep only the most recent samples
        while (_loadTimes.Count > MaxLoadTimeSamples)
        {
            _loadTimes.TryDequeue(out _);
        }

        // Update culture-specific load time
        _cultureMetrics.AddOrUpdate(culture, 
            new CultureMetrics { Culture = culture, AverageLoadTime = loadTime },
            (key, existing) => 
            {
                var totalTime = existing.AverageLoadTime.TotalMilliseconds * (existing.Requests - 1) + loadTime.TotalMilliseconds;
                existing.AverageLoadTime = TimeSpan.FromMilliseconds(totalTime / existing.Requests);
                return existing;
            });

        // Update feature-specific load time
        _featureMetrics.AddOrUpdate(feature,
            new FeatureMetrics { Feature = feature, AverageLoadTime = loadTime },
            (key, existing) =>
            {
                var totalTime = existing.AverageLoadTime.TotalMilliseconds * (existing.Requests - 1) + loadTime.TotalMilliseconds;
                existing.AverageLoadTime = TimeSpan.FromMilliseconds(totalTime / existing.Requests);
                return existing;
            });
    }

    public Task<TranslationCacheMetrics> GetMetricsAsync(CancellationToken cancellationToken = default)
    {
        var averageLoadTime = TimeSpan.Zero;
        if (_loadTimes.Count > 0)
        {
            var totalMs = _loadTimes.Sum(t => t.TotalMilliseconds);
            averageLoadTime = TimeSpan.FromMilliseconds(totalMs / _loadTimes.Count);
        }

        var metrics = new TranslationCacheMetrics
        {
            StartTime = _startTime,
            LastUpdated = DateTime.UtcNow,
            TotalRequests = _totalRequests,
            MemoryCacheHits = _memoryCacheHits,
            DistributedCacheHits = _distributedCacheHits,
            CacheMisses = _cacheMisses,
            AverageLoadTime = averageLoadTime,
            CultureMetrics = new Dictionary<string, CultureMetrics>(_cultureMetrics),
            FeatureMetrics = new Dictionary<string, FeatureMetrics>(_featureMetrics)
        };

        return Task.FromResult(metrics);
    }

    public Task ResetMetricsAsync(CancellationToken cancellationToken = default)
    {
        lock (_lock)
        {
            _startTime = DateTime.UtcNow;
            _totalRequests = 0;
            _memoryCacheHits = 0;
            _distributedCacheHits = 0;
            _cacheMisses = 0;
            _cultureMetrics.Clear();
            _featureMetrics.Clear();
            
            // Clear load times
            while (_loadTimes.TryDequeue(out _)) { }
        }

        return Task.CompletedTask;
    }

    private void UpdateCultureMetrics(string culture, bool isHit)
    {
        _cultureMetrics.AddOrUpdate(culture,
            new CultureMetrics 
            { 
                Culture = culture, 
                Requests = 1, 
                Hits = isHit ? 1 : 0, 
                Misses = isHit ? 0 : 1 
            },
            (key, existing) =>
            {
                existing.Requests++;
                if (isHit)
                    existing.Hits++;
                else
                    existing.Misses++;
                return existing;
            });
    }

    private void UpdateFeatureMetrics(string feature, bool isHit)
    {
        _featureMetrics.AddOrUpdate(feature,
            new FeatureMetrics 
            { 
                Feature = feature, 
                Requests = 1, 
                Hits = isHit ? 1 : 0, 
                Misses = isHit ? 0 : 1 
            },
            (key, existing) =>
            {
                existing.Requests++;
                if (isHit)
                    existing.Hits++;
                else
                    existing.Misses++;
                return existing;
            });
    }
}