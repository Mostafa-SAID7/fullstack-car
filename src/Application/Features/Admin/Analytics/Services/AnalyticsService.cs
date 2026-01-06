using Application.Features.Admin.Analytics.Models;

namespace Application.Features.Admin.Analytics.Services
{
    public class AnalyticsService : IAnalyticsService
    {
        private readonly IUserAnalyticsService _userAnalyticsService;
        private readonly IContentAnalyticsService _contentAnalyticsService;
        private readonly IEngagementAnalyticsService _engagementAnalyticsService;
        private readonly ISystemAnalyticsService _systemAnalyticsService;
        private readonly ISecurityAnalyticsService _securityAnalyticsService;
        private readonly IPerformanceAnalyticsService _performanceAnalyticsService;

        public AnalyticsService(
            IUserAnalyticsService userAnalyticsService,
            IContentAnalyticsService contentAnalyticsService,
            IEngagementAnalyticsService engagementAnalyticsService,
            ISystemAnalyticsService systemAnalyticsService,
            ISecurityAnalyticsService securityAnalyticsService,
            IPerformanceAnalyticsService performanceAnalyticsService)
        {
            _userAnalyticsService = userAnalyticsService;
            _contentAnalyticsService = contentAnalyticsService;
            _engagementAnalyticsService = engagementAnalyticsService;
            _systemAnalyticsService = systemAnalyticsService;
            _securityAnalyticsService = securityAnalyticsService;
            _performanceAnalyticsService = performanceAnalyticsService;
        }

        public async Task<UserAnalytics> GetUserAnalyticsAsync(DateTime? startDate, DateTime? endDate, CancellationToken cancellationToken = default)
        {
            return await _userAnalyticsService.GetUserAnalyticsAsync(startDate, endDate, cancellationToken);
        }

        public async Task<ContentAnalytics> GetContentAnalyticsAsync(DateTime? startDate, DateTime? endDate, CancellationToken cancellationToken = default)
        {
            return await _contentAnalyticsService.GetContentAnalyticsAsync(startDate, endDate, cancellationToken);
        }

        public async Task<EngagementAnalytics> GetEngagementAnalyticsAsync(DateTime? startDate, DateTime? endDate, CancellationToken cancellationToken = default)
        {
            return await _engagementAnalyticsService.GetEngagementAnalyticsAsync(startDate, endDate, cancellationToken);
        }

        public async Task<SystemAnalytics> GetSystemAnalyticsAsync(DateTime? startDate, DateTime? endDate, CancellationToken cancellationToken = default)
        {
            return await _systemAnalyticsService.GetSystemAnalyticsAsync(startDate, endDate, cancellationToken);
        }

        public async Task<SecurityAnalytics> GetSecurityAnalyticsAsync(DateTime? startDate, DateTime? endDate, CancellationToken cancellationToken = default)
        {
            return await _securityAnalyticsService.GetSecurityAnalyticsAsync(startDate, endDate, cancellationToken);
        }

        public async Task<PerformanceAnalytics> GetPerformanceAnalyticsAsync(DateTime? startDate, DateTime? endDate, CancellationToken cancellationToken = default)
        {
            return await _performanceAnalyticsService.GetPerformanceAnalyticsAsync(startDate, endDate, cancellationToken);
        }

        public async Task<List<UserTrendData>> GetUserTrendsAsync(DateTime startDate, DateTime endDate, string granularity = "day", CancellationToken cancellationToken = default)
        {
            return await _userAnalyticsService.GetUserTrendsAsync(startDate, endDate, granularity, cancellationToken);
        }

        public async Task<List<ContentTrendData>> GetContentTrendsAsync(DateTime startDate, DateTime endDate, string granularity = "day", CancellationToken cancellationToken = default)
        {
            return await _contentAnalyticsService.GetContentTrendsAsync(startDate, endDate, granularity, cancellationToken);
        }

        public async Task<List<EngagementTrendData>> GetEngagementTrendsAsync(DateTime startDate, DateTime endDate, string granularity = "day", CancellationToken cancellationToken = default)
        {
            return await _engagementAnalyticsService.GetEngagementTrendsAsync(startDate, endDate, granularity, cancellationToken);
        }

        public async Task<List<SystemTrendData>> GetSystemTrendsAsync(DateTime startDate, DateTime endDate, string granularity = "hour", CancellationToken cancellationToken = default)
        {
            return await _systemAnalyticsService.GetSystemTrendsAsync(startDate, endDate, granularity, cancellationToken);
        }

        public async Task<List<SecurityTrendData>> GetSecurityTrendsAsync(DateTime startDate, DateTime endDate, string granularity = "day", CancellationToken cancellationToken = default)
        {
            return await _securityAnalyticsService.GetSecurityTrendsAsync(startDate, endDate, granularity, cancellationToken);
        }
    }
}
