using System.Text.RegularExpressions;
using Microsoft.AspNetCore.DataProtection;

namespace WebAPI.Middleware
{
    public class SecurityMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly IDataProtector _dataProtector;
        private readonly ILogger<SecurityMiddleware> _logger;

        public SecurityMiddleware(
            RequestDelegate next, 
            IDataProtectionProvider dataProtectionProvider,
            ILogger<SecurityMiddleware> logger)
        {
            _next = next;
            _dataProtector = dataProtectionProvider.CreateProtector("SecurityMiddleware");
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            // Add security headers
            AddSecurityHeaders(context);

            // Validate and sanitize input
            if (await ValidateAndSanitizeInput(context))
            {
                await _next(context);
            }
            else
            {
                context.Response.StatusCode = 400;
                await context.Response.WriteAsync("Invalid input detected");
            }
        }

        private void AddSecurityHeaders(HttpContext context)
        {
            var response = context.Response;

            // Prevent clickjacking
            response.Headers.Append("X-Frame-Options", "DENY");

            // Prevent MIME type sniffing
            response.Headers.Append("X-Content-Type-Options", "nosniff");

            // Enable XSS protection
            response.Headers.Append("X-XSS-Protection", "1; mode=block");

            // Strict Transport Security (HTTPS only)
            if (context.Request.IsHttps)
            {
                response.Headers.Append("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
            }

            // Content Security Policy
            response.Headers.Append("Content-Security-Policy", 
                "default-src 'self'; " +
                "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
                "style-src 'self' 'unsafe-inline'; " +
                "img-src 'self' data: https:; " +
                "font-src 'self' https:; " +
                "connect-src 'self' https:; " +
                "frame-ancestors 'none'");

            // Referrer Policy
            response.Headers.Append("Referrer-Policy", "strict-origin-when-cross-origin");

            // Permissions Policy
            response.Headers.Append("Permissions-Policy", 
                "camera=(), microphone=(), geolocation=(), payment=()");
        }

        private async Task<bool> ValidateAndSanitizeInput(HttpContext context)
        {
            try
            {
                // Check for common attack patterns in URL
                if (ContainsSuspiciousPatterns(context.Request.Path.Value))
                {
                    _logger.LogWarning("Suspicious URL pattern detected: {Path}", context.Request.Path.Value);
                    return false;
                }

                // Check query parameters
                foreach (var param in context.Request.Query)
                {
                    if (ContainsSuspiciousPatterns(param.Value))
                    {
                        _logger.LogWarning("Suspicious query parameter detected: {Key}={Value}", param.Key, param.Value);
                        return false;
                    }
                }

                // Check headers for suspicious content
                foreach (var header in context.Request.Headers)
                {
                    if (ContainsSuspiciousPatterns(header.Value))
                    {
                        _logger.LogWarning("Suspicious header detected: {Key}={Value}", header.Key, header.Value);
                        return false;
                    }
                }

                // Check request body for POST/PUT requests
                if (context.Request.Method == "POST" || context.Request.Method == "PUT")
                {
                    if (context.Request.ContentType?.Contains("application/json") == true)
                    {
                        context.Request.EnableBuffering();
                        var body = await new StreamReader(context.Request.Body).ReadToEndAsync();
                        context.Request.Body.Position = 0;

                        if (ContainsSuspiciousPatterns(body))
                        {
                            _logger.LogWarning("Suspicious content in request body detected");
                            return false;
                        }
                    }
                }

                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error validating input");
                return false;
            }
        }

        private static bool ContainsSuspiciousPatterns(string? input)
        {
            if (string.IsNullOrEmpty(input))
                return false;

            var suspiciousPatterns = new[]
            {
                // SQL Injection patterns
                @"(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE)\b)",
                @"(\b(UNION|OR|AND)\s+\d+\s*=\s*\d+)",
                @"('|""|;|--|\*|/\*|\*/)",
                
                // XSS patterns
                @"<script[^>]*>.*?</script>",
                @"javascript:",
                @"vbscript:",
                @"onload\s*=",
                @"onerror\s*=",
                @"onclick\s*=",
                
                // Path traversal
                @"\.\./",
                @"\.\.\\",
                
                // Command injection
                @"(\b(cmd|powershell|bash|sh)\b)",
                @"(\||&|;|\$\(|`)",
                
                // LDAP injection
                @"(\*|\(|\)|\\|\||&)",
                
                // XML injection
                @"<!ENTITY",
                @"<!DOCTYPE",
                
                // Server-side template injection
                @"\{\{.*\}\}",
                @"\$\{.*\}",
                
                // NoSQL injection
                @"(\$where|\$ne|\$gt|\$lt|\$regex)"
            };

            return suspiciousPatterns.Any(pattern => 
                Regex.IsMatch(input, pattern, RegexOptions.IgnoreCase | RegexOptions.Multiline));
        }
    }

    public static class SecurityMiddlewareExtensions
    {
        public static IApplicationBuilder UseSecurityMiddleware(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<SecurityMiddleware>();
        }
    }
}
