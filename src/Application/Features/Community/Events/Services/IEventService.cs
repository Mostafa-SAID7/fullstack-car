using Application.Common.DTOs;
using Application.Features.Community.Events.DTOs;

namespace Application.Features.Community.Events.Services
{
    public interface IEventService
    {
        // Event Management
        Task<Result<EventDto>> CreateEventAsync(Guid organizerId, CreateEventRequest request, CancellationToken cancellationToken = default);
        Task<Result<EventDto>> UpdateEventAsync(Guid eventId, Guid userId, UpdateEventRequest request, CancellationToken cancellationToken = default);
        Task<Result<bool>> DeleteEventAsync(Guid eventId, Guid userId, string? reason = null, CancellationToken cancellationToken = default);
        Task<Result<EventDto>> GetEventByIdAsync(Guid eventId, Guid? userId = null, CancellationToken cancellationToken = default);
        Task<Result<EventsPagedResponse>> GetEventsAsync(GetEventsRequest request, CancellationToken cancellationToken = default);

        // Attendance Management
        Task<Result<EventAttendanceDto>> AttendEventAsync(Guid eventId, Guid userId, AttendEventRequest request, CancellationToken cancellationToken = default);
        Task<Result<bool>> CancelAttendanceAsync(Guid eventId, Guid userId, CancellationToken cancellationToken = default);
        Task<Result<EventAttendeesPagedResponse>> GetEventAttendeesAsync(Guid eventId, GetEventAttendeesRequest request, CancellationToken cancellationToken = default);
        Task<Result<bool>> ApproveAttendanceAsync(Guid eventId, Guid attendeeId, Guid approvedBy, CancellationToken cancellationToken = default);
        Task<Result<bool>> CheckInAttendeeAsync(Guid eventId, Guid attendeeId, Guid checkedInBy, CancellationToken cancellationToken = default);

        // Comments Management
        Task<Result<EventCommentDto>> CreateCommentAsync(Guid eventId, Guid userId, CreateEventCommentRequest request, CancellationToken cancellationToken = default);
        Task<Result<EventCommentDto>> UpdateCommentAsync(Guid commentId, Guid userId, UpdateEventCommentRequest request, CancellationToken cancellationToken = default);
        Task<Result<bool>> DeleteCommentAsync(Guid commentId, Guid userId, CancellationToken cancellationToken = default);
        Task<Result<EventCommentsPagedResponse>> GetEventCommentsAsync(Guid eventId, GetEventCommentsRequest request, CancellationToken cancellationToken = default);

        // Invitations Management
        Task<Result<List<EventInvitationDto>>> SendInvitationsAsync(Guid eventId, Guid invitedBy, InviteToEventRequest request, CancellationToken cancellationToken = default);
        Task<Result<bool>> AcceptInvitationAsync(Guid invitationId, CancellationToken cancellationToken = default);
        Task<Result<bool>> DeclineInvitationAsync(Guid invitationId, CancellationToken cancellationToken = default);
        Task<Result<bool>> CancelInvitationAsync(Guid invitationId, Guid cancelledBy, CancellationToken cancellationToken = default);

        // Event Updates
        Task<Result<EventUpdateDto>> CreateEventUpdateAsync(Guid eventId, Guid userId, CreateEventUpdateRequest request, CancellationToken cancellationToken = default);
        Task<Result<List<EventUpdateDto>>> GetEventUpdatesAsync(Guid eventId, string? updateType = null, CancellationToken cancellationToken = default);

        // Statistics and Analytics
        Task<Result<EventsStatsDto>> GetEventsStatsAsync(GetEventsStatsRequest? request = null, CancellationToken cancellationToken = default);
        Task<Result<EventAttendanceStatsDto>> GetEventAttendanceStatsAsync(Guid eventId, CancellationToken cancellationToken = default);
        Task<Result<List<EventSummaryDto>>> GetFeaturedEventsAsync(int count = 6, CancellationToken cancellationToken = default);
        Task<Result<List<EventSummaryDto>>> GetTrendingEventsAsync(string timeframe = "week", int count = 10, CancellationToken cancellationToken = default);
        Task<Result<List<EventSummaryDto>>> GetUpcomingEventsAsync(int count = 10, CancellationToken cancellationToken = default);

        // Admin Functions
        Task<Result<bool>> FeatureEventAsync(Guid eventId, Guid userId, bool isFeatured, CancellationToken cancellationToken = default);
        Task<Result<bool>> ModerateEventAsync(Guid eventId, Guid userId, string action, string? reason = null, CancellationToken cancellationToken = default);

        // Utility Functions
        Task<Result<List<EventCategoryDto>>> GetEventCategoriesAsync(CancellationToken cancellationToken = default);
        Task<Result<EventCalendarDto>> GetEventCalendarAsync(int year, int month, GetEventCalendarRequest? request = null, CancellationToken cancellationToken = default);
        Task<Result<List<EventSummaryDto>>> SearchEventsAsync(string searchTerm, GetEventsRequest? request = null, CancellationToken cancellationToken = default);
    }

    // Request DTOs for Service
    public class GetEventsRequest
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
        public string? SortBy { get; set; } = "StartDate";
        public bool SortDescending { get; set; } = false;
    }

    public class GetEventAttendeesRequest
    {
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 20;
        public string? AttendanceType { get; set; }
        public bool? IsApproved { get; set; }
        public bool? CheckedIn { get; set; }
        public string? SearchTerm { get; set; }
        public string? SortBy { get; set; } = "ResponseDate";
        public bool SortDescending { get; set; } = false;
    }

    public class GetEventCommentsRequest
    {
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 20;
        public string? SortBy { get; set; } = "CreatedAt";
        public bool SortDescending { get; set; } = true;
        public bool IncludeReplies { get; set; } = true;
    }

    public class GetEventsStatsRequest
    {
        public string? Category { get; set; }
        public string? EventType { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        public bool? IsPublic { get; set; } = true;
        public bool? IsActive { get; set; } = true;
    }

    public class GetEventCalendarRequest
    {
        public string? Category { get; set; }
        public string? EventType { get; set; }
        public bool? IsOnline { get; set; }
        public bool? IsFree { get; set; }
    }
}