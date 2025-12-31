using Application.Features.Admin.Analytics.DTOs.Responses;

namespace Application.Features.Admin.Analytics.Queries
{
    public class GetSystemAnalyticsQuery : BaseAnalyticsQuery, IRequest<Result<SystemAnalyticsResponse>>
    {
        public GetSystemAnalyticsQuery()
        {
            Granularity = "hour";
            Metrics = new() { "response_time", "error_rate", "requests", "uptime" };
        }
    }
}