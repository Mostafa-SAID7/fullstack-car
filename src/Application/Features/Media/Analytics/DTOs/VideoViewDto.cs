namespace Application.Features.Media.Analytics.DTOs;

public class VideoViewDto
{
    public Guid Id { get; set; }
    public Guid VideoId { get; set; }
    public Guid? UserId { get; set; }
    public string? IpAddress { get; set; }
    public string? Country { get; set; }
    public string? City { get; set; }
    public string? Device { get; set; }
    public string? Browser { get; set; }
    public string? OperatingSystem { get; set; }
    public int WatchTimeSeconds { get; set; }
    public double CompletionPercentage { get; set; }
    public string? Quality { get; set; }
    public bool IsUnique { get; set; }
    public DateTime ViewedAt { get; set; }
}