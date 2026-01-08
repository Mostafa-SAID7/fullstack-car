using MediatR;
using Application.Common.Models;
using Application.Features.Media.Podcasts.DTOs.Responses;

namespace Application.Features.Media.Podcasts.Queries;

public class SearchPodcastsQuery : IRequest<Result<PaginatedList<PodcastResponse>>>
{
    public string SearchTerm { get; set; } = string.Empty;
    public int? CategoryId { get; set; }
    public string? SortBy { get; set; } = "relevance"; // relevance, date, popularity, duration
    public string? Duration { get; set; } // short, medium, long
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}