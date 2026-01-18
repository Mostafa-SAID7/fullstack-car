using Application.Common.DTOs;
using Application.Features.Community.Events.DTOs;
using Application.Features.Community.Events.Interfaces;
using Application.Features.Shared.Notifications.Interfaces;
using Domain.Entities.Community.Events;
using MediatR;

namespace Application.Features.Community.Events.Commands
{
    public class CreateEventUpdateCommand : IRequest<Result<EventUpdateDto>>
    {
        public Guid EventId { get; set; }
        public Guid UserId { get; set; }
        public CreateEventUpdateRequest Request { get; set; } = new();
    }

    public class CreateEventUpdateCommandHandler : IRequestHandler<CreateEventUpdateCommand, Result<EventUpdateDto>>
    {
        private readonly IEventRepository _eventRepository;
        private readonly IEventUpdateRepository _updateRepository;
        private readonly IEventAttendanceRepository _attendanceRepository;
        private readonly INotificationService _notificationService;
        private readonly IUnitOfWork _unitOfWork;

        public CreateEventUpdateCommandHandler(
            IEventRepository eventRepository,
            IEventUpdateRepository updateRepository,
            IEventAttendanceRepository attendanceRepository,
            INotificationService notificationService,
            IUnitOfWork unitOfWork)
        {
            _eventRepository = eventRepository;
            _updateRepository = updateRepository;
            _attendanceRepository = attendanceRepository;
            _notificationService = notificationService;
            _unitOfWork = unitOfWork;
        }

        public async Task<Result<EventUpdateDto>> Handle(CreateEventUpdateCommand request, CancellationToken cancellationToken)
        {
            try
            {
                // Validate event exists and user is organizer
                var eventEntity = await _eventRepository.GetByIdWithDetailsAsync(request.EventId, cancellationToken);
                if (eventEntity == null)
                {
                    return Result<EventUpdateDto>.Failure("Event not found");
                }

                if (eventEntity.OrganizerId != request.UserId)
                {
                    return Result<EventUpdateDto>.Failure("Only event organizers can post updates");
                }

                // Create update
                var update = new EventUpdate
                {
                    Id = Guid.NewGuid(),
                    EventId = request.EventId,
                    Title = request.Request.Title.Trim(),
                    Content = request.Request.Content.Trim(),
                    UpdateType = request.Request.UpdateType,
                    CreatedBy = request.UserId.ToString(),
                    CreatedAt = DateTime.UtcNow
                };

                await _updateRepository.AddAsync(update, cancellationToken);
                await _unitOfWork.SaveChangesAsync(cancellationToken);

                // Create response DTO
                var updateDto = new EventUpdateDto
                {
                    Id = update.Id,
                    EventId = update.EventId,
                    Title = update.Title,
                    Content = update.Content,
                    UpdateType = update.UpdateType,
                    CreatedAt = update.CreatedAt,
                    CreatedBy = new EventUserDto
                    {
                        Id = request.UserId,
                        Username = "Unknown", // TODO: Get user details
                        DisplayName = "Unknown"
                    }
                };

                // Send notifications to attendees if requested
                if (request.Request.NotifyAttendees)
                {
                    var attendees = await _attendanceRepository.GetEventAttendeesAsync(request.EventId, cancellationToken);
                    var attendeeIds = attendees
                        .Where(a => a.AttendanceType == "Going" && a.IsApproved && a.UserId != request.UserId)
                        .Select(a => a.UserId)
                        .ToList();

                    foreach (var attendeeId in attendeeIds)
                    {
                        await _notificationService.SendEventUpdateNotificationAsync(
                            attendeeId,
                            request.EventId,
                            eventEntity.Title,
                            $"{update.Title}: {update.Content}");
                    }
                }

                return Result<EventUpdateDto>.Success(updateDto);
            }
            catch (Exception ex)
            {
                return Result<EventUpdateDto>.Failure($"Failed to create event update: {ex.Message}");
            }
        }
    }
}