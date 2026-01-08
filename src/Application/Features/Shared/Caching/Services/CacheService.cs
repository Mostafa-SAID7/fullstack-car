using Application.Features.Shared.Caching.Interfaces.Services;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Options;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Features.Shared.Caching.Services
{
    public class CacheService : ICacheService
    {
        private readonly IMemoryCache _memoryCache;
        private readonly IDistributedCache _distributedCache;
        private readonly Application.Features.Shared.Caching.Models.CacheSettings _settings;

        public CacheService(
            IMemoryCache memoryCache,
            IDistributedCache distributedCache,
            IOptions<Application.Features.Shared.Caching.Models.CacheSettings> settings)
        {
            _memoryCache = memoryCache;
            _distributedCache = distributedCache;
            _settings = settings.Value;
        }

        public async Task<T?> GetAsync<T>(string key, CancellationToken cancellationToken = default) where T : class
        {
            if (!_settings.Enabled) return default;

            // Try memory cache first
            if (_memoryCache.TryGetValue(key, out T? value))
            {
                return value;
            }

            // Try distributed cache
            if (_settings.UseRedis)
            {
                var cachedResponse = await _distributedCache.GetStringAsync(key, cancellationToken);
                if (cachedResponse != null)
                {
                    var deserializedValue = JsonSerializer.Deserialize<T>(cachedResponse);
                    if (deserializedValue != null)
                    {
                        // Pop into memory cache for faster subsequent access
                        var memoryOptions = new MemoryCacheEntryOptions
                        {
                            AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(_settings.DefaultExpirationMinutes),
                            Size = 1
                        };
                        _memoryCache.Set(key, deserializedValue, memoryOptions);
                        return deserializedValue;
                    }
                }
            }

            return default;
        }

        public async Task SetAsync<T>(string key, T value, TimeSpan? expiration = null, CancellationToken cancellationToken = default)
        {
            if (!_settings.Enabled) return;

            var opts = new MemoryCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = expiration ?? TimeSpan.FromMinutes(_settings.DefaultExpirationMinutes),
                Size = 1
            };

            _memoryCache.Set(key, value, opts);

            if (_settings.UseRedis)
            {
                var distributedOpts = new DistributedCacheEntryOptions
                {
                    AbsoluteExpirationRelativeToNow = expiration ?? TimeSpan.FromMinutes(_settings.DefaultExpirationMinutes)
                };

                var serializedValue = JsonSerializer.Serialize(value);
                await _distributedCache.SetStringAsync(key, serializedValue, distributedOpts, cancellationToken);
            }
        }

        public async Task RemoveAsync(string key, CancellationToken cancellationToken = default)
        {
            _memoryCache.Remove(key);

            if (_settings.UseRedis)
            {
                await _distributedCache.RemoveAsync(key, cancellationToken);
            }
        }

        public async Task RemoveByTagAsync(string tag, CancellationToken cancellationToken = default)
        {
            // Tag-based invalidation in IDistributedCache often Requires a more complex implementation 
            // tracking keys per tag. For simplicity here, we'll focus on memory cache 
            // or specific Redis patterns if needed later.

            // This is a placeholder for a more robust tag system
            // In a real scenario, we'd store a List of keys for each tag in Redis.
            _memoryCache.Remove(tag);

            if (_settings.UseRedis)
            {
                await _distributedCache.RemoveAsync(tag, cancellationToken);
            }
        }

        public async Task SetWithTagAsync<T>(string key, T value, string tag, TimeSpan? expiration = null, CancellationToken cancellationToken = default)
        {
            await SetAsync(key, value, expiration, cancellationToken);
            // Optionally link the key to the tag here
        }
    }
}
