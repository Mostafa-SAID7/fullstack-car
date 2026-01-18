namespace Application.Features.Media.Analytics.DTOs;

public class TrackVideoViewRequest
{
    public TimeSpan WatchDuration { get; set; }
    public bool CompletedView { get; set; }
    public string? Quality { get; set; }
    public string? DeviceType { get; set; }
    public Dictionary<string, object> Metadata { get; set; } = new();
}

public class TrackPodcastPlayRequest
{
    public TimeSpan PlayDuration { get; set; }
    public bool CompletedEpisode { get; set; }
    public double PlaybackSpeed { get; set; } = 1.0;
    public string? DeviceType { get; set; }
    public Dictionary<string, object> Metadata { get; set; } = new();
}