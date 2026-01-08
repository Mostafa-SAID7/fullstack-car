using Application.Common.Models;
using Application.Features.Media.Podcasts.DTOs.Responses;
using MediatR;

namespace Application.Features.Media.Podcasts.Queries;

public class GetTrendingPodcastsQuery : IRequest<Result<List<PodcastListDto>>>
{
    public int Count { get; set; } = 10;
    public int Days { get; set; } = 7;
}