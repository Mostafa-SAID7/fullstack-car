namespace Application.Features.Admin.Analytics.DTOs.Responses
{
    public class PerformanceAnalyticsResponse : AnalyticsResponse<PerformanceAnalytics>
    {
        public List<PerformanceMetric> Metrics { get; set; } = new();
    }
}
