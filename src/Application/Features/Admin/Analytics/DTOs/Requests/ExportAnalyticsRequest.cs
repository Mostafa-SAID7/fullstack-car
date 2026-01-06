namespace Application.Features.Admin.Analytics.DTOs.Requests
{
    public class ExportAnalyticsRequest
    {
        public string Format { get; set; } = "csv"; // "csv", "excel", "pdf", "json"
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public List<string> Metrics { get; set; } = new();
        public List<string> Dimensions { get; set; } = new();
        public string? EmailTo { get; set; }
        public bool IncludeCharts { get; set; } = false;
        public string? ReportName { get; set; }
    }
}
