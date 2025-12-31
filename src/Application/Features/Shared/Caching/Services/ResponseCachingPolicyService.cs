using Infrastructure.Common;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using System;
using System.Linq;

namespace Application.Features.Shared.Caching.Services
{
    public interface IResponseCachingPolicyService
    {
        bool ShouldCacheResponse(HttpContext context);
        TimeSpan GetCacheDuration(HttpContext context);
        string[] GetVaryByHeaders(HttpContext context);
        string[] GetVaryByQueryKeys(HttpContext context);
    }

    public class ResponseCachingPolicyService : IResponseCachingPolicyService
    {
        private readonly CacheSettings _settings;

        public ResponseCachingPolicyService(IOptions<CacheSettings> settings)
        {
            _settings = settings.Value;
        }

        public bool ShouldCacheResponse(HttpContext context)
        {
            if (!_settings.EnableResponseCaching)
                return false;

            // Don't cache if user is authenticated and response varies by user
            if (context.User.Identity?.IsAuthenticated == true)
            {
                var path = context.Request.Path.Value?.ToLower();
                
                // Cache public endpoints even for authenticated users
                var publicEndpoints = new[] { "/api/v1/localization", "/api/v1/health", "/api/v1/version" };
                if (publicEndpoints.Any(endpoint => path?.StartsWith(endpoint) == true))
                    return true;

                // Don't cache user-specific data
                var userSpecificEndpoints = new[] { "/api/v1/profile", "/api/v1/auth", "/api/v1/notifications" };
                if (userSpecificEndpoints.Any(endpoint => path?.StartsWith(endpoint) == true))
                    return false;
            }

            // Don't cache POST, PUT, DELETE requests
            if (!HttpMethods.IsGet(context.Request.Method) && !HttpMethods.IsHead(context.Request.Method))
                return false;

            // Don't cache if response has errors
            if (context.Response.StatusCode >= 400)
                return false;

            return true;
        }

        public TimeSpan GetCacheDuration(HttpContext context)
        {
            var path = context.Request.Path.Value?.ToLower();

            // Static content - cache longer
            if (path?.Contains("/swagger") == true || path?.Contains("/css") == true || path?.Contains("/js") == true)
                return TimeSpan.FromHours(24);

            // Localization - cache for 1 hour
            if (path?.StartsWith("/api/v1/localization") == true)
                return TimeSpan.FromHours(1);

            // Health checks - cache for 1 minute
            if (path?.StartsWith("/api/v1/health") == true)
                return TimeSpan.FromMinutes(1);

            // Default cache duration
            return TimeSpan.FromSeconds(_settings.ResponseCacheMaxAge);
        }

        public string[] GetVaryByHeaders(HttpContext context)
        {
            var headers = _settings.ResponseCacheVaryByHeaders.ToList();

            // Add custom headers based on endpoint
            var path = context.Request.Path.Value?.ToLower();
            
            if (path?.StartsWith("/api/v1/localization") == true)
            {
                headers.Add("Accept-Language");
            }

            if (context.User.Identity?.IsAuthenticated == true)
            {
                headers.Add("Authorization");
            }

            return headers.Distinct().ToArray();
        }

        public string[] GetVaryByQueryKeys(HttpContext context)
        {
            if (!_settings.ResponseCacheVaryByQueryKeys)
                return Array.Empty<string>();

            var path = context.Request.Path.Value?.ToLower();

            // For search endpoints, vary by search parameters
            if (path?.Contains("/search") == true)
                return new[] { "q", "page", "size", "sort" };

            // For list endpoints, vary by pagination and filtering
            if (path?.Contains("/list") == true || path?.EndsWith("s") == true)
                return new[] { "page", "size", "sort", "filter" };

            // Default query keys to vary by
            return new[] { "*" };
        }
    }
}