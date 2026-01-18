using Application.Common.Models;
using Application.Features.Community.Events.DTOs;
using MediatR;

namespace Application.Features.Community.Events.Queries;

public class GetEventAttendeesQuery : IRequest<Result<PaginatedList<EventAttendeeDto>>>
{
    public Guid EventId { get; set; }
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 20;
    public string? AttendanceType { get; set; }
    public bool? IsApproved { get; set; }
    public bool? CheckedIn { get; set; }
    public string? SearchTerm { get; set; }
    public string? SortBy { get; set; } = "ResponseDate";
    public bool SortDescending { get; set; } = false;
}

public class GetEventAttendeesQueryHandler : IRequestHandler<GetEventAttendeesQuery, Result<PaginatedList<EventAttendeeDto>>>
{
    public async Task<Result<PaginatedList<EventAttendeeDto>>> Handle(GetEventAttendeesQuery request, CancellationToken cancellationToken)
    {
        // TODO: Implement event attendees retrieval logic
        await Task.CompletedTask;
        
        var attendees = new List<EventAttendeeDto>();
        var paginatedList = new PaginatedList<EventAttendeeDto>(attendees, 0, request.PageNumber, request.PageSize);
        
        return Result<PaginatedList<EventAttendeeDto>>.Success(paginatedList);
    }
}