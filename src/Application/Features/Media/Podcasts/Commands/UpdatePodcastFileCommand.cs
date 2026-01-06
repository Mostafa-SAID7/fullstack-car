using Application.Common.Models;
using MediatR;

namespace Application.Features.Media.Podcasts.Commands;

public class UpdatePodcastFileCommand : IRequest<Result<bool>>
{
    public Guid PodcastId { get; set; }
    public string AudioUrl { get; set; } = string.Empty;
    public long FileSize { get; set; }
    public TimeSpan Duration { get; set; }
}
