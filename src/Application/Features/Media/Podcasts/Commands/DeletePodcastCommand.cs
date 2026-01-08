using MediatR;
using Application.Common.Models;

namespace Application.Features.Media.Podcasts.Commands;

public class DeletePodcastCommand : IRequest<Result<bool>>
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
}