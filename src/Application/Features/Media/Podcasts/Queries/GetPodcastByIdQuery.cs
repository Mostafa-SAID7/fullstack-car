using MediatR;
using Application.Common.Models;
using Application.Features.Media.Podcasts.DTOs.Responses;

namespace Application.Features.Media.Podcasts.Queries;

public class GetPodcastByIdQuery : IRequest<Result<PodcastDetailsDto>>
{
    public Guid Id { get; set; }
    public Guid? UserId { get; set; }
}