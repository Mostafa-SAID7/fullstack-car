using Application.Features.Admin.Analytics.DTOs.Responses;

namespace Application.Features.Admin.Analytics.Queries
{
    public class GetPerformanceAnalyticsQuery : IRequest<Result<PerformanceAnalyticsResponse>>
    {
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string? Granularity { get; set; } = "hour";
        public List<string>? Metrics { get; set; } = new() { "database_response", "cache_hit_rate", "api_response", "jobs" };
    }
}
