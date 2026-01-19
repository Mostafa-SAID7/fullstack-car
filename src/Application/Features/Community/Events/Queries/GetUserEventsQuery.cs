using Application.Common.DTOs;
using Application.Common.Interfaces;
using Application.Common.Models;
using Application.Features.Community.Events.DTOs;
using Application.Features.Community.Events.Interfaces;
using MediatR;
using System.Linq;

namespace Application.Features.Community.Events.Queries
{
    public class GetUserEventsQuery : IRequest<Result<EventsPagedResponse>>
    {
        public Guid UserId { get; set; }
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public string? Type { get; set; } // organized, attending, maybe
    }

    public class GetUserEventsQueryHandler : IRequestHandler<GetUserEventsQuery, Result<EventsPagedResponse>>
    {
        private readonly IEventRepository _eventRepository;
        private readonly IEventAttendanceRepository _attendanceRepository;

        public GetUserEventsQueryHandler(
            IEventRepository eventRepository,
            IEventAttendanceRepository attendanceRepository)
        {
            _eventRepository = eventRepository;
            _attendanceRepository = attendanceRepository;
        }

        public async Task<Result<EventsPagedResponse>> Handle(GetUserEventsQuery request, CancellationToken cancellationToken)
        {
            try
            {
                IEnumerable<Domain.Entities.Community.Events.Event> events;

                switch (request.Type?.ToLower())
                {
                    case "organized":
                        events = await _eventRepository.GetUserOrganizedEventsAsync(request.UserId, cancellationToken);
                        break;
                    case "attending":
                        events = await _eventRepository.GetUserAttendingEventsAsync(request.UserId, cancellationToken);
                        break;
                    case "maybe":
                        var maybeAttendances = await _attendanceRepository.GetUserAttendancesByTypeAsync(
                            request.UserId, "Maybe", cancellationToken);
                        var maybeEventIds = maybeAttendances.Select(a => a.EventId).ToList();
                        
                        events = await _eventRepository.FindAsync(e => maybeEventIds.Contains(e.Id), cancellationToken);
                        break;
                    default:
                        // Get all user events (organized + attending + maybe)
                        var organized = await _eventRepository.GetUserOrganizedEventsAsync(request.UserId, cancellationToken);
                        var attending = await _eventRepository.GetUserAttendingEventsAsync(request.UserId, cancellationToken);
                        var maybeAtt = await _attendanceRepository.GetUserAttendancesByTypeAsync(request.UserId, "Maybe", cancellationToken);
                        var maybeIds = maybeAtt.Select(a => a.EventId).ToList();
                        
                        var maybeEvs = await _eventRepository.FindAsync(e => maybeIds.Contains(e.Id), cancellationToken);
                        
                        events = organized.Union(attending).Union(maybeEvs).DistinctBy(e => e.Id);
                        break;
                }

                // Apply pagination
                var totalCount = events.Count();
                var pagedEvents = events
                    .Skip((request.PageNumber - 1) * request.PageSize)
                    .Take(request.PageSize)
                    .ToList();

                var eventDtos = pagedEvents.Select(e => new EventSummaryDto
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
                    IsUserAttending = e.OrganizerId == request.UserId || 
                                    e.Attendances.Any(a => a.UserId == request.UserId && a.AttendanceType == "Going"),
                    IsFeatured = e.IsFeatured,
                    Price = e.Price,
                    Currency = e.Currency,
                    Tags = e.Tags
                }).ToList();

                // Get category and type counts
                var categoryCounts = events
                    .GroupBy(e => e.Category)
                    .ToDictionary(g => g.Key, g => g.Count());

                var typeCounts = events
                    .GroupBy(e => e.EventType)
                    .ToDictionary(g => g.Key, g => g.Count());

                // Create stats
                var stats = new EventsStatsDto
                {
                    TotalEvents = totalCount,
                    UpcomingEvents = events.Count(e => e.StartDate > DateTime.UtcNow && e.Status == "Active"),
                    OngoingEvents = events.Count(e => e.StartDate <= DateTime.UtcNow && e.EndDate >= DateTime.UtcNow && e.Status == "Active"),
                    CompletedEvents = events.Count(e => e.EndDate < DateTime.UtcNow || e.Status == "Completed"),
                    CancelledEvents = events.Count(e => e.Status == "Cancelled"),
                    FeaturedEvents = events.Count(e => e.IsFeatured),
                    FreeEvents = events.Count(e => !e.Price.HasValue || e.Price == 0),
                    PaidEvents = events.Count(e => e.Price.HasValue && e.Price > 0),
                    OnlineEvents = events.Count(e => e.IsOnline),
                    InPersonEvents = events.Count(e => !e.IsOnline),
                    TotalAttendees = events.Sum(e => e.AttendeeCount),
                    AverageAttendeesPerEvent = totalCount > 0 ? (double)events.Sum(e => e.AttendeeCount) / totalCount : 0
                };

                var response = new EventsPagedResponse
                {
                    Items = eventDtos,
                    TotalCount = totalCount,
                    PageNumber = request.PageNumber,
                    PageSize = request.PageSize,
                    TotalPages = (int)Math.Ceiling(totalCount / (double)request.PageSize),
                    CategoryCounts = categoryCounts,
                    TypeCounts = typeCounts,
                    Stats = stats
                };

                return Result<EventsPagedResponse>.Success(response);
            }
            catch (Exception ex)
            {
                return Result<EventsPagedResponse>.Failure($"Failed to retrieve user events: {ex.Message}");
            }
        }
    }
}