using Application.Features.Shared.Logging.Interfaces;
using Application.Features.Shared.Logging.Services;
using System.Diagnostics;
using System.Text;

namespace WebAPI.Middleware
{
    public class AdvancedLoggingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<AdvancedLoggingMiddleware> _logger;

        public AdvancedLoggingMiddleware(RequestDelegate next, ILogger<AdvancedLoggingMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            var stopwatch = Stopwatch.StartNew();
            var originalBodyStream = context.Response.Body;

            try
            {
                // Log request
                await LogRequest(context);

                // Create a new memory stream for the response body
                using var responseBody = new MemoryStream();
                context.Response.Body = responseBody;

                // Continue down the middleware pipeline
                await _next(context);

                // Log response
                await LogResponse(context, stopwatch.Elapsed);

                // Copy the contents of the new memory stream to the original stream
                await responseBody.CopyToAsync(originalBodyStream);
            }
            catch (Exception ex)
            {
                await LogException(context, ex, stopwatch.Elapsed);
                throw;
            }
            finally
            {
                context.Response.Body = originalBodyStream;
                stopwatch.Stop();
            }
        }

        private async Task LogRequest(HttpContext context)
        {
            var request = context.Request;
            var userId = GetUserId(context);

            // Log basic request info
            _logger.LogApiCall(
                request.Method,
                $"{request.Path}{request.QueryString}",
                0,
                TimeSpan.Zero,
                userId
            );

            // Log detailed request for sensitive operations
            if (IsSensitiveEndpoint(request.Path))
            {
                _logger.LogSecurityEvent(
                    "SensitiveEndpointAccess",
                    $"Access to {request.Method} {request.Path} from {GetClientIpAddress(context)}",
                    userId
                );
            }

            // Log request body for POST/PUT operations (excluding sensitive data)
            if (ShouldLogRequestBody(request))
            {
                var body = await ReadRequestBody(request);
                if (!string.IsNullOrEmpty(body) && !ContainsSensitiveData(body))
                {
                    _logger.LogInformation("Request Body: {RequestBody}", body);
                }
            }
        }

        private async Task LogResponse(HttpContext context, TimeSpan duration)
        {
            var response = context.Response;
            var request = context.Request;
            var userId = GetUserId(context);

            // Log API call with response details
            _logger.LogApiCall(
                request.Method,
                $"{request.Path}{request.QueryString}",
                response.StatusCode,
                duration,
                userId
            );

            // Log performance issues
            if (duration.TotalMilliseconds > 5000)
            {
                _logger.LogPerformance(
                    $"SlowRequest_{request.Method}_{request.Path}",
                    duration,
                    new
                    {
                        StatusCode = response.StatusCode,
                        UserId = userId,
                        UserAgent = request.Headers.UserAgent.ToString(),
                        IpAddress = GetClientIpAddress(context)
                    }
                );
            }

            // Log error responses
            if (response.StatusCode >= 400)
            {
                var responseBody = await ReadResponseBody(context);
                _logger.LogWarning(
                    "Error Response - {Method} {Path} returned {StatusCode} in {Duration}ms. Response: {ResponseBody}",
                    request.Method,
                    request.Path,
                    response.StatusCode,
                    duration.TotalMilliseconds,
                    responseBody
                );
            }
        }

        private async Task LogException(HttpContext context, Exception exception, TimeSpan duration)
        {
            var request = context.Request;
            var userId = GetUserId(context);

            _logger.LogError(exception,
                "Unhandled exception in {Method} {Path} after {Duration}ms for user {UserId}",
                request.Method,
                request.Path,
                duration.TotalMilliseconds,
                userId
            );

            // Log security-related exceptions
            if (IsSecurityException(exception))
            {
                _logger.LogSecurityEvent(
                    "SecurityException",
                    $"Security exception in {request.Method} {request.Path}: {exception.Message}",
                    userId
                );
            }
        }

        private static string? GetUserId(HttpContext context)
        {
            return context.User?.FindFirst("sub")?.Value ??
                   context.User?.FindFirst("id")?.Value ??
                   context.User?.Identity?.Name;
        }

        private static string GetClientIpAddress(HttpContext context)
        {
            return context.Request.Headers["X-Forwarded-For"].FirstOrDefault() ??
                   context.Request.Headers["X-Real-IP"].FirstOrDefault() ??
                   context.Connection.RemoteIpAddress?.ToString() ??
                   "Unknown";
        }

        private static bool IsSensitiveEndpoint(PathString path)
        {
            var sensitiveEndpoints = new[]
            {
                "/api/v1/auth/login",
                "/api/v1/auth/register",
                "/api/v1/auth/reset-password",
                "/api/v1/profile/update",
                "/api/v1/admin"
            };

            return sensitiveEndpoints.Any(endpoint => path.StartsWithSegments(endpoint));
        }

        private static bool ShouldLogRequestBody(HttpRequest request)
        {
            return (request.Method == "POST" || request.Method == "PUT" || request.Method == "PATCH") &&
                   request.ContentType?.Contains("application/json") == true &&
                   request.ContentLength < 10000; // Don't log large payloads
        }

        private static async Task<string> ReadRequestBody(HttpRequest request)
        {
            request.EnableBuffering();
            var buffer = new byte[Convert.ToInt32(request.ContentLength ?? 0)];
            await request.Body.ReadAsync(buffer, 0, buffer.Length);
            request.Body.Position = 0;
            return Encoding.UTF8.GetString(buffer);
        }

        private static async Task<string> ReadResponseBody(HttpContext context)
        {
            context.Response.Body.Seek(0, SeekOrigin.Begin);
            var text = await new StreamReader(context.Response.Body).ReadToEndAsync();
            context.Response.Body.Seek(0, SeekOrigin.Begin);
            return text;
        }

        private static bool ContainsSensitiveData(string body)
        {
            var sensitiveFields = new[] { "password", "token", "secret", "key", "creditcard", "ssn" };
            var lowerBody = body.ToLower();
            return sensitiveFields.Any(field => lowerBody.Contains(field));
        }

        private static bool IsSecurityException(Exception exception)
        {
            return exception is UnauthorizedAccessException ||
                   exception is System.Security.SecurityException ||
                   exception.Message.ToLower().Contains("unauthorized") ||
                   exception.Message.ToLower().Contains("forbidden");
        }
    }
}
