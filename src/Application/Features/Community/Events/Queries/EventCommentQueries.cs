using Application.Common.DTOs;
using MediatR;

namespace Application.Features.Community.Events.Queries;

public class GetEventCommentRepliesQuery : IRequest<ApiResponseDto<object>>
{
    public Guid EventId { get; set; }
    public Guid CommentId { get; set; }
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 20;
}

public class GetEventCommentStatsQuery : IRequest<ApiResponseDto<object>>
{
    public Guid EventId { get; set; }
}