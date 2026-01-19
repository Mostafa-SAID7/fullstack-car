using Application.Common.DTOs;
using Application.Features.Community.Events.DTOs;
using Application.Features.Community.Events.Interfaces;
using Application.Common.Interfaces;
using MediatR;

namespace Application.Features.Community.Events.Commands
{
    public class CheckInEventAttendeeCommand : IRequest<Result<EventAttendanceDto>>
    {
        public Guid EventId { get; set; }
        public Guid AttendeeId { get; set; }
        public Guid CheckedInBy { get; set; }
    }

    public class CheckInEventAttendeeCommandHandler : IRequestHandler<CheckInEventAttendeeCommand, Result<EventAttendanceDto>>
    {
        private readonly IEventAttendanceRepository _attendanceRepository;
        private readonly IEventRepository _eventRepository;
        private readonly IUnitOfWork _unitOfWork;

        public CheckInEventAttendeeCommandHandler(
            IEventAttendanceRepository attendanceRepository,
            IEventRepository eventRepository,
            IUnitOfWork unitOfWork)
        {
            _attendanceRepository = attendanceRepository;
            _eventRepository = eventRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<Result<EventAttendanceDto>> Handle(CheckInEventAttendeeCommand request, CancellationToken cancellationToken)
        {
            try
            {
                // Check if event exists and user has permission
                var eventExists = await _eventRepository.ExistsAsync(request.EventId, cancellationToken);
                if (!eventExists)
                {
                    return Result<EventAttendanceDto>.Failure("Event not found");
                }

                var canEdit = await _eventRepository.IsUserOrganizerAsync(request.EventId, request.CheckedInBy, cancellationToken);
                if (!canEdit)
                {
                    return Result<EventAttendanceDto>.Failure("You don't have permission to check in attendees for this event");
                }

                // Get the attendance record
                var attendance = await _attendanceRepository.GetByEventAndUserAsync(request.EventId, request.AttendeeId, cancellationToken);
                if (attendance == null)
                {
                    return Result<EventAttendanceDto>.Failure("Attendance record not found");
                }

                if (attendance.CheckedIn)
                {
                    return Result<EventAttendanceDto>.Failure("Attendee is already checked in");
                }

                // Update check-in status
                attendance.CheckedIn = true;
                attendance.CheckedInAt = DateTime.UtcNow;
                attendance.UpdatedAt = DateTime.UtcNow;

                await _attendanceRepository.UpdateAsync(attendance, cancellationToken);
                await _unitOfWork.SaveChangesAsync(cancellationToken);

                var dto = new EventAttendanceDto
                {
                    Id = attendance.Id,
                    EventId = attendance.EventId,
                    UserId = attendance.UserId,
                    AttendanceType = attendance.AttendanceType,
                    IsApproved = attendance.IsApproved,
                    ResponseDate = attendance.ResponseDate,
                    ApprovedAt = attendance.ApprovedAt,
                    CheckedIn = attendance.CheckedIn,
                    CheckedInAt = attendance.CheckedInAt
                };

                return Result<EventAttendanceDto>.Success(dto);
            }
            catch (Exception ex)
            {
                return Result<EventAttendanceDto>.Failure($"Failed to check in attendee: {ex.Message}");
            }
        }
    }
}
