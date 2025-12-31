using Application.Features.Shared.Caching.Interfaces.Services;
using Application.Features.Shared.Caching.Models;

namespace Application.Features.Shared.Caching.Interfaces.Services
{
    public interface IAdvancedCacheService : ICacheService
    {
        // Bulk operations
        Task<Dictionary<string, T?>> GetManyAsync<T>(IEnumerable<string> keys, CancellationToken cancellationToken = default) where T : class;
        Task SetManyAsync<T>(Dictionary<string, T> keyValuePairs, TimeSpan? expiration = null, CancellationToken cancellationToken = default);
        Task RemoveManyAsync(IEnumerable<string> keys, CancellationToken cancellationToken = default);
        
        // Pattern-based operations
        Task<IEnumerable<string>> GetKeysByPatternAsync(string pattern, CancellationToken cancellationToken = default);
        Task RemoveByPatternAsync(string pattern, CancellationToken cancellationToken = default);
        
        // Advanced tag operations
        Task<IEnumerable<string>> GetKeysByTagAsync(string tag, CancellationToken cancellationToken = default);
        Task InvalidateTagAsync(string tag, CancellationToken cancellationToken = default);
        Task InvalidateTagsAsync(IEnumerable<string> tags, CancellationToken cancellationToken = default);
        
        // Cache statistics
        Task<CacheStatistics> GetStatisticsAsync(CancellationToken cancellationToken = default);
        
        // Conditional operations
        Task<bool> ExistsAsync(string key, CancellationToken cancellationToken = default);
        Task<T?> GetOrSetAsync<T>(string key, Func<Task<T>> factory, TimeSpan? expiration = null, CancellationToken cancellationToken = default) where T : class;
        
        // Lock-based operations for cache stampede prevention
        Task<T?> GetOrSetWithLockAsync<T>(string key, Func<Task<T>> factory, TimeSpan? expiration = null, TimeSpan? lockTimeout = null, CancellationToken cancellationToken = default) where T : class;
        
        // Sliding expiration
        Task SetWithSlidingExpirationAsync<T>(string key, T value, TimeSpan slidingExpiration, TimeSpan? absoluteExpiration = null, CancellationToken cancellationToken = default);
        
        // Refresh operations
        Task RefreshAsync(string key, CancellationToken cancellationToken = default);
        Task<bool> TryRefreshAsync(string key, CancellationToken cancellationToken = default);
    }
}