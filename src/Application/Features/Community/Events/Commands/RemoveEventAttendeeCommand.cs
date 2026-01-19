using Application.Common.DTOs;
using Application.Features.Community.Events.Interfaces;
using Application.Common.Interfaces;
using MediatR;

namespace Application.Features.Community.Events.Commands
{
    public class RemoveEventAttendeeCommand : IRequest<Result<bool>>
    {
        public Guid EventId { get; set; }
        public Guid AttendeeId { get; set; }
        public Guid RemovedBy { get; set; }
    }

    public class RemoveEventAttendeeCommandHandler : IRequestHandler<RemoveEventAttendeeCommand, Result<bool>>
    {
        private readonly IEventAttendanceRepository _attendanceRepository;
        private readonly IEventRepository _eventRepository;
        private readonly IUnitOfWork _unitOfWork;

        public RemoveEventAttendeeCommandHandler(
            IEventAttendanceRepository attendanceRepository,
            IEventRepository eventRepository,
            IUnitOfWork unitOfWork)
        {
            _attendanceRepository = attendanceRepository;
            _eventRepository = eventRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<Result<bool>> Handle(RemoveEventAttendeeCommand request, CancellationToken cancellationToken)
        {
            try
            {
                // Check if event exists and user has permission
                var eventExists = await _eventRepository.ExistsAsync(request.EventId, cancellationToken);
                if (!eventExists)
                {
                    return Result<bool>.Failure("Event not found");
                }

                var canEdit = await _eventRepository.IsUserOrganizerAsync(request.EventId, request.RemovedBy, cancellationToken);
                if (!canEdit)
                {
                    return Result<bool>.Failure("You don't have permission to remove attendees from this event");
                }

                // Get the attendance record
                var attendance = await _attendanceRepository.GetByEventAndUserAsync(request.EventId, request.AttendeeId, cancellationToken);
                if (attendance == null)
                {
                    return Result<bool>.Failure("Attendance record not found");
                }

                // Remove the attendance record
                await _attendanceRepository.DeleteAsync(attendance, cancellationToken);
                await _unitOfWork.SaveChangesAsync(cancellationToken);

                return Result<bool>.Success(true);
            }
            catch (Exception ex)
            {
                return Result<bool>.Failure($"Failed to remove attendee: {ex.Message}");
            }
        }
    }
}
