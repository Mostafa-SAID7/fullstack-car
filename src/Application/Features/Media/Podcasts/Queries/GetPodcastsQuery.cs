using Application.Common.Models;
using Application.Features.Media.Podcasts.DTOs.Responses;
using Domain.Enums.Media;
using MediatR;

namespace Application.Features.Media.Podcasts.Queries;

public class GetPodcastsQuery : IRequest<Result<PaginatedList<PodcastListDto>>>
{
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public string? SearchTerm { get; set; }
    public MediaStatus? Status { get; set; }
    public Guid? CreatorId { get; set; }
    public Guid? SeriesId { get; set; }
    public string? Tags { get; set; }
    public DateTime? FromDate { get; set; }
    public DateTime? ToDate { get; set; }
    public string SortBy { get; set; } = "CreatedAt";
    public bool SortDescending { get; set; } = true;
}

public class GetMyPodcastsQuery : IRequest<Result<PaginatedList<PodcastListDto>>>
{
    public Guid UserId { get; set; }
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public MediaStatus? Status { get; set; }
}

public class GetPodcastSeriesQuery : IRequest<Result<PaginatedList<PodcastSeriesDto>>>
{
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public string? SearchTerm { get; set; }
    public Guid? CreatorId { get; set; }
    public string? Category { get; set; }
}
