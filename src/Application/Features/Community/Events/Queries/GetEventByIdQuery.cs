using Application.Common.DTOs;
using Application.Features.Community.Events.DTOs;
using Application.Features.Community.Events.Interfaces;
using MediatR;

namespace Application.Features.Community.Events.Queries
{
    public class GetEventByIdQuery : IRequest<Result<EventDto>>
    {
        public Guid Id { get; set; }
        public Guid? UserId { get; set; }
    }

    public class GetEventByIdQueryHandler : IRequestHandler<GetEventByIdQuery, Result<EventDto>>
    {
        private readonly IEventRepository _eventRepository;
        private readonly IEventAttendanceRepository _attendanceRepository;

        public GetEventByIdQueryHandler(
            IEventRepository eventRepository,
            IEventAttendanceRepository attendanceRepository)
        {
            _eventRepository = eventRepository;
            _attendanceRepository = attendanceRepository;
        }

        public async Task<Result<EventDto>> Handle(GetEventByIdQuery request, CancellationToken cancellationToken)
        {
            try
            {
                var eventEntity = await _eventRepository.GetByIdWithDetailsAsync(request.Id, cancellationToken);
                if (eventEntity == null)
                {
                    return Result<EventDto>.Failure("Event not found");
                }

                // Get user attendance if user is provided
                EventAttendanceDto? userAttendance = null;
                if (request.UserId.HasValue)
                {
                    var attendance = await _attendanceRepository.GetByEventAndUserAsync(request.Id, request.UserId.Value, cancellationToken);
                    if (attendance != null)
                    {
                        userAttendance = new EventAttendanceDto
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
                    }
                }

                // Get attendance statistics
                var attendanceStats = await _attendanceRepository.GetAttendanceStatsByTypeAsync(request.Id, cancellationToken);
                var totalResponses = attendanceStats.Values.Sum();
                var goingCount = attendanceStats.GetValueOrDefault("Going", 0);
                var maybeCount = attendanceStats.GetValueOrDefault("Maybe", 0);
                var notGoingCount = attendanceStats.GetValueOrDefault("NotGoing", 0);
                var pendingApprovalCount = await _attendanceRepository.GetPendingApprovalCountAsync(request.Id, cancellationToken);
                var checkedInCount = await _attendanceRepository.GetCheckedInCountAsync(request.Id, cancellationToken);

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
                        DisplayName = eventEntity.Organizer?.UserName ?? "Unknown",
                        AvatarUrl = null, // TODO: Get avatar URL
                        EventsOrganized = 0, // TODO: Get events organized count
                        Rating = 0 // TODO: Get organizer rating
                    },
                    AttendanceStats = new EventAttendanceStatsDto
                    {
                        TotalResponses = totalResponses,
                        GoingCount = goingCount,
                        MaybeCount = maybeCount,
                        NotGoingCount = notGoingCount,
                        PendingApprovalCount = pendingApprovalCount,
                        ResponseRate = eventEntity.MaxAttendees.HasValue && eventEntity.MaxAttendees > 0 
                            ? (double)totalResponses / eventEntity.MaxAttendees.Value * 100 
                            : 0,
                        AvailableSpots = eventEntity.MaxAttendees.HasValue 
                            ? Math.Max(0, eventEntity.MaxAttendees.Value - goingCount) 
                            : null,
                        CheckedInCount = checkedInCount
                    },
                    UserAttendance = userAttendance,
                    RecentComments = new List<EventCommentDto>() // TODO: Get recent comments
                };

                return Result<EventDto>.Success(eventDto);
            }
            catch (Exception ex)
            {
                return Result<EventDto>.Failure($"Failed to retrieve event: {ex.Message}");
            }
        }
    }
}