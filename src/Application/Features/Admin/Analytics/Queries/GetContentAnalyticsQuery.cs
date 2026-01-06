using Application.Features.Admin.Analytics.DTOs.Responses;

namespace Application.Features.Admin.Analytics.Queries
{
    public class GetContentAnalyticsQuery : BaseAnalyticsQuery, IRequest<Result<ContentAnalyticsResponse>>
    {
        public GetContentAnalyticsQuery()
        {
            Granularity = "day";
            Metrics = new() { "posts", "comments", "groups", "reviews" };
        }
    }
}
