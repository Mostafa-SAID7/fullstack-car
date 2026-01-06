using Application.Features.Admin.Analytics.DTOs.Responses;
using Application.Features.Admin.Analytics.Models;
using Application.Features.Admin.Analytics.Queries;

namespace Application.Features.Admin.Analytics.Handlers
{
    public class GetAdvancedAnalyticsHandler : IRequestHandler<GetAdvancedAnalyticsQuery, Result<AdvancedAnalyticsResponse>>
    {
        private readonly IAnalyticsService _analyticsService;
        private readonly IAppLogger<GetAdvancedAnalyticsHandler> _logger;

        public GetAdvancedAnalyticsHandler(IAnalyticsService analyticsService, IAppLogger<GetAdvancedAnalyticsHandler> logger)
        {
            _analyticsService = analyticsService;
            _logger = logger;
        }

        public async Task<Result<AdvancedAnalyticsResponse>> Handle(GetAdvancedAnalyticsQuery request, CancellationToken cancellationToken)
        {
            var startTime = DateTime.UtcNow;
            
            try
            {
                var (startDate, endDate) = GetDateRange(request.Period, request.StartDate, request.EndDate);

                var analytics = new AdvancedAnalyticsResponse
                {
                    Users = await _analyticsService.GetUserAnalyticsAsync(startDate, endDate, cancellationToken),
                    Content = await _analyticsService.GetContentAnalyticsAsync(startDate, endDate, cancellationToken),
                    Engagement = await _analyticsService.GetEngagementAnalyticsAsync(startDate, endDate, cancellationToken),
                    System = await _analyticsService.GetSystemAnalyticsAsync(startDate, endDate, cancellationToken),
                    Security = await _analyticsService.GetSecurityAnalyticsAsync(startDate, endDate, cancellationToken),
                    Performance = await _analyticsService.GetPerformanceAnalyticsAsync(startDate, endDate, cancellationToken),
                    Metadata = new AnalyticsMetadata
                    {
                        StartDate = startDate,
                        EndDate = endDate,
                        Granularity = request.Period,
                        TotalRecords = 0, // Will be calculated by service
                        DataSource = "AdvancedAnalytics"
                    }
                };

                var duration = DateTime.UtcNow - startTime;
                _logger.LogPerformance("GetAdvancedAnalytics", duration, new { Period = request.Period, StartDate = startDate, EndDate = endDate });

                return Result<AdvancedAnalyticsResponse>.Success(analytics);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting advanced analytics for period {Period}", request.Period);
                throw;
            }
        }

        private static (DateTime startDate, DateTime endDate) GetDateRange(string period, DateTime? startDate, DateTime? endDate)
        {
            if (startDate.HasValue && endDate.HasValue)
                return (startDate.Value, endDate.Value);

            var now = DateTime.UtcNow;
            return period.ToLower() switch
            {
                "day" => (now.AddDays(-1), now),
                "week" => (now.AddDays(-7), now),
                "month" => (now.AddMonths(-1), now),
                "year" => (now.AddYears(-1), now),
                _ => (now.AddDays(-7), now)
            };
        }
    }
}
