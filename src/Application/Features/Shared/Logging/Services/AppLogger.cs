using Application.Features.Shared.Logging.Interfaces;
using Microsoft.Extensions.Logging;
using System.Text.Json;

namespace Application.Features.Shared.Logging.Services
{
    public class AppLogger<T> : IAppLogger<T>
    {
        private readonly ILogger<T> _logger;
        private readonly string _categoryName;

        public AppLogger(ILogger<T> logger)
        {
            _logger = logger;
            _categoryName = typeof(T).Name;
        }

        public IDisposable? BeginScope<TState>(TState state) where TState : notnull
            => _logger.BeginScope(state);

        public bool IsEnabled(Microsoft.Extensions.Logging.LogLevel logLevel)
            => _logger.IsEnabled(logLevel);

        public void Log<TState>(Microsoft.Extensions.Logging.LogLevel logLevel, EventId eventId, TState state, Exception? exception, Func<TState, Exception?, string> formatter)
            => _logger.Log(logLevel, eventId, state, exception, formatter);

        public void LogError(Exception? exception, string? message, params object?[] args)
            => _logger.LogError(exception, message, args);

        public void LogError(string? message, params object?[] args)
            => _logger.LogError(message, args);

        public void LogUserAction(string userId, string action, object? data = null)
        {
            using var scope = _logger.BeginScope(new Dictionary<string, object>
            {
                ["UserId"] = userId,
                ["ActionType"] = "UserAction",
                ["Action"] = action,
                ["Timestamp"] = DateTime.UtcNow
            });

            _logger.LogInformation("User {UserId} performed action: {Action} with data: {Data}",
                userId, action, data != null ? JsonSerializer.Serialize(data) : "null");
        }

        public void LogSecurityEvent(string eventType, string details, string? userId = null)
        {
            using var scope = _logger.BeginScope(new Dictionary<string, object>
            {
                ["EventType"] = "Security",
                ["SecurityEventType"] = eventType,
                ["UserId"] = userId ?? "Anonymous",
                ["Timestamp"] = DateTime.UtcNow
            });

            _logger.LogWarning("Security Event - {EventType}: {Details} (User: {UserId})",
                eventType, details, userId ?? "Anonymous");
        }

        public void LogPerformance(string operation, TimeSpan duration, object? metadata = null)
        {
            using var scope = _logger.BeginScope(new Dictionary<string, object>
            {
                ["EventType"] = "Performance",
                ["Operation"] = operation,
                ["Duration"] = duration.TotalMilliseconds,
                ["Timestamp"] = DateTime.UtcNow
            });

            var level = duration.TotalMilliseconds > 5000 ? Microsoft.Extensions.Logging.LogLevel.Warning : Microsoft.Extensions.Logging.LogLevel.Information;
            _logger.Log(level, "Performance - {Operation} took {Duration}ms. Metadata: {Metadata}",
                operation, duration.TotalMilliseconds, metadata != null ? JsonSerializer.Serialize(metadata) : "null");
        }

        public void LogBusinessEvent(string eventName, object data, string? userId = null)
        {
            using var scope = _logger.BeginScope(new Dictionary<string, object>
            {
                ["EventType"] = "Business",
                ["EventName"] = eventName,
                ["UserId"] = userId ?? "System",
                ["Timestamp"] = DateTime.UtcNow
            });

            _logger.LogInformation("Business Event - {EventName}: {Data} (User: {UserId})",
                eventName, JsonSerializer.Serialize(data), userId ?? "System");
        }

        public void LogApiCall(string endpoint, string method, TimeSpan duration, int statusCode, string? userId = null)
        {
            using var scope = _logger.BeginScope(new Dictionary<string, object>
            {
                ["EventType"] = "ApiCall",
                ["Endpoint"] = endpoint,
                ["Method"] = method,
                ["StatusCode"] = statusCode,
                ["Duration"] = duration.TotalMilliseconds,
                ["UserId"] = userId ?? "Anonymous",
                ["Timestamp"] = DateTime.UtcNow
            });

            var level = statusCode >= 400 ? Microsoft.Extensions.Logging.LogLevel.Warning : Microsoft.Extensions.Logging.LogLevel.Information;
            _logger.Log(level, "API Call - {Method} {Endpoint} returned {StatusCode} in {Duration}ms (User: {UserId})",
                method, endpoint, statusCode, duration.TotalMilliseconds, userId ?? "Anonymous");
        }

        public void LogDatabaseOperation(string operation, string table, TimeSpan duration, bool success)
        {
            using var scope = _logger.BeginScope(new Dictionary<string, object>
            {
                ["EventType"] = "Database",
                ["Operation"] = operation,
                ["Table"] = table,
                ["Duration"] = duration.TotalMilliseconds,
                ["Success"] = success,
                ["Timestamp"] = DateTime.UtcNow
            });

            var level = !success ? Microsoft.Extensions.Logging.LogLevel.Error : (duration.TotalMilliseconds > 1000 ? Microsoft.Extensions.Logging.LogLevel.Warning : Microsoft.Extensions.Logging.LogLevel.Debug);
            _logger.Log(level, "Database - {Operation} on {Table} {Status} in {Duration}ms",
                operation, table, success ? "succeeded" : "failed", duration.TotalMilliseconds);
        }

        public void LogCacheOperation(string operation, string key, bool hit, TimeSpan? duration = null)
        {
            using var scope = _logger.BeginScope(new Dictionary<string, object>
            {
                ["EventType"] = "Cache",
                ["Operation"] = operation,
                ["Key"] = key,
                ["Hit"] = hit,
                ["Duration"] = duration?.TotalMilliseconds ?? 0,
                ["Timestamp"] = DateTime.UtcNow
            });

            _logger.LogDebug("Cache - {Operation} for key {Key} resulted in {Result} in {Duration}ms",
                operation, key, hit ? "HIT" : "MISS", duration?.TotalMilliseconds ?? 0);
        }

        public void LogValidationError(string validator, string field, string error, object? value = null)
        {
            using var scope = _logger.BeginScope(new Dictionary<string, object>
            {
                ["EventType"] = "Validation",
                ["Validator"] = validator,
                ["Field"] = field,
                ["Error"] = error,
                ["Timestamp"] = DateTime.UtcNow
            });

            _logger.LogWarning("Validation Error - {Validator}.{Field}: {Error}. Value: {Value}",
                validator, field, error, value != null ? JsonSerializer.Serialize(value) : "null");
        }

        public void LogSystemHealth(string component, string status, object? metrics = null)
        {
            using var scope = _logger.BeginScope(new Dictionary<string, object>
            {
                ["EventType"] = "SystemHealth",
                ["Component"] = component,
                ["Status"] = status,
                ["Timestamp"] = DateTime.UtcNow
            });

            var level = status.ToLower() == "healthy" ? Microsoft.Extensions.Logging.LogLevel.Information : Microsoft.Extensions.Logging.LogLevel.Warning;
            _logger.Log(level, "System Health - {Component} is {Status}. Metrics: {Metrics}",
                component, status, metrics != null ? JsonSerializer.Serialize(metrics) : "null");
        }

        public void LogAuditTrail(string entity, string action, string entityId, object? oldValues = null, object? newValues = null, string? userId = null)
        {
            using var scope = _logger.BeginScope(new Dictionary<string, object>
            {
                ["EventType"] = "Audit",
                ["Entity"] = entity,
                ["Action"] = action,
                ["EntityId"] = entityId,
                ["UserId"] = userId ?? "System",
                ["Timestamp"] = DateTime.UtcNow
            });

            _logger.LogInformation("Audit Trail - {Entity}({EntityId}) {Action} by {UserId}. Old: {OldValues}, New: {NewValues}",
                entity, entityId, action, userId ?? "System",
                oldValues != null ? JsonSerializer.Serialize(oldValues) : "null",
                newValues != null ? JsonSerializer.Serialize(newValues) : "null");
        }
    }
}
