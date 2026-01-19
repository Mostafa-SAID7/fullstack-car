using Application.Common.DTOs;

namespace Application.Features.Community.Events.DTOs
{
    // Response DTOs
    public class EventDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
        public string Category { get; set; } = string.Empty;
        public string EventType { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string? Location { get; set; }
        public bool IsOnline { get; set; }
        public string? OnlineLink { get; set; }
        public int? MaxAttendees { get; set; }
        public bool RequireApproval { get; set; }
        public bool IsPublic { get; set; }
        public bool IsActive { get; set; }
        public bool IsFeatured { get; set; }
        public string Status { get; set; } = string.Empty;
        public int AttendeeCount { get; set; }
        public decimal? Price { get; set; }
        public string? Currency { get; set; }
        public List<string> Tags { get; set; } = new();
        public DateTime CreatedAt { get; set; }
        public EventOrganizerDto Organizer { get; set; } = new();
        public EventAttendanceStatsDto AttendanceStats { get; set; } = new();
        public EventAttendanceDto? UserAttendance { get; set; }
        public List<EventCommentDto> RecentComments { get; set; } = new();
    }

    public class EventSummaryDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
        public string Category { get; set; } = string.Empty;
        public string EventType { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string? Location { get; set; }
        public bool IsOnline { get; set; }
        public int AttendeeCount { get; set; }
        public int? MaxAttendees { get; set; }
        public string Status { get; set; } = string.Empty;
        public bool IsUserAttending { get; set; }
        public bool IsFeatured { get; set; }
        public decimal? Price { get; set; }
        public string? Currency { get; set; }
        public List<string> Tags { get; set; } = new();
    }

    public class EventOrganizerDto
    {
        public Guid Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string DisplayName { get; set; } = string.Empty;
        public string? AvatarUrl { get; set; }
        public string? Bio { get; set; }
        public int EventsOrganized { get; set; }
        public double Rating { get; set; }
    }

    public class EventAttendanceDto
    {
        public Guid Id { get; set; }
        public Guid EventId { get; set; }
        public Guid UserId { get; set; }
        public string AttendanceType { get; set; } = string.Empty;
        public DateTime ResponseDate { get; set; }
        public string? Notes { get; set; }
        public bool IsApproved { get; set; }
        public DateTime? ApprovedAt { get; set; }
        public bool CheckedIn { get; set; }
        public DateTime? CheckedInAt { get; set; }
    }

    public class EventAttendeeDto
    {
        public Guid Id { get; set; }
        public Guid EventId { get; set; }
        public Guid UserId { get; set; }
        public EventUserDto User { get; set; } = new();
        public string AttendanceType { get; set; } = string.Empty;
        public DateTime ResponseDate { get; set; }
        public string? Notes { get; set; }
        public bool IsApproved { get; set; }
        public DateTime? ApprovedAt { get; set; }
        public bool CheckedIn { get; set; }
        public DateTime? CheckedInAt { get; set; }
    }

    public class EventUserDto
    {
        public Guid Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string DisplayName { get; set; } = string.Empty;
        public string? AvatarUrl { get; set; }
        public bool IsOnline { get; set; }
    }

    public class EventAttendanceStatsDto
    {
        public Guid EventId { get; set; }
        public int TotalAttendees { get; set; }
        public int TotalResponses { get; set; }
        public int GoingCount { get; set; }
        public int MaybeCount { get; set; }
        public int NotGoingCount { get; set; }
        public int PendingApprovalCount { get; set; }
        public double ResponseRate { get; set; }
        public double AttendanceRate { get; set; }
        public int? AvailableSpots { get; set; }
        public int CheckedInCount { get; set; }
    }

    public class EventCommentDto
    {
        public Guid Id { get; set; }
        public Guid EventId { get; set; }
        public Guid? ParentCommentId { get; set; }
        public string Content { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public EventUserDto CreatedBy { get; set; } = new();
        public int LikeCount { get; set; }
        public bool HasUserLiked { get; set; }
        public List<EventCommentDto> ChildComments { get; set; } = new();
        public bool IsEdited { get; set; }
        public bool IsDeleted { get; set; }
    }

    public class EventCategoryDto
    {
        public string Name { get; set; } = string.Empty;
        public string DisplayName { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string? IconUrl { get; set; }
        public string Color { get; set; } = string.Empty;
        public int EventCount { get; set; }
        public bool IsActive { get; set; }
        public int SortOrder { get; set; }
    }

    public class EventCalendarDto
    {
        public int Year { get; set; }
        public int Month { get; set; }
        public List<EventCalendarDayDto> Days { get; set; } = new();
        public EventCalendarStatsDto Stats { get; set; } = new();
    }

    public class EventCalendarDayDto
    {
        public int Day { get; set; }
        public List<EventSummaryDto> Events { get; set; } = new();
        public int EventCount { get; set; }
        public bool HasEvents { get; set; }
    }

    public class EventCalendarStatsDto
    {
        public int TotalEvents { get; set; }
        public int UpcomingEvents { get; set; }
        public int OnlineEvents { get; set; }
        public int InPersonEvents { get; set; }
        public int FreeEvents { get; set; }
        public int PaidEvents { get; set; }
        public Dictionary<string, int> EventsByType { get; set; } = new();
        public Dictionary<string, int> EventsByCategory { get; set; } = new();
    }

    public class EventUpdateDto
    {
        public Guid Id { get; set; }
        public Guid EventId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string UpdateType { get; set; } = string.Empty;
        public bool IsImportant { get; set; }
        public DateTime CreatedAt { get; set; }
        public EventUserDto CreatedBy { get; set; } = new();
    }

    public class EventInvitationDto
    {
        public Guid Id { get; set; }
        public Guid EventId { get; set; }
        public string EventTitle { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? Message { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime InvitedAt { get; set; }
        public DateTime? ExpiresAt { get; set; }
        public DateTime? RespondedAt { get; set; }
        public EventUserDto InvitedBy { get; set; } = new();
    }

    // Request DTOs
    public class CreateEventRequest
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string EventType { get; set; } = "General";
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string? Location { get; set; }
        public bool IsOnline { get; set; } = false;
        public string? OnlineLink { get; set; }
        public int? MaxAttendees { get; set; }
        public bool RequireApproval { get; set; } = false;
        public bool IsPublic { get; set; } = true;
        public decimal? Price { get; set; }
        public string? Currency { get; set; }
        public List<string> Tags { get; set; } = new();
        public string? ImageUrl { get; set; }
    }

    public class UpdateEventRequest
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string EventType { get; set; } = "General";
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string? Location { get; set; }
        public bool IsOnline { get; set; } = false;
        public string? OnlineLink { get; set; }
        public int? MaxAttendees { get; set; }
        public bool RequireApproval { get; set; } = false;
        public bool IsPublic { get; set; } = true;
        public decimal? Price { get; set; }
        public string? Currency { get; set; }
        public List<string> Tags { get; set; } = new();
        public string? ImageUrl { get; set; }
    }

    public class AttendEventRequest
    {
        public string AttendanceType { get; set; } = "Going"; // Going, Maybe, NotGoing
        public string? Notes { get; set; }
    }

    public class InviteToEventRequest
    {
        public List<string> Emails { get; set; } = new();
        public string? Message { get; set; }
    }

    public class CreateEventCommentRequest
    {
        public string Content { get; set; } = string.Empty;
        public Guid? ParentCommentId { get; set; }
    }

    public class UpdateEventCommentRequest
    {
        public string Content { get; set; } = string.Empty;
    }

    public class CreateEventUpdateRequest
    {
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string UpdateType { get; set; } = "General";
        public bool NotifyAttendees { get; set; } = true;
    }

    // Pagination DTOs
    public class EventsPagedResponse : PaginatedResponseDto<EventSummaryDto>
    {
        public Dictionary<string, int> CategoryCounts { get; set; } = new();
        public Dictionary<string, int> TypeCounts { get; set; } = new();
        public EventsStatsDto Stats { get; set; } = new();
    }

    public class EventAttendeesPagedResponse : PaginatedResponseDto<EventAttendeeDto>
    {
        public EventAttendanceStatsDto Stats { get; set; } = new();
    }

    public class EventCommentsPagedResponse : PaginatedResponseDto<EventCommentDto>
    {
        public int TotalComments { get; set; }
        public int TotalReplies { get; set; }
    }

    public class EventUpdatesPagedResponse : PaginatedResponseDto<EventUpdateDto>
    {
        public List<EventUpdateDto> Updates { get; set; } = new();
    }

    public class EventsStatsDto
    {
        public int TotalEvents { get; set; }
        public int UpcomingEvents { get; set; }
        public int OngoingEvents { get; set; }
        public int CompletedEvents { get; set; }
        public int CancelledEvents { get; set; }
        public int FeaturedEvents { get; set; }
        public int FreeEvents { get; set; }
        public int PaidEvents { get; set; }
        public int OnlineEvents { get; set; }
        public int InPersonEvents { get; set; }
        public int TotalAttendees { get; set; }
        public double AverageAttendeesPerEvent { get; set; }
    }
}
