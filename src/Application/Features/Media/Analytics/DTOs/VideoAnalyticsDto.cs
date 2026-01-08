namespace Application.Features.Media.Analytics.DTOs;

public class VideoAnalyticsDto
{
    public Guid VideoId { get; set; }
    public string VideoTitle { get; set; } = string.Empty;
    public VideoMetricsDto Metrics { get; set; } = new();
    public List<TrendDataPointDto> ViewsTrend { get; set; } = new();
    public List<TrendDataPointDto> EngagementTrend { get; set; } = new();
    public List<RetentionDataPointDto> RetentionCurve { get; set; } = new();
    public List<GeographicDataDto> GeographicBreakdown { get; set; } = new();
    public List<DeviceDataDto> DeviceBreakdown { get; set; } = new();
    public List<ReferrerDataDto> ReferrerBreakdown { get; set; } = new();
    public List<EngagementBreakdownDto> EngagementBreakdown { get; set; } = new();
    public DateTime GeneratedAt { get; set; } = DateTime.UtcNow;
    public string TimeRange { get; set; } = string.Empty;
}

public class VideoMetricsDto
{
    public long TotalViews { get; set; }
    public long UniqueViews { get; set; }
    public long TotalLikes { get; set; }
    public long TotalDislikes { get; set; }
    public long TotalComments { get; set; }
    public long TotalShares { get; set; }
    public double AverageWatchTime { get; set; }
    public double AverageCompletionRate { get; set; }
    public double EngagementRate { get; set; }
    public double LikeToDislikeRatio { get; set; }
    public TimeSpan VideoDuration { get; set; }
}

public class RetentionDataPointDto
{
    public int TimeSeconds { get; set; }
    public double RetentionPercentage { get; set; }
    public bool IsDropOffPoint { get; set; }
}

public class EngagementBreakdownDto
{
    public string EngagementType { get; set; } = string.Empty;
    public long Count { get; set; }
    public double Percentage { get; set; }
    public List<TrendDataPointDto> Trend { get; set; } = new();
}