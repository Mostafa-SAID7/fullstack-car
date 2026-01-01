using Application.Features.Shared.Caching.Interfaces.Services;
using Application.Features.Shared.Caching.Services;
using Microsoft.AspNetCore.Http;
using System.Text.Json;
using System.Threading.Tasks;

namespace WebAPI.Middleware
{
    public class CacheInvalidationMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ICacheInvalidationStrategy _invalidationStrategy;

        public CacheInvalidationMiddleware(RequestDelegate next, ICacheInvalidationStrategy invalidationStrategy)
        {
            _next = next;
            _invalidationStrategy = invalidationStrategy;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            await _next(context);

            // Only process successful POST, PUT, DELETE requests
            if (context.Response.StatusCode >= 200 && context.Response.StatusCode < 300)
            {
                var method = context.Request.Method;
                var path = context.Request.Path.Value?.ToLower();

                if (HttpMethods.IsPost(method) || HttpMethods.IsPut(method) || HttpMethods.IsDelete(method))
                {
                    await InvalidateCacheBasedOnPath(path, context);
                }
            }
        }

        private async Task InvalidateCacheBasedOnPath(string? path, HttpContext context)
        {
            if (string.IsNullOrEmpty(path)) return;

            try
            {
                // Extract entity type and ID from path
                var segments = path.Split('/', StringSplitOptions.RemoveEmptyEntries);
                
                if (segments.Length >= 3) // e.g., /api/v1/users/123
                {
                    var entityType = segments[2].TrimEnd('s'); // Remove plural 's'
                    var entityId = segments.Length > 3 ? segments[3] : null;

                    // Capitalize first letter for entity type
                    entityType = char.ToUpper(entityType[0]) + entityType[1..];

                    if (!string.IsNullOrEmpty(entityId))
                    {
                        await _invalidationStrategy.InvalidateAsync(entityType, entityId);
                        await _invalidationStrategy.InvalidateRelatedAsync(entityType, entityId);
                    }
                    else
                    {
                        // For list operations, invalidate list caches
                        await _invalidationStrategy.InvalidateByPatternAsync($"{entityType.ToLower()}:list:*");
                        await _invalidationStrategy.InvalidateByPatternAsync($"{entityType.ToLower()}s:*");
                    }
                }
            }
            catch (Exception ex)
            {
                // Log error but don't fail the request
                var logger = context.RequestServices.GetService<ILogger<CacheInvalidationMiddleware>>();
                logger?.LogError(ex, "Error in cache invalidation middleware for path: {Path}", path);
            }
        }
    }
}