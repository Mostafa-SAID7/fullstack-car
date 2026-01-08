namespace Application.Features.Media.Analytics.DTOs;

public class PodcastAnalyticsDto
{
    public Guid PodcastId { get; set; }
    public string PodcastTitle { get; set; } = string.Empty;
    public PodcastMetricsDto Metrics { get; set; } = new();
    public List<TrendDataPointDto> PlaysTrend { get; set; } = new();
    public List<TrendDataPointDto> DownloadsTrend { get; set; } = new();
    public List<TrendDataPointDto> EngagementTrend { get; set; } = new();
    public List<RetentionDataPointDto> RetentionCurve { get; set; } = new();
    public List<GeographicDataDto> GeographicBreakdown { get; set; } = new();
    public List<DeviceDataDto> DeviceBreakdown { get; set; } = new();
    public List<ReferrerDataDto> ReferrerBreakdown { get; set; } = new();
    public List<EngagementBreakdownDto> EngagementBreakdown { get; set; } = new();
    public List<PlaybackSpeedDto> PlaybackSpeeds { get; set; } = new();
    public DateTime GeneratedAt { get; set; } = DateTime.UtcNow;
    public string TimeRange { get; set; } = string.Empty;
}

public class PodcastMetricsDto
{
    public long TotalPlays { get; set; }
    public long UniquePlays { get; set; }
    public long TotalDownloads { get; set; }
    public long TotalLikes { get; set; }
    public long TotalComments { get; set; }
    public long TotalShares { get; set; }
    public long TotalSubscriptions { get; set; }
    public double AverageListenTime { get; set; }
    public double AverageCompletionRate { get; set; }
    public double EngagementRate { get; set; }
    public double SubscriptionRate { get; set; }
    public TimeSpan EpisodeDuration { get; set; }
}

public class PlaybackSpeedDto
{
    public double Speed { get; set; }
    public long Count { get; set; }
    public double Percentage { get; set; }
}