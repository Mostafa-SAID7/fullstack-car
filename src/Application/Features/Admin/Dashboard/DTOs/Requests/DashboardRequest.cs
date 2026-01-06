namespace Application.Features.Admin.Dashboard.DTOs.Requests
{
    public class GetDashboardStatsRequest
    {
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        public bool IncludeSystemInfo { get; set; } = true;
        public bool IncludePerformanceMetrics { get; set; } = true;
        public bool IncludeRecentActivity { get; set; } = true;
    }

    public class RefreshDashboardRequest
    {
        public List<string> Components { get; set; } = new(); // "stats", "system", "performance", "activity"
        public bool ForceRefresh { get; set; } = false;
    }
}
