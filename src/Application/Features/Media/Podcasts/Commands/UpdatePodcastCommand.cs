using MediatR;
using Application.Common.Models;

namespace Application.Features.Media.Podcasts.Commands;

public class UpdatePodcastCommand : IRequest<Result<bool>>
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int CategoryId { get; set; }
    public List<string> Tags { get; set; } = new();
    public bool IsPublic { get; set; } = true;
    public string? ThumbnailUrl { get; set; }
}