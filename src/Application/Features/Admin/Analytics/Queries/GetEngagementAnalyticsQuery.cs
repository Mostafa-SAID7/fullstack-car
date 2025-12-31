using Application.Features.Admin.Analytics.DTOs.Responses;

namespace Application.Features.Admin.Analytics.Queries
{
    public class GetEngagementAnalyticsQuery : BaseAnalyticsQuery, IRequest<Result<EngagementAnalyticsResponse>>
    {
        public GetEngagementAnalyticsQuery()
        {
            Granularity = "day";
            Metrics = new() { "views", "likes", "shares", "engagement_rate" };
        }
    }
}