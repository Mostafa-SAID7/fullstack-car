using Application.Features.Admin.Dashboard.Models;

namespace Application.Features.Admin.Dashboard.DTOs.Responses
{
    public class DashboardStatsResponse
    {
        public int TotalUsers { get; set; }
        public int TotalPosts { get; set; }
        public int TotalGroups { get; set; }
        public int TotalReviews { get; set; }
        public int PendingApprovals { get; set; }
        public int FlaggedContent { get; set; }
        public int ActiveUsers { get; set; }
        public string SystemHealth { get; set; } = string.Empty;
        public DateTime LastUpdated { get; set; }
        public QuickStats QuickStats { get; set; } = new();
        public SystemInfo? SystemInfo { get; set; }
        public PerformanceMetrics? PerformanceMetrics { get; set; }
        public List<Activity> RecentActivity { get; set; } = new();
        public List<SystemAlert> SystemAlerts { get; set; } = new();
    }
}