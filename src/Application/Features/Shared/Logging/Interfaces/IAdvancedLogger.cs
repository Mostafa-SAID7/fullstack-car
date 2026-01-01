using Microsoft.Extensions.Logging;

namespace Application.Features.Shared.Logging.Interfaces;

public interface IAdvancedLogger<T> : ILogger<T>
{
    void LogStructured(Microsoft.Extensions.Logging.LogLevel level, string messageTemplate, params object[] args);
    void LogWithContext(Microsoft.Extensions.Logging.LogLevel level, string message, object context);
    void LogPerformance(string operationName, TimeSpan duration, object? additionalData = null);
    void LogSecurity(string action, string userId, string? details = null);
    void LogBusiness(string eventName, object eventData);
    Task LogAsync(Microsoft.Extensions.Logging.LogLevel level, string message, object? context = null);
}

public interface IAdvancedLogger : ILogger
{
    void LogStructured(Microsoft.Extensions.Logging.LogLevel level, string messageTemplate, params object[] args);
    void LogWithContext(Microsoft.Extensions.Logging.LogLevel level, string message, object context);
    void LogPerformance(string operationName, TimeSpan duration, object? additionalData = null);
    void LogSecurity(string action, string userId, string? details = null);
    void LogBusiness(string eventName, object eventData);
    Task LogAsync(Microsoft.Extensions.Logging.LogLevel level, string message, object? context = null);
}