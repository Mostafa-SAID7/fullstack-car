using Application.Features.Admin.Analytics.DTOs.Responses;
using Application.Features.Admin.Analytics.Queries;

namespace Application.Features.Admin.Analytics.Handlers
{
    public class GetEngagementAnalyticsHandler : IRequestHandler<GetEngagementAnalyticsQuery, Result<EngagementAnalyticsResponse>>
    {
        private readonly IAnalyticsService _analyticsService;

        public GetEngagementAnalyticsHandler(IAnalyticsService analyticsService)
        {
            _analyticsService = analyticsService;
        }

        public async Task<Result<EngagementAnalyticsResponse>> Handle(GetEngagementAnalyticsQuery request, CancellationToken cancellationToken)
        {
            try
            {
                var engagementAnalytics = await _analyticsService.GetEngagementAnalyticsAsync(request.StartDate, request.EndDate, cancellationToken);
                var engagementTrends = await _analyticsService.GetEngagementTrendsAsync(
                    request.StartDate ?? DateTime.UtcNow.AddDays(-30), 
                    request.EndDate ?? DateTime.UtcNow, 
                    request.Granularity ?? "day", 
                    cancellationToken);

                var response = new EngagementAnalyticsResponse
                {
                    Data = engagementAnalytics,
                    Trends = engagementTrends,
                    Metadata = new AnalyticsMetadata
                    {
                        StartDate = request.StartDate,
                        EndDate = request.EndDate,
                        Granularity = request.Granularity ?? "day",
                        Metrics = request.Metrics ?? new List<string>(),
                        TotalRecords = engagementAnalytics.TotalLikes + engagementAnalytics.TotalViews,
                        DataSource = "EngagementAnalytics"
                    },
                    Summary = new Dictionary<string, object>
                    {
                        { "engagement_health", engagementAnalytics.EngagementRate > 5 ? "excellent" : engagementAnalytics.EngagementRate > 2 ? "good" : "needs_improvement" },
                        { "interaction_level", engagementAnalytics.TotalLikes > 1000 ? "high" : "medium" },
                        { "content_reach", engagementAnalytics.TotalViews > 10000 ? "wide" : "moderate" }
                    }
                };

                return Result<EngagementAnalyticsResponse>.Success(response);
            }
            catch (Exception ex)
            {
                return Result<EngagementAnalyticsResponse>.Failure($"Error retrieving engagement analytics: {ex.Message}");
            }
        }
    }
}