using System.Net;
using System.Text.Json;
using Application.Common.Exceptions;
using Domain.Exceptions;

namespace WebAPI.Middleware;

/// <summary>
/// Global exception handler middleware to ensure all unhandled exceptions return proper API responses
/// </summary>
public class GlobalExceptionHandlerMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<GlobalExceptionHandlerMiddleware> _logger;
    private readonly IWebHostEnvironment _environment;

    public GlobalExceptionHandlerMiddleware(
        RequestDelegate next,
        ILogger<GlobalExceptionHandlerMiddleware> logger,
        IWebHostEnvironment environment)
    {
        _next = next;
        _logger = logger;
        _environment = environment;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An unhandled exception occurred while processing the request");
            await HandleExceptionAsync(context, ex);
        }
    }

    private async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        context.Response.ContentType = "application/json";

        object response;

        switch (exception)
        {
            case EntityNotFoundException:
                context.Response.StatusCode = (int)HttpStatusCode.NotFound;
                response = new
                {
                    Success = false,
                    Message = exception.Message,
                    Timestamp = DateTime.UtcNow
                };
                break;

            case Domain.Exceptions.UnauthorizedAccessException:
                context.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                response = new
                {
                    Success = false,
                    Message = "Access denied",
                    Timestamp = DateTime.UtcNow
                };
                break;

            case BusinessRuleValidationException businessEx:
                context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                response = new
                {
                    Success = false,
                    Message = businessEx.Message,
                    Errors = new[] { businessEx.Message }, // Use Message instead of Details
                    Timestamp = DateTime.UtcNow
                };
                break;

            case DomainException domainEx:
                context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                response = new
                {
                    Success = false,
                    Message = domainEx.Message,
                    Timestamp = DateTime.UtcNow
                };
                break;

            case Application.Common.Exceptions.ValidationException validationEx:
                context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                response = new
                {
                    Success = false,
                    Message = "Validation failed",
                    Errors = validationEx.Errors.SelectMany(x => x.Value).ToArray(),
                    Timestamp = DateTime.UtcNow
                };
                break;

            case ArgumentException argEx:
                context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                response = new
                {
                    Success = false,
                    Message = argEx.Message,
                    Timestamp = DateTime.UtcNow
                };
                break;

            case InvalidOperationException:
                context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                response = new
                {
                    Success = false,
                    Message = exception.Message,
                    Timestamp = DateTime.UtcNow
                };
                break;

            case NotSupportedException:
                context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                response = new
                {
                    Success = false,
                    Message = "Operation not supported",
                    Timestamp = DateTime.UtcNow
                };
                break;

            case TimeoutException:
                context.Response.StatusCode = (int)HttpStatusCode.RequestTimeout;
                response = new
                {
                    Success = false,
                    Message = "Request timeout",
                    Timestamp = DateTime.UtcNow
                };
                break;

            default:
                context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                response = new
                {
                    Success = false,
                    Message = "An internal server error occurred",
                    Timestamp = DateTime.UtcNow
                };

                // Include exception details in development environment
                if (_environment.IsDevelopment())
                {
                    var devResponse = new
                    {
                        Success = false,
                        Message = "An internal server error occurred",
                        Error = exception.Message,
                        StackTrace = exception.StackTrace,
                        Timestamp = DateTime.UtcNow
                    };
                    
                    var devJsonResponse = JsonSerializer.Serialize(devResponse, new JsonSerializerOptions
                    {
                        PropertyNamingPolicy = JsonNamingPolicy.CamelCase
                    });

                    await context.Response.WriteAsync(devJsonResponse);
                    return;
                }
                break;
        }

        var jsonResponse = JsonSerializer.Serialize(response, new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        });

        await context.Response.WriteAsync(jsonResponse);
    }

    private static string GetUserFriendlyMessage(Exception exception)
    {
        return exception switch
        {
            EntityNotFoundException => exception.Message,
            Domain.Exceptions.UnauthorizedAccessException => "Access denied",
            BusinessRuleValidationException => exception.Message,
            DomainException => exception.Message,
            Application.Common.Exceptions.ValidationException => "Validation failed",
            ArgumentException => exception.Message,
            InvalidOperationException => exception.Message,
            NotSupportedException => "Operation not supported",
            TimeoutException => "Request timeout",
            _ => "An internal server error occurred"
        };
    }
}

/// <summary>
/// Extension method to register the global exception handler middleware
/// </summary>
public static class GlobalExceptionHandlerMiddlewareExtensions
{
    public static IApplicationBuilder UseGlobalExceptionHandler(this IApplicationBuilder builder)
    {
        return builder.UseMiddleware<GlobalExceptionHandlerMiddleware>();
    }
}