using Application.Common.Models;
using Application.Features.Community.Events.DTOs;
using MediatR;

namespace Application.Features.Community.Events.Queries;

public class GetEventCommentRepliesQuery : IRequest<Result<PaginatedList<EventCommentDto>>>
{
    public Guid EventId { get; set; }
    public Guid ParentCommentId { get; set; }
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public string? SortBy { get; set; } = "CreatedAt";
    public bool SortDescending { get; set; } = false;
}

public class GetEventCommentRepliesQueryHandler : IRequestHandler<GetEventCommentRepliesQuery, Result<PaginatedList<EventCommentDto>>>
{
    public async Task<Result<PaginatedList<EventCommentDto>>> Handle(GetEventCommentRepliesQuery request, CancellationToken cancellationToken)
    {
        // TODO: Implement comment replies retrieval logic
        await Task.CompletedTask;
        
        var replies = new List<EventCommentDto>();
        var paginatedList = new PaginatedList<EventCommentDto>(replies, 0, request.PageNumber, request.PageSize);
        
        return Result<PaginatedList<EventCommentDto>>.Success(paginatedList);
    }
}