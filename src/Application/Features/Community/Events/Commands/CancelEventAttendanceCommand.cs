using Application.Common.DTOs;
using Application.Features.Community.Events.Interfaces;
using Application.Features.Shared.Notifications.Interfaces;
using MediatR;

namespace Application.Features.Community.Events.Commands
{
    public class CancelEventAttendanceCommand : IRequest<Result<bool>>
    {
        public Guid EventId { get; set; }
        public Guid UserId { get; set; }
    }

    public class CancelEventAttendanceCommandHandler : IRequestHandler<CancelEventAttendanceCommand, Result<bool>>
    {
        private readonly IEventRepository _eventRepository;
        private readonly IEventAttendanceRepository _attendanceRepository;
        private readonly INotificationService _notificationService;
        private readonly IUnitOfWork _unitOfWork;

        public CancelEventAttendanceCommandHandler(
            IEventRepository eventRepository,
            IEventAttendanceRepository attendanceRepository,
            INotificationService notificationService,
            IUnitOfWork unitOfWork)
        {
            _eventRepository = eventRepository;
            _attendanceRepository = attendanceRepository;
            _notificationService = notificationService;
            _unitOfWork = unitOfWork;
        }

        public async Task<Result<bool>> Handle(CancelEventAttendanceCommand request, CancellationToken cancellationToken)
        {
            try
            {
                // Validate event exists
                var eventEntity = await _eventRepository.GetByIdAsync(request.EventId, cancellationToken);
                if (eventEntity == null)
                {
                    return Result<bool>.Failure("Event not found");
                }

                // Get user attendance
                var attendance = await _attendanceRepository.GetByEventAndUserAsync(request.EventId, request.UserId, cancellationToken);
                if (attendance == null)
                {
                    return Result<bool>.Failure("You are not attending this event");
                }

                // Remove attendance
                await _attendanceRepository.RemoveAttendanceAsync(request.EventId, request.UserId, cancellationToken);

                // Update event attendee count if user was going
                if (attendance.AttendanceType == "Going" && attendance.IsApproved)
                {
                    eventEntity.AttendeeCount = Math.Max(0, eventEntity.AttendeeCount - 1);
                    await _eventRepository.UpdateAsync(eventEntity, cancellationToken);
                }

                await _unitOfWork.SaveChangesAsync(cancellationToken);

                // Send notification
                await _notificationService.NotifyEventAttendanceChangedAsync(
                    request.EventId,
                    request.UserId,
                    "User Name", // TODO: Get user name
                    "Cancelled");

                return Result<bool>.Success(true);
            }
            catch (Exception ex)
            {
                return Result<bool>.Failure($"Failed to cancel event attendance: {ex.Message}");
            }
        }
    }
}