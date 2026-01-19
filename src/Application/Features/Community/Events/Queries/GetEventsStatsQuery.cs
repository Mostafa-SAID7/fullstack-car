using Application.Common.DTOs;
using Application.Features.Community.Events.DTOs;
using Application.Features.Community.Events.Interfaces;
using MediatR;

namespace Application.Features.Community.Events.Queries
{
    public class GetEventsStatsQuery : IRequest<Result<EventsStatsDto>>
    {
        public string? Category { get; set; }
        public string? EventType { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        public bool? IsPublic { get; set; } = true;
        public bool? IsActive { get; set; } = true;
    }

    public class GetEventsStatsQueryHandler : IRequestHandler<GetEventsStatsQuery, Result<EventsStatsDto>>
    {
        private readonly IEventRepository _eventRepository;
        private readonly IEventAttendanceRepository _attendanceRepository;

        public GetEventsStatsQueryHandler(
            IEventRepository eventRepository,
            IEventAttendanceRepository attendanceRepository)
        {
            _eventRepository = eventRepository;
            _attendanceRepository = attendanceRepository;
        }

        public async Task<Result<EventsStatsDto>> Handle(GetEventsStatsQuery request, CancellationToken cancellationToken)
        {
            try
            {
                // Get filtered events for statistics
                var eventsResult = await _eventRepository.GetEventsPagedAsync(
                    pageNumber: 1,
                    pageSize: int.MaxValue, // Get all events for stats
                    category: request.Category,
                    eventType: request.EventType,
                    fromDate: request.FromDate,
                    toDate: request.ToDate,
                    isPublic: request.IsPublic,
                    isActive: request.IsActive,
                    cancellationToken: cancellationToken);

                var events = eventsResult.Items;
                var now = DateTime.UtcNow;

                // Calculate basic statistics
                var totalEvents = events.Count();
                var upcomingEvents = events.Count(e => e.StartDate > now && e.Status == "Active");
                var ongoingEvents = events.Count(e => e.StartDate <= now && e.EndDate >= now && e.Status == "Active");
                var completedEvents = events.Count(e => e.EndDate < now || e.Status == "Completed");
                var cancelledEvents = events.Count(e => e.Status == "Cancelled");
                var featuredEvents = events.Count(e => e.IsFeatured);
                var freeEvents = events.Count(e => !e.Price.HasValue || e.Price == 0);
                var paidEvents = events.Count(e => e.Price.HasValue && e.Price > 0);
                var onlineEvents = events.Count(e => e.IsOnline);
                var inPersonEvents = events.Count(e => !e.IsOnline);

                // Calculate attendee statistics
                var totalAttendees = events.Sum(e => e.AttendeeCount);
                var averageAttendeesPerEvent = totalEvents > 0 ? (double)totalAttendees / totalEvents : 0;

                var stats = new EventsStatsDto
                {
                    TotalEvents = totalEvents,
                    UpcomingEvents = upcomingEvents,
                    OngoingEvents = ongoingEvents,
                    CompletedEvents = completedEvents,
                    CancelledEvents = cancelledEvents,
                    FeaturedEvents = featuredEvents,
                    FreeEvents = freeEvents,
                    PaidEvents = paidEvents,
                    OnlineEvents = onlineEvents,
                    InPersonEvents = inPersonEvents,
                    TotalAttendees = totalAttendees,
                    AverageAttendeesPerEvent = Math.Round(averageAttendeesPerEvent, 2)
                };

                return Result<EventsStatsDto>.Success(stats);
            }
            catch (Exception ex)
            {
                return Result<EventsStatsDto>.Failure($"Failed to retrieve events statistics: {ex.Message}");
            }
        }
    }
}
