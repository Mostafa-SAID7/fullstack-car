using Application.Common.DTOs;
using Application.Features.Community.Events.DTOs;
using Application.Features.Community.Events.Interfaces;
using MediatR;

namespace Application.Features.Community.Events.Queries
{
    public class GetTrendingEventsQuery : IRequest<Result<List<EventSummaryDto>>>
    {
        public int Count { get; set; } = 10;
        public string Timeframe { get; set; } = "week"; // day, week, month
    }

    public class GetTrendingEventsQueryHandler : IRequestHandler<GetTrendingEventsQuery, Result<List<EventSummaryDto>>>
    {
        private readonly IEventRepository _eventRepository;

        public GetTrendingEventsQueryHandler(IEventRepository eventRepository)
        {
            _eventRepository = eventRepository;
        }

        public async Task<Result<List<EventSummaryDto>>> Handle(GetTrendingEventsQuery request, CancellationToken cancellationToken)
        {
            try
            {
                var events = await _eventRepository.GetTrendingEventsAsync(request.Timeframe, request.Count, cancellationToken);

                var eventDtos = events.Select(e => new EventSummaryDto
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
                    IsUserAttending = false, // TODO: Check user attendance
                    IsFeatured = e.IsFeatured,
                    Price = e.Price,
                    Currency = e.Currency,
                    Tags = e.Tags
                }).ToList();

                return Result<List<EventSummaryDto>>.Success(eventDtos);
            }
            catch (Exception ex)
            {
                return Result<List<EventSummaryDto>>.Failure($"Failed to retrieve trending events: {ex.Message}");
            }
        }
    }
}
