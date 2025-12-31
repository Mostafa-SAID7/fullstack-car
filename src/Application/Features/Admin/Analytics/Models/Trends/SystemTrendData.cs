namespace Application.Features.Admin.Analytics.Models.Trends
{
    public class SystemTrendData
    {
        public DateTime Date { get; set; }
        public double CpuUsage { get; set; }
        public double MemoryUsage { get; set; }
        public int ActiveConnections { get; set; }
        public double ResponseTime { get; set; }
    }
}