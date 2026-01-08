namespace Application.Features.Media.Podcasts.DTOs.Responses;

public class PodcastAnalyticsResponse
{
    public int PodcastId { get; set; }
    public string PodcastTitle { get; set; } = string.Empty;
    public int TotalListens { get; set; }
    public int UniqueListeners { get; set; }
    public int TotalSubscribers { get; set; }
    public int TotalLikes { get; set; }
    public TimeSpan AverageListenDuration { get; set; }
    public double CompletionRate { get; set; }
    public List<DailyListenStats> DailyStats { get; set; } = new();
    public List<GeographicStats> GeographicStats { get; set; } = new();
    public List<DeviceStats> DeviceStats { get; set; } = new();
}

public class DailyListenStats
{
    public DateTime Date { get; set; }
    public int Listens { get; set; }
    public int UniqueListeners { get; set; }
}

public class GeographicStats
{
    public string Country { get; set; } = string.Empty;
    public string CountryCode { get; set; } = string.Empty;
    public int ListenCount { get; set; }
    public double Percentage { get; set; }
}

public class DeviceStats
{
    public string DeviceType { get; set; } = string.Empty;
    public int ListenCount { get; set; }
    public double Percentage { get; set; }
}