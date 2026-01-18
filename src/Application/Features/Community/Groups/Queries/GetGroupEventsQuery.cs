using Application.Common.DTOs;
using Application.Features.Community.Groups.DTOs;
using Application.Features.Community.Groups.Interfaces;
using MediatR;

namespace Application.Features.Community.Groups.Queries
{
    public class GetGroupEventsQuery : IRequest<Result<GroupEventsPagedResponse>>
    {
        public Guid GroupId { get; set; }
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public bool? UpcomingOnly { get; set; } = true;
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        public string? EventType { get; set; }
    }

    public class GetGroupEventsQueryHandler : IRequestHandler<GetGroupEventsQuery, Result<GroupEventsPagedResponse>>
    {
        private readonly IGroupRepository _groupRepository;
        private readonly IGroupEventRepository _eventRepository;

        public GetGroupEventsQueryHandler(
            IGroupRepository groupRepository,
            IGroupEventRepository eventRepository)
        {
            _groupRepository = groupRepository;
            _eventRepository = eventRepository;
        }

        public async Task<Result<GroupEventsPagedResponse>> Handle(GetGroupEventsQuery request, CancellationToken cancellationToken)
        {
            try
            {
                // Validate group exists
                var groupExists = await _groupRepository.ExistsAsync(request.GroupId, cancellationToken);
                if (!groupExists)
                {
                    return Result<GroupEventsPagedResponse>.Failure("Group not found");
                }

                var pagedEvents = await _eventRepository.GetGroupEventsPagedAsync(
                    request.GroupId,
                    request.PageNumber,
                    request.PageSize,
                    request.UpcomingOnly,
                    request.FromDate,
                    request.ToDate,
                    request.EventType,
                    cancellationToken);

                var eventDtos = pagedEvents.Items.Select(e => new GroupEventSummaryDto
                {
                    Id = e.Id,
                    GroupId = e.GroupId,
                    Title = e.Title,
                    Description = e.Description,
                    StartDate = e.StartDate,
                    EndDate = e.EndDate,
                    Location = e.Location,
                    EventType = e.EventType,
                    IsOnline = e.IsOnline,
                    AttendeeCount = e.AttendeeCount,
                    MaxAttendees = e.MaxAttendees,
                    Status = e.Status,
                    IsUserAttending = false, // TODO: Check if current user is attending
                    ImageUrl = e.ImageUrl
                }).ToList();

                var response = new GroupEventsPagedResponse
                {
                    Items = eventDtos,
                    TotalCount = pagedEvents.TotalCount,
                    PageNumber = pagedEvents.PageNumber,
                    PageSize = pagedEvents.PageSize,
                    TotalPages = pagedEvents.TotalPages,
                    EventTypeCounts = new Dictionary<string, int>(), // TODO: Implement
                    Stats = new EventCalendarStatsDto
                    {
                        TotalEvents = pagedEvents.TotalCount,
                        UpcomingEvents = eventDtos.Count(e => e.StartDate > DateTime.UtcNow),
                        OnlineEvents = eventDtos.Count(e => e.IsOnline),
                        InPersonEvents = eventDtos.Count(e => !e.IsOnline)
                    }
                };

                return Result<GroupEventsPagedResponse>.Success(response);
            }
            catch (Exception ex)
            {
                return Result<GroupEventsPagedResponse>.Failure($"Failed to retrieve group events: {ex.Message}");
            }
        }
    }
}