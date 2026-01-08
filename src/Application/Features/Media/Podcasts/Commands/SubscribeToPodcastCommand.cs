using MediatR;
using Application.Common.Models;

namespace Application.Features.Media.Podcasts.Commands;

public class SubscribeToPodcastCommand : IRequest<Result<bool>>
{
    public Guid PodcastId { get; set; }
    public Guid UserId { get; set; }
}

public class UnsubscribeFromPodcastCommand : IRequest<Result<bool>>
{
    public Guid PodcastId { get; set; }
    public Guid UserId { get; set; }
}

public class RecordPodcastPlayCommand : IRequest<Result<bool>>
{
    public int PodcastId { get; set; }
    public TimeSpan? Duration { get; set; }
    public TimeSpan? Position { get; set; }
    public bool Completed { get; set; }
}