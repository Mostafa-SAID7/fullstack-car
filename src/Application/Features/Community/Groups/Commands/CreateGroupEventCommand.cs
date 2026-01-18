using Application.Common.DTOs;
using Application.Features.Community.Groups.DTOs;
using Application.Features.Community.Groups.Interfaces;
using Application.Features.Shared.Notifications.Interfaces;
using Domain.Entities.Community.Groups;
using MediatR;

namespace Application.Features.Community.Groups.Commands
{
    public class CreateGroupEventCommand : IRequest<Result<GroupEventDto>>
    {
        public Guid GroupId { get; set; }
        public Guid CreatedBy { get; set; }
        public CreateGroupEventRequest Request { get; set; } = new();
    }

    public class CreateGroupEventCommandHandler : IRequestHandler<CreateGroupEventCommand, Result<GroupEventDto>>
    {
        private readonly IGroupRepository _groupRepository;
        private readonly IGroupEventRepository _eventRepository;
        private readonly INotificationService _notificationService;
        private readonly IUnitOfWork _unitOfWork;

        public CreateGroupEventCommandHandler(
            IGroupRepository groupRepository,
            IGroupEventRepository eventRepository,
            INotificationService notificationService,
            IUnitOfWork unitOfWork)
        {
            _groupRepository = groupRepository;
            _eventRepository = eventRepository;
            _notificationService = notificationService;
            _unitOfWork = unitOfWork;
        }

        public async Task<Result<GroupEventDto>> Handle(CreateGroupEventCommand request, CancellationToken cancellationToken)
        {
            try
            {
                // Validate group exists
                var group = await _groupRepository.GetByIdAsync(request.GroupId, cancellationToken);
                if (group == null)
                {
                    return Result<GroupEventDto>.Failure("Group not found");
                }

                // Check if user can create events
                var canCreateEvents = await _groupRepository.IsUserOwnerAsync(request.GroupId, request.CreatedBy, cancellationToken) ||
                                    await _groupRepository.IsUserModeratorAsync(request.GroupId, request.CreatedBy, cancellationToken);

                if (!canCreateEvents)
                {
                    return Result<GroupEventDto>.Failure("You don't have permission to create events in this group");
                }

                // Create event entity
                var eventEntity = new GroupEvent
                {
                    Id = Guid.NewGuid(),
                    GroupId = request.GroupId,
                    Title = request.Request.Title,
                    Description = request.Request.Description,
                    StartDate = request.Request.StartDate,
                    EndDate = request.Request.EndDate,
                    Location = request.Request.Location,
                    EventType = request.Request.EventType,
                    IsOnline = request.Request.IsOnline,
                    OnlineLink = request.Request.OnlineLink,
                    MaxAttendees = request.Request.MaxAttendees,
                    RequireApproval = request.Request.RequireApproval,
                    Status = "Active",
                    ImageUrl = request.Request.ImageUrl,
                    CreatedBy = request.CreatedBy,
                    CreatedAt = DateTime.UtcNow
                };

                await _eventRepository.AddAsync(eventEntity, cancellationToken);

                // Update group event count
                group.EventCount++;
                group.LastActivity = DateTime.UtcNow;
                await _groupRepository.UpdateAsync(group, cancellationToken);

                await _unitOfWork.SaveChangesAsync(cancellationToken);

                // Send notifications
                await _notificationService.NotifyEventCreatedAsync(
                    request.GroupId, 
                    eventEntity.Id, 
                    eventEntity.Title, 
                    eventEntity.StartDate);

                // Map to DTO
                var eventDto = new GroupEventDto
                {
                    Id = eventEntity.Id,
                    GroupId = eventEntity.GroupId,
                    GroupName = group.Name,
                    Title = eventEntity.Title,
                    Description = eventEntity.Description,
                    StartDate = eventEntity.StartDate,
                    EndDate = eventEntity.EndDate,
                    Location = eventEntity.Location,
                    EventType = eventEntity.EventType,
                    IsOnline = eventEntity.IsOnline,
                    OnlineLink = eventEntity.OnlineLink,
                    MaxAttendees = eventEntity.MaxAttendees,
                    RequireApproval = eventEntity.RequireApproval,
                    Status = eventEntity.Status,
                    CreatedAt = eventEntity.CreatedAt,
                    ImageUrl = eventEntity.ImageUrl,
                    AttendanceStats = new EventAttendanceStatsDto(),
                    Tags = request.Request.Tags
                };

                return Result<GroupEventDto>.Success(eventDto);
            }
            catch (Exception ex)
            {
                return Result<GroupEventDto>.Failure($"Failed to create group event: {ex.Message}");
            }
        }
    }
}