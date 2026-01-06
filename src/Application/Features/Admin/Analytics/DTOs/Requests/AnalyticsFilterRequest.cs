namespace Application.Features.Admin.Analytics.DTOs.Requests
{
    public class AnalyticsFilterRequest
    {
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string Granularity { get; set; } = "day"; // "hour", "day", "week", "month"
        public List<string> Metrics { get; set; } = new();
        public string? GroupBy { get; set; }
        public Dictionary<string, object> Filters { get; set; } = new();
    }
}
