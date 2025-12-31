using Application.Features.Admin.Analytics.Models.Alerts;

namespace Application.Features.Admin.Analytics.Models.Analytics
{
    public class SystemAnalytics
    {
        public double CpuUsage { get; set; }
        public double MemoryUsage { get; set; }
        public double DiskUsage { get; set; }
        public double NetworkTraffic { get; set; }
        public int ActiveConnections { get; set; }
        public double AverageResponseTime { get; set; }
        public double ErrorRate { get; set; }
        public List<SystemAlert> Alerts { get; set; } = new();
    }
}