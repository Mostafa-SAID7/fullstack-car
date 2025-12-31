namespace Application.Features.Admin.Analytics.Interfaces
{
    public interface IContentAnalyticsService
    {
        Task<ContentAnalytics> GetContentAnalyticsAsync(DateTime? startDate, DateTime? endDate, CancellationToken cancellationToken = default);
        Task<List<ContentTrendData>> GetContentTrendsAsync(DateTime startDate, DateTime endDate, string granularity = "day", CancellationToken cancellationToken = default);
        Task<List<ContentCategory>> GetTopCategoriesAsync(CancellationToken cancellationToken = default);
        Task<List<ContentTrendData>> GetContentTrendsDetailedAsync(DateTime startDate, DateTime endDate, CancellationToken cancellationToken = default);
        Task<List<PopularContent>> GetPopularContentAsync(int limit, CancellationToken cancellationToken = default);
    }
}