using Application.Features.Admin.Analytics.DTOs.Responses;
using Application.Features.Admin.Analytics.Queries;

namespace Application.Features.Admin.Analytics.Handlers
{
    public class GetPerformanceAnalyticsHandler : IRequestHandler<GetPerformanceAnalyticsQuery, Result<PerformanceAnalyticsResponse>>
    {
        private readonly IPerformanceAnalyticsService _performanceAnalyticsService;

        public GetPerformanceAnalyticsHandler(IPerformanceAnalyticsService performanceAnalyticsService)
        {
            _performanceAnalyticsService = performanceAnalyticsService;
        }

        public async Task<Result<PerformanceAnalyticsResponse>> Handle(GetPerformanceAnalyticsQuery request, CancellationToken cancellationToken)
        {
            try
            {
                var performanceAnalytics = await _performanceAnalyticsService.GetPerformanceAnalyticsAsync(request.StartDate, request.EndDate, cancellationToken);

                var response = new PerformanceAnalyticsResponse
                {
                    Data = performanceAnalytics,
                    Metrics = performanceAnalytics.Metrics,
                    Metadata = new AnalyticsMetadata
                    {
                        StartDate = request.StartDate,
                        EndDate = request.EndDate,
                        Granularity = request.Granularity ?? "hour",
                        Metrics = request.Metrics ?? new List<string>(),
                        TotalRecords = performanceAnalytics.Metrics.Count,
                        DataSource = "PerformanceAnalytics"
                    },
                    Summary = new Dictionary<string, object>
                    {
                        { "database_health", performanceAnalytics.DatabaseResponseTime < 100 ? "excellent" : "good" },
                        { "cache_efficiency", performanceAnalytics.CacheHitRate > 90 ? "excellent" : "good" },
                        { "api_performance", performanceAnalytics.ApiResponseTime < 200 ? "excellent" : "good" }
                    }
                };

                return Result<PerformanceAnalyticsResponse>.Success(response);
            }
            catch (Exception ex)
            {
                return Result<PerformanceAnalyticsResponse>.Failure($"Error retrieving performance analytics: {ex.Message}");
            }
        }
    }
}
