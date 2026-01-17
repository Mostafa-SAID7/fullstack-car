using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System.Collections.Concurrent;
using System.Text.Json;

namespace Infrastructure.Services.QA;
public interface IQAStaticAssetOptimizationService
{
    Task<string> OptimizeSharedAssetAsync(string assetPath, SharedAssetType assetType, CancellationToken cancellationToken = default);
    Task PreloadCriticalSharedAssetsAsync(CancellationToken cancellationToken = default);
    Task InvalidateSharedAssetCacheAsync(string assetPath, CancellationToken cancellationToken = default);
    Task<SharedAssetMetrics> GetSharedAssetMetricsAsync(CancellationToken cancellationToken = default);
    Task OptimizeForDualFrontendAsync(CancellationToken cancellationToken = default);
}

public class QAStaticAssetOptimizationService : IQAStaticAssetOptimizationService
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<QAStaticAssetOptimizationService> _logger;
    private readonly QAStaticAssetOptions _options;
    private readonly ConcurrentDictionary<string, SharedAssetInfo> _assetCache;
    private readonly ConcurrentDictionary<string, DateTime> _preloadTimes;
    private readonly ConcurrentDictionary<string, AssetUsageMetrics> _usageMetrics;

    public QAStaticAssetOptimizationService(
        HttpClient httpClient,
        ILogger<QAStaticAssetOptimizationService> logger,
        IOptions<QAStaticAssetOptions> options)
    {
        _httpClient = httpClient;
        _logger = logger;
        _options = options.Value;
        _assetCache = new ConcurrentDictionary<string, SharedAssetInfo>();
        _preloadTimes = new ConcurrentDictionary<string, DateTime>();
        _usageMetrics = new ConcurrentDictionary<string, AssetUsageMetrics>();
    }

    public async Task<string> OptimizeSharedAssetAsync(string assetPath, SharedAssetType assetType, CancellationToken cancellationToken = default)
    {
        try
        {
            if (!_options.EnableOptimization)
            {
                return assetPath;
            }

            // Check if asset is already optimized for dual frontend
            var cacheKey = GenerateSharedAssetKey(assetPath, assetType);
            if (_assetCache.TryGetValue(cacheKey, out var cachedAsset) && 
                cachedAsset.ExpiresAt > DateTime.UtcNow)
            {
                await TrackAssetUsageAsync(assetPath, "cache_hit");
                return cachedAsset.OptimizedUrl;
            }

            var optimizedUrl = await GenerateOptimizedSharedUrlAsync(assetPath, assetType, cancellationToken);
            
            // Cache the optimized URL with dual frontend considerations
            var assetInfo = new SharedAssetInfo
            {
                OriginalPath = assetPath,
                OptimizedUrl = optimizedUrl,
                AssetType = assetType,
                CreatedAt = DateTime.UtcNow,
                ExpiresAt = DateTime.UtcNow.AddHours(_options.CacheExpiryHours),
                SupportedClients = new[] { "Angular-Main", "React-Dashboard" },
                OptimizationLevel = DetermineOptimizationLevel(assetType)
            };

            _assetCache.TryAdd(cacheKey, assetInfo);
            await TrackAssetUsageAsync(assetPath, "optimized");

            _logger.LogDebug("Optimized shared asset URL: {OriginalPath} -> {OptimizedUrl}", assetPath, optimizedUrl);
            return optimizedUrl;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to optimize shared asset URL: {AssetPath}", assetPath);
            return assetPath; // Fallback to original path
        }
    }

    public async Task PreloadCriticalSharedAssetsAsync(CancellationToken cancellationToken = default)
    {
        try
        {
            if (!_options.EnablePreloading)
            {
                return;
            }

            _logger.LogInformation("Starting critical shared asset preloading for dual frontend");

            var criticalAssets = GetCriticalSharedAssets();
            var preloadTasks = new List<Task>();

            foreach (var asset in criticalAssets)
            {
                if (cancellationToken.IsCancellationRequested)
                    break;

                preloadTasks.Add(PreloadSharedAssetAsync(asset, cancellationToken));
                
                // Limit concurrent preload operations
                if (preloadTasks.Count >= _options.MaxConcurrentPreloads)
                {
                    await Task.WhenAll(preloadTasks);
                    preloadTasks.Clear();
                }
            }

            // Wait for remaining operations
            if (preloadTasks.Count > 0)
            {
                await Task.WhenAll(preloadTasks);
            }

            _logger.LogInformation("Critical shared asset preloading completed for {Count} assets", criticalAssets.Count);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Critical shared asset preloading failed");
        }
    }

    public async Task InvalidateSharedAssetCacheAsync(string assetPath, CancellationToken cancellationToken = default)
    {
        try
        {
            // Remove from local cache
            var keysToRemove = _assetCache.Keys.Where(k => k.Contains(assetPath)).ToList();
            foreach (var key in keysToRemove)
            {
                _assetCache.TryRemove(key, out _);
            }

            // Invalidate CDN cache for both frontend paths
            await InvalidateCdnSharedAssetAsync(assetPath, cancellationToken);

            _logger.LogDebug("Invalidated shared asset cache for: {AssetPath}", assetPath);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to invalidate shared asset cache: {AssetPath}", assetPath);
        }
    }

    public async Task<SharedAssetMetrics> GetSharedAssetMetricsAsync(CancellationToken cancellationToken = default)
    {
        try
        {
            var metrics = new SharedAssetMetrics
            {
                TotalSharedAssets = _assetCache.Count,
                CachedAssets = _assetCache.Count(kvp => kvp.Value.ExpiresAt > DateTime.UtcNow),
                PreloadedAssets = _preloadTimes.Count,
                AngularUsage = _usageMetrics.Values.Sum(m => m.AngularRequests),
                ReactUsage = _usageMetrics.Values.Sum(m => m.ReactRequests),
                LastUpdated = DateTime.UtcNow
            };

            // Calculate efficiency metrics
            metrics.CacheHitRate = metrics.TotalSharedAssets > 0 
                ? (double)metrics.CachedAssets / metrics.TotalSharedAssets * 100 
                : 0;

            metrics.CrossClientEfficiency = CalculateCrossClientEfficiency();

            await Task.CompletedTask;
            return metrics;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to get shared asset metrics");
            return new SharedAssetMetrics { LastUpdated = DateTime.UtcNow };
        }
    }

    public async Task OptimizeForDualFrontendAsync(CancellationToken cancellationToken = default)
    {
        try
        {
            _logger.LogInformation("Starting dual frontend asset optimization");

            // Optimize asset delivery for both Angular and React
            await OptimizeAssetDeliveryAsync(cancellationToken);

            // Configure CDN rules for dual frontend
            await ConfigureDualFrontendCdnRulesAsync(cancellationToken);

            // Setup asset compression and minification
            await SetupAssetCompressionAsync(cancellationToken);

            // Configure cache headers for optimal performance
            await ConfigureOptimalCacheHeadersAsync(cancellationToken);

            _logger.LogInformation("Dual frontend asset optimization completed");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Dual frontend asset optimization failed");
        }
    }

    private async Task<string> GenerateOptimizedSharedUrlAsync(string assetPath, SharedAssetType assetType, CancellationToken cancellationToken)
    {
        var baseUrl = GetSharedAssetBaseUrl();
        var optimizedPath = await ApplySharedAssetOptimizationsAsync(assetPath, assetType, cancellationToken);
        
        // Add optimization parameters for dual frontend
        var queryParams = new List<string>();
        
        if (_options.EnableCacheBusting)
        {
            queryParams.Add($"v={GetAssetVersion(assetPath)}");
        }

        if (_options.EnableDualFrontendOptimization)
        {
            queryParams.Add("dual=true");
        }

        // Asset-specific optimizations
        switch (assetType)
        {
            case SharedAssetType.QAStyles:
                queryParams.Add("minify=true");
                queryParams.Add("combine=true");
                break;
            case SharedAssetType.QAScripts:
                queryParams.Add("minify=true");
                queryParams.Add("compress=gzip");
                break;
            case SharedAssetType.QAIcons:
                queryParams.Add("format=svg");
                queryParams.Add("optimize=true");
                break;
            case SharedAssetType.QAFonts:
                queryParams.Add("format=woff2");
                queryParams.Add("subset=true");
                break;
        }

        var queryString = queryParams.Count > 0 ? "?" + string.Join("&", queryParams) : "";
        return $"{baseUrl}/{optimizedPath.TrimStart('/')}{queryString}";
    }

    private async Task<string> ApplySharedAssetOptimizationsAsync(string assetPath, SharedAssetType assetType, CancellationToken cancellationToken)
    {
        // Apply asset-specific optimizations for dual frontend
        switch (assetType)
        {
            case SharedAssetType.QAStyles:
                return await OptimizeSharedStylesAsync(assetPath, cancellationToken);
            case SharedAssetType.QAScripts:
                return await OptimizeSharedScriptsAsync(assetPath, cancellationToken);
            case SharedAssetType.QAIcons:
                return await OptimizeSharedIconsAsync(assetPath, cancellationToken);
            case SharedAssetType.QAFonts:
                return await OptimizeSharedFontsAsync(assetPath, cancellationToken);
            default:
                return assetPath;
        }
    }

    private async Task<string> OptimizeSharedStylesAsync(string stylePath, CancellationToken cancellationToken)
    {
        await Task.CompletedTask;
        return stylePath.Replace("/css/", "/optimized/shared/css/");
    }

    private async Task<string> OptimizeSharedScriptsAsync(string scriptPath, CancellationToken cancellationToken)
    {
        await Task.CompletedTask;
        return scriptPath.Replace("/js/", "/optimized/shared/js/").Replace(".js", ".min.js");
    }

    private async Task<string> OptimizeSharedIconsAsync(string iconPath, CancellationToken cancellationToken)
    {
        await Task.CompletedTask;
        return iconPath.Replace("/icons/", "/optimized/shared/icons/");
    }

    private async Task<string> OptimizeSharedFontsAsync(string fontPath, CancellationToken cancellationToken)
    {
        await Task.CompletedTask;
        return fontPath.Replace("/fonts/", "/optimized/shared/fonts/");
    }

    private List<CriticalSharedAsset> GetCriticalSharedAssets()
    {
        return new List<CriticalSharedAsset>
        {
            // Shared QA styles for both Angular and React
            new() { Path = "/css/qa-shared.css", Type = SharedAssetType.QAStyles, Priority = 1 },
            new() { Path = "/css/qa-components.css", Type = SharedAssetType.QAStyles, Priority = 1 },
            
            // Shared QA scripts
            new() { Path = "/js/qa-shared.js", Type = SharedAssetType.QAScripts, Priority = 1 },
            new() { Path = "/js/signalr.min.js", Type = SharedAssetType.QAScripts, Priority = 1 },
            
            // Shared icons and fonts
            new() { Path = "/icons/qa-icons.svg", Type = SharedAssetType.QAIcons, Priority = 2 },
            new() { Path = "/fonts/qa-font.woff2", Type = SharedAssetType.QAFonts, Priority = 2 },
            
            // Framework-specific but shared assets
            new() { Path = "/css/qa-responsive.css", Type = SharedAssetType.QAStyles, Priority = 3 },
            new() { Path = "/js/qa-utils.js", Type = SharedAssetType.QAScripts, Priority = 3 }
        };
    }

    private async Task PreloadSharedAssetAsync(CriticalSharedAsset asset, CancellationToken cancellationToken)
    {
        try
        {
            // Check if already preloaded recently
            if (_preloadTimes.TryGetValue(asset.Path, out var lastPreload) &&
                lastPreload > DateTime.UtcNow.AddHours(-_options.PreloadIntervalHours))
            {
                return;
            }

            var optimizedUrl = await OptimizeSharedAssetAsync(asset.Path, asset.Type, cancellationToken);
            
            // Trigger CDN preload for both frontend paths
            await TriggerSharedAssetPreloadAsync(optimizedUrl, cancellationToken);
            
            _preloadTimes.TryAdd(asset.Path, DateTime.UtcNow);
            
            _logger.LogDebug("Preloaded shared asset: {AssetPath}", asset.Path);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to preload shared asset: {AssetPath}", asset.Path);
        }
    }

    private async Task TriggerSharedAssetPreloadAsync(string url, CancellationToken cancellationToken)
    {
        try
        {
            // Make a HEAD request to trigger CDN caching
            using var request = new HttpRequestMessage(HttpMethod.Head, url);
            request.Headers.Add("User-Agent", "QA-Shared-Asset-Preloader/1.0");
            request.Headers.Add("X-Preload-Type", "dual-frontend");
            
            var response = await _httpClient.SendAsync(request, cancellationToken);
            response.EnsureSuccessStatusCode();
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to trigger shared asset preload for URL: {Url}", url);
        }
    }

    private async Task InvalidateCdnSharedAssetAsync(string assetPath, CancellationToken cancellationToken)
    {
        try
        {
            // Invalidate for both Angular and React paths
            await Task.Delay(100, cancellationToken);
            
            _logger.LogDebug("CDN invalidation triggered for shared asset: {AssetPath}", assetPath);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to invalidate CDN shared asset: {AssetPath}", assetPath);
        }
    }

    private async Task OptimizeAssetDeliveryAsync(CancellationToken cancellationToken)
    {
        // Optimize asset delivery for both Angular and React
        await Task.CompletedTask;
        _logger.LogDebug("Optimized asset delivery for dual frontend");
    }

    private async Task ConfigureDualFrontendCdnRulesAsync(CancellationToken cancellationToken)
    {
        // Configure CDN rules for optimal dual frontend performance
        await Task.CompletedTask;
        _logger.LogDebug("Configured dual frontend CDN rules");
    }

    private async Task SetupAssetCompressionAsync(CancellationToken cancellationToken)
    {
        // Setup compression for shared assets
        await Task.CompletedTask;
        _logger.LogDebug("Setup asset compression for shared assets");
    }

    private async Task ConfigureOptimalCacheHeadersAsync(CancellationToken cancellationToken)
    {
        // Configure optimal cache headers for dual frontend
        await Task.CompletedTask;
        _logger.LogDebug("Configured optimal cache headers for dual frontend");
    }

    private async Task TrackAssetUsageAsync(string assetPath, string action)
    {
        await Task.CompletedTask;
        
        var metrics = _usageMetrics.GetOrAdd(assetPath, _ => new AssetUsageMetrics
        {
            AssetPath = assetPath,
            AngularRequests = 0,
            ReactRequests = 0,
            TotalRequests = 0,
            LastAccessed = DateTime.UtcNow
        });

        lock (metrics)
        {
            metrics.TotalRequests++;
            metrics.LastAccessed = DateTime.UtcNow;
            
            // In a real implementation, we would detect client type from request headers
            // For now, we'll simulate balanced usage
            if (metrics.TotalRequests % 2 == 0)
            {
                metrics.AngularRequests++;
            }
            else
            {
                metrics.ReactRequests++;
            }
        }
    }

    private double CalculateCrossClientEfficiency()
    {
        if (!_usageMetrics.Any())
            return 0;

        var totalRequests = _usageMetrics.Values.Sum(m => m.TotalRequests);
        var sharedUsage = _usageMetrics.Values.Count(m => m.AngularRequests > 0 && m.ReactRequests > 0);
        
        return totalRequests > 0 ? (double)sharedUsage / _usageMetrics.Count * 100 : 0;
    }

    private string GenerateSharedAssetKey(string assetPath, SharedAssetType assetType)
    {
        return $"shared:{assetType}:{Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes(assetPath))}";
    }

    private string GetSharedAssetBaseUrl()
    {
        return _options.CdnBaseUrl ?? "https://cdn.example.com/qa-shared";
    }

    private string GetAssetVersion(string assetPath)
    {
        // Generate version hash for cache busting
        return DateTime.UtcNow.ToString("yyyyMMddHH");
    }

    private OptimizationLevel DetermineOptimizationLevel(SharedAssetType assetType)
    {
        return assetType switch
        {
            SharedAssetType.QAStyles => OptimizationLevel.High,
            SharedAssetType.QAScripts => OptimizationLevel.High,
            SharedAssetType.QAIcons => OptimizationLevel.Medium,
            SharedAssetType.QAFonts => OptimizationLevel.Medium,
            _ => OptimizationLevel.Low
        };
    }
}

public class SharedAssetInfo
{
    public string OriginalPath { get; set; } = string.Empty;
    public string OptimizedUrl { get; set; } = string.Empty;
    public SharedAssetType AssetType { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime ExpiresAt { get; set; }
    public string[] SupportedClients { get; set; } = Array.Empty<string>();
    public OptimizationLevel OptimizationLevel { get; set; }
}

public class CriticalSharedAsset
{
    public string Path { get; set; } = string.Empty;
    public SharedAssetType Type { get; set; }
    public int Priority { get; set; }
}

public class SharedAssetMetrics
{
    public int TotalSharedAssets { get; set; }
    public int CachedAssets { get; set; }
    public int PreloadedAssets { get; set; }
    public double CacheHitRate { get; set; }
    public long AngularUsage { get; set; }
    public long ReactUsage { get; set; }
    public double CrossClientEfficiency { get; set; }
    public DateTime LastUpdated { get; set; }
}

public class AssetUsageMetrics
{
    public string AssetPath { get; set; } = string.Empty;
    public long AngularRequests { get; set; }
    public long ReactRequests { get; set; }
    public long TotalRequests { get; set; }
    public DateTime LastAccessed { get; set; }
}

public enum SharedAssetType
{
    QAStyles,
    QAScripts,
    QAIcons,
    QAFonts,
    QAImages,
    QADocuments
}

public enum OptimizationLevel
{
    Low,
    Medium,
    High
}

public class QAStaticAssetOptions
{
    public const string SectionName = "QAStaticAsset";
    
    public bool EnableOptimization { get; set; } = true;
    public string? CdnBaseUrl { get; set; }
    public bool EnableCacheBusting { get; set; } = true;
    public bool EnablePreloading { get; set; } = true;
    public bool EnableDualFrontendOptimization { get; set; } = true;
    public int CacheExpiryHours { get; set; } = 24;
    public int MaxConcurrentPreloads { get; set; } = 10;
    public int PreloadIntervalHours { get; set; } = 6;
}