using Application.Common.Models;
using Application.Features.Community.Events.DTOs;
using MediatR;

namespace Application.Features.Community.Events.Commands;

public class RejectEventAttendanceCommand : IRequest<Result<EventAttendeeDto>>
{
    public Guid EventId { get; set; }
    public Guid AttendeeId { get; set; }
    public Guid RejectedBy { get; set; }
    public string? Reason { get; set; }
}

public class RejectEventAttendanceCommandHandler : IRequestHandler<RejectEventAttendanceCommand, Result<EventAttendeeDto>>
{
    public async Task<Result<EventAttendeeDto>> Handle(RejectEventAttendanceCommand request, CancellationToken cancellationToken)
    {
        // TODO: Implement attendance rejection logic
        await Task.CompletedTask;
        
        var attendee = new EventAttendeeDto
        {
            Id = request.AttendeeId,
            EventId = request.EventId,
            UserId = Guid.NewGuid(),
            IsApproved = false,
            AttendanceType = "Rejected"
        };
        
        return Result<EventAttendeeDto>.Success(attendee);
    }
}