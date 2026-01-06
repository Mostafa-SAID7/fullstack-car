namespace Application.Features.Admin.Analytics.DTOs.Responses
{
    public class ContentAnalyticsResponse : AnalyticsResponse<ContentAnalytics>
    {
        public List<ContentTrendData> Trends { get; set; } = new();
    }
}
