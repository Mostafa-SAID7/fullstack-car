using Application.Features.Shared.System.Models;

namespace Application.Features.Shared.System.Interfaces
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
}
