namespace Application.Features.Media.Analytics.DTOs;

public class PodcastPlayDto
{
    public Guid Id { get; set; }
    public Guid PodcastId { get; set; }
    public Guid? UserId { get; set; }
    public string? IpAddress { get; set; }
    public string? Country { get; set; }
    public string? City { get; set; }
    public string? Device { get; set; }
    public string? Browser { get; set; }
    public string? OperatingSystem { get; set; }
    public int ListenTimeSeconds { get; set; }
    public double CompletionPercentage { get; set; }
    public double PlaybackSpeed { get; set; }
    public bool IsDownload { get; set; }
    public bool IsUnique { get; set; }
    public DateTime PlayedAt { get; set; }
}