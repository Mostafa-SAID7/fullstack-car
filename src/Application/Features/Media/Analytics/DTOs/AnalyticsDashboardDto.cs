namespace Application.Features.Media.Analytics.DTOs;

public class AnalyticsDashboardDto
{
    public OverviewMetricsDto Overview { get; set; } = new();
    public List<TrendDataPointDto> ViewsTrend { get; set; } = new();
    public List<TrendDataPointDto> EngagementTrend { get; set; } = new();
    public List<TopContentDto> TopVideos { get; set; } = new();
    public List<TopContentDto> TopPodcasts { get; set; } = new();
    public List<GeographicDataDto> TopCountries { get; set; } = new();
    public List<DeviceDataDto> TopDevices { get; set; } = new();
    public List<ReferrerDataDto> TopReferrers { get; set; } = new();
    public ComparisonDataDto? Comparison { get; set; }
    public DateTime GeneratedAt { get; set; } = DateTime.UtcNow;
    public string TimeRange { get; set; } = string.Empty;
}

public class OverviewMetricsDto
{
    public long TotalViews { get; set; }
    public long TotalPlays { get; set; }
    public long TotalLikes { get; set; }
    public long TotalComments { get; set; }
    public long TotalShares { get; set; }
    public long TotalSubscribers { get; set; }
    public double AverageWatchTime { get; set; }
    public double AverageEngagementRate { get; set; }
    public long UniqueViewers { get; set; }
    public long ReturningViewers { get; set; }
}

public class TrendDataPointDto
{
    public DateTime Date { get; set; }
    public long Value { get; set; }
    public double? PercentageChange { get; set; }
}

public class TopContentDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Thumbnail { get; set; }
    public long Views { get; set; }
    public long Likes { get; set; }
    public double EngagementRate { get; set; }
    public DateTime PublishedAt { get; set; }
}

public class GeographicDataDto
{
    public string Country { get; set; } = string.Empty;
    public string? CountryCode { get; set; }
    public long Views { get; set; }
    public double Percentage { get; set; }
}

public class DeviceDataDto
{
    public string Device { get; set; } = string.Empty;
    public string? Browser { get; set; }
    public string? OperatingSystem { get; set; }
    public long Views { get; set; }
    public double Percentage { get; set; }
}

public class ReferrerDataDto
{
    public string Referrer { get; set; } = string.Empty;
    public long Views { get; set; }
    public double Percentage { get; set; }
}

public class ComparisonDataDto
{
    public string PreviousPeriod { get; set; } = string.Empty;
    public double ViewsChange { get; set; }
    public double EngagementChange { get; set; }
    public double SubscribersChange { get; set; }
}