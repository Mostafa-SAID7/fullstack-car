namespace Application.Features.Admin.Analytics.DTOs.Responses
{
    public class AdvancedAnalyticsResponse
    {
        public UserAnalytics Users { get; set; } = new();
        public ContentAnalytics Content { get; set; } = new();
        public EngagementAnalytics Engagement { get; set; } = new();
        public SystemAnalytics System { get; set; } = new();
        public SecurityAnalytics Security { get; set; } = new();
        public PerformanceAnalytics Performance { get; set; } = new();
        public AnalyticsMetadata Metadata { get; set; } = new();
    }
}
