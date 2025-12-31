namespace Application.Features.Admin.Analytics.DTOs.Responses
{
    // Unified Analytics Response Structure
    public class AnalyticsResponse<T>
    {
        public T Data { get; set; } = default!;
        public AnalyticsMetadata Metadata { get; set; } = new();
        public Dictionary<string, object> Summary { get; set; } = new();
    }

    public class AnalyticsMetadata
    {
        public DateTime GeneratedAt { get; set; } = DateTime.UtcNow;
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string Granularity { get; set; } = string.Empty;
        public List<string> Metrics { get; set; } = new();
        public int TotalRecords { get; set; }
        public string DataSource { get; set; } = string.Empty;
    }
}