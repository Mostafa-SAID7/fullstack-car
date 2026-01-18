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
    public class CreateEventCommand : IRequest<Result<EventDto>>
    {
        public Guid OrganizerId { get; set; }
        public CreateEventRequest Request { get; set; } = new();
    }

    public class CreateEventCommandHandler : IRequestHandler<CreateEventCommand, Result<EventDto>>
    {
        private readonly IEventRepository _eventRepository;
        private readonly INotificationService _notificationService;
        private readonly IEventHubService _eventHubService;
        private readonly ICacheService _cacheService;
        private readonly IUnitOfWork _unitOfWork;

        public CreateEventCommandHandler(
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

        public async Task<Result<EventDto>> Handle(CreateEventCommand request, CancellationToken cancellationToken)
        {
            try
            {
                // Validate dates
                if (request.Request.StartDate <= DateTime.UtcNow)
                {
                    return Result<EventDto>.Failure("Event start date must be in the future");
                }

                if (request.Request.EndDate <= request.Request.StartDate)
                {
                    return Result<EventDto>.Failure("Event end date must be after start date");
                }

                // Create event entity
                var eventEntity = new Event
                {
                    Id = Guid.NewGuid(),
                    Title = request.Request.Title,
                    Description = request.Request.Description,
                    Category = request.Request.Category,
                    EventType = request.Request.EventType,
                    StartDate = request.Request.StartDate,
                    EndDate = request.Request.EndDate,
                    Location = request.Request.Location,
                    IsOnline = request.Request.IsOnline,
                    OnlineLink = request.Request.OnlineLink,
                    MaxAttendees = request.Request.MaxAttendees,
                    RequireApproval = request.Request.RequireApproval,
                    IsPublic = request.Request.IsPublic,
                    Price = request.Request.Price,
                    Currency = request.Request.Currency,
                    Tags = request.Request.Tags,
                    ImageUrl = request.Request.ImageUrl,
                    OrganizerId = request.OrganizerId,
                    Status = "Active",
                    IsActive = true,
                    IsFeatured = false,
                    AttendeeCount = 0,
                    CreatedAt = DateTime.UtcNow
                };

                await _eventRepository.AddAsync(eventEntity, cancellationToken);
                await _unitOfWork.SaveChangesAsync(cancellationToken);

                // Send notifications (if public event)
                if (eventEntity.IsPublic)
                {
                    await _notificationService.NotifyEventCreatedAsync(
                        Guid.Empty, // No specific group
                        eventEntity.Id,
                        eventEntity.Title,
                        eventEntity.StartDate);
                }

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
                        Id = request.OrganizerId,
                        Username = "Unknown", // TODO: Get organizer details
                        DisplayName = "Unknown"
                    },
                    AttendanceStats = new EventAttendanceStatsDto(),
                    RecentComments = new List<EventCommentDto>()
                };

                // Send real-time updates via SignalR
                await _eventHubService.NotifyEventCreatedAsync(eventEntity.Id, eventDto);

                // Invalidate relevant caches
                await _cacheService.RemoveByTagAsync("Events", cancellationToken);
                await _cacheService.RemoveByTagAsync("Featured", cancellationToken);
                await _cacheService.RemoveByTagAsync("Trending", cancellationToken);
                await _cacheService.RemoveByTagAsync("Upcoming", cancellationToken);
                await _cacheService.RemoveByTagAsync("Categories", cancellationToken);
                await _cacheService.RemoveByTagAsync("Stats", cancellationToken);

                return Result<EventDto>.Success(eventDto);
            }
            catch (Exception ex)
            {
                return Result<EventDto>.Failure($"Failed to create event: {ex.Message}");
            }
        }
    }
}