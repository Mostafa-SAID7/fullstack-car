namespace Application.Features.Admin.Analytics.Queries
{
    public abstract class BaseAnalyticsQuery
    {
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string? Granularity { get; set; }
        public List<string>? Metrics { get; set; }
    }
}