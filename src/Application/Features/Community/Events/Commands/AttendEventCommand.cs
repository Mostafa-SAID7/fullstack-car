using Application.Common.DTOs;
using Application.Features.Community.Events.DTOs;
using Application.Features.Community.Events.Interfaces;
using Application.Features.Community.Events.Services;
using Application.Features.Shared.Notifications.Interfaces;
using Application.Features.Shared.Caching.Interfaces.Services;
using Domain.Entities.Community.Events;
using MediatR;

namespace Application.Features.Community.Events.Commands
{
    public class AttendEventCommand : IRequest<Result<EventAttendanceDto>>
    {
        public Guid EventId { get; set; }
        public Guid UserId { get; set; }
        public AttendEventRequest Request { get; set; } = new();
    }

    public class AttendEventCommandHandler : IRequestHandler<AttendEventCommand, Result<EventAttendanceDto>>
    {
        private readonly IEventRepository _eventRepository;
        private readonly IEventAttendanceRepository _attendanceRepository;
        private readonly INotificationService _notificationService;
        private readonly IEventHubService _eventHubService;
        private readonly ICacheService _cacheService;
        private readonly IUnitOfWork _unitOfWork;

        public AttendEventCommandHandler(
            IEventRepository eventRepository,
            IEventAttendanceRepository attendanceRepository,
            INotificationService notificationService,
            IEventHubService eventHubService,
            ICacheService cacheService,
            IUnitOfWork unitOfWork)
        {
            _eventRepository = eventRepository;
            _attendanceRepository = attendanceRepository;
            _notificationService = notificationService;
            _eventHubService = eventHubService;
            _cacheService = cacheService;
            _unitOfWork = unitOfWork;
        }

        public async Task<Result<EventAttendanceDto>> Handle(AttendEventCommand request, CancellationToken cancellationToken)
        {
            try
            {
                // Validate event exists and is active
                var eventEntity = await _eventRepository.GetByIdAsync(request.EventId, cancellationToken);
                if (eventEntity == null)
                {
                    return Result<EventAttendanceDto>.Failure("Event not found");
                }

                if (!eventEntity.IsActive || eventEntity.Status != "Active")
                {
                    return Result<EventAttendanceDto>.Failure("Event is not active");
                }

                if (eventEntity.StartDate <= DateTime.UtcNow)
                {
                    return Result<EventAttendanceDto>.Failure("Cannot attend past events");
                }

                // Check if event is full (only for "Going" attendance)
                if (request.Request.AttendanceType == "Going" && eventEntity.MaxAttendees.HasValue)
                {
                    var currentAttendeeCount = await _attendanceRepository.GetAttendeeCountByTypeAsync(request.EventId, "Going", cancellationToken);
                    if (currentAttendeeCount >= eventEntity.MaxAttendees.Value)
                    {
                        return Result<EventAttendanceDto>.Failure("Event is full");
                    }
                }

                // Check if user already has attendance record
                var existingAttendance = await _attendanceRepository.GetByEventAndUserAsync(request.EventId, request.UserId, cancellationToken);

                EventAttendance attendance;
                bool isNewAttendance = false;

                if (existingAttendance != null)
                {
                    // Update existing attendance
                    existingAttendance.AttendanceType = request.Request.AttendanceType;
                    existingAttendance.Notes = request.Request.Notes;
                    existingAttendance.ResponseDate = DateTime.UtcNow;
                    existingAttendance.IsApproved = !eventEntity.RequireApproval;
                    existingAttendance.ApprovedAt = !eventEntity.RequireApproval ? DateTime.UtcNow : null;

                    await _attendanceRepository.UpdateAsync(existingAttendance, cancellationToken);
                    attendance = existingAttendance;
                }
                else
                {
                    // Create new attendance
                    attendance = new EventAttendance
                    {
                        Id = Guid.NewGuid(),
                        EventId = request.EventId,
                        UserId = request.UserId,
                        AttendanceType = request.Request.AttendanceType,
                        Notes = request.Request.Notes,
                        ResponseDate = DateTime.UtcNow,
                        IsApproved = !eventEntity.RequireApproval,
                        ApprovedAt = !eventEntity.RequireApproval ? DateTime.UtcNow : null,
                        CheckedIn = false
                    };

                    await _attendanceRepository.AddAsync(attendance, cancellationToken);
                    isNewAttendance = true;
                }

                // Update event attendee count if going and approved
                if (request.Request.AttendanceType == "Going" && attendance.IsApproved)
                {
                    if (isNewAttendance)
                    {
                        eventEntity.AttendeeCount++;
                    }
                    else if (existingAttendance?.AttendanceType != "Going")
                    {
                        eventEntity.AttendeeCount++;
                    }
                }
                else if (existingAttendance?.AttendanceType == "Going" && request.Request.AttendanceType != "Going")
                {
                    eventEntity.AttendeeCount = Math.Max(0, eventEntity.AttendeeCount - 1);
                }

                await _eventRepository.UpdateAsync(eventEntity, cancellationToken);
                await _unitOfWork.SaveChangesAsync(cancellationToken);

                // Invalidate cache
                await _cacheService.RemoveByTagAsync("Events", cancellationToken);
                await _cacheService.RemoveByTagAsync("Stats", cancellationToken);
                await _cacheService.RemoveByTagAsync("MyEvents", cancellationToken);
                await _cacheService.RemoveByTagAsync($"Event_{request.EventId}", cancellationToken);
                await _cacheService.RemoveByTagAsync($"EventAttendees_{request.EventId}", cancellationToken);

                // Send notifications
                await _notificationService.NotifyEventAttendanceChangedAsync(
                    request.EventId,
                    request.UserId,
                    "User Name", // TODO: Get user name
                    request.Request.AttendanceType);

                // Map to DTO
                var attendanceDto = new EventAttendanceDto
                {
                    Id = attendance.Id,
                    EventId = attendance.EventId,
                    UserId = attendance.UserId,
                    AttendanceType = attendance.AttendanceType,
                    ResponseDate = attendance.ResponseDate,
                    Notes = attendance.Notes,
                    IsApproved = attendance.IsApproved,
                    ApprovedAt = attendance.ApprovedAt,
                    CheckedIn = attendance.CheckedIn,
                    CheckedInAt = attendance.CheckedInAt
                };

                // Send real-time updates via SignalR
                await _eventHubService.NotifyAttendanceChangedAsync(
                    request.EventId, 
                    request.UserId, 
                    request.Request.AttendanceType, 
                    attendanceDto);

                return Result<EventAttendanceDto>.Success(attendanceDto);
            }
            catch (Exception ex)
            {
                return Result<EventAttendanceDto>.Failure($"Failed to update event attendance: {ex.Message}");
            }
        }
    }
}