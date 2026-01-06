namespace Application.Features.Admin.Dashboard.Models
{
    // Dashboard-related models
    public class QuickStats
    {
        public int NewUsersToday { get; set; }
        public int PostsToday { get; set; }
        public int CommentsToday { get; set; }
        public int ReportsToday { get; set; }
    }

    public class SystemInfo
    {
        public string Version { get; set; } = string.Empty;
        public string Environment { get; set; } = string.Empty;
        public DateTime ServerTime { get; set; }
        public string DatabaseStatus { get; set; } = string.Empty;
        public string AIServiceStatus { get; set; } = string.Empty;
        public string CacheStatus { get; set; } = string.Empty;
        public string Uptime { get; set; } = string.Empty;
        public SystemMetrics SystemMetrics { get; set; } = new();
        public DatabaseMetrics DatabaseMetrics { get; set; } = new();
    }

    public class SystemMetrics
    {
        public long WorkingSet { get; set; }
        public long PrivateMemory { get; set; }
        public int ThreadCount { get; set; }
        public int HandleCount { get; set; }
    }

    public class DatabaseMetrics
    {
        public int TotalTables { get; set; }
        public int TotalRecords { get; set; }
        public string DatabaseSize { get; set; } = string.Empty;
        public int ConnectionCount { get; set; }
    }

    public class Activity
    {
        public string Type { get; set; } = string.Empty;
        public string User { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; }
        public string Icon { get; set; } = string.Empty;
        public string Priority { get; set; } = string.Empty;
    }

    public class SystemAlert
    {
        public string Message { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; }
        public string Type { get; set; } = string.Empty;
        public string Severity { get; set; } = string.Empty;
    }

    public class PerformanceMetrics
    {
        public double CpuUsage { get; set; }
        public MemoryUsage MemoryUsage { get; set; } = new();
        public DiskUsage DiskUsage { get; set; } = new();
        public NetworkTraffic NetworkTraffic { get; set; } = new();
        public ResponseTimes ResponseTimes { get; set; } = new();
        public double ErrorRate { get; set; }
        public DatabaseMetrics DatabaseMetrics { get; set; } = new();
        public CacheMetrics CacheMetrics { get; set; } = new();
    }

    public class MemoryUsage
    {
        public long WorkingSet { get; set; }
        public long PrivateMemory { get; set; }
        public long GCMemory { get; set; }
    }

    public class DiskUsage
    {
        public double Used { get; set; }
        public double Available { get; set; }
        public double Total { get; set; }
    }

    public class NetworkTraffic
    {
        public long Incoming { get; set; }
        public long Outgoing { get; set; }
    }

    public class ResponseTimes
    {
        public double Average { get; set; }
        public double P95 { get; set; }
        public double P99 { get; set; }
    }

    public class CacheMetrics
    {
        public double HitRate { get; set; }
        public double MissRate { get; set; }
        public int TotalKeys { get; set; }
        public string MemoryUsage { get; set; } = string.Empty;
    }
}
