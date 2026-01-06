using Application.Features.Admin.Analytics.DTOs.Responses;

namespace Application.Features.Admin.Analytics.Queries
{
    public class GetSecurityAnalyticsQuery : BaseAnalyticsQuery, IRequest<Result<SecurityAnalyticsResponse>>
    {
        public GetSecurityAnalyticsQuery()
        {
            Granularity = "day";
            Metrics = new() { "security_events", "failed_logins", "blocked_ips", "threats" };
        }
    }
}
