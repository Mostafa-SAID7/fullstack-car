using Application.Common.Models;
using Application.Features.Media.Analytics.DTOs;
using MediatR;

namespace Application.Features.Media.Analytics.Commands;

public class TrackPodcastPlayCommand : IRequest<Result<PodcastPlayDto>>
{
    public Guid PodcastId { get; set; }
    public Guid? UserId { get; set; }
    public string? IpAddress { get; set; }
    public string? UserAgent { get; set; }
    public string? Referrer { get; set; }
    public string? Country { get; set; }
    public string? City { get; set; }
    public string? Device { get; set; }
    public string? Browser { get; set; }
    public string? OperatingSystem { get; set; }
    public int? ListenTimeSeconds { get; set; }
    public double? CompletionPercentage { get; set; }
    public double? PlaybackSpeed { get; set; } = 1.0;
    public bool IsDownload { get; set; } = false;
    public bool IsUnique { get; set; } = true;
}