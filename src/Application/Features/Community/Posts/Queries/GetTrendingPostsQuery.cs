using Application.Common.DTOs;
using MediatR;

namespace Application.Features.Community.Posts.Queries;

public class GetTrendingPostsQuery : IRequest<ApiResponseDto<List<object>>>
{
    public int Count { get; set; } = 10;
    public string Timeframe { get; set; } = "day";
}

public class GetUserPostsQuery : IRequest<ApiResponseDto<List<object>>>
{
    public Guid UserId { get; set; }
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}