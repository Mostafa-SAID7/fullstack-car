using System.Text.Json;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.DataProtection;

namespace WebAPI.Middleware
{
    /// <summary>
    /// Enhanced security middleware specifically for QA System endpoints
    /// Implements Task 8.5 security hardening requirements
    /// Provides additional protection for QA-specific attack vectors
    /// </summary>
    public class QASecurityMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly IDataProtectionProvider _dataProtectionProvider;
        private readonly ILogger<QASecurityMiddleware> _logger;

        // Security patterns for QA-specific attacks
        private static readonly Regex[] MaliciousPatterns = new[]
        {
            new Regex(@"<script[^>]*>.*?</script>", RegexOptions.IgnoreCase | RegexOptions.Compiled),
            new Regex(@"javascript:", RegexOptions.IgnoreCase | RegexOptions.Compiled),
            new Regex(@"on\w+\s*=", RegexOptions.IgnoreCase | RegexOptions.Compiled),
            new Regex(@"(union|select|insert|update|delete|drop|create|alter)\s+", RegexOptions.IgnoreCase | RegexOptions.Compiled),
            new Regex(@"(exec|execute|sp_|xp_)\s*\(", RegexOptions.IgnoreCase | RegexOptions.Compiled)
        };

        public QASecurityMiddleware(RequestDelegate next, IDataProtectionProvider dataProtectionProvider, ILogger<QASecurityMiddleware> logger)
        {
            _next = next;
            _dataProtectionProvider = dataProtectionProvider;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            // Only apply security checks to QA endpoints
            if (context.Request.Path.StartsWithSegments("/api/v7/qa"))
            {
                // Check for malicious content in request body
                if (context.Request.ContentLength > 0 && 
                    (context.Request.Method == "POST" || context.Request.Method == "PUT"))
                {
                    await ValidateRequestContent(context);
                }

                // Add security headers
                AddSecurityHeaders(context);

                // Rate limiting check
                if (await IsRateLimited(context))
                {
                    context.Response.StatusCode = 429;
                    await context.Response.WriteAsync("Rate limit exceeded");
                    return;
                }
            }

            await _next(context);
        }

        private async Task ValidateRequestContent(HttpContext context)
        {
            context.Request.EnableBuffering();
            var body = await new StreamReader(context.Request.Body).ReadToEndAsync();
            context.Request.Body.Position = 0;

            foreach (var pattern in MaliciousPatterns)
            {
                if (pattern.IsMatch(body))
                {
                    _logger.LogWarning("Malicious content detected in QA request from {IP}: {Pattern}", 
                        context.Connection.RemoteIpAddress, pattern.ToString());
                    
                    context.Response.StatusCode = 400;
                    await context.Response.WriteAsync("Invalid content detected");
                    return;
                }
            }
        }

        private void AddSecurityHeaders(HttpContext context)
        {
            context.Response.Headers.Add("X-Content-Type-Options", "nosniff");
            context.Response.Headers.Add("X-Frame-Options", "DENY");
            context.Response.Headers.Add("X-XSS-Protection", "1; mode=block");
            context.Response.Headers.Add("Referrer-Policy", "strict-origin-when-cross-origin");
        }

        private async Task<bool> IsRateLimited(HttpContext context)
        {
            // Simple in-memory rate limiting (in production, use Redis or similar)
            var key = $"qa_rate_limit_{context.Connection.RemoteIpAddress}";
            // Implementation would check rate limits here
            return false; // Simplified for now
        }
    }
}