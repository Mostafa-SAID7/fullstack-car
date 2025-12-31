using Application.Features.Shared.Caching.DTOs.Requests;
using Application.Features.Shared.Caching.DTOs.Responses;
using Application.Features.Shared.Caching.Interfaces.Services;
using Application.Features.Shared.Caching.Models;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Features.Shared.Caching.Services
{
    public interface ICacheManagerService
    {
        Task<CacheResponse<T>> GetAsync<T>(string key, CancellationToken cancellationToken = default) where T : class;
        Task<CacheOperationResponse> SetAsync<T>(CacheRequest request, T value, CancellationToken cancellationToken = default);
        Task<BulkCacheResponse<T>> GetManyAsync<T>(string[] keys, CancellationToken cancellationToken = default) where T : class;
        Task<CacheOperationResponse> SetManyAsync<T>(BulkCacheRequest<T> request, CancellationToken cancellationToken = default);
        Task<CacheOperationResponse> InvalidateAsync(CacheInvalidationRequest request, CancellationToken cancellationToken = default);
        Task<CacheStatistics> GetStatisticsAsync(CancellationToken cancellationToken = default);
    }

    public class CacheManagerService : ICacheManagerService
    {
        private readonly IAdvancedCacheService _cacheService;
        private readonly ICacheInvalidationStrategy _invalidationStrategy;

        public CacheManagerService(
            IAdvancedCacheService cacheService,
            ICacheInvalidationStrategy invalidationStrategy)
        {
            _cacheService = cacheService;
            _invalidationStrategy = invalidationStrategy;
        }

        public async Task<CacheResponse<T>> GetAsync<T>(string key, CancellationToken cancellationToken = default) where T : class
        {
            var startTime = DateTime.UtcNow;
            var data = await _cacheService.GetAsync<T>(key, cancellationToken);
            
            return new CacheResponse<T>
            {
                Success = data != null,
                Data = data,
                Key = key,
                IsFromCache = data != null,
                CachedAt = data != null ? startTime : null
            };
        }

        public async Task<CacheOperationResponse> SetAsync<T>(CacheRequest request, T value, CancellationToken cancellationToken = default)
        {
            var startTime = DateTime.UtcNow;
            
            if (!string.IsNullOrEmpty(request.Tag))
            {
                await _cacheService.SetWithTagAsync(request.Key, value, request.Tag, request.Expiration, cancellationToken);
            }
            else
            {
                await _cacheService.SetAsync(request.Key, value, request.Expiration, cancellationToken);
            }
            
            var duration = DateTime.UtcNow - startTime;
            
            return new CacheOperationResponse
            {
                Success = true,
                Key = request.Key,
                AffectedKeys = 1,
                Duration = duration,
                Message = "Cache entry set successfully"
            };
        }

        public async Task<BulkCacheResponse<T>> GetManyAsync<T>(string[] keys, CancellationToken cancellationToken = default) where T : class
        {
            var data = await _cacheService.GetManyAsync<T>(keys, cancellationToken);
            var hits = data.Values.Count(v => v != null);
            
            return new BulkCacheResponse<T>
            {
                Success = true,
                Data = data,
                TotalRequested = keys.Length,
                CacheHits = hits,
                CacheMisses = keys.Length - hits,
                FailedKeys = data.Where(kvp => kvp.Value == null).Select(kvp => kvp.Key).ToList()
            };
        }

        public async Task<CacheOperationResponse> SetManyAsync<T>(BulkCacheRequest<T> request, CancellationToken cancellationToken = default)
        {
            var startTime = DateTime.UtcNow;
            await _cacheService.SetManyAsync(request.KeyValuePairs, request.Expiration, cancellationToken);
            var duration = DateTime.UtcNow - startTime;
            
            return new CacheOperationResponse
            {
                Success = true,
                AffectedKeys = request.KeyValuePairs.Count,
                Duration = duration,
                Message = $"Successfully cached {request.KeyValuePairs.Count} entries"
            };
        }

        public async Task<CacheOperationResponse> InvalidateAsync(CacheInvalidationRequest request, CancellationToken cancellationToken = default)
        {
            var startTime = DateTime.UtcNow;
            var affectedKeys = 0;

            if (request.Tags.Any())
            {
                await _cacheService.InvalidateTagsAsync(request.Tags, cancellationToken);
                affectedKeys += request.Tags.Length;
            }

            if (!string.IsNullOrEmpty(request.Pattern))
            {
                await _cacheService.RemoveByPatternAsync(request.Pattern, cancellationToken);
                affectedKeys++;
            }

            if (!string.IsNullOrEmpty(request.EntityType) && !string.IsNullOrEmpty(request.EntityId))
            {
                await _invalidationStrategy.InvalidateAsync(request.EntityType, request.EntityId, cancellationToken);
                affectedKeys++;
            }

            var duration = DateTime.UtcNow - startTime;
            
            return new CacheOperationResponse
            {
                Success = true,
                AffectedKeys = affectedKeys,
                Duration = duration,
                Message = "Cache invalidation completed successfully"
            };
        }

        public async Task<CacheStatistics> GetStatisticsAsync(CancellationToken cancellationToken = default)
        {
            return await _cacheService.GetStatisticsAsync(cancellationToken);
        }
    }
}