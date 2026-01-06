using Application.Common.Models;

namespace Application.Features.Admin.Analytics.Interfaces
{
    public interface IAnalyticsService
    {
        Task<UserAnalytics> GetUserAnalyticsAsync(DateTime? startDate, DateTime? endDate, CancellationToken cancellationToken = default);
        Task<ContentAnalytics> GetContentAnalyticsAsync(DateTime? startDate, DateTime? endDate, CancellationToken cancellationToken = default);
        Task<EngagementAnalytics> GetEngagementAnalyticsAsync(DateTime? startDate, DateTime? endDate, CancellationToken cancellationToken = default);
        Task<SystemAnalytics> GetSystemAnalyticsAsync(DateTime? startDate, DateTime? endDate, CancellationToken cancellationToken = default);
        Task<SecurityAnalytics> GetSecurityAnalyticsAsync(DateTime? startDate, DateTime? endDate, CancellationToken cancellationToken = default);
        Task<PerformanceAnalytics> GetPerformanceAnalyticsAsync(DateTime? startDate, DateTime? endDate, CancellationToken cancellationToken = default);

        Task<List<UserTrendData>> GetUserTrendsAsync(DateTime startDate, DateTime endDate, string granularity = "day", CancellationToken cancellationToken = default);
        Task<List<ContentTrendData>> GetContentTrendsAsync(DateTime startDate, DateTime endDate, string granularity = "day", CancellationToken cancellationToken = default);
        Task<List<EngagementTrendData>> GetEngagementTrendsAsync(DateTime startDate, DateTime endDate, string granularity = "day", CancellationToken cancellationToken = default);
        Task<List<SystemTrendData>> GetSystemTrendsAsync(DateTime startDate, DateTime endDate, string granularity = "hour", CancellationToken cancellationToken = default);
        Task<List<SecurityTrendData>> GetSecurityTrendsAsync(DateTime startDate, DateTime endDate, string granularity = "day", CancellationToken cancellationToken = default);
    }
}
