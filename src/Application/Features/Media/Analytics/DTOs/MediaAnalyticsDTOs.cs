namespace Application.Features.Media.Analytics.DTOs;

public class TrackVideoViewRequest
{
    public TimeSpan WatchDuration { get; set; }
    public int WatchTimeSeconds { get; set; }
    public bool CompletedView { get; set; }
    public bool IsCompleted { get; set; }
    public double CompletionPercentage { get; set; }
    public string? Quality { get; set; }
    public string? DeviceType { get; set; }
    public string? Device { get; set; }
    public string? Country { get; set; }
    public Dictionary<string, object> Metadata { get; set; } = new();
}

public class TrackPodcastPlayRequest
{
    public TimeSpan PlayDuration { get; set; }
    public int ListenTimeSeconds { get; set; }
    public bool CompletedEpisode { get; set; }
    public bool IsCompleted { get; set; }
    public double CompletionPercentage { get; set; }
    public double PlaybackSpeed { get; set; } = 1.0;
    public string? DeviceType { get; set; }
    public string? Device { get; set; }
    public string? Country { get; set; }
    public Dictionary<string, object> Metadata { get; set; } = new();
}