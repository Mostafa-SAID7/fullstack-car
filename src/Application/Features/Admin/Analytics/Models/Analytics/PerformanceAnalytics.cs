using Application.Features.Admin.Analytics.Models.Metrics;

namespace Application.Features.Admin.Analytics.Models.Analytics
{
    public class PerformanceAnalytics
    {
        public double DatabaseResponseTime { get; set; }
        public double CacheHitRate { get; set; }
        public double ApiResponseTime { get; set; }
        public int QueuedJobs { get; set; }
        public int FailedJobs { get; set; }
        public List<PerformanceMetric> Metrics { get; set; } = new();
    }
}
