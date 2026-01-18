using Application.Common.Models;
using Application.Features.Community.Events.DTOs;
using MediatR;

namespace Application.Features.Community.Events.Queries;

public class GetEventCommentsQuery : IRequest<Result<PaginatedList<EventCommentDto>>>
{
    public Guid EventId { get; set; }
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 20;
    public string? SortBy { get; set; } = "CreatedAt";
    public bool SortDescending { get; set; } = true;
    public bool IncludeReplies { get; set; } = true;
}

public class GetEventCommentsQueryHandler : IRequestHandler<GetEventCommentsQuery, Result<PaginatedList<EventCommentDto>>>
{
    public async Task<Result<PaginatedList<EventCommentDto>>> Handle(GetEventCommentsQuery request, CancellationToken cancellationToken)
    {
        // TODO: Implement event comments retrieval logic
        await Task.CompletedTask;
        
        var comments = new List<EventCommentDto>();
        var paginatedList = new PaginatedList<EventCommentDto>(comments, 0, request.PageNumber, request.PageSize);
        
        return Result<PaginatedList<EventCommentDto>>.Success(paginatedList);
    }
}