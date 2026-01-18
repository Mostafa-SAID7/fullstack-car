using Application.Common.Models;
using Application.Features.Community.Events.DTOs;
using MediatR;

namespace Application.Features.Community.Events.Commands;

public class ApproveEventAttendanceCommand : IRequest<Result<EventAttendeeDto>>
{
    public Guid EventId { get; set; }
    public Guid AttendeeId { get; set; }
    public Guid ApprovedBy { get; set; }
}

public class ApproveEventAttendanceCommandHandler : IRequestHandler<ApproveEventAttendanceCommand, Result<EventAttendeeDto>>
{
    public async Task<Result<EventAttendeeDto>> Handle(ApproveEventAttendanceCommand request, CancellationToken cancellationToken)
    {
        // TODO: Implement attendance approval logic
        await Task.CompletedTask;
        
        var attendee = new EventAttendeeDto
        {
            Id = request.AttendeeId,
            EventId = request.EventId,
            UserId = Guid.NewGuid(),
            IsApproved = true,
            ApprovedAt = DateTime.UtcNow,
            AttendanceType = "Going"
        };
        
        return Result<EventAttendeeDto>.Success(attendee);
    }
}