namespace Application.Features.Admin.Analytics.DTOs.Responses
{
    public class SystemAnalyticsResponse : AnalyticsResponse<SystemAnalytics>
    {
        public List<SystemTrendData> Trends { get; set; } = new();
    }
}