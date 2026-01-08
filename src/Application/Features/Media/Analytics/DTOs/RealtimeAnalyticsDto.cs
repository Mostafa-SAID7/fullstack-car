namespace Application.Features.Media.Analytics.DTOs;

public class RealtimeAnalyticsDto
{
    public int ActiveViewers { get; set; }
    public int ActiveListeners { get; set; }
    public List<RealtimeContentDto> TopContent { get; set; } = new();
    public List<RealtimeGeographicDto> TopCountries { get; set; } = new();
    public List<RealtimeEventDto> RecentEvents { get; set; } = new();
    public RealtimeMetricsDto Metrics { get; set; } = new();
    public DateTime LastUpdated { get; set; } = DateTime.UtcNow;
    public int TimeWindowMinutes { get; set; }
}

public class RealtimeContentDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty; // Video, Podcast
    public int CurrentViewers { get; set; }
    public int ViewsInWindow { get; set; }
    public double EngagementRate { get; set; }
}

public class RealtimeGeographicDto
{
    public string Country { get; set; } = string.Empty;
    public string? CountryCode { get; set; }
    public int ActiveViewers { get; set; }
    public int ViewsInWindow { get; set; }
}

public class RealtimeEventDto
{
    public string EventType { get; set; } = string.Empty; // View, Like, Comment, Share
    public Guid MediaId { get; set; }
    public string MediaTitle { get; set; } = string.Empty;
    public string? Country { get; set; }
    public DateTime Timestamp { get; set; }
}

public class RealtimeMetricsDto
{
    public int ViewsPerMinute { get; set; }
    public int PlaysPerMinute { get; set; }
    public int EngagementsPerMinute { get; set; }
    public double AverageWatchTime { get; set; }
    public double BounceRate { get; set; }
    public List<TrendDataPointDto> ViewsTrend { get; set; } = new(); // Last hour by minute
}