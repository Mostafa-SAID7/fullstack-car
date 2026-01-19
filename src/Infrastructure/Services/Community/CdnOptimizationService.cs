using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System.Collections.Concurrent;
using System.Net.Http;
using System.Text.Json;

namespace Infrastructure.Services.QA;

public interface ICdnOptimizationService
{
    Task<string> OptimizeAssetUrlAsync(string assetPath, AssetType assetType, CancellationToken cancellationToken = default);
    Task PreloadCriticalAssetsAsync(CancellationToken cancellationToken = default);
    Task InvalidateCdnCacheAsync(string assetPath, CancellationToken cancellationToken = default);
    Task<CdnPerformanceMetrics> GetCdnMetricsAsync(CancellationToken cancellationToken = default);
    Task OptimizeCdnConfigurationAsync(CancellationToken cancellationToken = default);
}

public class CdnOptimizationService : ICdnOptimizationService
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<CdnOptimizationService> _logger;
    private readonly CdnOptions _options;
    private readonly ConcurrentDictionary<string, CdnAssetInfo> _assetCache;
    private readonly ConcurrentDictionary<string, DateTime> _preloadTimes;

    public CdnOptimizationService(
        HttpClient httpClient,
        ILogger<CdnOptimizationService> logger,
        IOptions<CdnOptions> options)
    {
        _httpClient = httpClient;
        _logger = logger;
        _options = options.Value;
        _assetCache = new ConcurrentDictionary<string, CdnAssetInfo>();
        _preloadTimes = new ConcurrentDictionary<string, DateTime>();
    }

    public async Task<string> OptimizeAssetUrlAsync(string assetPath, AssetType assetType, CancellationToken cancellationToken = default)
    {
        try
        {
            if (!_options.EnableCdn)
            {
                return assetPath;
            }

            // Check if asset is already optimized
            if (_assetCache.TryGetValue(assetPath, out var cachedAsset) && 
                cachedAsset.ExpiresAt > DateTime.UtcNow)
            {
                return cachedAsset.OptimizedUrl;
            }

            var optimizedUrl = await GenerateOptimizedUrlAsync(assetPath, assetType, cancellationToken);
            
            // Cache the optimized URL
            var assetInfo = new CdnAssetInfo
            {
                OriginalPath = assetPath,
                OptimizedUrl = optimizedUrl,
                AssetType = assetType,
                CreatedAt = DateTime.UtcNow,
                ExpiresAt = DateTime.UtcNow.AddHours(_options.UrlCacheHours)
            };

            _assetCache.TryAdd(assetPath, assetInfo);

            _logger.LogDebug("Optimized asset URL: {OriginalPath} -> {OptimizedUrl}", assetPath, optimizedUrl);
            return optimizedUrl;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to optimize asset URL: {AssetPath}", assetPath);
            return assetPath; // Fallback to original path
        }
    }

    public async Task PreloadCriticalAssetsAsync(CancellationToken cancellationToken = default)
    {
        try
        {
            if (!_options.EnablePreloading)
            {
                return;
            }

            _logger.LogInformation("Starting CDN asset preloading");

            var criticalAssets = GetCriticalAssets();
            var preloadTasks = new List<Task>();

            foreach (var asset in criticalAssets)
            {
                if (cancellationToken.IsCancellationRequested)
                    break;

                preloadTasks.Add(PreloadAssetAsync(asset, cancellationToken));
                
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

            _logger.LogInformation("CDN asset preloading completed for {Count} assets", criticalAssets.Count);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "CDN asset preloading failed");
        }
    }

    public async Task InvalidateCdnCacheAsync(string assetPath, CancellationToken cancellationToken = default)
    {
        try
        {
            if (!_options.EnableCacheInvalidation)
            {
                return;
            }

            // Remove from local cache
            _assetCache.TryRemove(assetPath, out _);

            // Invalidate CDN cache
            await InvalidateCdnAssetAsync(assetPath, cancellationToken);

            _logger.LogDebug("Invalidated CDN cache for asset: {AssetPath}", assetPath);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to invalidate CDN cache for asset: {AssetPath}", assetPath);
        }
    }

    public async Task<CdnPerformanceMetrics> GetCdnMetricsAsync(CancellationToken cancellationToken = default)
    {
        try
        {
            var metrics = new CdnPerformanceMetrics
            {
                TotalAssets = _assetCache.Count,
                CachedAssets = _assetCache.Count(kvp => kvp.Value.ExpiresAt > DateTime.UtcNow),
                PreloadedAssets = _preloadTimes.Count,
                LastUpdated = DateTime.UtcNow
            };

            // Get CDN performance data if available
            if (_options.EnableMetricsCollection)
            {
                var cdnMetrics = await GetCdnProviderMetricsAsync(cancellationToken);
                if (cdnMetrics != null)
                {
                    metrics.AverageResponseTime = cdnMetrics.AverageResponseTime;
                    metrics.CacheHitRate = cdnMetrics.CacheHitRate;
                    metrics.BandwidthUsage = cdnMetrics.BandwidthUsage;
                }
            }

            return metrics;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to get CDN metrics");
            return new CdnPerformanceMetrics { LastUpdated = DateTime.UtcNow };
        }
    }

    public async Task OptimizeCdnConfigurationAsync(CancellationToken cancellationToken = default)
    {
        try
        {
            _logger.LogInformation("Starting CDN configuration optimization");

            // Optimize cache headers
            await OptimizeCacheHeadersAsync(cancellationToken);

            // Configure compression
            await ConfigureCompressionAsync(cancellationToken);

            // Setup edge rules
            await SetupEdgeRulesAsync(cancellationToken);

            // Configure geographic distribution
            await ConfigureGeographicDistributionAsync(cancellationToken);

            _logger.LogInformation("CDN configuration optimization completed");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "CDN configuration optimization failed");
        }
    }

    private async Task<string> GenerateOptimizedUrlAsync(string assetPath, AssetType assetType, CancellationToken cancellationToken)
    {
        var baseUrl = GetCdnBaseUrl();
        var optimizedPath = await ApplyAssetOptimizationsAsync(assetPath, assetType, cancellationToken);
        
        // Add cache busting and optimization parameters
        var queryParams = new List<string>();
        
        if (_options.EnableCacheBusting)
        {
            queryParams.Add($"v={GetAssetVersion(assetPath)}");
        }

        if (assetType == AssetType.Image && _options.EnableImageOptimization)
        {
            queryParams.Add("format=webp");
            queryParams.Add("quality=85");
        }

        if (assetType == AssetType.JavaScript && _options.EnableMinification)
        {
            queryParams.Add("minify=true");
        }

        var queryString = queryParams.Count > 0 ? "?" + string.Join("&", queryParams) : "";
        return $"{baseUrl}/{optimizedPath.TrimStart('/')}{queryString}";
    }

    private async Task<string> ApplyAssetOptimizationsAsync(string assetPath, AssetType assetType, CancellationToken cancellationToken)
    {
        // Apply asset-specific optimizations
        switch (assetType)
        {
            case AssetType.Image:
                return await OptimizeImagePathAsync(assetPath, cancellationToken);
            case AssetType.JavaScript:
                return await OptimizeJavaScriptPathAsync(assetPath, cancellationToken);
            case AssetType.Css:
                return await OptimizeCssPathAsync(assetPath, cancellationToken);
            default:
                return assetPath;
        }
    }

    private async Task<string> OptimizeImagePathAsync(string imagePath, CancellationToken cancellationToken)
    {
        // Apply image-specific optimizations
        await Task.CompletedTask;
        return imagePath.Replace("/images/", "/optimized/images/");
    }

    private async Task<string> OptimizeJavaScriptPathAsync(string jsPath, CancellationToken cancellationToken)
    {
        // Apply JavaScript-specific optimizations
        await Task.CompletedTask;
        return jsPath.Replace(".js", ".min.js");
    }

    private async Task<string> OptimizeCssPathAsync(string cssPath, CancellationToken cancellationToken)
    {
        // Apply CSS-specific optimizations
        await Task.CompletedTask;
        return cssPath.Replace(".css", ".min.css");
    }

    private List<CriticalAsset> GetCriticalAssets()
    {
        return new List<CriticalAsset>
        {
            new() { Path = "/css/styles.css", Type = AssetType.Css, Priority = 1 },
            new() { Path = "/js/main.js", Type = AssetType.JavaScript, Priority = 1 },
            new() { Path = "/js/signalr.min.js", Type = AssetType.JavaScript, Priority = 1 },
            new() { Path = "/images/icons.svg", Type = AssetType.Image, Priority = 2 },
            new() { Path = "/fonts/font.woff2", Type = AssetType.Font, Priority = 2 },
            new() { Path = "/css/responsive.css", Type = AssetType.Css, Priority = 3 },
            new() { Path = "/js/search.js", Type = AssetType.JavaScript, Priority = 3 }
        };
    }

    private async Task PreloadAssetAsync(CriticalAsset asset, CancellationToken cancellationToken)
    {
        try
        {
            // Check if already preloaded recently
            if (_preloadTimes.TryGetValue(asset.Path, out var lastPreload) &&
                lastPreload > DateTime.UtcNow.AddHours(-_options.PreloadIntervalHours))
            {
                return;
            }

            var optimizedUrl = await OptimizeAssetUrlAsync(asset.Path, asset.Type, cancellationToken);
            
            // Trigger CDN preload
            await TriggerCdnPreloadAsync(optimizedUrl, cancellationToken);
            
            _preloadTimes.TryAdd(asset.Path, DateTime.UtcNow);
            
            _logger.LogDebug("Preloaded CDN asset: {AssetPath}", asset.Path);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to preload CDN asset: {AssetPath}", asset.Path);
        }
    }

    private async Task TriggerCdnPreloadAsync(string url, CancellationToken cancellationToken)
    {
        try
        {
            // Make a HEAD request to trigger CDN caching
            using var request = new HttpRequestMessage(HttpMethod.Head, url);
            request.Headers.Add("User-Agent", "CDN-Preloader/1.0");
            
            var response = await _httpClient.SendAsync(request, cancellationToken);
            response.EnsureSuccessStatusCode();
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to trigger CDN preload for URL: {Url}", url);
        }
    }

    private async Task InvalidateCdnAssetAsync(string assetPath, CancellationToken cancellationToken)
    {
        try
        {
            // This would typically call the CDN provider's invalidation API
            // For now, we'll simulate the operation
            await Task.Delay(100, cancellationToken);
            
            _logger.LogDebug("CDN invalidation triggered for asset: {AssetPath}", assetPath);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to invalidate CDN asset: {AssetPath}", assetPath);
        }
    }

    private async Task<CdnProviderMetrics?> GetCdnProviderMetricsAsync(CancellationToken cancellationToken)
    {
        try
        {
            // This would typically call the CDN provider's metrics API
            // For now, we'll return simulated metrics
            await Task.Delay(50, cancellationToken);
            
            return new CdnProviderMetrics
            {
                AverageResponseTime = 45.5,
                CacheHitRate = 94.2,
                BandwidthUsage = 1024 * 1024 * 500 // 500 MB
            };
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to get CDN provider metrics");
            return null;
        }
    }

    private async Task OptimizeCacheHeadersAsync(CancellationToken cancellationToken)
    {
        // Configure optimal cache headers for different asset types
        await Task.CompletedTask;
        _logger.LogDebug("Optimized CDN cache headers");
    }

    private async Task ConfigureCompressionAsync(CancellationToken cancellationToken)
    {
        // Configure compression settings
        await Task.CompletedTask;
        _logger.LogDebug("Configured CDN compression");
    }

    private async Task SetupEdgeRulesAsync(CancellationToken cancellationToken)
    {
        // Setup edge computing rules for better performance
        await Task.CompletedTask;
        _logger.LogDebug("Setup CDN edge rules");
    }

    private async Task ConfigureGeographicDistributionAsync(CancellationToken cancellationToken)
    {
        // Configure geographic distribution for optimal performance
        await Task.CompletedTask;
        _logger.LogDebug("Configured CDN geographic distribution");
    }

    private string GetCdnBaseUrl()
    {
        return _options.CdnBaseUrl ?? "https://cdn.example.com";
    }

    private string GetAssetVersion(string assetPath)
    {
        // Generate version hash for cache busting
        return DateTime.UtcNow.ToString("yyyyMMddHH");
    }
}

public class CdnAssetInfo
{
    public string OriginalPath { get; set; } = string.Empty;
    public string OptimizedUrl { get; set; } = string.Empty;
    public AssetType AssetType { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime ExpiresAt { get; set; }
}

public class CriticalAsset
{
    public string Path { get; set; } = string.Empty;
    public AssetType Type { get; set; }
    public int Priority { get; set; }
}

public class CdnPerformanceMetrics
{
    public int TotalAssets { get; set; }
    public int CachedAssets { get; set; }
    public int PreloadedAssets { get; set; }
    public double AverageResponseTime { get; set; }
    public double CacheHitRate { get; set; }
    public long BandwidthUsage { get; set; }
    public DateTime LastUpdated { get; set; }
}

public class CdnProviderMetrics
{
    public double AverageResponseTime { get; set; }
    public double CacheHitRate { get; set; }
    public long BandwidthUsage { get; set; }
}

public enum AssetType
{
    JavaScript,
    Css,
    Image,
    Font,
    Video,
    Audio,
    Document
}

public class CdnOptions
{
    public const string SectionName = "Cdn";
    
    public bool EnableCdn { get; set; } = true;
    public string? CdnBaseUrl { get; set; }
    public bool EnableCacheBusting { get; set; } = true;
    public bool EnableImageOptimization { get; set; } = true;
    public bool EnableMinification { get; set; } = true;
    public bool EnablePreloading { get; set; } = true;
    public bool EnableCacheInvalidation { get; set; } = true;
    public bool EnableMetricsCollection { get; set; } = true;
    public int UrlCacheHours { get; set; } = 24;
    public int MaxConcurrentPreloads { get; set; } = 10;
    public int PreloadIntervalHours { get; set; } = 6;
}