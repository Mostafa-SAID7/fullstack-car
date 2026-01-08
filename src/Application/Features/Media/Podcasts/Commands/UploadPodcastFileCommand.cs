using MediatR;
using Microsoft.AspNetCore.Http;
using Application.Common.Models;

namespace Application.Features.Media.Podcasts.Commands;

public class UploadPodcastFileCommand : IRequest<Result<string>>
{
    public int PodcastId { get; set; }
    public IFormFile File { get; set; } = null!;
}