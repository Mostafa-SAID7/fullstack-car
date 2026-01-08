using Application.Common.Models;
using Application.Features.Media.Podcasts.DTOs.Responses;
using MediatR;

namespace Application.Features.Media.Podcasts.Queries;

public class GetUserPodcastSubscriptionsQuery : IRequest<Result<PaginatedList<PodcastListDto>>>
{
    public Guid UserId { get; set; }
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}