using Application.Common.Models;
using Application.Features.Community.Events.DTOs;
using MediatR;

namespace Application.Features.Community.Events.Queries;

public class GetUserEventInvitationsQuery : IRequest<Result<PaginatedList<EventInvitationDto>>>
{
    public string Email { get; set; } = string.Empty;
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 20;
    public string? Status { get; set; }
    public string? SortBy { get; set; } = "InvitedAt";
    public bool SortDescending { get; set; } = true;
}

public class GetUserEventInvitationsQueryHandler : IRequestHandler<GetUserEventInvitationsQuery, Result<PaginatedList<EventInvitationDto>>>
{
    public async Task<Result<PaginatedList<EventInvitationDto>>> Handle(GetUserEventInvitationsQuery request, CancellationToken cancellationToken)
    {
        // TODO: Implement user event invitations retrieval logic
        await Task.CompletedTask;
        
        var invitations = new List<EventInvitationDto>();
        var paginatedList = new PaginatedList<EventInvitationDto>(invitations, 0, request.PageNumber, request.PageSize);
        
        return Result<PaginatedList<EventInvitationDto>>.Success(paginatedList);
    }
}