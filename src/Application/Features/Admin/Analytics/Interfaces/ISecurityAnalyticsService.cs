namespace Application.Features.Admin.Analytics.Interfaces
{
    public interface ISecurityAnalyticsService
    {
        Task<SecurityAnalytics> GetSecurityAnalyticsAsync(DateTime? startDate, DateTime? endDate, CancellationToken cancellationToken = default);
        Task<List<SecurityTrendData>> GetSecurityTrendsAsync(DateTime startDate, DateTime endDate, string granularity = "day", CancellationToken cancellationToken = default);
        Task<List<SecurityThreat>> GetRecentSecurityThreatsAsync(int limit, CancellationToken cancellationToken = default);
        Task<List<SecurityEvent>> GetRecentSecurityEventsAsync(int limit, CancellationToken cancellationToken = default);
    }
}