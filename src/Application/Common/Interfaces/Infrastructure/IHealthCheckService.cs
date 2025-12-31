namespace Application.Common.Interfaces.Infrastructure
{
    public interface IHealthCheckService
    {
        Task<HealthCheckResult> CheckHealthAsync(CancellationToken cancellationToken = default);
        Task<HealthCheckResult> CheckDatabaseHealthAsync(CancellationToken cancellationToken = default);
        Task<HealthCheckResult> CheckCacheHealthAsync(CancellationToken cancellationToken = default);
        Task<HealthCheckResult> CheckExternalServiceHealthAsync(string serviceName, CancellationToken cancellationToken = default);
        Task<List<HealthCheckResult>> CheckAllServicesHealthAsync(CancellationToken cancellationToken = default);
        Task<HealthCheckSummary> GetHealthSummaryAsync(CancellationToken cancellationToken = default);
        Task RegisterHealthCheckAsync(string name, Func<CancellationToken, Task<HealthCheckResult>> healthCheck);
        Task UnregisterHealthCheckAsync(string name);
    }

    public class HealthCheckResult
    {
        public string Name { get; set; } = string.Empty;
        public HealthStatus Status { get; set; }
        public string? Description { get; set; }
        public TimeSpan Duration { get; set; }
        public Exception? Exception { get; set; }
        public Dictionary<string, object> Data { get; set; } = new();
        public DateTime CheckedAt { get; set; } = DateTime.UtcNow;
    }

    public class HealthCheckSummary
    {
        public HealthStatus OverallStatus { get; set; }
        public int TotalChecks { get; set; }
        public int HealthyChecks { get; set; }
        public int UnhealthyChecks { get; set; }
        public int DegradedChecks { get; set; }
        public TimeSpan TotalDuration { get; set; }
        public List<HealthCheckResult> Results { get; set; } = new();
        public DateTime CheckedAt { get; set; } = DateTime.UtcNow;
    }

    public enum HealthStatus
    {
        Healthy,
        Degraded,
        Unhealthy
    }
}