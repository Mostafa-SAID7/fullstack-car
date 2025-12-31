namespace Application.Features.Admin.Analytics.DTOs.Responses
{
    public class UserAnalyticsResponse : AnalyticsResponse<UserAnalytics>
    {
        public List<UserTrendData> Trends { get; set; } = new();
    }
}