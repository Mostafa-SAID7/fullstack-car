using Application.Features.Identity.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using System.IdentityModel.Tokens.Jwt;

namespace WebAPI.Middleware
{
    public class JwtValidationMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<JwtValidationMiddleware> _logger;

        public JwtValidationMiddleware(RequestDelegate next, ILogger<JwtValidationMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context, IJwtTokenService jwtTokenService)
        {
            // Skip validation for endpoints that don't require authentication
            var endpoint = context.GetEndpoint();
            if (endpoint?.Metadata?.GetMetadata<IAllowAnonymous>() != null)
            {
                await _next(context);
                return;
            }

            var token = ExtractTokenFromHeader(context);
            if (!string.IsNullOrEmpty(token))
            {
                try
                {
                    // Validate token and check if it's expired
                    var principal = jwtTokenService.ValidateToken(token);
                    if (principal == null)
                    {
                        // Check if token is just expired (for better error messaging)
                        var expiredPrincipal = jwtTokenService.ValidateExpiredToken(token);
                        if (expiredPrincipal != null && jwtTokenService.IsTokenExpired(token))
                        {
                            context.Response.StatusCode = 401;
                            await context.Response.WriteAsync("Token has expired. Please refresh your token.");
                            return;
                        }

                        context.Response.StatusCode = 401;
                        await context.Response.WriteAsync("Invalid token.");
                        return;
                    }

                    // Token is valid, continue with request
                    context.User = principal;
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, "Token validation failed");
                    context.Response.StatusCode = 401;
                    await context.Response.WriteAsync("Token validation failed.");
                    return;
                }
            }

            await _next(context);
        }

        private static string? ExtractTokenFromHeader(HttpContext context)
        {
            var authHeader = context.Request.Headers["Authorization"].FirstOrDefault();
            if (authHeader != null && authHeader.StartsWith("Bearer "))
            {
                return authHeader.Substring("Bearer ".Length).Trim();
            }
            return null;
        }
    }
}