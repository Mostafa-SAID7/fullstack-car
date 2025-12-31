namespace Application.Features.Admin.Analytics.Interfaces
{
    public interface IEngagementAnalyticsService
    {
        Task<EngagementAnalytics> GetEngagementAnalyticsAsync(DateTime? startDate, DateTime? endDate, CancellationToken cancellationToken = default);
        Task<List<EngagementTrendData>> GetEngagementTrendsAsync(DateTime startDate, DateTime endDate, string granularity = "day", CancellationToken cancellationToken = default);
        Task<List<EngagementTrendData>> GetEngagementTrendsDetailedAsync(DateTime startDate, DateTime endDate, CancellationToken cancellationToken = default);
        Task<List<TopEngagedContent>> GetTopEngagedContentAsync(int limit, CancellationToken cancellationToken = default);
    }
}