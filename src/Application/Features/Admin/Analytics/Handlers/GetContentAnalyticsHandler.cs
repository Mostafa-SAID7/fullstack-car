using Application.Features.Admin.Analytics.DTOs.Responses;
using Application.Features.Admin.Analytics.Queries;

namespace Application.Features.Admin.Analytics.Handlers
{
    public class GetContentAnalyticsHandler : IRequestHandler<GetContentAnalyticsQuery, Result<ContentAnalyticsResponse>>
    {
        private readonly IAnalyticsService _analyticsService;

        public GetContentAnalyticsHandler(IAnalyticsService analyticsService)
        {
            _analyticsService = analyticsService;
        }

        public async Task<Result<ContentAnalyticsResponse>> Handle(GetContentAnalyticsQuery request, CancellationToken cancellationToken)
        {
            try
            {
                var contentAnalytics = await _analyticsService.GetContentAnalyticsAsync(request.StartDate, request.EndDate, cancellationToken);
                var contentTrends = await _analyticsService.GetContentTrendsAsync(
                    request.StartDate ?? DateTime.UtcNow.AddDays(-30), 
                    request.EndDate ?? DateTime.UtcNow, 
                    request.Granularity ?? "day", 
                    cancellationToken);

                var response = new ContentAnalyticsResponse
                {
                    Data = contentAnalytics,
                    Trends = contentTrends,
                    Metadata = new AnalyticsMetadata
                    {
                        StartDate = request.StartDate,
                        EndDate = request.EndDate,
                        Granularity = request.Granularity ?? "day",
                        Metrics = request.Metrics ?? new List<string>(),
                        TotalRecords = contentAnalytics.TotalPosts,
                        DataSource = "ContentAnalytics"
                    },
                    Summary = new Dictionary<string, object>
                    {
                        { "growth_trend", contentAnalytics.ContentGrowthRate > 0 ? "positive" : "negative" },
                        { "content_health", contentAnalytics.TotalPosts > 100 ? "healthy" : "growing" },
                        { "engagement_level", contentAnalytics.PopularContent.Count > 5 ? "high" : "medium" }
                    }
                };

                return Result<ContentAnalyticsResponse>.Success(response);
            }
            catch (Exception ex)
            {
                return Result<ContentAnalyticsResponse>.Failure($"Error retrieving content analytics: {ex.Message}");
            }
        }
    }
}