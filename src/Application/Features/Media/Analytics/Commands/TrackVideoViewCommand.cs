using Application.Common.Models;
using MediatR;

namespace Application.Features.Media.Analytics.Commands;

public class TrackVideoViewCommand : IRequest<Result<bool>>
{
    public Guid VideoId { get; set; }
    public Guid? UserId { get; set; }
    public string? IpAddress { get; set; }
    public TimeSpan WatchDuration { get; set; }
    public bool IsCompleted { get; set; }
    public string? UserAgent { get; set; }
    public string? Country { get; set; }
}

public class TrackPodcastPlayCommand : IRequest<Result<bool>>
{
    public Guid PodcastId { get; set; }
    public Guid? UserId { get; set; }
    public string? IpAddress { get; set; }
    public TimeSpan PlayDuration { get; set; }
    public bool IsCompleted { get; set; }
    public string? UserAgent { get; set; }
    public string? Country { get; set; }
}
