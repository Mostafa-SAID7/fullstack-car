namespace Application.Features.Admin.DTOs.Analytics
{
    public class AdminAnalyticsDto
    {
        public UserAnalyticsDto Users { get; set; } = new();
        public ContentAnalyticsDto Content { get; set; } = new();
        public EngagementAnalyticsDto Engagement { get; set; } = new();
        public SystemAnalyticsDto System { get; set; } = new();
        public RevenueAnalyticsDto Revenue { get; set; } = new();
        public SecurityAnalyticsDto Security { get; set; } = new();
    }

    public class UserAnalyticsDto
    {
        public int TotalUsers { get; set; }
        public int ActiveUsers { get; set; }
        public int NewUsersToday { get; set; }
        public int NewUsersThisWeek { get; set; }
        public int NewUsersThisMonth { get; set; }
        public double UserGrowthRate { get; set; }
        public double UserRetentionRate { get; set; }
        public double UserChurnRate { get; set; }
        public List<UserGrowthDataPoint> GrowthChart { get; set; } = new();
        public Dictionary<string, int> UsersByCountry { get; set; } = new();
        public Dictionary<string, int> UsersByAge { get; set; } = new();
        public Dictionary<string, int> UsersByDevice { get; set; } = new();
    }

    public class ContentAnalyticsDto
    {
        public int TotalPosts { get; set; }
        public int TotalComments { get; set; }
        public int TotalGroups { get; set; }
        public int TotalReviews { get; set; }
        public int PostsToday { get; set; }
        public int PostsThisWeek { get; set; }
        public int PostsThisMonth { get; set; }
        public double ContentGrowthRate { get; set; }
        public List<ContentDataPoint> ContentChart { get; set; } = new();
        public Dictionary<string, int> PostsByCategory { get; set; } = new();
        public List<PopularContentDto> PopularPosts { get; set; } = new();
        public List<PopularContentDto> TrendingTopics { get; set; } = new();
    }

    public class EngagementAnalyticsDto
    {
        public long TotalViews { get; set; }
        public long TotalLikes { get; set; }
        public long TotalShares { get; set; }
        public double AverageEngagementRate { get; set; }
        public double AverageSessionDuration { get; set; }
        public double BounceRate { get; set; }
        public List<EngagementDataPoint> EngagementChart { get; set; } = new();
        public Dictionary<string, double> EngagementByHour { get; set; } = new();
        public Dictionary<string, double> EngagementByDay { get; set; } = new();
    }

    public class SystemAnalyticsDto
    {
        public double AverageResponseTime { get; set; }
        public double ErrorRate { get; set; }
        public long TotalRequests { get; set; }
        public long SuccessfulRequests { get; set; }
        public long FailedRequests { get; set; }
        public double SystemUptime { get; set; }
        public List<PerformanceDataPoint> PerformanceChart { get; set; } = new();
        public Dictionary<string, int> ErrorsByType { get; set; } = new();
        public List<PopularEndpointDto> PopularEndpoints { get; set; } = new();
    }

    public class RevenueAnalyticsDto
    {
        public decimal TotalRevenue { get; set; }
        public decimal RevenueToday { get; set; }
        public decimal RevenueThisMonth { get; set; }
        public decimal RevenueThisYear { get; set; }
        public double RevenueGrowthRate { get; set; }
        public decimal AverageRevenuePerUser { get; set; }
        public List<RevenueDataPoint> RevenueChart { get; set; } = new();
        public Dictionary<string, decimal> RevenueBySource { get; set; } = new();
        public List<TopCustomerDto> TopCustomers { get; set; } = new();
    }

    public class SecurityAnalyticsDto
    {
        public int TotalSecurityEvents { get; set; }
        public int SecurityEventsToday { get; set; }
        public int FailedLoginAttempts { get; set; }
        public int BlockedIPs { get; set; }
        public int SuspiciousActivities { get; set; }
        public List<SecurityEventDto> RecentEvents { get; set; } = new();
        public Dictionary<string, int> ThreatsByType { get; set; } = new();
        public List<string> TopThreats { get; set; } = new();
    }

    // Data Point Classes
    public class UserGrowthDataPoint
    {
        public DateTime Date { get; set; }
        public int NewUsers { get; set; }
        public int TotalUsers { get; set; }
        public int ActiveUsers { get; set; }
    }

    public class ContentDataPoint
    {
        public DateTime Date { get; set; }
        public int Posts { get; set; }
        public int Comments { get; set; }
        public int Groups { get; set; }
        public int Reviews { get; set; }
    }

    public class EngagementDataPoint
    {
        public DateTime Date { get; set; }
        public long Views { get; set; }
        public long Likes { get; set; }
        public long Shares { get; set; }
        public double EngagementRate { get; set; }
    }

    public class PerformanceDataPoint
    {
        public DateTime Timestamp { get; set; }
        public double ResponseTime { get; set; }
        public double CpuUsage { get; set; }
        public double MemoryUsage { get; set; }
        public long RequestCount { get; set; }
    }

    public class RevenueDataPoint
    {
        public DateTime Date { get; set; }
        public decimal Revenue { get; set; }
        public int Transactions { get; set; }
        public decimal AverageOrderValue { get; set; }
    }

    // Supporting Classes
    public class PopularContentDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Author { get; set; } = string.Empty;
        public long Views { get; set; }
        public long Likes { get; set; }
        public long Comments { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class PopularEndpointDto
    {
        public string Endpoint { get; set; } = string.Empty;
        public string Method { get; set; } = string.Empty;
        public long RequestCount { get; set; }
        public double AverageResponseTime { get; set; }
        public double ErrorRate { get; set; }
    }

    public class TopCustomerDto
    {
        public Guid UserId { get; set; }
        public string UserName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public decimal TotalSpent { get; set; }
        public int OrderCount { get; set; }
        public DateTime LastOrder { get; set; }
    }

    public class SecurityEventDto
    {
        public Guid Id { get; set; }
        public string EventType { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Severity { get; set; } = string.Empty;
        public string IpAddress { get; set; } = string.Empty;
        public string UserAgent { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; }
        public Guid? UserId { get; set; }
        public string? UserName { get; set; }
    }

    // Request DTOs
    public class AnalyticsFilterRequest
    {
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string? Granularity { get; set; } = "day"; // "hour", "day", "week", "month"
        public List<string> Metrics { get; set; } = new();
        public Dictionary<string, string> Filters { get; set; } = new();
    }

    public class ExportAnalyticsRequest
    {
        public string Format { get; set; } = "csv"; // "csv", "excel", "pdf"
        public List<string> Metrics { get; set; } = new();
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public bool IncludeCharts { get; set; } = false;
    }
}