using Application.Features.Shared.Caching.Interfaces.Services;
using Application.Features.Shared.Caching.Models;
using Infrastructure.Common;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using StackExchange.Redis;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Features.Shared.Caching.Services
{
    public class AdvancedCacheService : IAdvancedCacheService
    {
        private readonly IMemoryCache _memoryCache;
        private readonly IDistributedCache _distributedCache;
        private readonly IDatabase? _redisDatabase;
        private readonly CacheSettings _settings;
        private readonly ILogger<AdvancedCacheService> _logger;
        private readonly ICacheKeyBuilder _keyBuilder;
        
        // Tag tracking for invalidation
        private readonly ConcurrentDictionary<string, HashSet<string>> _tagToKeys = new();
        private readonly ConcurrentDictionary<string, HashSet<string>> _keyToTags = new();
        
        // Statistics tracking
        private readonly CacheStatistics _statistics = new();
        private readonly SemaphoreSlim _lockSemaphore = new(1, 1);

        public AdvancedCacheService(
            IMemoryCache memoryCache,
            IDistributedCache distributedCache,
            IOptions<CacheSettings> settings,
            ILogger<AdvancedCacheService> logger,
            ICacheKeyBuilder keyBuilder,
            IConnectionMultiplexer? redis = null)
        {
            _memoryCache = memoryCache;
            _distributedCache = distributedCache;
            _settings = settings.Value;
            _logger = logger;
            _keyBuilder = keyBuilder;
            _redisDatabase = redis?.GetDatabase(_settings.RedisDatabase);
        }

        public async Task<T?> GetAsync<T>(string key, CancellationToken cancellationToken = default) where T : class
        {
            if (!_settings.Enabled) return default;

            _statistics.TotalRequests++;

            try
            {
                // Try memory cache first
                if (_settings.EnableMemoryCache && _memoryCache.TryGetValue(key, out T? value))
                {
                    _statistics.CacheHits++;
                    _logger.LogDebug("Memory cache hit for key: {Key}", key);
                    return value;
                }

                // Try distributed cache
                if (_settings.EnableDistributedCache && _settings.UseRedis)
                {
                    var cachedResponse = await _distributedCache.GetStringAsync(key, cancellationToken);
                    if (cachedResponse != null)
                    {
                        var deserializedValue = JsonSerializer.Deserialize<T>(cachedResponse);
                        if (deserializedValue != null)
                        {
                            // Populate memory cache for faster subsequent access
                            if (_settings.EnableMemoryCache)
                            {
                                var memoryOptions = new MemoryCacheEntryOptions
                                {
                                    AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(_settings.DefaultExpirationMinutes / 2),
                                    Priority = CacheItemPriority.Normal
                                };
                                _memoryCache.Set(key, deserializedValue, memoryOptions);
                            }

                            _statistics.CacheHits++;
                            _logger.LogDebug("Distributed cache hit for key: {Key}", key);
                            return deserializedValue;
                        }
                    }
                }

                _statistics.CacheMisses++;
                _logger.LogDebug("Cache miss for key: {Key}", key);
                return default;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting cache value for key: {Key}", key);
                return default;
            }
        }

        public async Task SetAsync<T>(string key, T value, TimeSpan? expiration = null, CancellationToken cancellationToken = default)
        {
            if (!_settings.Enabled || value == null) return;

            var exp = expiration ?? TimeSpan.FromMinutes(_settings.DefaultExpirationMinutes);

            try
            {
                // Set in memory cache
                if (_settings.EnableMemoryCache)
                {
                    var memoryOptions = new MemoryCacheEntryOptions
                    {
                        AbsoluteExpirationRelativeToNow = exp,
                        Priority = CacheItemPriority.Normal,
                        Size = 1
                    };
                    _memoryCache.Set(key, value, memoryOptions);
                }

                // Set in distributed cache
                if (_settings.EnableDistributedCache && _settings.UseRedis)
                {
                    var distributedOptions = new DistributedCacheEntryOptions
                    {
                        AbsoluteExpirationRelativeToNow = exp
                    };

                    var serializedValue = JsonSerializer.Serialize(value);
                    await _distributedCache.SetStringAsync(key, serializedValue, distributedOptions, cancellationToken);
                }

                _logger.LogDebug("Cache set for key: {Key} with expiration: {Expiration}", key, exp);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error setting cache value for key: {Key}", key);
            }
        }

        public async Task RemoveAsync(string key, CancellationToken cancellationToken = default)
        {
            try
            {
                _memoryCache.Remove(key);

                if (_settings.UseRedis)
                {
                    await _distributedCache.RemoveAsync(key, cancellationToken);
                }

                // Remove from tag tracking
                if (_keyToTags.TryRemove(key, out var tags))
                {
                    foreach (var tag in tags)
                    {
                        if (_tagToKeys.TryGetValue(tag, out var keys))
                        {
                            keys.Remove(key);
                        }
                    }
                }

                _logger.LogDebug("Cache removed for key: {Key}", key);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error removing cache value for key: {Key}", key);
            }
        }

        public async Task RemoveByTagAsync(string tag, CancellationToken cancellationToken = default)
        {
            if (!_settings.EnableTagBasedInvalidation) return;

            try
            {
                if (_tagToKeys.TryGetValue(tag, out var keys))
                {
                    var keyList = keys.ToList();
                    foreach (var key in keyList)
                    {
                        await RemoveAsync(key, cancellationToken);
                    }
                    _tagToKeys.TryRemove(tag, out _);
                }

                // Also try Redis pattern-based removal if available
                if (_redisDatabase != null)
                {
                    var tagKey = _keyBuilder.BuildTagKey(tag);
                    var taggedKeys = await _redisDatabase.SetMembersAsync(tagKey);
                    
                    if (taggedKeys.Length > 0)
                    {
                        var tasks = taggedKeys.Select(k => _redisDatabase.KeyDeleteAsync((RedisKey)k.ToString())).ToArray();
                        await Task.WhenAll(tasks);
                        await _redisDatabase.KeyDeleteAsync(tagKey);
                    }
                }

                _logger.LogDebug("Cache invalidated for tag: {Tag}", tag);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error invalidating cache for tag: {Tag}", tag);
            }
        }

        public async Task SetWithTagAsync<T>(string key, T value, string tag, TimeSpan? expiration = null, CancellationToken cancellationToken = default)
        {
            await SetAsync(key, value, expiration, cancellationToken);

            if (_settings.EnableTagBasedInvalidation)
            {
                // Track tag relationships
                _tagToKeys.AddOrUpdate(tag, new HashSet<string> { key }, (_, existing) =>
                {
                    existing.Add(key);
                    return existing;
                });

                _keyToTags.AddOrUpdate(key, new HashSet<string> { tag }, (_, existing) =>
                {
                    existing.Add(tag);
                    return existing;
                });

                // Store in Redis for distributed tag tracking
                if (_redisDatabase != null)
                {
                    var tagKey = _keyBuilder.BuildTagKey(tag);
                    await _redisDatabase.SetAddAsync(tagKey, key);
                    await _redisDatabase.KeyExpireAsync(tagKey, TimeSpan.FromMinutes(_settings.TagExpirationMinutes));
                }
            }
        }

        public async Task<Dictionary<string, T?>> GetManyAsync<T>(IEnumerable<string> keys, CancellationToken cancellationToken = default) where T : class
        {
            var result = new Dictionary<string, T?>();
            var keyList = keys.ToList();

            if (!_settings.Enabled || !keyList.Any()) return result;

            try
            {
                // Try memory cache first
                var memoryMisses = new List<string>();
                foreach (var key in keyList)
                {
                    if (_settings.EnableMemoryCache && _memoryCache.TryGetValue(key, out T? value))
                    {
                        result[key] = value;
                    }
                    else
                    {
                        memoryMisses.Add(key);
                    }
                }

                // Try distributed cache for memory misses
                if (_settings.EnableDistributedCache && _settings.UseRedis && memoryMisses.Any())
                {
                    var tasks = memoryMisses.Select(async key =>
                    {
                        var cachedResponse = await _distributedCache.GetStringAsync(key, cancellationToken);
                        if (cachedResponse != null)
                        {
                            var deserializedValue = JsonSerializer.Deserialize<T>(cachedResponse);
                            if (deserializedValue != null)
                            {
                                result[key] = deserializedValue;
                                
                                // Populate memory cache
                                if (_settings.EnableMemoryCache)
                                {
                                    _memoryCache.Set(key, deserializedValue, TimeSpan.FromMinutes(_settings.DefaultExpirationMinutes / 2));
                                }
                            }
                        }
                    });

                    await Task.WhenAll(tasks);
                }

                // Add null entries for complete misses
                foreach (var key in keyList.Where(k => !result.ContainsKey(k)))
                {
                    result[key] = null;
                }

                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting multiple cache values");
                return result;
            }
        }

        public async Task SetManyAsync<T>(Dictionary<string, T> keyValuePairs, TimeSpan? expiration = null, CancellationToken cancellationToken = default)
        {
            if (!_settings.Enabled || !keyValuePairs.Any()) return;

            var tasks = keyValuePairs.Select(kvp => SetAsync(kvp.Key, kvp.Value, expiration, cancellationToken));
            await Task.WhenAll(tasks);
        }

        public async Task RemoveManyAsync(IEnumerable<string> keys, CancellationToken cancellationToken = default)
        {
            var tasks = keys.Select(key => RemoveAsync(key, cancellationToken));
            await Task.WhenAll(tasks);
        }

        public async Task<IEnumerable<string>> GetKeysByPatternAsync(string pattern, CancellationToken cancellationToken = default)
        {
            if (_redisDatabase == null) return Enumerable.Empty<string>();

            try
            {
                var server = _redisDatabase.Multiplexer.GetServer(_redisDatabase.Multiplexer.GetEndPoints().First());
                var keys = server.Keys(pattern: pattern).Select(k => k.ToString());
                return keys;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting keys by pattern: {Pattern}", pattern);
                return Enumerable.Empty<string>();
            }
        }

        public async Task RemoveByPatternAsync(string pattern, CancellationToken cancellationToken = default)
        {
            var keys = await GetKeysByPatternAsync(pattern, cancellationToken);
            await RemoveManyAsync(keys, cancellationToken);
        }

        public async Task<IEnumerable<string>> GetKeysByTagAsync(string tag, CancellationToken cancellationToken = default)
        {
            if (_tagToKeys.TryGetValue(tag, out var keys))
            {
                return keys.ToList();
            }

            if (_redisDatabase != null)
            {
                var tagKey = _keyBuilder.BuildTagKey(tag);
                var redisKeys = await _redisDatabase.SetMembersAsync(tagKey);
                return redisKeys.Select(k => k.ToString());
            }

            return Enumerable.Empty<string>();
        }

        public async Task InvalidateTagAsync(string tag, CancellationToken cancellationToken = default)
        {
            await RemoveByTagAsync(tag, cancellationToken);
        }

        public async Task InvalidateTagsAsync(IEnumerable<string> tags, CancellationToken cancellationToken = default)
        {
            var tasks = tags.Select(tag => InvalidateTagAsync(tag, cancellationToken));
            await Task.WhenAll(tasks);
        }

        public Task<CacheStatistics> GetStatisticsAsync(CancellationToken cancellationToken = default)
        {
            _statistics.LastUpdated = DateTime.UtcNow;
            return Task.FromResult(_statistics);
        }

        public async Task<bool> ExistsAsync(string key, CancellationToken cancellationToken = default)
        {
            if (_settings.EnableMemoryCache && _memoryCache.TryGetValue(key, out _))
            {
                return true;
            }

            if (_settings.EnableDistributedCache && _settings.UseRedis)
            {
                var exists = await _distributedCache.GetStringAsync(key, cancellationToken);
                return exists != null;
            }

            return false;
        }

        public async Task<T?> GetOrSetAsync<T>(string key, Func<Task<T>> factory, TimeSpan? expiration = null, CancellationToken cancellationToken = default) where T : class
        {
            var cached = await GetAsync<T>(key, cancellationToken);
            if (cached != null) return cached;

            var value = await factory();
            if (value != null)
            {
                await SetAsync(key, value, expiration, cancellationToken);
            }

            return value;
        }

        public async Task<T?> GetOrSetWithLockAsync<T>(string key, Func<Task<T>> factory, TimeSpan? expiration = null, TimeSpan? lockTimeout = null, CancellationToken cancellationToken = default) where T : class
        {
            var cached = await GetAsync<T>(key, cancellationToken);
            if (cached != null) return cached;

            var timeout = lockTimeout ?? TimeSpan.FromSeconds(30);
            var lockKey = $"lock:{key}";

            try
            {
                await _lockSemaphore.WaitAsync(timeout, cancellationToken);

                // Double-check after acquiring lock
                cached = await GetAsync<T>(key, cancellationToken);
                if (cached != null) return cached;

                var value = await factory();
                if (value != null)
                {
                    await SetAsync(key, value, expiration, cancellationToken);
                }

                return value;
            }
            finally
            {
                _lockSemaphore.Release();
            }
        }

        public async Task SetWithSlidingExpirationAsync<T>(string key, T value, TimeSpan slidingExpiration, TimeSpan? absoluteExpiration = null, CancellationToken cancellationToken = default)
        {
            if (!_settings.Enabled || value == null) return;

            try
            {
                if (_settings.EnableMemoryCache)
                {
                    var memoryOptions = new MemoryCacheEntryOptions
                    {
                        SlidingExpiration = slidingExpiration,
                        Priority = CacheItemPriority.Normal,
                        Size = 1
                    };

                    if (absoluteExpiration.HasValue)
                    {
                        memoryOptions.AbsoluteExpirationRelativeToNow = absoluteExpiration;
                    }

                    _memoryCache.Set(key, value, memoryOptions);
                }

                if (_settings.EnableDistributedCache && _settings.UseRedis)
                {
                    var distributedOptions = new DistributedCacheEntryOptions
                    {
                        SlidingExpiration = slidingExpiration
                    };

                    if (absoluteExpiration.HasValue)
                    {
                        distributedOptions.AbsoluteExpirationRelativeToNow = absoluteExpiration;
                    }

                    var serializedValue = JsonSerializer.Serialize(value);
                    await _distributedCache.SetStringAsync(key, serializedValue, distributedOptions, cancellationToken);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error setting cache with sliding expiration for key: {Key}", key);
            }
        }

        public async Task RefreshAsync(string key, CancellationToken cancellationToken = default)
        {
            if (_settings.UseRedis)
            {
                await _distributedCache.RefreshAsync(key, cancellationToken);
            }
        }

        public async Task<bool> TryRefreshAsync(string key, CancellationToken cancellationToken = default)
        {
            try
            {
                await RefreshAsync(key, cancellationToken);
                return true;
            }
            catch
            {
                return false;
            }
        }
    }
}