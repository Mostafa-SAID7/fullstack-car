using Application.Common.Models;
using MediatR;

namespace Application.Features.Media.Videos.Commands;

public class UpdateVideoFileCommand : IRequest<Result<bool>>
{
    public Guid VideoId { get; set; }
    public string VideoUrl { get; set; } = string.Empty;
    public long FileSize { get; set; }
    public TimeSpan Duration { get; set; }
}