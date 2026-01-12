using Application.Common.Interfaces;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Hosting;
using Microsoft.AspNetCore.Hosting;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Diagnostics;

namespace Infrastructure.Repositories;

/// <summary>
/// Translation repository with multi-level caching (Memory + Redis) and resource file loading
/// </summary>
public class TranslationRepository : ITranslationRepository
{
    private readonly IMemoryCache _memoryCache;
    private readonly IDistributedCache _distributedCache;
    private readonly IWebHostEnvironment _environment;
    private readonly ILogger<TranslationRepository> _logger;
    private readonly ITranslationCacheMetricsService _metricsService;
    
    private static readonly string[] SupportedCultures = { "en-US", "ar-EG", "ar-AE", "ar-SA" };
    private static readonly TimeSpan MemoryCacheExpiration = TimeSpan.FromMinutes(30);
    private static readonly TimeSpan DistributedCacheExpiration = TimeSpan.FromHours(2);
    
    public TranslationRepository(
        IMemoryCache memoryCache,
        IDistributedCache distributedCache,
        IWebHostEnvironment environment,
        ILogger<TranslationRepository> logger,
        ITranslationCacheMetricsService metricsService)
    {
        _memoryCache = memoryCache;
        _distributedCache = distributedCache;
        _environment = environment;
        _logger = logger;
        _metricsService = metricsService;
    }

    public async Task<Dictionary<string, string>> GetTranslationsAsync(string culture, string feature, CancellationToken cancellationToken = default)
    {
        var stopwatch = Stopwatch.StartNew();
        var cacheKey = $"translations:{culture}:{feature}";
        
        // L1 Cache: Memory (fastest)
        if (_memoryCache.TryGetValue(cacheKey, out Dictionary<string, string>? memoryResult))
        {
            stopwatch.Stop();
            _metricsService.RecordCacheHit("memory", culture, feature);
            _metricsService.RecordCacheLoadTime(culture, feature, stopwatch.Elapsed);
            _logger.LogDebug("Translation cache hit (Memory): {CacheKey}", cacheKey);
            return memoryResult!;
        }

        // L2 Cache: Redis (fast)
        var distributedResult = await GetFromDistributedCacheAsync(cacheKey, cancellationToken);
        if (distributedResult != null)
        {
            stopwatch.Stop();
            _metricsService.RecordCacheHit("distributed", culture, feature);
            _metricsService.RecordCacheLoadTime(culture, feature, stopwatch.Elapsed);
            _logger.LogDebug("Translation cache hit (Redis): {CacheKey}", cacheKey);
            
            // Store in memory cache for faster subsequent access
            var memoryCacheEntryOptions = new MemoryCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = MemoryCacheExpiration,
                Size = 1 // Each cache entry counts as 1 unit
            };
            _memoryCache.Set(cacheKey, distributedResult, memoryCacheEntryOptions);
            return distributedResult;
        }

        // L3: Load from resource files
        var translations = await LoadFromResourceFilesAsync(culture, feature, cancellationToken);
        stopwatch.Stop();
        
        _metricsService.RecordCacheMiss("file", culture, feature);
        _metricsService.RecordCacheLoadTime(culture, feature, stopwatch.Elapsed);
        
        // Cache the result in both levels
        await SetInDistributedCacheAsync(cacheKey, translations, cancellationToken);
        
        // Set memory cache with size
        var memoryCacheOptions = new MemoryCacheEntryOptions
        {
            AbsoluteExpirationRelativeToNow = MemoryCacheExpiration,
            Size = 1 // Each cache entry counts as 1 unit
        };
        _memoryCache.Set(cacheKey, translations, memoryCacheOptions);
        
        _logger.LogDebug("Translations loaded from files: {Culture}:{Feature}", culture, feature);
        return translations;
    }

    public async Task<Dictionary<string, Dictionary<string, string>>> GetBatchTranslationsAsync(string culture, IEnumerable<string> features, CancellationToken cancellationToken = default)
    {
        var result = new Dictionary<string, Dictionary<string, string>>();
        var tasks = features.Select(async feature =>
        {
            var translations = await GetTranslationsAsync(culture, feature, cancellationToken);
            return new { Feature = feature, Translations = translations };
        });

        var results = await Task.WhenAll(tasks);
        
        foreach (var item in results)
        {
            result[item.Feature] = item.Translations;
        }

        return result;
    }

    public async Task<string?> GetTranslationAsync(string culture, string key, CancellationToken cancellationToken = default)
    {
        // Extract feature from hierarchical key (e.g., "posts.create.title" -> "posts")
        var parts = key.Split('.');
        if (parts.Length == 0)
        {
            return null;
        }

        var feature = parts[0];
        var translations = await GetTranslationsAsync(culture, feature, cancellationToken);
        
        // Try to get the exact key first
        if (translations.TryGetValue(key, out var translation))
        {
            return translation;
        }

        // Fallback logic: try parent culture (e.g., ar for ar-EG)
        if (culture.Contains('-'))
        {
            var parentCulture = culture.Split('-')[0];
            if (parentCulture != culture && SupportedCultures.Any(c => c.StartsWith(parentCulture)))
            {
                var parentTranslations = await GetTranslationsAsync(parentCulture, feature, cancellationToken);
                if (parentTranslations.TryGetValue(key, out var parentTranslation))
                {
                    return parentTranslation;
                }
            }
        }

        // Final fallback: en-US
        if (culture != "en-US")
        {
            var fallbackTranslations = await GetTranslationsAsync("en-US", feature, cancellationToken);
            if (fallbackTranslations.TryGetValue(key, out var fallbackTranslation))
            {
                return fallbackTranslation;
            }
        }

        _logger.LogWarning("Translation not found for key: {Key} in culture: {Culture}", key, culture);
        return null;
    }

    public async Task<bool> ValidateTranslationCompletenessAsync(string culture, string feature, CancellationToken cancellationToken = default)
    {
        try
        {
            // Get the reference translations (en-US)
            var referenceTranslations = await GetTranslationsAsync("en-US", feature, cancellationToken);
            
            // Get the target culture translations
            var targetTranslations = await GetTranslationsAsync(culture, feature, cancellationToken);
            
            // Check if all reference keys exist in target
            foreach (var referenceKey in referenceTranslations.Keys)
            {
                if (!targetTranslations.ContainsKey(referenceKey))
                {
                    _logger.LogWarning("Missing translation key: {Key} for culture: {Culture} in feature: {Feature}", 
                        referenceKey, culture, feature);
                    return false;
                }
            }

            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error validating translation completeness for {Culture}:{Feature}", culture, feature);
            return false;
        }
    }

    public async Task InvalidateCacheAsync(string? culture = null, string? feature = null, CancellationToken cancellationToken = default)
    {
        try
        {
            if (culture == null && feature == null)
            {
                // Clear all translation caches
                _logger.LogInformation("Invalidating all translation caches");
                
                // Clear memory cache (we can't selectively clear, so we'll rely on expiration)
                // For distributed cache, we'd need to track keys or use a cache invalidation pattern
                
                foreach (var supportedCulture in SupportedCultures)
                {
                    var availableFeatures = await GetAvailableFeaturesAsync(supportedCulture, cancellationToken);
                    foreach (var availableFeature in availableFeatures)
                    {
                        var cacheKey = $"translations:{supportedCulture}:{availableFeature}";
                        _memoryCache.Remove(cacheKey);
                        await _distributedCache.RemoveAsync(cacheKey, cancellationToken);
                    }
                }
            }
            else if (culture != null && feature != null)
            {
                // Clear specific culture and feature
                var cacheKey = $"translations:{culture}:{feature}";
                _memoryCache.Remove(cacheKey);
                await _distributedCache.RemoveAsync(cacheKey, cancellationToken);
                _logger.LogInformation("Invalidated cache for {Culture}:{Feature}", culture, feature);
            }
            else if (culture != null)
            {
                // Clear all features for a specific culture
                var availableFeatures = await GetAvailableFeaturesAsync(culture, cancellationToken);
                foreach (var availableFeature in availableFeatures)
                {
                    var cacheKey = $"translations:{culture}:{availableFeature}";
                    _memoryCache.Remove(cacheKey);
                    await _distributedCache.RemoveAsync(cacheKey, cancellationToken);
                }
                _logger.LogInformation("Invalidated cache for culture: {Culture}", culture);
            }
            else if (feature != null)
            {
                // Clear specific feature for all cultures
                foreach (var supportedCulture in SupportedCultures)
                {
                    var cacheKey = $"translations:{supportedCulture}:{feature}";
                    _memoryCache.Remove(cacheKey);
                    await _distributedCache.RemoveAsync(cacheKey, cancellationToken);
                }
                _logger.LogInformation("Invalidated cache for feature: {Feature}", feature);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error invalidating cache for culture: {Culture}, feature: {Feature}", culture, feature);
        }
    }

    public Task<IEnumerable<string>> GetSupportedCulturesAsync(CancellationToken cancellationToken = default)
    {
        return Task.FromResult<IEnumerable<string>>(SupportedCultures);
    }

    public async Task<IEnumerable<string>> GetAvailableFeaturesAsync(string culture, CancellationToken cancellationToken = default)
    {
        var features = new HashSet<string>();
        
        try
        {
            var resourcesPath = Path.Combine(_environment.ContentRootPath, "Resources");
            
            // Check Main app features
            var mainPath = Path.Combine(resourcesPath, "Main", "Community");
            if (Directory.Exists(mainPath))
            {
                var mainFeatures = Directory.GetDirectories(mainPath)
                    .Select(Path.GetFileName)
                    .Where(name => !string.IsNullOrEmpty(name))
                    .Cast<string>();
                
                foreach (var feature in mainFeatures)
                {
                    var culturePath = Path.Combine(mainPath, feature, $"{culture}.json");
                    if (File.Exists(culturePath))
                    {
                        features.Add(feature.ToLowerInvariant());
                    }
                }
            }
            
            // Check Dashboard features
            var dashboardPath = Path.Combine(resourcesPath, "Dashboard");
            if (Directory.Exists(dashboardPath))
            {
                var dashboardFeatures = GetFeaturesRecursively(dashboardPath, culture);
                foreach (var feature in dashboardFeatures)
                {
                    features.Add(feature);
                }
            }
            
            // Check Shared features
            var sharedPath = Path.Combine(resourcesPath, "Shared");
            if (Directory.Exists(sharedPath))
            {
                var sharedFeatures = GetFeaturesRecursively(sharedPath, culture);
                foreach (var feature in sharedFeatures)
                {
                    features.Add(feature);
                }
            }
            
            // Check Identity features
            var identityPath = Path.Combine(resourcesPath, "Identity");
            if (Directory.Exists(identityPath))
            {
                var identityFeatures = GetFeaturesRecursively(identityPath, culture);
                foreach (var feature in identityFeatures)
                {
                    features.Add(feature);
                }
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting available features for culture: {Culture}", culture);
        }

        return features;
    }

    private async Task<Dictionary<string, string>> LoadFromResourceFilesAsync(string culture, string feature, CancellationToken cancellationToken)
    {
        var resourcePath = GetResourcePath(culture, feature);
        
        if (!File.Exists(resourcePath))
        {
            // Fallback to en-US
            resourcePath = GetResourcePath("en-US", feature);
        }

        if (!File.Exists(resourcePath))
        {
            _logger.LogWarning("Translation resource not found: {ResourcePath}", resourcePath);
            return new Dictionary<string, string>();
        }

        try
        {
            var json = await File.ReadAllTextAsync(resourcePath, cancellationToken);
            var nested = JsonSerializer.Deserialize<Dictionary<string, object>>(json);
            
            if (nested == null)
            {
                return new Dictionary<string, string>();
            }
            
            return FlattenTranslations(nested);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error loading translation resource: {ResourcePath}", resourcePath);
            return new Dictionary<string, string>();
        }
    }

    private Dictionary<string, string> FlattenTranslations(Dictionary<string, object> nested)
    {
        var flattened = new Dictionary<string, string>();
        FlattenRecursive(nested, "", flattened);
        return flattened;
    }

    private void FlattenRecursive(Dictionary<string, object> source, string prefix, Dictionary<string, string> result)
    {
        foreach (var kvp in source)
        {
            var key = string.IsNullOrEmpty(prefix) ? kvp.Key : $"{prefix}.{kvp.Key}";
            
            if (kvp.Value is JsonElement element)
            {
                if (element.ValueKind == JsonValueKind.Object)
                {
                    var nested = JsonSerializer.Deserialize<Dictionary<string, object>>(element.GetRawText());
                    if (nested != null)
                    {
                        FlattenRecursive(nested, key, result);
                    }
                }
                else if (element.ValueKind == JsonValueKind.String)
                {
                    var stringValue = element.GetString();
                    if (stringValue != null)
                    {
                        result[key] = stringValue;
                    }
                }
            }
            else if (kvp.Value is string stringValue)
            {
                result[key] = stringValue;
            }
            else if (kvp.Value != null)
            {
                // Handle nested objects that aren't JsonElement
                var nestedJson = JsonSerializer.Serialize(kvp.Value);
                var nestedDict = JsonSerializer.Deserialize<Dictionary<string, object>>(nestedJson);
                if (nestedDict != null)
                {
                    FlattenRecursive(nestedDict, key, result);
                }
            }
        }
    }

    private string GetResourcePath(string culture, string feature)
    {
        var resourcesPath = Path.Combine(_environment.ContentRootPath, "Resources");
        
        // Try different possible paths based on feature name
        var possiblePaths = new[]
        {
            Path.Combine(resourcesPath, "Main", "Community", feature, $"{culture}.json"),
            Path.Combine(resourcesPath, "Dashboard", "Community", feature, $"{culture}.json"),
            Path.Combine(resourcesPath, "Shared", feature, $"{culture}.json"),
            Path.Combine(resourcesPath, "Identity", feature, $"{culture}.json"),
            Path.Combine(resourcesPath, feature, $"{culture}.json")
        };

        foreach (var path in possiblePaths)
        {
            if (File.Exists(path))
            {
                return path;
            }
        }

        // Return the first path as default (Main/Community)
        return possiblePaths[0];
    }

    private IEnumerable<string> GetFeaturesRecursively(string basePath, string culture)
    {
        var features = new List<string>();
        
        try
        {
            if (!Directory.Exists(basePath))
            {
                return features;
            }

            // Look for culture files directly in this directory
            var cultureFile = Path.Combine(basePath, $"{culture}.json");
            if (File.Exists(cultureFile))
            {
                var featureName = Path.GetFileName(basePath);
                if (!string.IsNullOrEmpty(featureName))
                {
                    features.Add(featureName.ToLowerInvariant());
                }
            }

            // Recursively check subdirectories
            foreach (var subdirectory in Directory.GetDirectories(basePath))
            {
                var subFeatures = GetFeaturesRecursively(subdirectory, culture);
                features.AddRange(subFeatures);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting features recursively from: {BasePath}", basePath);
        }

        return features;
    }

    private async Task<Dictionary<string, string>?> GetFromDistributedCacheAsync(string cacheKey, CancellationToken cancellationToken)
    {
        try
        {
            var cachedBytes = await _distributedCache.GetAsync(cacheKey, cancellationToken);
            if (cachedBytes != null)
            {
                var cachedJson = System.Text.Encoding.UTF8.GetString(cachedBytes);
                return JsonSerializer.Deserialize<Dictionary<string, string>>(cachedJson);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting from distributed cache: {CacheKey}", cacheKey);
        }

        return null;
    }

    private async Task SetInDistributedCacheAsync(string cacheKey, Dictionary<string, string> translations, CancellationToken cancellationToken)
    {
        try
        {
            var json = JsonSerializer.Serialize(translations);
            var bytes = System.Text.Encoding.UTF8.GetBytes(json);
            
            var options = new DistributedCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = DistributedCacheExpiration
            };
            
            await _distributedCache.SetAsync(cacheKey, bytes, options, cancellationToken);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error setting distributed cache: {CacheKey}", cacheKey);
        }
    }
}
   