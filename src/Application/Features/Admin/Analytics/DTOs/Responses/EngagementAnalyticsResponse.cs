namespace Application.Features.Admin.Analytics.DTOs.Responses
{
    public class EngagementAnalyticsResponse : AnalyticsResponse<EngagementAnalytics>
    {
        public List<EngagementTrendData> Trends { get; set; } = new();
    }
}