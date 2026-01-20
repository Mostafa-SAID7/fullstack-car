using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using Application.Features.Shared.Caching.Interfaces;
using Application.Features.Shared.Caching.Services;
using Application.Features.Shared.Caching.Models;
using StackExchange.Redis;
using CacheSettings = Application.Features.Shared.Caching.Models.CacheSettings;

namespace Infrastructure.Extensions
{
    public static class CachingExtensions
    {
        public static IServiceCollection AddCachingServices(this IServiceCollection services, IConfiguration configuration)
        {
            // Caching Services
            services.Configure<CacheSettings>(configuration.GetSection("CacheSettings"));
            services.AddMemoryCache(options =>
            {
                var cacheSettings = configuration.GetSection("CacheSettings").Get<CacheSettings>() ?? new CacheSettings();
                options.SizeLimit = cacheSettings.MaxMemoryCacheSize * 1024 * 1024; // Convert MB to bytes
                options.CompactionPercentage = cacheSettings.CompactionPercentage / 100.0;
                options.ExpirationScanFrequency = TimeSpan.FromSeconds(cacheSettings.ScanFrequencySeconds);
            });

            var cacheSettings = configuration.GetSection("CacheSettings").Get<CacheSettings>() ?? new CacheSettings();
            if (cacheSettings.Enabled && cacheSettings.UseRedis)
            {
                services.AddStackExchangeRedisCache(options =>
                {
                    options.Configuration = cacheSettings.RedisConnectionString;
                    options.InstanceName = cacheSettings.RedisKeyPrefix;
                });

                // Add Redis connection for advanced operations
                services.AddSingleton<IConnectionMultiplexer>(provider =>
                {
                    var connectionString = cacheSettings.RedisConnectionString;
                    var configuration = ConfigurationOptions.Parse(connectionString);
                    configuration.ConnectTimeout = cacheSettings.RedisConnectTimeout;
                    configuration.CommandMap = CommandMap.Create(new HashSet<string> { "INFO", "CONFIG", "CLUSTER", "PING", "ECHO", "CLIENT" }, available: false);
                    return ConnectionMultiplexer.Connect(configuration);
                });
            }
            else
            {
                services.AddDistributedMemoryCache();
            }

            // Register caching services
            services.AddSingleton<ICacheKeyBuilder, CacheKeyBuilder>();
            services.AddSingleton<ICacheService, CacheService>();
            services.AddSingleton<IAdvancedCacheService, AdvancedCacheService>();
            services.AddSingleton<ICacheInvalidationStrategy, CacheInvalidationStrategy>();

            return services;
        }
    }
}
