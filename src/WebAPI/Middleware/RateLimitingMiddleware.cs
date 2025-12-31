using Application.Common.Interfaces.Infrastructure;
using System.Net;

namespace WebAPI.Middleware
{
    public class RateLimitingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly IRateLimitingService _rateLimitingService;
        private readonly ILogger<RateLimitingMiddleware> _logger;

        public RateLimitingMiddleware(
            RequestDelegate next,
            IRateLimitingService rateLimitingService,
            ILogger<RateLimitingMiddleware> logger)
        {
            _next = next;
            _rateLimitingService = rateLimitingService;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                var clientId = GetClientIdentifier(context);
                var endpoint = GetEndpointIdentifier(context);
                var rateLimitKey = $"{clientId}:{endpoint}";

                // Check rate limit
                var rateLimitResult = await _rateLimitingService.CheckRateLimitAsync(rateLimitKey, "default");

                if (!rateLimitResult.IsAllowed)
                {
                    _logger.LogWarning("Rate limit exceeded for client {ClientId} on endpoint {Endpoint}", 
                        clientId, endpoint);

                    // Add rate limit headers
                    context.Response.Headers.Append("X-RateLimit-Limit", "100");
                    context.Response.Headers.Append("X-RateLimit-Remaining", rateLimitResult.RemainingRequests.ToString());
                    context.Response.Headers.Append("X-RateLimit-Reset", rateLimitResult.ResetTime.ToString("O"));
                    context.Response.Headers.Append("Retry-After", ((int)rateLimitResult.RetryAfter.TotalSeconds).ToString());

                    context.Response.StatusCode = (int)HttpStatusCode.TooManyRequests;
                    await context.Response.WriteAsync("Rate limit exceeded. Please try again later.");
                    return;
                }

                // Add rate limit headers for successful requests
                context.Response.Headers.Append("X-RateLimit-Limit", "100");
                context.Response.Headers.Append("X-RateLimit-Remaining", rateLimitResult.RemainingRequests.ToString());
                context.Response.Headers.Append("X-RateLimit-Reset", rateLimitResult.ResetTime.ToString("O"));

                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in rate limiting middleware");
                await _next(context);
            }
        }

        private static string GetClientIdentifier(HttpContext context)
        {
            // Try to get user ID first
            var userId = context.User?.FindFirst("sub")?.Value ?? context.User?.FindFirst("id")?.Value;
            if (!string.IsNullOrEmpty(userId))
            {
                return $"user:{userId}";
            }

            // Fall back to IP address
            var ipAddress = context.Request.Headers["X-Forwarded-For"].FirstOrDefault() ??
                           context.Request.Headers["X-Real-IP"].FirstOrDefault() ??
                           context.Connection.RemoteIpAddress?.ToString() ??
                           "unknown";

            return $"ip:{ipAddress}";
        }

        private static string GetEndpointIdentifier(HttpContext context)
        {
            var path = context.Request.Path.Value?.ToLower() ?? "/";
            var method = context.Request.Method.ToUpper();
            
            // Normalize path to remove IDs and focus on the endpoint pattern
            var normalizedPath = NormalizePath(path);
            
            return $"{method}:{normalizedPath}";
        }

        private static string NormalizePath(string path)
        {
            // Replace GUIDs and numeric IDs with placeholders
            var guidPattern = @"[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}";
            var numericPattern = @"/\d+(/|$)";
            
            path = System.Text.RegularExpressions.Regex.Replace(path, guidPattern, "{id}", 
                System.Text.RegularExpressions.RegexOptions.IgnoreCase);
            path = System.Text.RegularExpressions.Regex.Replace(path, numericPattern, "/{id}$1");
            
            return path;
        }
    }

    public static class RateLimitingMiddlewareExtensions
    {
        public static IApplicationBuilder UseRateLimitingMiddleware(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<RateLimitingMiddleware>();
        }
    }
}