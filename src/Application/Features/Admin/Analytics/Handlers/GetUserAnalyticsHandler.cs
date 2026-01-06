using Application.Features.Admin.Analytics.DTOs.Responses;
using Application.Features.Admin.Analytics.Models;
using Application.Features.Admin.Analytics.Queries;

namespace Application.Features.Admin.Analytics.Handlers
{
    public class GetUserAnalyticsHandler : IRequestHandler<GetUserAnalyticsQuery, Result<UserAnalyticsResponse>>
    {
        private readonly IAnalyticsService _analyticsService;

        public GetUserAnalyticsHandler(IAnalyticsService analyticsService)
        {
            _analyticsService = analyticsService;
        }

        public async Task<Result<UserAnalyticsResponse>> Handle(GetUserAnalyticsQuery request, CancellationToken cancellationToken)
        {
            try
            {
                var userAnalytics = await _analyticsService.GetUserAnalyticsAsync(request.StartDate, request.EndDate, cancellationToken);
                var userTrends = await _analyticsService.GetUserTrendsAsync(
                    request.StartDate ?? DateTime.UtcNow.AddDays(-30), 
                    request.EndDate ?? DateTime.UtcNow, 
                    request.Granularity ?? "day", 
                    cancellationToken);

                var response = new UserAnalyticsResponse
                {
                    Data = userAnalytics,
                    Trends = userTrends,
                    Metadata = new AnalyticsMetadata
                    {
                        StartDate = request.StartDate,
                        EndDate = request.EndDate,
                        Granularity = request.Granularity ?? "day",
                        Metrics = request.Metrics ?? new List<string>(),
                        TotalRecords = userAnalytics.TotalUsers,
                        DataSource = "UserAnalytics"
                    },
                    Summary = new Dictionary<string, object>
                    {
                        { "growth_trend", userAnalytics.UserGrowthRate > 0 ? "positive" : "negative" },
                        { "retention_status", userAnalytics.UserRetentionRate > 70 ? "good" : userAnalytics.UserRetentionRate > 50 ? "average" : "poor" },
                        { "engagement_level", userAnalytics.TopUsers.Count > 5 ? "high" : "medium" }
                    }
                };

                return Result<UserAnalyticsResponse>.Success(response);
            }
            catch (Exception ex)
            {
                return Result<UserAnalyticsResponse>.Failure($"Error retrieving user analytics: {ex.Message}");
            }
        }
    }
}
