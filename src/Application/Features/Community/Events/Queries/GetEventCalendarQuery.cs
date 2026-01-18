using Application.Common.DTOs;
using Application.Features.Community.Events.DTOs;
using Application.Features.Community.Events.Interfaces;
using MediatR;

namespace Application.Features.Community.Events.Queries
{
    public class GetEventCalendarQuery : IRequest<Result<EventCalendarDto>>
    {
        public int Year { get; set; }
        public int Month { get; set; }
        public string? Category { get; set; }
        public string? EventType { get; set; }
        public bool? IsOnline { get; set; }
        public bool? IsFree { get; set; }
    }

    public class GetEventCalendarQueryHandler : IRequestHandler<GetEventCalendarQuery, Result<EventCalendarDto>>
    {
        private readonly IEventRepository _eventRepository;

        public GetEventCalendarQueryHandler(IEventRepository eventRepository)
        {
            _eventRepository = eventRepository;
        }

        public async Task<Result<EventCalendarDto>> Handle(GetEventCalendarQuery request, CancellationToken cancellationToken)
        {
            try
            {
                // Calculate date range for the month
                var startDate = new DateTime(request.Year, request.Month, 1);
                var endDate = startDate.AddMonths(1).AddDays(-1);

                // Get events for the month with filters
                var eventsResult = await _eventRepository.GetEventsPagedAsync(
                    pageNumber: 1,
                    pageSize: 1000, // Get all events for the month
                    category: request.Category,
                    eventType: request.EventType,
                    fromDate: startDate,
                    toDate: endDate,
                    isOnline: request.IsOnline,
                    isFree: request.IsFree,
                    isPublic: true,
                    isActive: true,
                    sortBy: "StartDate",
                    sortDescending: false,
                    cancellationToken: cancellationToken);

                var events = eventsResult.Items;

                // Group events by day
                var eventsByDay = events
                    .GroupBy(e => e.StartDate.Day)
                    .ToDictionary(g => g.Key, g => g.ToList());

                // Create calendar days
                var days = new List<EventCalendarDayDto>();
                var daysInMonth = DateTime.DaysInMonth(request.Year, request.Month);

                for (int day = 1; day <= daysInMonth; day++)
                {
                    var dayEvents = eventsByDay.GetValueOrDefault(day, new List<Domain.Entities.Community.Events.Event>());
                    
                    var dayDto = new EventCalendarDayDto
                    {
                        Day = day,
                        EventCount = dayEvents.Count,
                        HasEvents = dayEvents.Any(),
                        Events = dayEvents.Select(e => new EventSummaryDto
                        {
                            Id = e.Id,
                            Title = e.Title,
                            Description = e.Description.Length > 100 ? e.Description.Substring(0, 100) + "..." : e.Description,
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
                            IsUserAttending = false, // TODO: Check user attendance
                            IsFeatured = e.IsFeatured,
                            Price = e.Price,
                            Currency = e.Currency,
                            Tags = e.Tags
                        }).ToList()
                    };

                    days.Add(dayDto);
                }

                // Calculate statistics
                var stats = new EventCalendarStatsDto
                {
                    TotalEvents = events.Count(),
                    UpcomingEvents = events.Count(e => e.StartDate > DateTime.UtcNow),
                    OnlineEvents = events.Count(e => e.IsOnline),
                    InPersonEvents = events.Count(e => !e.IsOnline),
                    FreeEvents = events.Count(e => !e.Price.HasValue || e.Price == 0),
                    PaidEvents = events.Count(e => e.Price.HasValue && e.Price > 0),
                    EventsByType = events
                        .GroupBy(e => e.EventType)
                        .ToDictionary(g => g.Key, g => g.Count()),
                    EventsByCategory = events
                        .GroupBy(e => e.Category)
                        .ToDictionary(g => g.Key, g => g.Count())
                };

                var calendar = new EventCalendarDto
                {
                    Year = request.Year,
                    Month = request.Month,
                    Days = days,
                    Stats = stats
                };

                return Result<EventCalendarDto>.Success(calendar);
            }
            catch (Exception ex)
            {
                return Result<EventCalendarDto>.Failure($"Failed to retrieve event calendar: {ex.Message}");
            }
        }
    }
}