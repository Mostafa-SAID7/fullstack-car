using Application.Common.Models;
using Application.Features.Community.Events.DTOs;
using MediatR;

namespace Application.Features.Community.Events.Queries;

public class GetEventInvitationsQuery : IRequest<Result<PaginatedList<EventInvitationDto>>>
{
    public Guid EventId { get; set; }
    public Guid UserId { get; set; }
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 20;
    public string? Status { get; set; }
    public string? SortBy { get; set; } = "InvitedAt";
    public bool SortDescending { get; set; } = true;
}

public class GetEventInvitationsQueryHandler : IRequestHandler<GetEventInvitationsQuery, Result<PaginatedList<EventInvitationDto>>>
{
    public async Task<Result<PaginatedList<EventInvitationDto>>> Handle(GetEventInvitationsQuery request, CancellationToken cancellationToken)
    {
        // TODO: Implement event invitations retrieval logic
        await Task.CompletedTask;
        
        var invitations = new List<EventInvitationDto>();
        var paginatedList = new PaginatedList<EventInvitationDto>(invitations, 0, request.PageNumber, request.PageSize);
        
        return Result<PaginatedList<EventInvitationDto>>.Success(paginatedList);
    }
}