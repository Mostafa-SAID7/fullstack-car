using MediatR;
using Application.Common.Models;

namespace Application.Features.Media.Podcasts.Commands;

public class DeletePodcastCommand : IRequest<Result<bool>>
{
    public int Id { get; set; }
}