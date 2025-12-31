using Infrastructure.Common;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.OutputCaching;
using Microsoft.Extensions.Options;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Infrastructure.Services.Caching
{
    public class CustomOutputCachePolicy : IOutputCachePolicy
    {
        private readonly CacheSettings _settings;

        public CustomOutputCachePolicy(IOptions<CacheSettings> settings)
        {
            _settings = settings.Value;
        }

        public ValueTask CacheRequestAsync(OutputCacheContext context, CancellationToken cancellation)
        {
            if (!_settings.EnableOutputCaching)
            {
                context.EnableOutputCaching = false;
                return ValueTask.CompletedTask;
            }

            var request = context.HttpContext.Request;
            var path = request.Path.Value?.ToLower();

            // Don't cache authenticated user-specific endpoints
            if (context.HttpContext.User.Identity?.IsAuthenticated == true)
            {
                var userSpecificEndpoints = new[] { "/api/v1/profile", "/api/v1/auth", "/api/v1/notifications" };
                if (userSpecificEndpoints.Any(endpoint => path?.StartsWith(endpoint) == true))
                {
                    context.EnableOutputCaching = false;
                    return ValueTask.CompletedTask;
                }
            }

            // Only cache GET and HEAD requests
            if (!HttpMethods.IsGet(request.Method) && !HttpMethods.IsHead(request.Method))
            {
                context.EnableOutputCaching = false;
                return ValueTask.CompletedTask;
            }

            context.EnableOutputCaching = true;
            context.ResponseExpirationTimeSpan = GetCacheDuration(path);

            // Add vary by headers
            if (_settings.OutputCacheVaryByUser && context.HttpContext.User.Identity?.IsAuthenticated == true)
            {
                var headerNames = context.CacheVaryByRules.HeaderNames.ToList();
                headerNames.Add("Authorization");
                context.CacheVaryByRules.HeaderNames = headerNames.ToArray();
            }

            if (_settings.OutputCacheVaryByRole && context.HttpContext.User.Identity?.IsAuthenticated == true)
            {
                var roles = context.HttpContext.User.Claims
                    .Where(c => c.Type == "role")
                    .Select(c => c.Value)
                    .ToArray();
                
                if (roles.Any())
                {
                    context.CacheVaryByRules.VaryByValues.Add("roles", string.Join(",", roles));
                }
            }

            // Add query parameters to vary by
            var queryKeys = GetVaryByQueryKeys(path);
            foreach (var key in queryKeys)
            {
                if (key == "*")
                {
                    context.CacheVaryByRules.QueryKeys = "*";
                    break;
                }
                context.CacheVaryByRules.QueryKeys = context.CacheVaryByRules.QueryKeys.Append(key).ToArray();
            }

            return ValueTask.CompletedTask;
        }

        public ValueTask ServeFromCacheAsync(OutputCacheContext context, CancellationToken cancellation)
        {
            return ValueTask.CompletedTask;
        }

        public ValueTask ServeFromOriginAsync(OutputCacheContext context, CancellationToken cancellation)
        {
            return ValueTask.CompletedTask;
        }

        public ValueTask ServeResponseAsync(OutputCacheContext context, CancellationToken cancellation)
        {
            return ValueTask.CompletedTask;
        }

        private TimeSpan GetCacheDuration(string? path)
        {
            // Static content - cache longer
            if (path?.Contains("/swagger") == true)
                return TimeSpan.FromHours(1);

            // Localization - cache for 30 minutes
            if (path?.StartsWith("/api/v1/localization") == true)
                return TimeSpan.FromMinutes(30);

            // Health checks - cache for 30 seconds
            if (path?.StartsWith("/api/v1/health") == true)
                return TimeSpan.FromSeconds(30);

            // List endpoints - cache for 5 minutes
            if (path?.Contains("/list") == true || path?.EndsWith("s") == true)
                return TimeSpan.FromMinutes(5);

            // Default cache duration
            return TimeSpan.FromSeconds(_settings.OutputCacheDefaultExpiration);
        }

        private string[] GetVaryByQueryKeys(string? path)
        {
            // For search endpoints
            if (path?.Contains("/search") == true)
                return new[] { "q", "page", "size", "sort" };

            // For list endpoints
            if (path?.Contains("/list") == true || path?.EndsWith("s") == true)
                return new[] { "page", "size", "sort", "filter" };

            // Default - vary by all query parameters
            return new[] { "*" };
        }
    }
}