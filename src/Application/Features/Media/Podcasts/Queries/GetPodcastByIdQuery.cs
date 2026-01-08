using MediatR;
using Application.Common.Models;
using Application.Features.Media.Podcasts.DTOs.Responses;

namespace Application.Features.Media.Podcasts.Queries;

public class GetPodcastByIdQuery : IRequest<Result<PodcastDetailResponse>>
{
    public int Id { get; set; }
}