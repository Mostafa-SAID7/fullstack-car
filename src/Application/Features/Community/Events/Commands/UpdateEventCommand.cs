using Application.Common.DTOs;
using Application.Features.Community.Events.DTOs;
using Application.Features.Community.Events.Interfaces;
using Application.Features.Community.Events.Services;
using Application.Features.Shared.Notifications.Interfaces;
using Application.Features.Shared.Caching.Interfaces.Services;
using MediatR;

namespace Application.Features.Community.Events.Commands
{
    public class UpdateEventCommand : IRequest<Result<EventDto>>
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public UpdateEventRequest Request { get; set; } = new();
    }

    public class UpdateEventCommandHandler : IRequestHandler<UpdateEventCommand, Result<EventDto>>
    {
        private readonly IEventRepository _eventRepository;
        private readonly INotificationService _notificationService;
        private readonly IEventHubService _eventHubService;
        private readonly ICacheService _cacheService;
        private readonly IUnitOfWork _unitOfWork;

        public UpdateEventCommandHandler(
            IEventRepository eventRepository,
            INotificationService notificationService,
            IEventHubService eventHubService,
            ICacheService cacheService,
            IUnitOfWork unitOfWork)
        {
            _eventRepository = eventRepository;
            _notificationService = notificationService;
            _eventHubService = eventHubService;
            _cacheService = cacheService;
            _unitOfWork = unitOfWork;
        }

        public async Task<Result<EventDto>> Handle(UpdateEventCommand request, CancellationToken cancellationToken)
        {
            try
            {
                // Get existing event
                var eventEntity = await _eventRepository.GetByIdWithDetailsAsync(request.Id, cancellationToken);
                if (eventEntity == null)
                {
                    return Result<EventDto>.Failure("Event not found");
                }

                // Check permissions
                if (!await _eventRepository.CanUserEditEventAsync(request.Id, request.UserId, cancellationToken))
                {
                    return Result<EventDto>.Failure("You don't have permission to update this event");
                }

                // Validate dates
                if (request.Request.StartDate <= DateTime.UtcNow)
                {
                    return Result<EventDto>.Failure("Event start date must be in the future");
                }

                if (request.Request.EndDate <= request.Request.StartDate)
                {
                    return Result<EventDto>.Failure("Event end date must be after start date");
                }

                // Update event properties
                eventEntity.Title = request.Request.Title;
                eventEntity.Description = request.Request.Description;
                eventEntity.Category = request.Request.Category;
                eventEntity.EventType = request.Request.EventType;
                eventEntity.StartDate = request.Request.StartDate;
                eventEntity.EndDate = request.Request.EndDate;
                eventEntity.Location = request.Request.Location;
                eventEntity.IsOnline = request.Request.IsOnline;
                eventEntity.OnlineLink = request.Request.OnlineLink;
                eventEntity.MaxAttendees = request.Request.MaxAttendees;
                eventEntity.RequireApproval = request.Request.RequireApproval;
                eventEntity.IsPublic = request.Request.IsPublic;
                eventEntity.Price = request.Request.Price;
                eventEntity.Currency = request.Request.Currency;
                eventEntity.Tags = request.Request.Tags;
                eventEntity.ImageUrl = request.Request.ImageUrl;
                eventEntity.UpdatedAt = DateTime.UtcNow;

                await _eventRepository.UpdateAsync(eventEntity, cancellationToken);
                await _unitOfWork.SaveChangesAsync(cancellationToken);

                // Send notifications
                await _notificationService.NotifyEventUpdatedAsync(
                    Guid.Empty, // No specific group
                    eventEntity.Id,
                    eventEntity.Title,
                    eventEntity.StartDate);

                // Map to DTO
                var eventDto = new EventDto
                {
                    Id = eventEntity.Id,
                    Title = eventEntity.Title,
                    Description = eventEntity.Description,
                    ImageUrl = eventEntity.ImageUrl,
                    Category = eventEntity.Category,
                    EventType = eventEntity.EventType,
                    StartDate = eventEntity.StartDate,
                    EndDate = eventEntity.EndDate,
                    Location = eventEntity.Location,
                    IsOnline = eventEntity.IsOnline,
                    OnlineLink = eventEntity.OnlineLink,
                    MaxAttendees = eventEntity.MaxAttendees,
                    RequireApproval = eventEntity.RequireApproval,
                    IsPublic = eventEntity.IsPublic,
                    IsActive = eventEntity.IsActive,
                    IsFeatured = eventEntity.IsFeatured,
                    Status = eventEntity.Status,
                    AttendeeCount = eventEntity.AttendeeCount,
                    Price = eventEntity.Price,
                    Currency = eventEntity.Currency,
                    Tags = eventEntity.Tags,
                    CreatedAt = eventEntity.CreatedAt,
                    Organizer = new EventOrganizerDto
                    {
                        Id = eventEntity.OrganizerId,
                        Username = eventEntity.Organizer?.UserName ?? "Unknown",
                        DisplayName = eventEntity.Organizer?.UserName ?? "Unknown"
                    },
                    AttendanceStats = new EventAttendanceStatsDto(),
                    RecentComments = new List<EventCommentDto>()
                };

                // Send real-time updates via SignalR
                await _eventHubService.NotifyEventUpdatedAsync(eventEntity.Id, eventDto);

                // Invalidate relevant caches
                await _cacheService.RemoveByTagAsync("Events", cancellationToken);
                await _cacheService.RemoveByTagAsync("Featured", cancellationToken);
                await _cacheService.RemoveByTagAsync("Trending", cancellationToken);
                await _cacheService.RemoveByTagAsync("Upcoming", cancellationToken);
                await _cacheService.RemoveByTagAsync("MyEvents", cancellationToken);
                await _cacheService.RemoveByTagAsync("Stats", cancellationToken);

                return Result<EventDto>.Success(eventDto);
            }
            catch (Exception ex)
            {
                return Result<EventDto>.Failure($"Failed to update event: {ex.Message}");
            }
        }
    }
}