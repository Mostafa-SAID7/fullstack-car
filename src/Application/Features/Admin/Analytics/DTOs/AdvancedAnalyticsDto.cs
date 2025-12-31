namespace Application.Features.Admin.Analytics.DTOs
{
    public class AdvancedAnalyticsDto
    {
        public UserAnalytics Users { get; set; } = new();
        public ContentAnalytics Content { get; set; } = new();
        public EngagementAnalytics Engagement { get; set; } = new();
        public SystemAnalytics System { get; set; } = new();
        public SecurityAnalytics Security { get; set; } = new();
        public PerformanceAnalytics Performance { get; set; } = new();
    }

    public class UserAnalytics
    {
        public int TotalUsers { get; set; }
        public int ActiveUsers { get; set; }
        public int NewUsersToday { get; set; }
        public int NewUsersThisWeek { get; set; }
        public int NewUsersThisMonth { get; set; }
        public double UserGrowthRate { get; set; }
        public double UserRetentionRate { get; set; }
        public List<UserDemographic> Demographics { get; set; } = new();
        public List<UserActivityTrend> ActivityTrends { get; set; } = new();
        public List<TopUser> TopUsers { get; set; } = new();
    }

    public class ContentAnalytics
    {
        public int TotalPosts { get; set; }
        public int TotalComments { get; set; }
        public int TotalGroups { get; set; }
        public int PostsToday { get; set; }
        public int PostsThisWeek { get; set; }
        public int PostsThisMonth { get; set; }
        public double ContentGrowthRate { get; set; }
        public List<ContentCategory> TopCategories { get; set; } = new();
        public List<ContentTrend> ContentTrends { get; set; } = new();
        public List<PopularContent> PopularContent { get; set; } = new();
    }

    public class EngagementAnalytics
    {
        public int TotalLikes { get; set; }
        public int TotalShares { get; set; }
        public int TotalViews { get; set; }
        public double EngagementRate { get; set; }
        public double AverageSessionDuration { get; set; }
        public List<EngagementTrend> EngagementTrends { get; set; } = new();
        public List<TopEngagedContent> TopEngagedContent { get; set; } = new();
    }

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

    public class SecurityAnalytics
    {
        public int FailedLoginAttempts { get; set; }
        public int SuspiciousActivities { get; set; }
        public int BlockedIPs { get; set; }
        public int SecurityIncidents { get; set; }
        public List<SecurityThreat> RecentThreats { get; set; } = new();
        public List<SecurityEvent> SecurityEvents { get; set; } = new();
    }

    public class PerformanceAnalytics
    {
        public double DatabaseResponseTime { get; set; }
        public double CacheHitRate { get; set; }
        public double ApiResponseTime { get; set; }
        public int QueuedJobs { get; set; }
        public int FailedJobs { get; set; }
        public List<PerformanceMetric> Metrics { get; set; } = new();
    }

    // Supporting classes
    public class UserDemographic
    {
        public string Category { get; set; } = string.Empty;
        public string Value { get; set; } = string.Empty;
        public int Count { get; set; }
        public double Percentage { get; set; }
    }

    public class UserActivityTrend
    {
        public DateTime Date { get; set; }
        public int ActiveUsers { get; set; }
        public int NewUsers { get; set; }
        public int ReturnedUsers { get; set; }
    }

    public class TopUser
    {
        public string UserId { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public int PostCount { get; set; }
        public int LikeCount { get; set; }
        public int CommentCount { get; set; }
        public double EngagementScore { get; set; }
    }

    public class ContentCategory
    {
        public string Name { get; set; } = string.Empty;
        public int Count { get; set; }
        public double Percentage { get; set; }
        public double GrowthRate { get; set; }
    }

    public class ContentTrend
    {
        public DateTime Date { get; set; }
        public int PostCount { get; set; }
        public int CommentCount { get; set; }
        public int ViewCount { get; set; }
    }

    public class PopularContent
    {
        public string Id { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public int Views { get; set; }
        public int Likes { get; set; }
        public int Comments { get; set; }
        public double EngagementScore { get; set; }
    }

    public class EngagementTrend
    {
        public DateTime Date { get; set; }
        public int Likes { get; set; }
        public int Comments { get; set; }
        public int Shares { get; set; }
        public int Views { get; set; }
        public double EngagementRate { get; set; }
    }

    public class TopEngagedContent
    {
        public string Id { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Author { get; set; } = string.Empty;
        public double EngagementRate { get; set; }
        public int TotalEngagements { get; set; }
    }

    public class SystemAlert
    {
        public string Id { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public string Severity { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; }
        public bool IsResolved { get; set; }
    }

    public class SecurityThreat
    {
        public string Id { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public string Source { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Severity { get; set; } = string.Empty;
        public DateTime DetectedAt { get; set; }
        public string Status { get; set; } = string.Empty;
    }

    public class SecurityEvent
    {
        public string Id { get; set; } = string.Empty;
        public string EventType { get; set; } = string.Empty;
        public string UserId { get; set; } = string.Empty;
        public string IpAddress { get; set; } = string.Empty;
        public string UserAgent { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; }
        public string Details { get; set; } = string.Empty;
    }

    public class PerformanceMetric
    {
        public string Name { get; set; } = string.Empty;
        public double Value { get; set; }
        public string Unit { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; }
        public string Status { get; set; } = string.Empty;
    }
}