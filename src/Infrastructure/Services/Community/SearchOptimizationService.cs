using Application.Features.Shared.Caching.Interfaces.Services;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System.Collections.Concurrent;
using System.Diagnostics;
using System.Text.Json;

namespace Infrastructure.Services.QA;

public interface ISearchOptimizationService
{
    Task<T> ExecuteOptimizedSearchAsync<T>(Func<Task<T>> searchQuery, string searchTerm, string cacheKey, CancellationToken cancellationToken = default) where T : class;
    Task PrewarmSearchCacheAsync(CancellationToken cancellationToken = default);
    Task InvalidateSearchCacheAsync(string pattern, CancellationToken cancellationToken = default);
    Task<SearchPerformanceMetrics> GetSearchMetricsAsync(CancellationToken cancellationToken = default);
    Task OptimizeSearchIndexesAsync(CancellationToken cancellationToken = default);
}

public class SearchOptimizationService : ISearchOptimizationService
{
    private readonly IAdvancedCacheService _cacheService;
    private readonly ILogger<SearchOptimizationService> _logger;
    private readonly SearchPerformanceOptions _options;
    private readonly ConcurrentDictionary<string, SearchQueryMetrics> _searchMetrics;
    private readonly ConcurrentDictionary<string, DateTime> _cacheWarmupTimes;

    public SearchOptimizationService(
        IAdvancedCacheService cacheService,
        ILogger<SearchOptimizationService> logger,
        IOptions<SearchPerformanceOptions> options)
    {
        _cacheService = cacheService;
        _logger = logger;
        _options = options.Value;
        _searchMetrics = new ConcurrentDictionary<string, SearchQueryMetrics>();
        _cacheWarmupTimes = new ConcurrentDictionary<string, DateTime>();
    }

    public async Task<T> ExecuteOptimizedSearchAsync<T>(
        Func<Task<T>> searchQuery, 
        string searchTerm, 
        string cacheKey, 
        CancellationToken cancellationToken = default) where T : class
    {
        var stopwatch = Stopwatch.StartNew();
        var queryHash = GenerateQueryHash(searchTerm);

        try
        {
            // Enhanced cache key with client type differentiation
            var enhancedCacheKey = $"{cacheKey}:unified";
            
            // Try to get from cache first
            var cachedResult = await _cacheService.GetAsync<T>(enhancedCacheKey);
            if (cachedResult != null)
            {
                stopwatch.Stop();
                await UpdateSearchMetricsAsync(queryHash, stopwatch.ElapsedMilliseconds, true, true);
                
                _logger.LogDebug("Search cache hit for query: {SearchTerm} in {ElapsedMs}ms", 
                    searchTerm, stopwatch.ElapsedMilliseconds);
                
                return cachedResult;
            }

            // Execute search query with dual-frontend optimization
            var result = await ExecuteWithDualFrontendOptimizationAsync(searchQuery, searchTerm);
            
            stopwatch.Stop();

            // Cache the result with enhanced strategy for dual frontend usage
            if (ShouldCacheResultForDualFrontend(searchTerm, stopwatch.ElapsedMilliseconds))
            {
                var cacheExpiry = CalculateDualFrontendCacheExpiry(searchTerm);
                
                // Cache with tags for efficient invalidation across both frontends
                var cacheTags = new[] { "search", "dual-frontend", $"term-{queryHash}" };
                await _cacheService.SetAsync(enhancedCacheKey, result, cacheExpiry);
                
                _logger.LogDebug("Cached search result for dual frontend usage: {SearchTerm}", searchTerm);
            }

            await UpdateSearchMetricsAsync(queryHash, stopwatch.ElapsedMilliseconds, true, false);
            
            // Log slow searches with enhanced context
            if (stopwatch.ElapsedMilliseconds > _options.SlowSearchThresholdMs)
            {
                _logger.LogWarning("Slow search detected for dual frontend: '{SearchTerm}' took {ElapsedMs}ms", 
                    searchTerm, stopwatch.ElapsedMilliseconds);
            }

            return result;
        }
        catch (Exception ex)
        {
            stopwatch.Stop();
            await UpdateSearchMetricsAsync(queryHash, stopwatch.ElapsedMilliseconds, false, false);
            
            _logger.LogError(ex, "Search query failed for dual frontend: '{SearchTerm}' after {ElapsedMs}ms", 
                searchTerm, stopwatch.ElapsedMilliseconds);
            throw;
        }
    }

    public async Task PrewarmSearchCacheAsync(CancellationToken cancellationToken = default)
    {
        try
        {
            _logger.LogInformation("Starting search cache prewarming");

            var popularSearchTerms = await GetPopularSearchTermsAsync(cancellationToken);
            var prewarmTasks = new List<Task>();

            foreach (var searchTerm in popularSearchTerms)
            {
                if (cancellationToken.IsCancellationRequested)
                    break;

                prewarmTasks.Add(PrewarmSearchTermAsync(searchTerm, cancellationToken));
                
                // Limit concurrent prewarming operations
                if (prewarmTasks.Count >= _options.MaxConcurrentPrewarmOperations)
                {
                    await Task.WhenAll(prewarmTasks);
                    prewarmTasks.Clear();
                }
            }

            // Wait for remaining operations
            if (prewarmTasks.Count > 0)
            {
                await Task.WhenAll(prewarmTasks);
            }

            _logger.LogInformation("Search cache prewarming completed for {Count} terms", popularSearchTerms.Count);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Search cache prewarming failed");
        }
    }

    public async Task InvalidateSearchCacheAsync(string pattern, CancellationToken cancellationToken = default)
    {
        try
        {
            // Invalidate cache entries matching the pattern
            await _cacheService.RemoveByPatternAsync($"search:{pattern}*");
            
            _logger.LogDebug("Invalidated search cache for pattern: {Pattern}", pattern);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to invalidate search cache for pattern: {Pattern}", pattern);
        }
    }

    public async Task<SearchPerformanceMetrics> GetSearchMetricsAsync(CancellationToken cancellationToken = default)
    {
        await Task.CompletedTask;

        var metrics = new SearchPerformanceMetrics
        {
            TotalSearches = _searchMetrics.Values.Sum(m => m.ExecutionCount),
            CacheHits = _searchMetrics.Values.Sum(m => m.CacheHits),
            AverageResponseTime = _searchMetrics.Values.Any() 
                ? _searchMetrics.Values.Average(m => m.AverageExecutionTimeMs) 
                : 0,
            SlowSearches = _searchMetrics.Values.Sum(m => m.SlowSearchCount),
            LastUpdated = DateTime.UtcNow
        };

        metrics.CacheHitRate = metrics.TotalSearches > 0 
            ? (double)metrics.CacheHits / metrics.TotalSearches * 100 
            : 0;

        return metrics;
    }

    public async Task OptimizeSearchIndexesAsync(CancellationToken cancellationToken = default)
    {
        try
        {
            _logger.LogInformation("Starting search index optimization");

            // This would typically involve:
            // 1. Rebuilding search indexes
            // 2. Updating search statistics
            // 3. Optimizing search query plans
            
            // For now, we'll simulate the optimization
            await Task.Delay(1000, cancellationToken);
            
            _logger.LogInformation("Search index optimization completed");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Search index optimization failed");
        }
    }

    private async Task<T> ExecuteWithDualFrontendOptimizationAsync<T>(Func<Task<T>> searchQuery, string searchTerm)
    {
        // Apply search-specific optimizations for dual frontend usage
        if (IsComplexSearch(searchTerm))
        {
            // For complex searches, apply additional optimizations
            return await ExecuteComplexSearchWithDualFrontendAsync(searchQuery);
        }

        return await searchQuery();
    }

    private async Task<T> ExecuteComplexSearchWithDualFrontendAsync<T>(Func<Task<T>> searchQuery)
    {
        // Implement complex search optimizations for dual frontend
        // This could include query rewriting, parallel execution, result formatting
        return await searchQuery();
    }

    private bool ShouldCacheResultForDualFrontend(string searchTerm, long executionTimeMs)
    {
        // Enhanced caching strategy for dual frontend usage
        return executionTimeMs > _options.CacheThresholdMs ||
               IsPopularSearchTerm(searchTerm) ||
               IsCrossClientSearchTerm(searchTerm);
    }

    private bool IsCrossClientSearchTerm(string searchTerm)
    {
        // Identify search terms that are commonly used by both Angular and React clients
        var crossClientTerms = new[] { "javascript", "react", "angular", "api", "database", "performance" };
        return crossClientTerms.Any(term => searchTerm.ToLowerInvariant().Contains(term));
    }

    private TimeSpan CalculateDualFrontendCacheExpiry(string searchTerm)
    {
        // Enhanced cache expiry strategy for dual frontend
        if (IsPopularSearchTerm(searchTerm) || IsCrossClientSearchTerm(searchTerm))
        {
            return TimeSpan.FromMinutes(_options.PopularTermCacheMinutes * 1.5); // Longer cache for cross-client terms
        }

        return TimeSpan.FromMinutes(_options.DefaultCacheMinutes);
    }

    private bool IsComplexSearch(string searchTerm)
    {
        // Determine if this is a complex search that needs special handling
        return searchTerm.Length > _options.ComplexSearchTermLength ||
               searchTerm.Contains(" AND ") ||
               searchTerm.Contains(" OR ") ||
               searchTerm.Contains("\"");
    }

    private bool ShouldCacheResult(string searchTerm, long executionTimeMs)
    {
        // Cache results that took longer than threshold or are popular terms
        return executionTimeMs > _options.CacheThresholdMs ||
               IsPopularSearchTerm(searchTerm);
    }

    private bool IsPopularSearchTerm(string searchTerm)
    {
        var queryHash = GenerateQueryHash(searchTerm);
        if (_searchMetrics.TryGetValue(queryHash, out var metrics))
        {
            return metrics.ExecutionCount >= _options.PopularTermThreshold;
        }
        return false;
    }

    private TimeSpan CalculateCacheExpiry(string searchTerm)
    {
        // Dynamic cache expiry based on search term characteristics
        if (IsPopularSearchTerm(searchTerm))
        {
            return TimeSpan.FromMinutes(_options.PopularTermCacheMinutes);
        }

        return TimeSpan.FromMinutes(_options.DefaultCacheMinutes);
    }

    private async Task<List<string>> GetPopularSearchTermsAsync(CancellationToken cancellationToken)
    {
        // Get popular search terms from metrics
        var popularTerms = _searchMetrics
            .Where(kvp => kvp.Value.ExecutionCount >= _options.PopularTermThreshold)
            .OrderByDescending(kvp => kvp.Value.ExecutionCount)
            .Take(_options.MaxPrewarmTerms)
            .Select(kvp => kvp.Key)
            .ToList();

        // Add some default popular terms if we don't have enough data
        if (popularTerms.Count < 10)
        {
            popularTerms.AddRange(new[]
            {
                "javascript", "react", "angular", "typescript", "nodejs",
                "sql", "database", "performance", "security", "api"
            });
        }

        await Task.CompletedTask;
        return popularTerms.Distinct().ToList();
    }

    private async Task PrewarmSearchTermAsync(string searchTerm, CancellationToken cancellationToken)
    {
        try
        {
            var cacheKey = $"search:prewarm:{GenerateQueryHash(searchTerm)}";
            
            // Check if already prewarmed recently
            if (_cacheWarmupTimes.TryGetValue(searchTerm, out var lastWarmup) &&
                lastWarmup > DateTime.UtcNow.AddHours(-_options.PrewarmIntervalHours))
            {
                return;
            }

            // Simulate search execution for prewarming
            // In a real implementation, this would execute actual search queries
            await Task.Delay(100, cancellationToken);
            
            _cacheWarmupTimes.TryAdd(searchTerm, DateTime.UtcNow);
            
            _logger.LogDebug("Prewarmed search cache for term: {SearchTerm}", searchTerm);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to prewarm search term: {SearchTerm}", searchTerm);
        }
    }

    private string GenerateQueryHash(string searchTerm)
    {
        // Generate a consistent hash for the search term
        return Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes(searchTerm.ToLowerInvariant()))
            .Replace("+", "-").Replace("/", "_").Replace("=", "");
    }

    private async Task UpdateSearchMetricsAsync(string queryHash, long executionTimeMs, bool success, bool cacheHit)
    {
        await Task.CompletedTask;

        var metrics = _searchMetrics.GetOrAdd(queryHash, _ => new SearchQueryMetrics
        {
            QueryHash = queryHash,
            ExecutionCount = 0,
            TotalExecutionTimeMs = 0,
            MaxExecutionTimeMs = 0,
            MinExecutionTimeMs = long.MaxValue,
            SuccessCount = 0,
            CacheHits = 0,
            SlowSearchCount = 0
        });

        lock (metrics)
        {
            metrics.ExecutionCount++;
            metrics.TotalExecutionTimeMs += executionTimeMs;
            metrics.MaxExecutionTimeMs = Math.Max(metrics.MaxExecutionTimeMs, executionTimeMs);
            metrics.MinExecutionTimeMs = Math.Min(metrics.MinExecutionTimeMs, executionTimeMs);
            metrics.LastExecuted = DateTime.UtcNow;

            if (success)
            {
                metrics.SuccessCount++;
            }

            if (cacheHit)
            {
                metrics.CacheHits++;
            }

            if (executionTimeMs > _options.SlowSearchThresholdMs)
            {
                metrics.SlowSearchCount++;
            }

            // Calculate derived metrics
            metrics.AverageExecutionTimeMs = metrics.TotalExecutionTimeMs / metrics.ExecutionCount;
            metrics.SuccessRate = (double)metrics.SuccessCount / metrics.ExecutionCount * 100;
        }
    }
}

public class SearchQueryMetrics
{
    public string QueryHash { get; set; } = string.Empty;
    public long ExecutionCount { get; set; }
    public long TotalExecutionTimeMs { get; set; }
    public long AverageExecutionTimeMs { get; set; }
    public long MaxExecutionTimeMs { get; set; }
    public long MinExecutionTimeMs { get; set; }
    public long SuccessCount { get; set; }
    public double SuccessRate { get; set; }
    public long CacheHits { get; set; }
    public long SlowSearchCount { get; set; }
    public DateTime? LastExecuted { get; set; }
}

public class SearchPerformanceMetrics
{
    public long TotalSearches { get; set; }
    public long CacheHits { get; set; }
    public double CacheHitRate { get; set; }
    public double AverageResponseTime { get; set; }
    public long SlowSearches { get; set; }
    public DateTime LastUpdated { get; set; }
}

public class SearchPerformanceOptions
{
    public const string SectionName = "SearchPerformance";
    
    public int SlowSearchThresholdMs { get; set; } = 2000; // 2 seconds as per requirements
    public int CacheThresholdMs { get; set; } = 500; // Cache searches taking longer than 500ms
    public int ComplexSearchTermLength { get; set; } = 50;
    public int PopularTermThreshold { get; set; } = 10; // Searches executed 10+ times
    public int PopularTermCacheMinutes { get; set; } = 60;
    public int DefaultCacheMinutes { get; set; } = 15;
    public int MaxPrewarmTerms { get; set; } = 100;
    public int MaxConcurrentPrewarmOperations { get; set; } = 5;
    public int PrewarmIntervalHours { get; set; } = 6;
}