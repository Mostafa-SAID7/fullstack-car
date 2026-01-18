using Application.Common.Models;
using Application.Features.Community.Events.DTOs;
using MediatR;

namespace Application.Features.Community.Events.Commands;

public class AcceptEventInvitationCommand : IRequest<Result<EventAttendeeDto>>
{
    public Guid EventId { get; set; }
    public Guid InvitationId { get; set; }
}

public class AcceptEventInvitationCommandHandler : IRequestHandler<AcceptEventInvitationCommand, Result<EventAttendeeDto>>
{
    public async Task<Result<EventAttendeeDto>> Handle(AcceptEventInvitationCommand request, CancellationToken cancellationToken)
    {
        // TODO: Implement invitation acceptance logic
        await Task.CompletedTask;
        
        var attendee = new EventAttendeeDto
        {
            Id = Guid.NewGuid(),
            EventId = request.EventId,
            UserId = Guid.NewGuid(),
            AttendanceType = "Going",
            ResponseDate = DateTime.UtcNow
        };
        
        return Result<EventAttendeeDto>.Success(attendee);
    }
}