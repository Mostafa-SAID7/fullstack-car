using Microsoft.Extensions.Logging;

namespace Application.Features.Shared.Logging.Extensions;

public static class LoggerExtensions
{
    public static void LogUserAction(this ILogger logger, string userId, string action, object? additionalData = null)
    {
        logger.LogInformation("User Action: {Action} by User: {UserId} - Data: {@AdditionalData}", 
            action, userId ?? "Unknown", additionalData);
    }

    public static void LogBusinessEvent(this ILogger logger, string eventName, object? eventData = null, string? userId = null)
    {
        logger.LogInformation("Business Event: {EventName} by User: {UserId} - Data: {@EventData}", 
            eventName, userId ?? "System", eventData);
    }

    public static void LogSystemHealth(this ILogger logger, string component, string status, object? details = null)
    {
        logger.LogInformation("System Health: {Component} - Status: {Status} - Details: {@Details}", 
            component, status, details);
    }

    public static void LogPerformance(this ILogger logger, string operationName, TimeSpan duration, object? additionalData = null)
    {
        logger.LogInformation("Performance: {Operation} took {Duration}ms - Data: {@AdditionalData}", 
            operationName, duration.TotalMilliseconds, additionalData);
    }

    public static void LogSecurityEvent(this ILogger logger, string eventType, string? userId = null, object? details = null)
    {
        logger.LogWarning("Security Event: {EventType} by User: {UserId} - Details: {@Details}", 
            eventType, userId ?? "Unknown", details);
    }

    public static void LogApiCall(this ILogger logger, string method, string path, int statusCode, TimeSpan duration, string? userId = null)
    {
        logger.LogInformation("API Call: {Method} {Path} returned {StatusCode} in {Duration}ms by User: {UserId}", 
            method, path, statusCode, duration.TotalMilliseconds, userId ?? "Anonymous");
    }
}
