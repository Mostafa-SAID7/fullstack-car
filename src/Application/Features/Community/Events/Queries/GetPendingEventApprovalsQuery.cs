using Application.Common.Models;
using Application.Features.Community.Events.DTOs;
using MediatR;

namespace Application.Features.Community.Events.Queries;

public class GetPendingEventApprovalsQuery : IRequest<Result<PaginatedList<EventAttendeeDto>>>
{
    public Guid EventId { get; set; }
    public Guid UserId { get; set; }
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 20;
}

public class GetPendingEventApprovalsQueryHandler : IRequestHandler<GetPendingEventApprovalsQuery, Result<PaginatedList<EventAttendeeDto>>>
{
    public async Task<Result<PaginatedList<EventAttendeeDto>>> Handle(GetPendingEventApprovalsQuery request, CancellationToken cancellationToken)
    {
        // TODO: Implement pending approvals retrieval logic
        await Task.CompletedTask;
        
        var attendees = new List<EventAttendeeDto>();
        var paginatedList = new PaginatedList<EventAttendeeDto>(attendees, 0, request.PageNumber, request.PageSize);
        
        return Result<PaginatedList<EventAttendeeDto>>.Success(paginatedList);
    }
}