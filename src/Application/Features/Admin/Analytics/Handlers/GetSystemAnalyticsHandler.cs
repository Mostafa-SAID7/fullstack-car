using Application.Features.Admin.Analytics.DTOs.Responses;
using Application.Features.Admin.Analytics.Queries;

namespace Application.Features.Admin.Analytics.Handlers
{
    public class GetSystemAnalyticsHandler : IRequestHandler<GetSystemAnalyticsQuery, Result<SystemAnalyticsResponse>>
    {
        private readonly IAnalyticsService _analyticsService;

        public GetSystemAnalyticsHandler(IAnalyticsService analyticsService)
        {
            _analyticsService = analyticsService;
        }

        public async Task<Result<SystemAnalyticsResponse>> Handle(GetSystemAnalyticsQuery request, CancellationToken cancellationToken)
        {
            try
            {
                var systemAnalytics = await _analyticsService.GetSystemAnalyticsAsync(request.StartDate, request.EndDate, cancellationToken);
                var systemTrends = await _analyticsService.GetSystemTrendsAsync(
                    request.StartDate ?? DateTime.UtcNow.AddHours(-24), 
                    request.EndDate ?? DateTime.UtcNow, 
                    request.Granularity ?? "hour", 
                    cancellationToken);

                var response = new SystemAnalyticsResponse
                {
                    Data = systemAnalytics,
                    Trends = systemTrends,
                    Metadata = new AnalyticsMetadata
                    {
                        StartDate = request.StartDate,
                        EndDate = request.EndDate,
                        Granularity = request.Granularity ?? "hour",
                        Metrics = request.Metrics ?? new List<string>(),
                        TotalRecords = systemAnalytics.ActiveConnections,
                        DataSource = "SystemAnalytics"
                    },
                    Summary = new Dictionary<string, object>
                    {
                        { "system_health", systemAnalytics.CpuUsage < 80 && systemAnalytics.MemoryUsage < 80 ? "good" : "warning" },
                        { "performance_trend", systemAnalytics.AverageResponseTime < 200 ? "excellent" : "needs_attention" },
                        { "error_status", systemAnalytics.ErrorRate < 1 ? "low" : "high" },
                        { "connection_load", systemAnalytics.ActiveConnections > 100 ? "high" : "normal" }
                    }
                };

                return Result<SystemAnalyticsResponse>.Success(response);
            }
            catch (Exception ex)
            {
                return Result<SystemAnalyticsResponse>.Failure($"Error retrieving system analytics: {ex.Message}");
            }
        }
    }
}
