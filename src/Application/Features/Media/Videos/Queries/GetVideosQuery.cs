using Application.Common.Models;
using Application.Features.Media.Videos.DTOs.Responses;
using Domain.Enums.Media;
using MediatR;

namespace Application.Features.Media.Videos.Queries;

public class GetVideosQuery : IRequest<Result<PaginatedList<VideoListDto>>>
{
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public string? SearchTerm { get; set; }
    public MediaStatus? Status { get; set; }
    public Guid? CreatorId { get; set; }
    public string? Tags { get; set; }
    public VideoQuality? Quality { get; set; }
    public DateTime? FromDate { get; set; }
    public DateTime? ToDate { get; set; }
    public string SortBy { get; set; } = "CreatedAt";
    public bool SortDescending { get; set; } = true;
}

public class GetVideoByIdQuery : IRequest<Result<VideoDetailsDto>>
{
    public Guid Id { get; set; }
    public Guid? UserId { get; set; }
}

public class GetMyVideosQuery : IRequest<Result<PaginatedList<VideoListDto>>>
{
    public Guid UserId { get; set; }
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public MediaStatus? Status { get; set; }
}

public class GetTrendingVideosQuery : IRequest<Result<List<VideoListDto>>>
{
    public int Count { get; set; } = 10;
    public int Days { get; set; } = 7;
}