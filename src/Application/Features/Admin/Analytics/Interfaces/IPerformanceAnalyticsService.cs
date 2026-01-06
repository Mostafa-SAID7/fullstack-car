namespace Application.Features.Admin.Analytics.Interfaces
{
    public interface IPerformanceAnalyticsService
    {
        Task<PerformanceAnalytics> GetPerformanceAnalyticsAsync(DateTime? startDate, DateTime? endDate, CancellationToken cancellationToken = default);
    }
}
