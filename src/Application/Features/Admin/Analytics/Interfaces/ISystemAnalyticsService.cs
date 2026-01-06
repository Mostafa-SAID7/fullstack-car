namespace Application.Features.Admin.Analytics.Interfaces
{
    public interface ISystemAnalyticsService
    {
        Task<SystemAnalytics> GetSystemAnalyticsAsync(DateTime? startDate, DateTime? endDate, CancellationToken cancellationToken = default);
        Task<List<SystemTrendData>> GetSystemTrendsAsync(DateTime startDate, DateTime endDate, string granularity = "hour", CancellationToken cancellationToken = default);
        Task<List<SystemAlert>> GetSystemAlertsAsync(CancellationToken cancellationToken = default);
    }
}
