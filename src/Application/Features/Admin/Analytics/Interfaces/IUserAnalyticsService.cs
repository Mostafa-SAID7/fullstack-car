namespace Application.Features.Admin.Analytics.Interfaces
{
    public interface IUserAnalyticsService
    {
        Task<UserAnalytics> GetUserAnalyticsAsync(DateTime? startDate, DateTime? endDate, CancellationToken cancellationToken = default);
        Task<List<UserTrendData>> GetUserTrendsAsync(DateTime startDate, DateTime endDate, string granularity = "day", CancellationToken cancellationToken = default);
        Task<List<UserDemographic>> GetUserDemographicsAsync(CancellationToken cancellationToken = default);
        Task<List<UserActivityTrend>> GetUserActivityTrendsAsync(DateTime startDate, DateTime endDate, CancellationToken cancellationToken = default);
        Task<List<TopUser>> GetTopUsersAsync(int limit, CancellationToken cancellationToken = default);
        Task<double> CalculateUserRetentionRateAsync(CancellationToken cancellationToken = default);
    }
}