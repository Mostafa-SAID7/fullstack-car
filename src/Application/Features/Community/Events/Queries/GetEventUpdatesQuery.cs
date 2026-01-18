using Application.Common.DTOs;
using Application.Features.Community.Events.DTOs;
using Application.Features.Community.Events.Interfaces;
using MediatR;

namespace Application.Features.Community.Events.Queries
{
    public class GetEventUpdatesQuery : IRequest<Result<EventUpdatesPagedResponse>>
    {
        public Guid EventId { get; set; }
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public string? UpdateType { get; set; }
        public string? SortBy { get; set; } = "CreatedAt";
        public bool SortDescending { get; set; } = true;
    }

    public class GetEventUpdatesQueryHandler : IRequestHandler<GetEventUpdatesQuery, Result<EventUpdatesPagedResponse>>
    {
        private readonly IEventUpdateRepository _eventUpdateRepository;
        private readonly IEventRepository _eventRepository;

        public GetEventUpdatesQueryHandler(
            IEventUpdateRepository eventUpdateRepository,
            IEventRepository eventRepository)
        {
            _eventUpdateRepository = eventUpdateRepository;
            _eventRepository = eventRepository;
        }

        public async Task<Result<EventUpdatesPagedResponse>> Handle(GetEventUpdatesQuery request, CancellationToken cancellationToken)
        {
            try
            {
                // Check if event exists
                var eventExists = await _eventRepository.ExistsAsync(request.EventId, cancellationToken);
                if (!eventExists)
                {
                    return Result<EventUpdatesPagedResponse>.Failure("Event not found");
                }

                var result = await _eventUpdateRepository.GetEventUpdatesPagedAsync(
                    request.EventId,
                    request.PageNumber,
                    request.PageSize,
                    request.UpdateType,
                    request.SortBy,
                    request.SortDescending,
                    cancellationToken);

                var updates = result.Items.Select(u => new EventUpdateDto
                {
                    Id = u.Id,
                    EventId = u.EventId,
                    Title = u.Title,
                    Content = u.Content,
                    UpdateType = u.UpdateType,
                    IsImportant = u.IsImportant,
                    CreatedAt = u.CreatedAt,
                    CreatedBy = new EventUserDto
                    {
                        Id = u.CreatedByUser.Id,
                        Username = u.CreatedByUser.UserName ?? string.Empty,
                        DisplayName = $"{u.CreatedByUser.FirstName} {u.CreatedByUser.LastName}".Trim(),
                        AvatarUrl = u.CreatedByUser.ProfileImageUrl,
                        IsOnline = false
                    }
                }).ToList();

                var response = new EventUpdatesPagedResponse
                {
                    Updates = updates,
                    TotalCount = result.TotalCount,
                    PageNumber = result.PageNumber,
                    PageSize = result.PageSize,
                    TotalPages = result.TotalPages
                };

                return Result<EventUpdatesPagedResponse>.Success(response);
            }
            catch (Exception ex)
            {
                return Result<EventUpdatesPagedResponse>.Failure($"Failed to retrieve event updates: {ex.Message}");
            }
        }
    }
}