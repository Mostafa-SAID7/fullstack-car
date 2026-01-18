using Application.Common.DTOs;
using Application.Features.Community.Events.DTOs;
using Application.Features.Community.Events.Interfaces;
using MediatR;

namespace Application.Features.Community.Events.Queries
{
    public class GetEventAttendanceStatsQuery : IRequest<Result<EventAttendanceStatsDto>>
    {
        public Guid EventId { get; set; }
    }

    public class GetEventAttendanceStatsQueryHandler : IRequestHandler<GetEventAttendanceStatsQuery, Result<EventAttendanceStatsDto>>
    {
        private readonly IEventAttendanceRepository _attendanceRepository;
        private readonly IEventRepository _eventRepository;

        public GetEventAttendanceStatsQueryHandler(
            IEventAttendanceRepository attendanceRepository,
            IEventRepository eventRepository)
        {
            _attendanceRepository = attendanceRepository;
            _eventRepository = eventRepository;
        }

        public async Task<Result<EventAttendanceStatsDto>> Handle(GetEventAttendanceStatsQuery request, CancellationToken cancellationToken)
        {
            try
            {
                // Check if event exists
                var eventExists = await _eventRepository.ExistsAsync(request.EventId, cancellationToken);
                if (!eventExists)
                {
                    return Result<EventAttendanceStatsDto>.Failure("Event not found");
                }

                var stats = await _attendanceRepository.GetAttendanceStatsAsync(request.EventId, cancellationToken);

                var dto = new EventAttendanceStatsDto
                {
                    EventId = request.EventId,
                    TotalAttendees = stats.TotalAttendees,
                    GoingCount = stats.GoingCount,
                    MaybeCount = stats.MaybeCount,
                    NotGoingCount = stats.NotGoingCount,
                    PendingApprovalCount = stats.PendingApprovalCount,
                    CheckedInCount = stats.CheckedInCount,
                    AttendanceRate = stats.AttendanceRate
                };

                return Result<EventAttendanceStatsDto>.Success(dto);
            }
            catch (Exception ex)
            {
                return Result<EventAttendanceStatsDto>.Failure($"Failed to retrieve attendance statistics: {ex.Message}");
            }
        }
    }
}