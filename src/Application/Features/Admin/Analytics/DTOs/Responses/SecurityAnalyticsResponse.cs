namespace Application.Features.Admin.Analytics.DTOs.Responses
{
    public class SecurityAnalyticsResponse : AnalyticsResponse<SecurityAnalytics>
    {
        public List<SecurityTrendData> Trends { get; set; } = new();
    }
}