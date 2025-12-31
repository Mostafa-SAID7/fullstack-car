using Microsoft.Extensions.Logging;

namespace Application.Common.Interfaces.Logging
{
    public interface IAdvancedLogger<T> : ILogger<T>
    {
        void LogUserAction(string userId, string action, object? data = null);
        void LogSecurityEvent(string eventType, string details, string? userId = null);
        void LogPerformance(string operation, TimeSpan duration, object? metadata = null);
        void LogBusinessEvent(string eventName, object data, string? userId = null);
        void LogApiCall(string endpoint, string method, TimeSpan duration, int statusCode, string? userId = null);
        void LogDatabaseOperation(string operation, string table, TimeSpan duration, bool success);
        void LogCacheOperation(string operation, string key, bool hit, TimeSpan? duration = null);
        void LogValidationError(string validator, string field, string error, object? value = null);
        void LogSystemHealth(string component, string status, object? metrics = null);
        void LogAuditTrail(string entity, string action, string entityId, object? oldValues = null, object? newValues = null, string? userId = null);
        
        // Add missing LogError method that inherits from ILogger<T>
        void LogError(Exception? exception, string? message, params object?[] args);
        void LogError(string? message, params object?[] args);
    }
}