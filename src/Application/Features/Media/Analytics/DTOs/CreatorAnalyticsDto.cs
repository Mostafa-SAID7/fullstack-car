namespace Application.Features.Media.Analytics.DTOs;

public class CreatorAnalyticsDto
{
    public Guid CreatorId { get; set; }
    public string CreatorName { get; set; } = string.Empty;
    public CreatorMetricsDto Metrics { get; set; } = new();
    public List<TrendDataPointDto> ViewsTrend { get; set; } = new();
    public List<TrendDataPointDto> SubscribersTrend { get; set; } = new();
    public List<TrendDataPointDto> EngagementTrend { get; set; } = new();
    public List<TopContentDto> TopVideos { get; set; } = new();
    public List<TopContentDto> TopPodcasts { get; set; } = new();
    public AudienceInsightsDto AudienceInsights { get; set; } = new();
    public ContentPerformanceDto ContentPerformance { get; set; } = new();
    public ComparisonDataDto? Comparison { get; set; }
    public DateTime GeneratedAt { get; set; } = DateTime.UtcNow;
    public string TimeRange { get; set; } = string.Empty;
}

public class CreatorMetricsDto
{
    public long TotalViews { get; set; }
    public long TotalPlays { get; set; }
    public long TotalSubscribers { get; set; }
    public long TotalLikes { get; set; }
    public long TotalComments { get; set; }
    public long TotalShares { get; set; }
    public int TotalVideos { get; set; }
    public int TotalPodcasts { get; set; }
    public double AverageEngagementRate { get; set; }
    public double SubscriberGrowthRate { get; set; }
    public double ContentConsistency { get; set; }
}

public class AudienceInsightsDto
{
    public List<GeographicDataDto> TopCountries { get; set; } = new();
    public List<DeviceDataDto> TopDevices { get; set; } = new();
    public List<AgeGroupDto> AgeGroups { get; set; } = new();
    public List<GenderDto> GenderBreakdown { get; set; } = new();
    public List<InterestDto> TopInterests { get; set; } = new();
    public double AverageSessionDuration { get; set; }
    public double ReturnViewerRate { get; set; }
}

public class ContentPerformanceDto
{
    public double AverageViewsPerVideo { get; set; }
    public double AveragePlaysPerPodcast { get; set; }
    public double AverageEngagementRate { get; set; }
    public double AverageCompletionRate { get; set; }
    public List<CategoryPerformanceDto> CategoryPerformance { get; set; } = new();
    public List<PublishTimeDto> BestPublishTimes { get; set; } = new();
}

public class AgeGroupDto
{
    public string AgeRange { get; set; } = string.Empty;
    public long Count { get; set; }
    public double Percentage { get; set; }
}

public class GenderDto
{
    public string Gender { get; set; } = string.Empty;
    public long Count { get; set; }
    public double Percentage { get; set; }
}

public class InterestDto
{
    public string Interest { get; set; } = string.Empty;
    public long Count { get; set; }
    public double Percentage { get; set; }
}

public class CategoryPerformanceDto
{
    public string Category { get; set; } = string.Empty;
    public long Views { get; set; }
    public double EngagementRate { get; set; }
    public int ContentCount { get; set; }
}

public class PublishTimeDto
{
    public string DayOfWeek { get; set; } = string.Empty;
    public int Hour { get; set; }
    public double AverageViews { get; set; }
    public double EngagementRate { get; set; }
}