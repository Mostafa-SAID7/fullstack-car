using Application.Common.DTOs;
using Application.Features.Community.Events.DTOs;
using Application.Features.Community.Events.Interfaces;
using MediatR;

namespace Application.Features.Community.Events.Queries
{
    public class GetEventsQuery : IRequest<Result<EventsPagedResponse>>
    {
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public string? Category { get; set; }
        public string? EventType { get; set; }
        public string? SearchTerm { get; set; }
        public string? Location { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        public bool? IsOnline { get; set; }
        public bool? IsFree { get; set; }
        public bool? IsPublic { get; set; }
        public bool? IsActive { get; set; } = true;
        public string? SortBy { get; set; } = "StartDate";
        public bool SortDescending { get; set; } = false;
        public Guid? UserId { get; set; }
    }

    public class GetEventsQueryHandler : IRequestHandler<GetEventsQuery, Result<EventsPagedResponse>>
    {
        private readonly IEventRepository _eventRepository;
        private readonly IEventAttendanceRepository _attendanceRepository;

        public GetEventsQueryHandler(IEventRepository eventRepository, IEventAttendanceRepository attendanceRepository)
        {
            _eventRepository = eventRepository;
            _attendanceRepository = attendanceRepository;
        }

        public async Task<Result<EventsPagedResponse>> Handle(GetEventsQuery request, CancellationToken cancellationToken)
        {
            try
            {
                var pagedEvents = await _eventRepository.GetEventsPagedAsync(
                    request.PageNumber,
                    request.PageSize,
                    request.Category,
                    request.EventType,
                    request.SearchTerm,
                    request.Location,
                    request.FromDate,
                    request.ToDate,
                    request.IsOnline,
                    request.IsFree,
                    request.IsPublic,
                    request.IsActive,
                    request.SortBy,
                    request.SortDescending,
                    cancellationToken);

                var userAttendances = request.UserId.HasValue 
                    ? await _attendanceRepository.GetUserAttendancesAsync(request.UserId.Value, cancellationToken)
                    : new List<Domain.Entities.Community.Events.EventAttendance>();

                var attendingEventIds = userAttendances
                    .Where(a => a.AttendanceType == "Going")
                    .Select(a => a.EventId)
                    .ToHashSet();

                var eventDtos = pagedEvents.Items.Select(e => new EventSummaryDto
                {
                    Id = e.Id,
                    Title = e.Title,
                    Description = e.Description.Length > 200 ? e.Description.Substring(0, 200) + "..." : e.Description,
                    ImageUrl = e.ImageUrl,
                    Category = e.Category,
                    EventType = e.EventType,
                    StartDate = e.StartDate,
                    EndDate = e.EndDate,
                    Location = e.Location,
                    IsOnline = e.IsOnline,
                    AttendeeCount = e.AttendeeCount,
                    MaxAttendees = e.MaxAttendees,
                    Status = e.Status,
                    IsUserAttending = attendingEventIds.Contains(e.Id),
                    IsFeatured = e.IsFeatured,
                    Price = e.Price,
                    Currency = e.Currency,
                    Tags = e.Tags
                }).ToList();

                var response = new EventsPagedResponse
                {
                    Items = eventDtos,
                    TotalCount = pagedEvents.TotalCount,
                    PageNumber = pagedEvents.PageNumber,
                    PageSize = pagedEvents.PageSize,
                    TotalPages = pagedEvents.TotalPages,
                    CategoryCounts = eventDtos.GroupBy(e => e.Category)
                                           .ToDictionary(g => g.Key, g => g.Count()),
                    TypeCounts = eventDtos.GroupBy(e => e.EventType)
                                        .ToDictionary(g => g.Key, g => g.Count()),
                    Stats = new EventsStatsDto
                    {
                        TotalEvents = pagedEvents.TotalCount,
                        UpcomingEvents = eventDtos.Count(e => e.StartDate > DateTime.UtcNow),
                        OngoingEvents = eventDtos.Count(e => e.StartDate <= DateTime.UtcNow && e.EndDate >= DateTime.UtcNow),
                        CompletedEvents = eventDtos.Count(e => e.EndDate < DateTime.UtcNow),
                        FeaturedEvents = eventDtos.Count(e => e.IsFeatured),
                        FreeEvents = eventDtos.Count(e => !e.Price.HasValue || e.Price == 0),
                        PaidEvents = eventDtos.Count(e => e.Price.HasValue && e.Price > 0),
                        OnlineEvents = eventDtos.Count(e => e.IsOnline),
                        InPersonEvents = eventDtos.Count(e => !e.IsOnline),
                        TotalAttendees = eventDtos.Sum(e => e.AttendeeCount)
                    }
                };

                return Result<EventsPagedResponse>.Success(response);
            }
            catch (Exception ex)
            {
                return Result<EventsPagedResponse>.Failure($"Failed to retrieve events: {ex.Message}");
            }
        }
    }
}
