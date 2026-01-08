using MediatR;
using Application.Common.Models;
using Application.Features.Media.Podcasts.DTOs.Responses;

namespace Application.Features.Media.Podcasts.Queries;

public class GetPodcastsByCategoryQuery : IRequest<Result<PaginatedList<PodcastResponse>>>
{
    public int CategoryId { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}