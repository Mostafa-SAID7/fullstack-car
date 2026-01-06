using Application.Features.Admin.Analytics.DTOs.Responses;

namespace Application.Features.Admin.Analytics.Queries
{
    public class GetUserAnalyticsQuery : BaseAnalyticsQuery, IRequest<Result<UserAnalyticsResponse>>
    {
        public GetUserAnalyticsQuery()
        {
            Granularity = "day";
            Metrics = new() { "users", "growth", "retention", "churn" };
        }
    }
}
