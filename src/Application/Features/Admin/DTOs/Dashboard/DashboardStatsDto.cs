namespace Application.Features.Admin.DTOs.Dashboard
{
    public class DashboardStatsDto
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
        public QuickStatsDto QuickStats { get; set; } = new();
    }

    public class QuickStatsDto
    {
        public int NewUsersToday { get; set; }
        public int PostsToday { get; set; }
        public int CommentsToday { get; set; }
        public int ReportsToday { get; set; }
    }

    public class SystemInfoDto
    {
        public string Version { get; set; } = string.Empty;
        public string Environment { get; set; } = string.Empty;
        public DateTime ServerTime { get; set; }
        public string DatabaseStatus { get; set; } = string.Empty;
        public string AIServiceStatus { get; set; } = string.Empty;
        public string CacheStatus { get; set; } = string.Empty;
        public string Uptime { get; set; } = string.Empty;
        public SystemMetricsDto SystemMetrics { get; set; } = new();
        public DatabaseMetricsDto DatabaseMetrics { get; set; } = new();
    }

    public class SystemMetricsDto
    {
        public long WorkingSet { get; set; }
        public long PrivateMemory { get; set; }
        public int ThreadCount { get; set; }
        public int HandleCount { get; set; }
    }

    public class DatabaseMetricsDto
    {
        public int TotalTables { get; set; }
        public int TotalRecords { get; set; }
        public string DatabaseSize { get; set; } = string.Empty;
        public int ConnectionCount { get; set; }
    }

    public class ActivityDto
    {
        public string Type { get; set; } = string.Empty;
        public string User { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; }
        public string Icon { get; set; } = string.Empty;
        public string Priority { get; set; } = string.Empty;
    }

    public class SystemAlertDto
    {
        public string Message { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; }
        public string Type { get; set; } = string.Empty;
        public string Severity { get; set; } = string.Empty;
    }

    public class PerformanceMetricsDto
    {
        public double CpuUsage { get; set; }
        public MemoryUsageDto MemoryUsage { get; set; } = new();
        public DiskUsageDto DiskUsage { get; set; } = new();
        public NetworkTrafficDto NetworkTraffic { get; set; } = new();
        public ResponseTimesDto ResponseTimes { get; set; } = new();
        public double ErrorRate { get; set; }
        public DatabaseMetricsDto DatabaseMetrics { get; set; } = new();
        public CacheMetricsDto CacheMetrics { get; set; } = new();
    }

    public class MemoryUsageDto
    {
        public long WorkingSet { get; set; }
        public long PrivateMemory { get; set; }
        public long GCMemory { get; set; }
    }

    public class DiskUsageDto
    {
        public double Used { get; set; }
        public double Available { get; set; }
        public double Total { get; set; }
    }

    public class NetworkTrafficDto
    {
        public long Incoming { get; set; }
        public long Outgoing { get; set; }
    }

    public class ResponseTimesDto
    {
        public double Average { get; set; }
        public double P95 { get; set; }
        public double P99 { get; set; }
    }

    public class CacheMetricsDto
    {
        public double HitRate { get; set; }
        public double MissRate { get; set; }
        public int TotalKeys { get; set; }
        public string MemoryUsage { get; set; } = string.Empty;
    }
}